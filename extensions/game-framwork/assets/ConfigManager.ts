import { resources, JsonAsset } from "cc";

type ConfigChangeCallback = (configName: string, data: any) => void;

export class ConfigManager {
    private static _instance: ConfigManager;
    public static get instance() {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }

    private _configs: Map<string, any> = new Map();
    private _watchers: Map<string, ConfigChangeCallback[]> = new Map();

    /**
     * 异步加载 config 目录下所有 JSON 文件
     */
    public async loadAllConfigs(): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.loadDir("config", JsonAsset, (err, assets) => {
                if (err) {
                    console.error("加载配置失败", err);
                    reject(err);
                    return;
                }

                for (const jsonAsset of assets) {
                    const name = jsonAsset.name.replace(/\.json$/, "");
                    this.setConfig(name, jsonAsset.json);
                }

                resolve();
            });
        });
    }

    /**
     * 设置配置（内部使用或手动更新配置时使用）
     */
    public setConfig(name: string, data: any): void {
        this._configs.set(name, data);
        this.notifyWatchers(name, data);
    }

    /**
     * 获取整个配置对象
     */
    public getConfig<T = any>(name: string): T | null {
        return this._configs.get(name) || null;
    }

    /**
     * 获取某个配置中的值
     */
    public getValue<T = any>(configName: string, key: string): T | null {
        const config = this.getConfig(configName);
        return config && config[key] !== undefined ? config[key] : null;
    }

    /**
     * 注册配置变更监听
     */
    public onConfigChanged(name: string, callback: ConfigChangeCallback): void {
        if (!this._watchers.has(name)) {
            this._watchers.set(name, []);
        }
        this._watchers.get(name)?.push(callback);
    }

    private notifyWatchers(name: string, data: any) {
        const watchers = this._watchers.get(name);
        if (watchers) {
            for (const cb of watchers) {
                cb(name, data);
            }
        }
    }

    /**
     * 释放某个配置
     */
    public releaseConfig(name: string) {
        this._configs.delete(name);
        this._watchers.delete(name);
    }

    /**
     * 释放所有配置
     */
    public releaseAllConfigs() {
        this._configs.clear();
        this._watchers.clear();
    }
}
export const ConfigMgr = ConfigManager.instance;

/**
// 监听配置变化
ConfigManager.instance.onConfigChanged("level", (name, data) => {
    console.log(`[监听] 配置 ${name} 被更新`, data);
});

// 主动修改配置并通知监听者
const newLevelConfig = {
    level1: { enemyCount: 6, boss: false },
    level2: { enemyCount: 12, boss: true },
};
ConfigManager.instance.setConfig("level", newLevelConfig);  // 触发通知

// 释放配置缓存
ConfigManager.instance.releaseConfig("item");

// 释放全部配置
ConfigManager.instance.releaseAllConfigs();

// 获取 level 配置的全部内容
const levelConfig = ConfigManager.instance.getConfig("level");
console.log("全部关卡配置:", levelConfig);
// 获取 level2 的配置项
const level2 = ConfigManager.instance.getValue("level", "level2");
console.log("level2 配置:", level2);
*/