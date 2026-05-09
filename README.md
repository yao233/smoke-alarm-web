# 烟雾报警系统 - AI智能监控面板

> 将此项目部署到 GitHub Pages，即可通过浏览器访问烟雾报警系统的实时数据和AI分析功能。

## 文件说明

| 文件 | 作用 |
|------|------|
| `index.html` | 主页面（数据展示 + AI对话 + 远程控制） |
| `config.js` | 配置文件（需要填写API Key） |
| `gizwits-api.js` | 机智云API接口封装 |
| `ai-chat.js` | 百度千帆AI接口封装 |
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

### 第4步：配置AI（可选）

1. 访问 https://console.bce.baidu.com/qianfan/ais/console/application
2. 创建应用，获取 **API Key** 和 **Secret Key**
3. 编辑 `config.js`，填入你的Key：
```javascript
const AI_CONFIG = {
    apiKey: '你的API Key',
    secretKey: '你的Secret Key',
    ...
};
```
4. 重新上传 `config.js` 到 GitHub

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
