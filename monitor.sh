#!/bin/bash
# ========================================
# 云服务器监控脚本 - QwenPaw 自动重启
# 放置位置: /root/.copaw/monitor.sh
# 添加定时任务: */5 * * * * /root/.copaw/monitor.sh
# ========================================

LOG_FILE="/root/.copaw/monitor.log"
PORT=8889
MAX_RESTART=3

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

# 检查端口是否响应
check_port() {
    timeout 3 curl -s "http://localhost:${PORT}/api/agents" > /dev/null 2>&1
    return $?
}

# 检查进程是否存在
check_process() {
    ps aux | grep "qwenpaw app" | grep -v grep > /dev/null 2>&1
    return $?
}

log "=== 开始检查 ==="

# 检查端口
if ! check_port; then
    log "⚠️ 端口 ${PORT} 无响应"
    
    # 检查进程
    if check_process; then
        log "📌 进程存在，尝试重启..."
        pkill -f "qwenpaw app"
        sleep 2
        cd /root/.copaw
        nohup qwenpaw app --host 0.0.0.0 --port ${PORT} > qwenpaw.log 2>&1 &
        sleep 5
        
        if check_port; then
            log "✅ 重启成功"
        else
            log "❌ 重启失败"
        fi
    else
        log "❌ 进程不存在，启动..."
        cd /root/.copaw
        nohup qwenpaw app --host 0.0.0.0 --port ${PORT} > qwenpaw.log 2>&1 &
        sleep 5
        
        if check_port; then
            log "✅ 启动成功"
        else
            log "❌ 启动失败"
        fi
    fi
else
    log "✅ 正常运行"
fi

# 检查 cloud-api.py 状态
if ! pgrep -f "cloud-api.py" > /dev/null; then
    log "⚠️ cloud-api.py 未运行，启动..."
    cd /root/.copaw/plugins/self-media
    nohup python3 cloud-api.py > cloud-api.log 2>&1 &
    sleep 2
    log "✅ cloud-api.py 已启动"
fi

log "=== 检查完成 ==="
