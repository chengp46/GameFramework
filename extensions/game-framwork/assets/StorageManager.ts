import { _decorator, sys } from 'cc';
const { ccclass, property } = _decorator;

export class StorageManager {
    private static instance: StorageManager;

    private constructor() { }

    static getInstance(): StorageManager {
        if (!this.instance) {
            this.instance = new StorageManager();
        }
        return this.instance;
    }

    setItem(key: string, value: any) {
        sys.localStorage.setItem(key, JSON.stringify(value));
    }

    getItem(key: string, defaultValue: any = null) {
        const data = sys.localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }

    removeItem(key: string) {
        sys.localStorage.removeItem(key);
    }
}

export const StorageMgr = StorageManager.getInstance();
