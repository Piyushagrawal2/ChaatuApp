import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'next-themes';
import { RootState } from '@/store/store';
import { setModel, setCustomModelConfig, setTemperature, toggleWebSearch } from '@/store/chatSlice';

const MODELS = [
    { id: 'chaatu-v1.2', label: 'Chaatu v1.2', description: 'Balanced performance' },
    { id: 'gpt-4o', label: 'GPT-4o', description: 'Reasoning & creativity' },
    { id: 'claude-3-haiku', label: 'Claude 3 Haiku', description: 'Fast and efficient' },
    { id: 'custom', label: 'Custom API', description: 'Bring your own key' },
];

const SettingsPanel = () => {
    const { theme, setTheme } = useTheme();
    const dispatch = useDispatch();
    const { model, temperature, isWebSearchEnabled, customModelConfig } = useSelector((state: RootState) => ({
        model: state.chat.model,
        temperature: state.chat.temperature,
        isWebSearchEnabled: state.chat.isWebSearchEnabled,
        customModelConfig: state.chat.customModelConfig,
    }));

    const selectedModel = useMemo(() => MODELS.find(item => item.id === model), [model]);

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border p-4 space-y-3">
                <header>
                    <p className="text-sm font-medium">Model</p>
                    <p className="text-xs text-muted-foreground">Choose the model for responses</p>
                </header>
                <div className="space-y-2">
                    {MODELS.map(option => (
                        <button
                            key={option.id}
                            onClick={() => dispatch(setModel(option.id))}
                            className={[
                                'w-full text-left border rounded-xl px-3 py-2 text-sm',
                                model === option.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                            ].join(' ')}
                        >
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                        </button>
                    ))}
                </div>
                {selectedModel?.id === 'custom' && (
                    <input
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        placeholder="sk-live-..."
                        value={customModelConfig?.apiKey ?? ''}
                        onChange={(event) => dispatch(setCustomModelConfig({ name: customModelConfig?.name || 'Custom Model', apiKey: event.target.value }))}
                    />
                )}
            </section>

            <section className="rounded-2xl border p-4 space-y-4">
                <header>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-xs text-muted-foreground">Higher values are more creative.</p>
                </header>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={temperature}
                        onChange={(event) => dispatch(setTemperature(Number(event.target.value)))}
                        className="flex-1"
                    />
                    <span className="text-sm font-medium w-10 text-right">{temperature.toFixed(1)}</span>
                </div>
            </section>

            <section className="rounded-2xl border p-4 space-y-4">
                <header>
                    <p className="text-sm font-medium">Preferences</p>
                    <p className="text-xs text-muted-foreground">Apply global chat options.</p>
                </header>

                <div className="flex items-center justify-between text-sm">
                    <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-xs text-muted-foreground">Switch between light and dark.</p>
                    </div>
                    <div className="flex gap-2">
                        {['light', 'dark', 'system'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setTheme(mode)}
                                className={[
                                    'px-3 py-1 rounded-full border text-xs capitalize',
                                    theme === mode ? 'border-primary text-primary' : 'border-border text-muted-foreground',
                                ].join(' ')}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div>
                        <p className="font-medium">Web search</p>
                        <p className="text-xs text-muted-foreground">Allow assistant to search the web.</p>
                    </div>
                    <button
                        onClick={() => dispatch(toggleWebSearch())}
                        className={[
                            'px-3 py-1 rounded-full border text-xs',
                            isWebSearchEnabled ? 'border-primary text-primary' : 'border-border text-muted-foreground',
                        ].join(' ')}
                    >
                        {isWebSearchEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SettingsPanel;

