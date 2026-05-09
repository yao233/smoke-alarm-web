/**
 * ========================================
 *  DeepSeek AI 接口封装（OpenAI 兼容格式）
 * ========================================
 */

class AIBot {
    constructor(config) {
        this.config = config;
        this.chatHistory = [];
    }

    /**
     * 发送消息给AI
     * @param {string} userMessage - 用户消息
     * @param {Object} deviceData - 当前设备数据（可选）
     * @returns {string} AI回复
     */
    async chat(userMessage, deviceData = null) {
        // 如果还没配置API Key，返回提示
        if (!this.config.apiKey) {
            return '⚠️ 请先在 config.js 中填入 DeepSeek API Key。\n\n申请步骤：\n1. 访问 https://platform.deepseek.com\n2. 注册登录后点击左侧 "API Keys"\n3. 创建密钥，复制以 sk- 开头的Key\n4. 填入 config.js 的 apiKey 字段';
        }

        // 构建系统提示词
        let systemContent = this.config.systemPrompt;

        // 附加当前设备数据
        if (deviceData) {
            systemContent += `\n\n当前设备实时数据：\n- 温度：${deviceData.temperature}°C\n- 烟雾浓度：${deviceData.smokeLevel}%\n- 蜂鸣器状态：${deviceData.buzzerOn ? '开启' : '关闭'}\n- 温度报警阈值：${deviceData.tempThreshold}°C\n- 烟雾报警阈值：${deviceData.smokeThreshold}%\n- 当前是否报警：${(deviceData.temperature > deviceData.tempThreshold || deviceData.smokeLevel > deviceData.smokeThreshold) ? '是' : '否'}`;
        }

        // 构建消息历史
        const messages = [
            { role: 'system', content: systemContent },
            ...this.chatHistory,
            { role: 'user', content: userMessage }
        ];

        // 调用 DeepSeek API（OpenAI 兼容格式）
        const url = 'https://api.deepseek.com/chat/completions';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                const aiReply = data.choices[0].message.content;
                // 保存对话历史（用于多轮对话）
                this.chatHistory.push({ role: 'user', content: userMessage });
                this.chatHistory.push({ role: 'assistant', content: aiReply });
                // 只保留最近10轮
                if (this.chatHistory.length > 20) {
                    this.chatHistory = this.chatHistory.slice(-20);
                }
                return aiReply;
            } else if (data.error) {
                throw new Error(data.error.message || 'AI回复失败');
            } else {
                throw new Error('AI回复格式异常');
            }
        } catch (error) {
            console.error('AI对话失败:', error);
            return `❌ AI服务调用失败：${error.message}\n\n请检查：\n1. API Key 是否正确（以 sk- 开头）\n2. 网络连接是否正常\n3. DeepSeek 账户是否有余额`;
        }
    }

    /**
     * 一键分析当前设备状态
     * @param {Object} deviceData - 设备数据
     * @returns {string} AI分析报告
     */
    async analyzeStatus(deviceData) {
        const prompt = `请分析当前烟雾报警系统的状态并给出安全评估报告，包括：
1. 当前各项数据是否正常
2. 是否存在安全隐患
3. 安全建议

请用简明的报告格式输出。`;

        return await this.chat(prompt, deviceData);
    }

    /**
     * 清除对话历史
     */
    clearHistory() {
        this.chatHistory = [];
    }
}

// 导出实例
const aiBot = new AIBot(AI_CONFIG);
