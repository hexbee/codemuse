import { useState, useEffect } from 'react';

const DEFAULT_CONFIG = {
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    maxTokens: 2000,
    temperature: 0.7,
};

const SUPPORTED_MODELS = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];

export const useAIConfig = () => {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [isConfigured, setIsConfigured] = useState(false);

    // Load config from localStorage on mount
    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem('ai-config');
            if (savedConfig) {
                const parsedConfig = JSON.parse(savedConfig);
                setConfig({ ...DEFAULT_CONFIG, ...parsedConfig });
                setIsConfigured(!!parsedConfig.apiKey);
            }
        } catch (error) {
            console.error('Failed to load AI config:', error);
        }
    }, []);

    // Save config to localStorage
    const saveConfig = newConfig => {
        try {
            const updatedConfig = { ...config, ...newConfig };
            setConfig(updatedConfig);
            localStorage.setItem('ai-config', JSON.stringify(updatedConfig));
            setIsConfigured(!!updatedConfig.apiKey);
            return true;
        } catch (error) {
            console.error('Failed to save AI config:', error);
            return false;
        }
    };

    // Update specific config field
    const updateConfig = (field, value) => {
        return saveConfig({ [field]: value });
    };

    // Validate config
    const validateConfig = (configToValidate = config) => {
        const errors = {};

        if (!configToValidate.apiKey || configToValidate.apiKey.trim() === '') {
            errors.apiKey = 'API Key is required';
        }

        if (
            !configToValidate.baseUrl ||
            configToValidate.baseUrl.trim() === ''
        ) {
            errors.baseUrl = 'Base URL is required';
        } else {
            try {
                new URL(configToValidate.baseUrl);
            } catch {
                errors.baseUrl = 'Invalid URL format';
            }
        }

        if (!configToValidate.model || configToValidate.model.trim() === '') {
            errors.model = 'Model selection is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    };

    // Reset config to defaults
    const resetConfig = () => {
        setConfig(DEFAULT_CONFIG);
        localStorage.removeItem('ai-config');
        setIsConfigured(false);
    };

    return {
        config,
        isConfigured,
        saveConfig,
        updateConfig,
        validateConfig,
        resetConfig,
        supportedModels: SUPPORTED_MODELS,
    };
};
