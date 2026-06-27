# 📦 智媒体安装指南

## 环境要求

| 组件 | 版本 | 说明 |
|------|------|------|
| **Python** | 3.8+ | 后端运行环境 |
| **paramiko** | - | SSH 连接库 |
| **requests** | - | HTTP 请求库 |
| **QwenPaw** | 1.1.10+ | 本地运行环境 |

## 安装步骤

### 1. 安装 Python 依赖

```bash
pip install paramiko requests
```

### 2. 安装插件

```bash
# 进入插件目录
cd self-media

# 安装插件
qwenpaw plugin install . --force
```

### 3. 验证安装

1. 重启 QwenPaw（如果需要）
2. 刷新页面
3. 在左侧菜单应看到「📡 智媒体」

### 4. 首次使用

- 插件预设连接作者服务器，无需任何配置
- 打开「智媒体」页面，等待加载（约 3-5 秒）
- 智能体卡牌将自动显示

## 连接自己的云服务器（可选）

如需连接自己的服务器：

1. 复制配置模板
```bash
cp config.json.example config.json
```

2. 编辑 config.json，填入服务器信息
```json
{
  "host": "your-server.com",
  "port": 22,
  "user": "root",
  "password": "your-password",
  "share_domain": "your-domain.com",
  "agent_port": 8889,
  "api_port": 8890
}
```

3. 重启插件
```bash
qwenpaw plugin install . --force
```

## 云服务器部署

如果连接自己的服务器，需要在云服务器上部署：

1. 安装 QwenPaw
2. 安装 agent-share 插件
3. 上传并运行 cloud-api.py
```bash
# 启动 cloud-api.py
cd /root/.copaw/plugins/self-media
nohup python3 cloud-api.py > cloud-api.log 2>&1 &
```

## 常见问题

- **加载慢**：检查网络能否访问云服务器 8890 端口
- **显示为空**：检查 cloud-api.py 是否正常运行
- **分享链接失败**：检查云服务器 8889 端口是否开放
