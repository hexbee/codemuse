import { useState } from 'react';
import { X, Sun, Moon, Type, Palette } from 'lucide-react';
import styles from './Settings.module.css';

const SettingsPanel = ({ theme, onToggleTheme, onClose }) => {
    const [fontSize, setFontSize] = useState(14);
    const [fontFamily, setFontFamily] = useState('Consolas');

    const fontFamilies = [
        { value: 'Consolas', label: 'Consolas' },
        { value: 'Monaco', label: 'Monaco' },
        { value: 'Menlo', label: 'Menlo' },
        { value: 'Courier New', label: 'Courier New' },
        { value: 'Source Code Pro', label: 'Source Code Pro' },
        { value: 'Fira Code', label: 'Fira Code' }
    ];

    const handleFontSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setFontSize(newSize);
        // You could emit this to parent component to update editor settings
    };

    const handleFontFamilyChange = (e) => {
        setFontFamily(e.target.value);
        // You could emit this to parent component to update editor settings
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h3>Settings</h3>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Palette size={16} />
                            <h4>Appearance</h4>
                        </div>
                        
                        <div className={styles.setting}>
                            <label>Theme</label>
                            <button
                                onClick={onToggleTheme}
                                className={styles.themeToggle}
                            >
                                {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                                {theme === 'light' ? 'Light' : 'Dark'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Type size={16} />
                            <h4>Editor</h4>
                        </div>
                        
                        <div className={styles.setting}>
                            <label htmlFor="fontSize">Font Size</label>
                            <div className={styles.inputGroup}>
                                <input
                                    id="fontSize"
                                    type="range"
                                    min="10"
                                    max="24"
                                    value={fontSize}
                                    onChange={handleFontSizeChange}
                                    className={styles.slider}
                                />
                                <span className={styles.value}>{fontSize}px</span>
                            </div>
                        </div>

                        <div className={styles.setting}>
                            <label htmlFor="fontFamily">Font Family</label>
                            <select
                                id="fontFamily"
                                value={fontFamily}
                                onChange={handleFontFamilyChange}
                                className={styles.select}
                            >
                                {fontFamilies.map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h4>About</h4>
                        </div>
                        
                        <div className={styles.about}>
                            <p><strong>CodeMuse</strong></p>
                            <p>A modern HTML editor with live preview and AI assistance.</p>
                            <p>Version 1.0.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
