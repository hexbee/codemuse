import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import styles from './App.module.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        p {
            line-height: 1.6;
            color: #666;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to CodeMuse</h1>
        <p>This is a sample HTML document that you can edit and preview in real-time.</p>

        <div class="highlight">
            <strong>Try editing this HTML:</strong>
            <ul>
                <li>Change the title</li>
                <li>Add new elements</li>
                <li>Modify the styles</li>
                <li>See changes instantly in the preview</li>
            </ul>
        </div>

        <p>CodeMuse provides a powerful HTML editor with syntax highlighting, live preview, and AI assistance to help you create amazing web content.</p>
    </div>
</body>
</html>`);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.app}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <MainContent
        htmlCode={htmlCode}
        onHtmlChange={setHtmlCode}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;
