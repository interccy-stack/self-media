#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智媒体 Cloud API 服务
通过 HTTP API 提供智能体列表和分享链接生成
"""

import json
import subprocess
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

CLOUD_AGENT_PORT = 8889
CACHE_TTL = 300  # 5分钟缓存
MAX_RETRIES = 3  # 最大重试次数
RETRY_DELAY = 2  # 重试间隔(秒)

# 缓存
_cache = {"agents": [], "share_links": {}, "updated_at": 0}


def get_agents_from_qwenpaw():
    """从 qwenpaw 获取智能体列表（带重试）"""
    for attempt in range(MAX_RETRIES):
        try:
            result = subprocess.run(
                ["qwenpaw", "agents", "list"],
                capture_output=True,
                text=True,
                timeout=15
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
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
                        "status": "online" if a.get("enabled", True) else "offline"
                    })
                return agents
            else:
                print(f"尝试 {attempt+1}/{MAX_RETRIES}: qwenpaw 返回错误")
        except subprocess.TimeoutExpired:
            print(f"尝试 {attempt+1}/{MAX_RETRIES}: 超时")
        except Exception as e:
            print(f"尝试 {attempt+1}/{MAX_RETRIES}: {e}")
        
        if attempt < MAX_RETRIES - 1:
            time.sleep(RETRY_DELAY)
    
    print(f"获取智能体失败，已重试 {MAX_RETRIES} 次")
    return []


def generate_share_link(agent_id, name):
    """生成单个分享链接（带重试）"""
    for attempt in range(MAX_RETRIES):
        try:
            payload = json.dumps({"agent_id": agent_id, "name": name, "expiry_days": 0})
            cmd = f'curl -s -X POST http://localhost:{CLOUD_AGENT_PORT}/api/agent-share/share -H "Content-Type: application/json" -d \'{payload}\''
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=15)
            resp = json.loads(result.stdout) if result.stdout else {}
            if resp.get("success") and resp.get("share_url"):
                url = resp["share_url"]
                # 替换IP为域名
                url = url.replace("172.19.26.110", "agent.bh-jk.com")
                url = url.replace("112.124.10.90", "agent.bh-jk.com")
                return url
            else:
                print(f"生成链接失败 {agent_id}: {resp.get('message', 'unknown')}")
        except Exception as e:
            print(f"尝试 {attempt+1}/{MAX_RETRIES}: {e}")
        
        if attempt < MAX_RETRIES - 1:
            time.sleep(RETRY_DELAY)
    
    print(f"生成链接失败 {agent_id}，已重试 {MAX_RETRIES} 次")
    return None


def generate_all_share_links(agents):
    """批量生成分享链接"""
    share_links = {}
    for agent in agents:
        aid = agent["id"]
        name = agent["name"]
        url = generate_share_link(aid, name)
        if url:
            share_links[aid] = url
    return share_links


class APIHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

    def send_json(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == "/agents":
            # 获取智能体列表
            now = time.time()
            
            # 检查缓存
            if not _cache["agents"] or (now - _cache["updated_at"]) > CACHE_TTL:
                _cache["agents"] = get_agents_from_qwenpaw()
                _cache["updated_at"] = now
                # 同时生成分享链接
                _cache["share_links"] = generate_all_share_links(_cache["agents"])
                print(f"刷新智能体列表: {len(_cache['agents'])} 个, 分享链接: {len(_cache['share_links'])} 个")
            
            # 合并分享链接
            for agent in _cache["agents"]:
                agent["share_url"] = _cache["share_links"].get(agent["id"], "")
            
            self.send_json({
                "success": True,
                "agents": _cache["agents"],
                "count": len(_cache["agents"]),
                "updated_at": _cache["updated_at"]
            })
            
        elif path == "/refresh":
            # 强制刷新
            _cache["agents"] = get_agents_from_qwenpaw()
            _cache["updated_at"] = int(time.time())
            _cache["share_links"] = generate_all_share_links(_cache["agents"])
            
            for agent in _cache["agents"]:
                agent["share_url"] = _cache["share_links"].get(agent["id"], "")
            
            self.send_json({
                "success": True,
                "agents": _cache["agents"],
                "count": len(_cache["agents"]),
                "updated_at": _cache["updated_at"]
            })
            
        elif path == "/health":
            self.send_json({"status": "ok", "time": int(time.time())})
        else:
            self.send_json({"error": "not found"})

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


def main():
    port = 8890
    server = HTTPServer(("0.0.0.0", port), APIHandler)
    print(f"🚀 智媒体 API 服务已启动: http://0.0.0.0:{port}")
    print(f"📋 API 端点:")
    print(f"   - GET /agents    获取智能体列表")
    print(f"   - GET /refresh   强制刷新")
    print(f"   - GET /health   健康检查")
    print(f"   - 缓存时间: {CACHE_TTL}秒")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 服务已停止")
        server.server_close()


if __name__ == "__main__":
    main()
