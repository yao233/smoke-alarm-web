/**
 * ========================================
 *  机智云 API 接口封装
 * ========================================
 */

class GizwitsAPI {
    constructor(config) {
        this.config = config;
        this.token = '';
        this.tokenExpireTime = 0;
        this.lastData = null;
    }

    /**
     * 获取访问令牌（匿名登录）
     */
    async getToken() {
        // 检查token是否有效
        if (this.token && Date.now() < this.tokenExpireTime) {
            return this.token;
        }

        // 匿名登录接口：/app/bind/guest
        const url = `${this.config.apiBase}/${this.config.apiVersion}/bind/guest`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_key: this.config.productKey
                })
            });

            const data = await response.json();

            if (data.token) {
                this.token = data.token;
                // token有效期约7天，提前1天刷新
                this.tokenExpireTime = Date.now() + 6 * 24 * 60 * 60 * 1000;
                return this.token;
            } else {
                throw new Error(data.msg || '获取token失败');
            }
        } catch (error) {
            console.error('获取token失败:', error);
            throw error;
        }
    }

    /**
     * 获取设备最新数据点
     */
    async getLatestData() {
        const token = await this.getToken();
        const url = `${this.config.apiBase}/${this.config.apiVersion}/devdata/${this.config.did}/latest`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-Gizwits-Token': token }
            });

            const data = await response.json();

            if (data.success && data.data) {
                this.lastData = data.data;
                return data.data;
            } else {
                throw new Error(data.msg || '获取设备数据失败');
            }
        } catch (error) {
            console.error('获取设备数据失败:', error);
            throw error;
        }
    }

    /**
     * 获取设备历史数据
     * @param {number} start - 开始时间戳（秒）
     * @param {number} end - 结束时间戳（秒）
     */
    async getHistoryData(start, end) {
        const token = await this.getToken();
        const url = `${this.config.apiBase}/${this.config.apiVersion}/devdata/${this.config.did}`;
        const params = new URLSearchParams({ start, end });

        try {
            const response = await fetch(`${url}?${params}`, {
                method: 'GET',
                headers: { 'X-Gizwits-Token': token }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取历史数据失败:', error);
            throw error;
        }
    }

    /**
     * 控制设备（下发命令）
     * @param {Object} attrs - 数据点键值对，如 { valuebuzzer: true }
     */
    async controlDevice(attrs) {
        const token = await this.getToken();
        const url = `${this.config.apiBase}/${this.config.apiVersion}/control/${this.config.did}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Gizwits-Token': token
                },
                body: JSON.stringify({ attrs })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('控制设备失败:', error);
            throw error;
        }
    }

    /**
     * 格式化数据点，返回用户可读的对象
     */
    parseDataPoints(raw) {
        if (!raw) return null;

        return {
            // 温度
            temperature: raw.valueTemp ?? 0,
            // 烟雾浓度 (0~100%)
            smokeLevel: raw.valuemqvalue ?? 0,
            // 蜂鸣器状态
            buzzerOn: raw.valuebuzzer === true || raw.valuebuzzer === 1,
            // 电源指示灯
            powerOn: raw.valuepower === true || raw.valuepower === 1,
            // 温度报警阈值
            tempThreshold: raw.valueTemp_yuzhi ?? 0,
            // 烟雾报警阈值
            smokeThreshold: raw.valuemq_yuzhi ?? 0,
            // 数据时间
            timestamp: raw.attr_updated_at || new Date().toISOString()
        };
    }
}

// 导出实例
const gizwitsAPI = new GizwitsAPI(GIZWITS_CONFIG);
