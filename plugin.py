# -*- coding: utf-8 -*-
"""
智媒体 Self-Media Plugin v1.2.0

卡牌式展示云服务器上的智能体，自动刷新。
点击卡牌进入与对应智能体的对话（通过 agent-share 分享链接）。
"""

import asyncio
import json
import logging
import time

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi import Body

logger = logging.getLogger("self-media")

# ============================================================
#  ☁ 云服务器配置（默认：作者服务器，开箱即用）
# ============================================================
# 配置优先级：config.json > 默认值

def load_config():
    """从配置文件加载敏感配置"""
    import os
    # 检查当前工作目录下的 config.json
    config_paths = [
        "plugins/self-media/config.json",
        "config.json", 
        os.path.expanduser("~/.copaw/self-media-config.json")
    ]
    for p in config_paths:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    return json.load(f)
            except:
                pass
    return {}

_config = load_config()

CLOUD_HOST       = _config.get("host", "agent.bh-jk.com")  # 默认作者服务器
CLOUD_PORT       = _config.get("port", 22)
CLOUD_USER       = _config.get("user", "root")
CLOUD_PASS       = _config.get("password", "")  # 仅备用
CLOUD_SHARE_DOMAIN = _config.get("share_domain", "agent.bh-jk.com")
CLOUD_AGENT_PORT = _config.get("agent_port", 8889)
CLOUD_API_PORT   = _config.get("api_port", 8890)  # 公开API，无需认证
CACHE_TTL = _config.get("cache_ttl", 120)

# 内存缓存
_agent_cache = {"agents": [], "updated_at": 0, "error": None, "offline_mode": False}

# 文件缓存路径（离线可用）
import os
CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".cache.json")


def load_cache_from_file():
    """从文件加载离线缓存"""
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            pass
    return None


def save_cache_to_file(cache):
    """保存缓存到文件"""
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False)
    except:
        pass


def ssh_run(command: str, timeout: int = 15) -> str:
    import paramiko
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(CLOUD_HOST, port=CLOUD_PORT, username=CLOUD_USER,
                       password=CLOUD_PASS, timeout=timeout)
        _, stdout, stderr = client.exec_command(command, timeout=timeout)
        output = stdout.read().decode(errors="replace").strip()
        err_text = stderr.read().decode(errors="replace").strip()
        client.close()
        return output
    except Exception as e:
        logger.error(f"SSH 执行失败: {e}")
        return ""


def fetch_agents() -> list:
    """通过 HTTP API 获取智能体列表（推荐，带离线缓存）"""
    import requests
    try:
        url = f"http://{CLOUD_HOST}:{CLOUD_API_PORT}/agents"
        resp = requests.get(url, timeout=30)
        data = resp.json()
        agents = []
        for a in data.get("agents", []):
            model_info = a.get("active_model") or {}
            agents.append({
                "id": a.get("id", ""),
                "name": a.get("name", a.get("id", "")),
                "description": (a.get("description", "") or "")[:200],
                "enabled": a.get("enabled", True),
                "model": model_info.get("model", "-"),
                "provider": model_info.get("provider_id", "-"),
                "status": "online" if a.get("enabled", True) else "offline",
                "share_url": a.get("share_url", "")
            })
        
        # 保存到离线缓存
        save_cache_to_file({"agents": agents, "updated_at": int(time.time())})
        _agent_cache["offline_mode"] = False
        logger.info(f"HTTP 获取到 {len(agents)} 个智能体")
        return agents
        
    except Exception as e:
        logger.error(f"HTTP 获取智能体列表失败: {e}")
        
        # 尝试加载离线缓存
        offline = load_cache_from_file()
        if offline and offline.get("agents"):
            logger.info(f"使用离线缓存: {len(offline['agents'])} 个智能体")
            _agent_cache["offline_mode"] = True
            return offline["agents"]
        
        return fetch_agents_ssh()


def fetch_agents_ssh() -> list:
    """通过 SSH 获取智能体列表（备用方案）"""
    try:
        raw = ssh_run("qwenpaw agents list 2>/dev/null")
    except Exception as e:
        logger.error(f"获取智能体列表失败: {e}")
        return []
    agents = []
    try:
        data = json.loads(raw)
        for a in data.get("agents", []):
            model_info = a.get("active_model") or {}
            agents.append({
                "id": a.get("id", ""),
                "name": a.get("name", a.get("id", "")),
                "description": (a.get("description", "") or "")[:200],
                "enabled": a.get("enabled", True),
                "model": model_info.get("model", "-"),
                "provider": model_info.get("provider_id", "-"),
                "status": "online" if a.get("enabled", True) else "offline",
                "share_url": ""
            })
    except json.JSONDecodeError as e:
        logger.warning(f"解析智能体列表失败: {e}")
    return agents


def fetch_share_links() -> dict:
    agents = fetch_agents()
    return fetch_share_links_with_agents(agents)


def fetch_share_links_with_agents(agents) -> dict:
    """通过 HTTP API 获取分享链接（推荐，更快）"""
    import requests
    share_map = {}
    try:
        url = f"http://{CLOUD_HOST}:{CLOUD_API_PORT}/agents"
        resp = requests.get(url, timeout=30)
        data = resp.json()
        for ag in data.get("agents", []):
            aid = ag.get("id", "")
            share_url = ag.get("share_url", "")
            if share_url:
                share_url = share_url.replace("172.19.26.110", CLOUD_SHARE_DOMAIN)
                share_url = share_url.replace("112.124.10.90", CLOUD_SHARE_DOMAIN)
                share_map[aid] = share_url
        logger.info(f"通过 HTTP API 获取到 {len(share_map)} 个分享链接")
    except Exception as e:
        logger.error(f"HTTP API 失败，尝试 SSH 方式: {e}")
        return fetch_share_links_with_agents_ssh(agents)
    return share_map


