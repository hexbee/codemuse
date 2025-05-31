# 代码格式化指南

本项目已配置完整的代码格式化和质量检查工具链，确保代码风格的一致性和质量。

## 🛠️ 工具配置

### 1. **Prettier** - 代码格式化

- **配置文件**: `.prettierrc`
- **忽略文件**: `.prettierignore`
- **功能**: 自动格式化代码，统一代码风格

### 2. **ESLint** - 代码质量检查

- **配置文件**: `eslint.config.js`
- **功能**: 检查代码质量，发现潜在问题

### 3. **EditorConfig** - 编辑器配置

- **配置文件**: `.editorconfig`
- **功能**: 统一不同编辑器的基础设置

## 📝 格式化规则

### Prettier 配置

```json
{
    "semi": true, // 使用分号
    "trailingComma": "es5", // ES5兼容的尾随逗号
    "singleQuote": true, // 使用单引号
    "printWidth": 80, // 行宽80字符
    "tabWidth": 4, // 缩进4个空格
    "useTabs": false, // 使用空格而非Tab
    "bracketSpacing": true, // 对象括号内空格
    "bracketSameLine": false, // JSX括号换行
    "arrowParens": "avoid", // 箭头函数参数括号
    "endOfLine": "lf" // 使用LF换行符
}
```

### EditorConfig 配置

- **字符编码**: UTF-8
- **换行符**: LF
- **缩进**: 4个空格
- **文件末尾**: 插入新行
- **行尾空格**: 自动删除

## 🚀 使用方法

### NPM 脚本命令

```bash
# 格式化所有文件
npm run format

# 检查格式化状态（不修改文件）
npm run format:check

# 运行ESLint检查
npm run lint

# 运行ESLint并自动修复
npm run lint:fix

# 格式化 + ESLint修复（推荐）
npm run format:lint
```

### 开发工作流

1. **开发时**:

    - VSCode会自动在保存时格式化代码
    - ESLint会实时显示问题

2. **提交前**:

    ```bash
    npm run format:lint
    ```

3. **CI/CD**:
    ```bash
    npm run format:check
    npm run lint
    ```

## 🔧 VSCode 配置

### 推荐扩展

项目已配置 `.vscode/extensions.json`，包含：

- Prettier - Code formatter
- ESLint
- EditorConfig for VS Code

### 自动配置

项目已配置 `.vscode/settings.json`：

- 保存时自动格式化
- 保存时自动修复ESLint问题
- 统一编辑器设置

## 📋 最佳实践

### 1. **团队协作**

- 所有团队成员使用相同的格式化配置
- 提交前运行 `npm run format:lint`
- 不要修改格式化配置文件

### 2. **代码质量**

- 修复所有ESLint错误
- 关注ESLint警告
- 使用有意义的变量名

### 3. **文件组织**

- 保持文件结构清晰
- 使用一致的导入顺序
- 删除未使用的代码

## 🎯 配置文件说明

| 文件                      | 用途         | 说明               |
| ------------------------- | ------------ | ------------------ |
| `.prettierrc`             | Prettier配置 | 代码格式化规则     |
| `.prettierignore`         | Prettier忽略 | 不需要格式化的文件 |
| `eslint.config.js`        | ESLint配置   | 代码质量检查规则   |
| `.editorconfig`           | 编辑器配置   | 跨编辑器的基础设置 |
| `.vscode/settings.json`   | VSCode设置   | 项目级VSCode配置   |
| `.vscode/extensions.json` | VSCode扩展   | 推荐安装的扩展     |

## 🔍 故障排除

### 常见问题

1. **格式化不生效**

    - 检查VSCode是否安装Prettier扩展
    - 确认 `.prettierrc` 文件存在
    - 重启VSCode

2. **ESLint错误**

    - 运行 `npm run lint:fix` 自动修复
    - 检查 `eslint.config.js` 配置
    - 确认安装了所有依赖

3. **编辑器设置冲突**
    - 检查全局VSCode设置
    - 确认项目设置优先级
    - 查看 `.editorconfig` 配置

### 手动修复

如果自动工具无法解决问题：

```bash
# 重新安装依赖
npm install

# 清理并重新格式化
npm run format
npm run lint:fix
```

---

通过这套完整的代码格式化配置，项目代码将保持高质量和一致性！ 🎉
