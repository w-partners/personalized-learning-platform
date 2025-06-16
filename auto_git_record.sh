#!/bin/bash

# 자동 Git 기록 함수
auto_git_record() {
    local action="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M')
    
    echo "" >> README.md
    echo "### $timestamp" >> README.md
    echo "- $action" >> README.md
    
    # restore_point.json 업데이트
    local temp_file=$(mktemp)
    jq --arg time "$timestamp" --arg action "$action" \
       '.last_log_time = $time | .last_action = $action' \
       restore_point.json > "$temp_file" && mv "$temp_file" restore_point.json
    
    # Git 커밋
    git add .
    git commit -m "📝 $action - MCP session $timestamp"
    
    echo "✅ Git 기록 완료: $action"
}

# 에러 처리 함수
handle_error() {
    local error_msg="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M')
    
    echo "" >> README.md
    echo "### $timestamp - ❌ ERROR" >> README.md
    echo "- 에러 발생: $error_msg" >> README.md
    echo "- 자동 재시도 준비 중..." >> README.md
    
    git add README.md
    git commit -m "❌ ERROR: $error_msg - $timestamp"
    
    echo "🚨 에러 기록 완료: $error_msg"
}

export -f auto_git_record
export -f handle_error
