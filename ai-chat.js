/**
 * ========================================
 *  百度千帆 AI 接口封装
 * ========================================
 */

class AIBot {
    constructor(config) {
        this.config = config;
        this.accessToken = '';
        this.tokenExpireTime = 0;
        this.chatHistory = [];
    }

    /**
     * 获取百度API的access_token
     */
    async getAccessToken() {
        if (this.accessToken && Date.now() < this.tokenExpireTime) {
            return this.accessToken;
        }

        const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.config.apiKey}&client_secret=${this.config.secretKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
            });

            const data = await response.json();

            if (data.access_token) {
                this.accessToken = data.access_token;
                this.tokenExpireTime = Date.now() + (data.expires_in - 600) * 1000;
                return this.accessToken;
            } else {
                throw new Error(data.error_description || '获取AI token失败');
            }
        } catch (error) {
            console.error('获取AI token失败:', error);
            throw error;
        }
    }

    /**
     * 发送消息给AI
     * @param {string} userMessage - 用户消息
     * @param {Object} deviceData - 当前设备数据（可选）
     * @returns {string} AI回复
     */
    async chat(userMessage, deviceData = null) {
        // 如果还没配置API Key，返回提示
        if (!this.config.apiKey || !this.config.secretKey) {
            return '⚠️ 请先在 config.js 中配置百度千帆的 API Key 和 Secret Key。\n\n申请步骤：\n1. 访问 https://console.bce.baidu.com/qianfan/ais/console/application\n2. 创建应用，获取 API Key 和 Secret Key\n3. 填入 config.js 文件中';
        }

        // 构建上下文
        let systemContent = this.config.systemPrompt;

        // 附加当前设备数据
        if (deviceData) {
            systemContent += `\n\n当前设备实时数据：\n- 温度：${deviceData.temperature}°C\n- 烟雾浓度：${deviceData.smokeLevel}%\n- 蜂鸣器状态：${deviceData.buzzerOn ? '开启' : '关闭'}\n- 温度报警阈值：${deviceData.tempThreshold}°C\n- 烟雾报警阈值：${deviceData.smokeThreshold}%\n- 当前是否报警：${(deviceData.temperature > deviceData.tempThreshold || deviceData.smokeLevel > deviceData.smokeThreshold) ? '是' : '否'}`;
        }

        // 构建消息历史
        this.chatHistory.push({ role: 'user', content: userMessage });

        // 只保留最近10轮对话
        if (this.chatHistory.length > 20) {
            this.chatHistory = this.chatHistory.slice(-20);
        }

        const messages = [
            { role: 'system', content: systemContent },
            ...this.chatHistory
        ];

        const token = await this.getAccessToken();
        const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${this.config.model}?access_token=${token}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages,
                    temperature: 0.7,
                    max_output_tokens: 1024
                })
            });

            const data = await response.json();

            if (data.result) {
                const aiReply = data.result;
                this.chatHistory.push({ role: 'assistant', content: aiReply });
                return aiReply;
            } else {
                throw new Error(data.error_msg || 'AI回复失败');
            }
        } catch (error) {
            console.error('AI对话失败:', error);
            return `❌ AI服务调用失败：${error.message}\n\n请检查：\n1. API Key是否正确\n2. 网络连接是否正常\n3. 百度千帆账户是否欠费`;
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
