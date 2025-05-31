# CodeMuse - HTML Editor with AI Assistant

一个现代化的HTML编辑器，具有实时预览功能和AI对话增强编辑体验。

## ✨ 功能特性

### 🎨 现代化界面设计
- **响应式布局**: 适配桌面和移动设备
- **主题切换**: 支持明暗主题
- **清洁美观**: 圆角、阴影、平滑过渡效果
- **可折叠侧边栏**: 灵活的布局管理

### 📝 强大的编辑功能
- **Monaco Editor**: 基于VS Code的编辑器核心
- **语法高亮**: HTML语法高亮显示
- **行号显示**: 清晰的代码行号
- **智能补全**: HTML标签和属性自动补全
- **代码格式化**: 自动格式化和缩进
- **代码片段**: 内置HTML模板和常用代码片段

### 👁️ 实时预览
- **即时渲染**: 编辑代码时实时更新预览
- **安全沙箱**: 使用iframe安全渲染HTML
- **刷新功能**: 手动刷新预览内容

### 🤖 AI助手集成
- **智能对话**: AI助手帮助编写和优化HTML代码
- **代码建议**: 提供HTML最佳实践建议
- **格式化帮助**: 协助代码格式化和结构优化
- **实时交互**: 流畅的聊天界面体验

### 🛠️ 实用工具
- **复制代码**: 一键复制HTML代码到剪贴板
- **下载文件**: 将HTML代码下载为.html文件
- **设置面板**: 自定义编辑器字体、大小等设置

## 🚀 技术栈

- **前端框架**: React 19 + Vite
- **编辑器**: Monaco Editor (VS Code核心)
- **图标库**: Lucide React
- **样式方案**: CSS Modules + CSS变量
- **状态管理**: React Hooks
- **主题系统**: CSS变量 + localStorage持久化

## 📦 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📁 项目结构

```
codemuse/
├── src/
│   ├── components/          # React组件
│   │   ├── Sidebar/        # AI助手侧边栏
│   │   ├── MainContent/    # 主内容区域
│   │   ├── Editor/         # 代码编辑器
│   │   ├── Preview/        # 预览组件
│   │   └── Settings/       # 设置面板
│   ├── hooks/              # 自定义Hooks
│   │   └── useTheme.js     # 主题管理Hook
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 应用入口
│   └── index.css           # 全局样式和主题变量
├── public/                 # 静态资源
├── package.json            # 项目配置
└── README.md              # 项目文档
```

## 🎯 使用指南

### 基本操作
1. **编辑HTML**: 在左侧编辑器中输入HTML代码
2. **查看预览**: 点击"Preview"标签查看实时渲染效果
3. **AI助手**: 使用左侧AI助手获取编码帮助
4. **主题切换**: 点击月亮/太阳图标切换明暗主题

### 快捷功能
- **复制代码**: 点击"Copy"按钮复制当前HTML代码
- **下载文件**: 点击"Download"按钮下载HTML文件
- **设置**: 点击"Settings"按钮自定义编辑器设置

### AI助手使用
- 在侧边栏输入框中输入问题或需求
- AI助手会提供HTML编码建议和最佳实践
- 支持代码格式化、结构优化等功能

## 🔧 自定义配置

### 主题定制
在 `src/index.css` 中修改CSS变量来自定义主题颜色：

```css
:root {
    --accent-primary: #your-color;
    --bg-primary: #your-background;
    /* 更多变量... */
}
```

### 编辑器配置
在 `src/components/Editor/CodeEditor.jsx` 中修改Monaco Editor选项：

```javascript
const editorOptions = {
    fontSize: 14,
    fontFamily: 'Consolas',
    // 更多选项...
};
```

## 📝 开发说明

### 添加新功能
1. 在相应的组件目录下创建新组件
2. 使用CSS Modules编写样式
3. 通过props传递数据和事件处理函数
4. 更新主应用组件集成新功能

### 样式规范
- 使用CSS变量确保主题一致性
- 采用CSS Modules避免样式冲突
- 遵循响应式设计原则
- 保持组件样式的独立性

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

## 📄 许可证

MIT License
