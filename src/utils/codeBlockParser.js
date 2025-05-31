/**
 * 代码块解析工具
 * 用于检测和解析AI回复中的代码块
 */

/**
 * 解析消息内容，提取代码块和普通文本
 * @param {string} content - 消息内容
 * @returns {Array} 解析后的内容块数组
 */
export function parseMessageContent(content) {
    if (!content || typeof content !== 'string') {
        return [{ type: 'text', content: content || '' }];
    }

    const blocks = [];
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        // 添加代码块前的文本
        if (match.index > lastIndex) {
            const textContent = content.slice(lastIndex, match.index).trim();
            if (textContent) {
                blocks.push({
                    type: 'text',
                    content: textContent
                });
            }
        }

        // 添加代码块
        const language = match[1] || 'text';
        const code = match[2].trim();
        
        blocks.push({
            type: 'code',
            language: language.toLowerCase(),
            content: code,
            id: generateCodeBlockId()
        });

        lastIndex = match.index + match[0].length;
    }

    // 添加最后剩余的文本
    if (lastIndex < content.length) {
        const textContent = content.slice(lastIndex).trim();
        if (textContent) {
            blocks.push({
                type: 'text',
                content: textContent
            });
        }
    }

    // 如果没有找到代码块，返回原始文本
    if (blocks.length === 0) {
        blocks.push({
            type: 'text',
            content: content
        });
    }

    return blocks;
}

/**
 * 生成唯一的代码块ID
 * @returns {string} 唯一ID
 */
function generateCodeBlockId() {
    return `code-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 检查是否为支持的代码语言
 * @param {string} language - 语言标识
 * @returns {boolean} 是否支持
 */
export function isSupportedLanguage(language) {
    const supportedLanguages = [
        'html', 'css', 'javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx',
        'json', 'xml', 'markdown', 'md', 'python', 'java', 'c', 'cpp',
        'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'sql',
        'bash', 'shell', 'powershell', 'yaml', 'yml', 'toml', 'ini'
    ];
    
    return supportedLanguages.includes(language.toLowerCase());
}

/**
 * 获取语言的显示名称
 * @param {string} language - 语言标识
 * @returns {string} 显示名称
 */
export function getLanguageDisplayName(language) {
    const languageNames = {
        'html': 'HTML',
        'css': 'CSS',
        'javascript': 'JavaScript',
        'js': 'JavaScript',
        'jsx': 'React JSX',
        'typescript': 'TypeScript',
        'ts': 'TypeScript',
        'tsx': 'React TSX',
        'json': 'JSON',
        'xml': 'XML',
        'markdown': 'Markdown',
        'md': 'Markdown',
        'python': 'Python',
        'java': 'Java',
        'c': 'C',
        'cpp': 'C++',
        'csharp': 'C#',
        'php': 'PHP',
        'ruby': 'Ruby',
        'go': 'Go',
        'rust': 'Rust',
        'swift': 'Swift',
        'kotlin': 'Kotlin',
        'sql': 'SQL',
        'bash': 'Bash',
        'shell': 'Shell',
        'powershell': 'PowerShell',
        'yaml': 'YAML',
        'yml': 'YAML',
        'toml': 'TOML',
        'ini': 'INI'
    };
    
    return languageNames[language.toLowerCase()] || language.toUpperCase();
}

/**
 * 检查代码是否可以导入到编辑器
 * @param {string} language - 语言标识
 * @returns {boolean} 是否可以导入
 */
export function canImportToEditor(language) {
    const importableLanguages = ['html', 'css', 'javascript', 'js', 'xml'];
    return importableLanguages.includes(language.toLowerCase());
}

/**
 * 格式化代码内容用于显示
 * @param {string} code - 代码内容
 * @param {number} maxLines - 最大显示行数
 * @returns {object} 格式化结果
 */
export function formatCodeForDisplay(code, maxLines = 10) {
    if (!code) return { preview: '', isLong: false, totalLines: 0 };
    
    const lines = code.split('\n');
    const totalLines = lines.length;
    const isLong = totalLines > maxLines;
    
    const preview = isLong 
        ? lines.slice(0, maxLines).join('\n') + '\n...'
        : code;
    
    return {
        preview,
        isLong,
        totalLines,
        fullCode: code
    };
}
