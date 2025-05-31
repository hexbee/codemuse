import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import styles from './CodeEditor.module.css';

const CodeEditor = ({ value, onChange, theme }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Configure HTML language features
        monaco.languages.html.htmlDefaults.setOptions({
            format: {
                tabSize: 4,
                insertSpaces: true,
                wrapLineLength: 120,
                unformatted: 'default"',
                contentUnformatted: 'pre,code,textarea',
                indentInnerHtml: false,
                preserveNewLines: true,
                maxPreserveNewLines: undefined,
                indentHandlebars: false,
                endWithNewline: false,
                extraLiners: 'head, body, /html',
                wrapAttributes: 'auto',
            },
            suggest: {
                html5: true,
                angular1: false,
                ionic: false,
            },
        });

        // Add custom HTML snippets
        monaco.languages.registerCompletionItemProvider('html', {
            provideCompletionItems: () => {
                const suggestions = [
                    {
                        label: 'html5',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            '<!DOCTYPE html>',
                            '<html lang="en">',
                            '<head>',
                            '    <meta charset="UTF-8">',
                            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '    <title>${1:Document}</title>',
                            '</head>',
                            '<body>',
                            '    ${2}',
                            '</body>',
                            '</html>',
                        ].join('\n'),
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: 'HTML5 boilerplate',
                    },
                    {
                        label: 'div',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText:
                            '<div class="${1:class-name}">\n    ${2}\n</div>',
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: 'Div with class',
                    },
                    {
                        label: 'button',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText:
                            '<button type="${1:button}" onclick="${2:function()}">${3:Button Text}</button>',
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: 'Button element',
                    },
                ];
                return { suggestions };
            },
        });
    };

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 1.5,
        fontFamily: 'Consolas, "Courier New", monospace',
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        detectIndentation: false,
        trimAutoWhitespace: true,
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        snippetSuggestions: 'top',
        quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
        },
        parameterHints: {
            enabled: true,
        },
        hover: {
            enabled: true,
        },
        contextmenu: true,
        mouseWheelZoom: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
        },
    };

    return (
        <div className={styles.editorContainer}>
            <Editor
                height="100%"
                defaultLanguage="html"
                value={value}
                onChange={onChange}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={editorOptions}
                loading={
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <span>Loading editor...</span>
                    </div>
                }
            />
        </div>
    );
};

export default CodeEditor;
