import { _decorator, JsonAsset } from 'cc';
import ResourceManager from './ResourceManager';
const { ccclass, property } = _decorator;

export class ConfigManager {
    private static instance: ConfigManager;
    private configData: any = null;

    private constructor() { }

    static getInstance(): ConfigManager {
        if (!this.instance) {
            this.instance = new ConfigManager();
        }
        return this.instance;
    }

    async loadConfig() {
        ResourceManager.loadLocal("config/gameConfig", JsonAsset, (assert:JsonAsset)=>{
            this.configData = assert.json;
            console.log(this.configData);
        });
        
    }

    get(key: string) {
        return this.configData ? this.configData[key] : null;
    }
}

export const ConfigMgr = ConfigManager.getInstance();