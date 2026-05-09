/**
 * ========================================
 *  配置文件 - 请替换为你自己的信息
 * ========================================
 */

// 机智云配置
const GIZWITS_CONFIG = {
    // 产品标识（从机智云后台获取）
    productKey: 'f107c5b8bc044abea780dbbfb3d9ce09',
    // 产品密钥（从机智云后台获取）
    productSecret: 'aa7f45bcc7ab4d73826686f24e8ace32',
    // 设备ID（从机智云设备管理获取）
    did: 'HNaKi2LC9pTRMAGjcGEKHP',
    // 机智云API地址
    apiBase: 'https://api.gizwits.com',
    // API版本
    apiVersion: 'app'
};

// 百度千帆AI配置（去 https://console.bce.baidu.com/qianfan/ais/console/application 申请）
const AI_CONFIG = {
    // 百度千帆 API Key（需要你去申请）
    apiKey: '',
    // 百度千帆 Secret Key（需要你去申请）
    secretKey: '',
    // AI模型名称
    model: 'ernie-speed-128k',
    // AI系统提示词
    systemPrompt: `你是一个智能烟雾报警系统助手。你的职责是：
1. 分析用户提供的温度和烟雾浓度数据
2. 判断是否存在安全隐患
3. 给出专业的安全建议
4. 用简洁易懂的语言回答用户问题

系统参数：
- 烟雾浓度范围：0~100%
- 温度正常范围：-10~50°C
- 报警阈值由用户设置，超过阈值会触发蜂鸣器和LED报警

请根据实时数据给出专业分析。`
};
