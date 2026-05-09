# 烟雾报警系统 - AI智能监控面板

> 将此项目部署到 GitHub Pages，即可通过浏览器访问烟雾报警系统的实时数据和AI分析功能。
> 
> **AI 服务**：使用 DeepSeek API（申请简单、价格便宜）

## 文件说明

| 文件 | 作用 |
|------|------|
| `index.html` | 主页面（数据展示 + AI对话 + 远程控制） |
| `config.js` | 配置文件（需要填写机智云凭据 + DeepSeek API Key） |
| `gizwits-api.js` | 机智云API接口封装 |
| `ai-chat.js` | DeepSeek AI接口封装 |
| `style.css` | 页面样式 |

## 部署到 GitHub Pages（5分钟）

### 第1步：创建GitHub仓库

1. 打开 https://github.com/new
2. 仓库名称填：`smoke-alarm-web`
3. 选择 **Public**（公开）
4. **不要**勾选 README、.gitignore、License
5. 点击 **Create repository**

### 第2步：上传文件

**方式A：网页上传（最简单）**
1. 在新仓库页面，点击 **Add file** → **Upload files**
2. 把以下5个文件拖拽上去：
   - `index.html`
   - `config.js`
   - `gizwits-api.js`
   - `ai-chat.js`
   - `style.css`
3. 点击 **Commit changes**

**方式B：Git命令行**
```bash
cd smoke-alarm-web
git init
git add .
git commit -m "烟雾报警系统AI监控面板"
git remote add origin https://github.com/你的用户名/smoke-alarm-web.git
git branch -M main
git push -u origin main
```

### 第3步：开启 GitHub Pages

1. 进入仓库页面 → **Settings**（设置）
2. 左侧菜单找到 **Pages**
3. Source 选择：**Deploy from a branch**
4. Branch 选择：**main**，文件夹选 **/ (root)**
5. 点击 **Save**
6. 等待1-2分钟，页面会显示访问链接：
   `https://你的用户名.github.io/smoke-alarm-web/`

### 第4步：配置 AI（DeepSeek）

1. 打开 https://platform.deepseek.com ，注册并登录
2. 点击左侧 **API Keys** → **Create new secret key**
3. 复制生成的 Key（以 `sk-` 开头）
4. 编辑 `config.js`，填入你的 Key：
```javascript
const AI_CONFIG = {
    apiKey: 'sk-你的Key',
    ...
};
```
5. 重新上传 `config.js` 到 GitHub

> DeepSeek 新用户有免费额度，用完需充值（非常便宜，约 ¥0.001/千tokens）

## 功能

- **实时数据**：自动每10秒刷新温度、烟雾浓度、报警状态
- **数据趋势**：折线图展示温度和烟雾浓度的历史变化
- **远程控制**：一键开启/关闭蜂鸣器和电源灯
- **AI分析**：点击"AI分析"自动生成安全评估报告
- **AI对话**：输入文字与AI自由对话，询问安全问题

## 注意事项

- 机智云API需要在产品设置中允许API访问
- 百度千帆AI有免费额度，超出需要付费
- 如果遇到跨域问题，确保机智云产品设置了正确的API权限
