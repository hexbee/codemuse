import { useState } from 'react';
import {
    X,
    Sun,
    Moon,
    Type,
    Palette,
    Bot,
    Eye,
    EyeOff,
    Check,
    AlertCircle,
    Wifi,
} from 'lucide-react';
import { useAIConfig } from '../../hooks/useAIConfig';
import OpenAIService from '../../services/openaiService';
import styles from './Settings.module.css';

const SettingsPanel = ({ theme, onToggleTheme, onClose }) => {
    const [fontSize, setFontSize] = useState(14);
    const [fontFamily, setFontFamily] = useState('Consolas');
    const [showApiKey, setShowApiKey] = useState(false);
    const [tempConfig, setTempConfig] = useState({});
    const [configErrors, setConfigErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const { config, updateConfig, validateConfig, supportedModels } =
        useAIConfig();

    const fontFamilies = [
        { value: 'Consolas', label: 'Consolas' },
        { value: 'Monaco', label: 'Monaco' },
        { value: 'Menlo', label: 'Menlo' },
        { value: 'Courier New', label: 'Courier New' },
        { value: 'Source Code Pro', label: 'Source Code Pro' },
        { value: 'Fira Code', label: 'Fira Code' },
    ];

    const handleFontSizeChange = e => {
        const newSize = parseInt(e.target.value);
        setFontSize(newSize);
        // You could emit this to parent component to update editor settings
    };

    const handleFontFamilyChange = e => {
        setFontFamily(e.target.value);
        // You could emit this to parent component to update editor settings
    };

    // AI Config handlers
    const handleConfigChange = (field, value) => {
        setTempConfig(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (configErrors[field]) {
            setConfigErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleSaveAIConfig = async () => {
        setIsSaving(true);
        setSaveSuccess(false);

        try {
            const configToSave = { ...config, ...tempConfig };
            const validation = validateConfig(configToSave);

            if (!validation.isValid) {
                setConfigErrors(validation.errors);
                setIsSaving(false);
                return;
            }

            // Save each field
            for (const [field, value] of Object.entries(tempConfig)) {
                updateConfig(field, value);
            }

            setTempConfig({});
            setConfigErrors({});
            setSaveSuccess(true);

            // Hide success message after 2 seconds
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (error) {
            console.error('Failed to save AI config:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getCurrentConfigValue = field => {
        return tempConfig[field] !== undefined
            ? tempConfig[field]
            : config[field];
    };

    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestResult(null);

        try {
            const configToTest = { ...config, ...tempConfig };
            const validation = validateConfig(configToTest);

            if (!validation.isValid) {
                setTestResult({
                    success: false,
                    message: 'Please fix configuration errors before testing',
                });
                setIsTesting(false);
                return;
            }

            const testService = new OpenAIService(configToTest);
            const result = await testService.testConnection();

            setTestResult({
                success: result.success,
                message: result.success
                    ? 'Connection successful! API is working correctly.'
                    : `Connection failed: ${result.error}`,
            });
        } catch (error) {
            setTestResult({
                success: false,
                message: `Test failed: ${error.message}`,
            });
        } finally {
            setIsTesting(false);
        }
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
                                {theme === 'light' ? (
                                    <Sun size={16} />
                                ) : (
                                    <Moon size={16} />
                                )}
                                {theme === 'light' ? 'Light' : 'Dark'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Bot size={16} />
                            <h4>AI Configuration</h4>
                        </div>

                        <div className={styles.setting}>
                            <label htmlFor="apiKey">API Key</label>
                            <div className={styles.inputGroup}>
                                <input
                                    id="apiKey"
                                    type={showApiKey ? 'text' : 'password'}
                                    value={getCurrentConfigValue('apiKey')}
                                    onChange={e =>
                                        handleConfigChange(
                                            'apiKey',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your OpenAI API key"
                                    className={`${styles.input} ${configErrors.apiKey ? styles.inputError : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className={styles.toggleButton}
                                    title={
                                        showApiKey
                                            ? 'Hide API key'
                                            : 'Show API key'
                                    }
                                >
                                    {showApiKey ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {configErrors.apiKey && (
                                <div className={styles.errorMessage}>
                                    <AlertCircle size={14} />
                                    {configErrors.apiKey}
                                </div>
                            )}
                        </div>

                        <div className={styles.setting}>
                            <label htmlFor="baseUrl">Base URL</label>
                            <input
                                id="baseUrl"
                                type="text"
                                value={getCurrentConfigValue('baseUrl')}
                                onChange={e =>
                                    handleConfigChange(
                                        'baseUrl',
                                        e.target.value
                                    )
                                }
                                placeholder="https://api.openai.com/v1"
                                className={`${styles.input} ${configErrors.baseUrl ? styles.inputError : ''}`}
                            />
                            {configErrors.baseUrl && (
                                <div className={styles.errorMessage}>
                                    <AlertCircle size={14} />
                                    {configErrors.baseUrl}
                                </div>
                            )}
                        </div>

                        <div className={styles.setting}>
                            <label htmlFor="model">Model</label>
                            <select
                                id="model"
                                value={getCurrentConfigValue('model')}
                                onChange={e =>
                                    handleConfigChange('model', e.target.value)
                                }
                                className={`${styles.select} ${configErrors.model ? styles.inputError : ''}`}
                            >
                                {supportedModels.map(model => (
                                    <option
                                        key={model.value}
                                        value={model.value}
                                    >
                                        {model.label}
                                    </option>
                                ))}
                            </select>
                            {configErrors.model && (
                                <div className={styles.errorMessage}>
                                    <AlertCircle size={14} />
                                    {configErrors.model}
                                </div>
                            )}
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isTesting}
                                    className={styles.testButton}
                                >
                                    {isTesting ? (
                                        'Testing...'
                                    ) : (
                                        <>
                                            <Wifi size={16} />
                                            Test Connection
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleSaveAIConfig}
                                    disabled={
                                        isSaving ||
                                        Object.keys(tempConfig).length === 0
                                    }
                                    className={`${styles.saveButton} ${saveSuccess ? styles.saveSuccess : ''}`}
                                >
                                    {isSaving ? (
                                        'Saving...'
                                    ) : saveSuccess ? (
                                        <>
                                            <Check size={16} />
                                            Saved!
                                        </>
                                    ) : (
                                        'Save Configuration'
                                    )}
                                </button>
                            </div>
                            {testResult && (
                                <div
                                    className={`${styles.testResult} ${testResult.success ? styles.testSuccess : styles.testError}`}
                                >
                                    {testResult.success ? (
                                        <Check size={14} />
                                    ) : (
                                        <AlertCircle size={14} />
                                    )}
                                    {testResult.message}
                                </div>
                            )}
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
                                <span className={styles.value}>
                                    {fontSize}px
                                </span>
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
                            <p>
                                <strong>CodeMuse</strong>
                            </p>
                            <p>
                                A modern HTML editor with live preview and AI
                                assistance.
                            </p>
                            <p>Version 1.0.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