def fetch_share_links_with_agents_ssh(agents) -> dict:
    """通过 SSH 获取分享链接（备用方案）"""
    share_map = {}
    for agent in agents:
        aid = agent["id"]
        name = agent["name"]
        try:
            payload = json.dumps({"agent_id": aid, "name": name, "expiry_days": 0}, ensure_ascii=False)
            cmd = f'curl -s -X POST http://localhost:{CLOUD_AGENT_PORT}/api/agent-share/share -H "Content-Type: application/json" -d \'{payload}\' 2>/dev/null'
            output = ssh_run(cmd, timeout=10)
            if output:
                resp = json.loads(output)
                if resp.get("success") and resp.get("share_url"):
                    url = resp["share_url"]
                    url = url.replace("172.19.26.110", CLOUD_SHARE_DOMAIN)
                    url = url.replace("112.124.10.90", CLOUD_SHARE_DOMAIN)
                    timestamp = int(time.time() * 1000)
                    if "?" in url:
                        url = f"{url}&_t={timestamp}"
                    else:
                        url = f"{url}?_t={timestamp}"
                    share_map[aid] = url
        except Exception as e:
            logger.error(f"生成分享链接失败 {aid}: {e}")
    return share_map


def update_cache():
    global _agent_cache
    try:
        agents = fetch_agents()
        _agent_cache = {"agents": agents, "updated_at": int(time.time()), "error": None}
        logger.info(f"缓存已更新: {len(agents)} 个智能体")
    except Exception as e:
        _agent_cache["error"] = str(e)
        logger.error(f"更新缓存失败: {e}")


class SelfMediaPlugin:
    def __init__(self):
        self.router = APIRouter()
        self._setup_routes()

    def _setup_routes(self):
        @self.router.get("/agents")
        async def list_agents():
            global _agent_cache
            now = int(time.time())
            # 5分钟缓存
            if not _agent_cache["agents"] or (now - _agent_cache["updated_at"]) > CACHE_TTL:
                try:
                    agents = await asyncio.to_thread(fetch_agents)
                except Exception as e:
                    logger.error(f"获取智能体列表失败: {e}")
                    agents = _agent_cache.get("agents", [])
                logger.info(f"获取到 {len(agents)} 个智能体")
                
                try:
                    share_links = await asyncio.to_thread(fetch_share_links_with_agents, agents)
                    logger.info(f"获取到 {len(share_links)} 个分享链接")
                except Exception as e:
                    logger.error(f"获取分享链接失败: {e}")
                    share_links = {}
                
                agents_with_share = []
                for ag in agents:
                    ag = ag.copy()
                    ag["share_url"] = share_links.get(ag["id"], "")
                    agents_with_share.append(ag)
                
                _agent_cache = {"agents": agents_with_share, "updated_at": int(time.time()), "error": None}
                
                return JSONResponse({
                    "success": True,
                    "agents": agents_with_share,
                    "count": len(agents_with_share),
                    "updated_at": int(time.time()),
                    "error": None
                })
            else:
                return JSONResponse({
                    "success": True,
                    "agents": _agent_cache["agents"],
                    "count": len(_agent_cache["agents"]),
                    "updated_at": _agent_cache["updated_at"],
                    "error": _agent_cache.get("error")
                })

        @self.router.get("/status")
        async def check_status():
            try:
                import requests
                resp = requests.get(f"http://{CLOUD_HOST}:{CLOUD_API_PORT}/agents", timeout=5)
                if resp.status_code == 200:
                    data = resp.json()
                    count = len(data.get("agents", []))
                    return JSONResponse({
                        "connected": True, 
                        "host": CLOUD_HOST, 
                        "count": count,
                        "offline_mode": _agent_cache.get("offline_mode", False),
                        "message": f"已连接 · {count} 个智能体" + (" (离线缓存)" if _agent_cache.get("offline_mode") else "")
                    })
                else:
                    return JSONResponse({"connected": False, "host": CLOUD_HOST, "message": f"HTTP {resp.status_code}"})
            except Exception as e:
                # 检查是否有离线缓存
                offline = load_cache_from_file()
                if offline and offline.get("agents"):
                    return JSONResponse({
                        "connected": False, 
                        "host": CLOUD_HOST, 
                        "offline_mode": True,
                        "count": len(offline["agents"]),
                        "message": f"离线模式 · {len(offline['agents'])} 个智能体"
                    })
                return JSONResponse({"connected": False, "host": CLOUD_HOST, "message": str(e)})

        @self.router.post("/refresh")
        async def refresh_agents():
            await asyncio.to_thread(update_cache)
            return JSONResponse({
                "success": True,
                "agents": _agent_cache["agents"],
                "count": len(_agent_cache["agents"]),
                "updated_at": int(time.time())
            })

        @self.router.post("/share-links")
        async def generate_share_links():
            await asyncio.to_thread(update_cache)
            share_map = {}
            for ag in _agent_cache["agents"]:
                aid = ag["id"]
                url = ag.get("share_url", "")
                if url:
                    timestamp = int(time.time() * 1000)
                    if "?" in url:
                        url = f"{url}&_t={timestamp}"
                    else:
                        url = f"{url}?_t={timestamp}"
                    share_map[aid] = url
            return JSONResponse({
                "success": True,
                "share_links": share_map,
                "count": len(share_map)
            })

    def register(self, api):
        api.register_http_router(self.router, prefix="/self-media", tags=["智媒体"])
        logger.info("✅ 智媒体 plugin registered")


# 导出插件实例
plugin = SelfMediaPlugin()
