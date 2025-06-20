import { _decorator, Asset, assetManager, resources, AssetManager, Constructor } from 'cc';
const { ccclass } = _decorator;

type BundleName = string;
type ProgressCallback = (completed: number, total: number, url: string) => void;

interface CachedAsset {
    asset: Asset;
    refCount: number;
    bundleName: BundleName;
}

@ccclass('ResLoader')
export class ResLoader {
    private static _cache: Map<string, CachedAsset> = new Map();
    private static _versionMap: Map<BundleName, string> = new Map();

    /**
     * 设置 bundle 的版本（用于拼接 remote URL）
     */
    public static setBundleVersion(bundleName: string, version: string = "") {
        this._versionMap.set(bundleName, version);
    }

    /**
     * 加载资源
     */
    public static async load<T extends Asset>(url: string, type: Constructor<T>,
        bundleName: string = 'resources'): Promise<T> {
        const key = `${bundleName}:${url}`;
        if (this._cache.has(key)) {
            const record = this._cache.get(key)!;
            record.refCount++;
            return record.asset as T;
        }

        const bundle = await this._getBundle(bundleName);
        return new Promise<T>((resolve, reject) => {
            bundle.load(url, type, (err, asset) => {
                if (err) {
                    console.error(`加载${url}失败: ${err}`);
                    reject(null);
                    return;
                }
                this._cache.set(key, { asset, refCount: 1, bundleName });
                resolve(asset);
            });
        });
    }

    /**
     * 批量加载，支持进度回调
     */
    public static async loadBatch<T extends Asset>(urls: string[], type: Constructor<T>, bundleName: string = 'resources',
        onProgress?: ProgressCallback): Promise<Map<string, T>> {
        const result = new Map<string, T>();
        const total = urls.length;
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const asset = await this.load<T>(url, type, bundleName);
            result.set(url, asset);
            onProgress?.(i + 1, total, url);
        }
        return result;
    }

    /**
     * 获取资源
     */
    public static get<T extends Asset>(url: string, bundleName: string = 'resources'): T | null {
        const key = `${bundleName}:${url}`;
        return this._cache.has(key) ? (this._cache.get(key)!.asset as T) : null;
    }

    /**
     * 释放资源
     */
    public static release(url: string, bundleName: string = 'resources') {
        const key = `${bundleName}:${url}`;
        if (!this._cache.has(key)) return;

        const record = this._cache.get(key)!;
        record.refCount--;
        if (record.refCount <= 0) {
            assetManager.releaseAsset(record.asset);
            this._cache.delete(key);
        }
    }

    /**
     * 释放某个 Bundle 下的所有资源
     */
    public static releaseBundle(bundleName: string) {
        for (const [key, record] of this._cache.entries()) {
            if (record.bundleName === bundleName) {
                assetManager.releaseAsset(record.asset);
                this._cache.delete(key);
            }
        }
    }

    /**
     * 释放全部资源
     */
    public static releaseAll() {
        for (const [, record] of this._cache.entries()) {
            assetManager.releaseAsset(record.asset);
        }
        this._cache.clear();
    }

    /**
     * 获取 Bundle（支持远程热更新目录）
     */
    private static async _getBundle(bundleName: string): Promise<AssetManager.Bundle> {
        if (bundleName === 'resources') {
            return resources;
        }
        const existing = assetManager.getBundle(bundleName);
        if (existing) {
            return existing;
        }
        const version = this._versionMap.get(bundleName) ?? '';
        const remoteUrl = `${assetManager.downloader.remoteServerAddress}/${bundleName}${version ? `_${version}` : ''}`;

        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, { base: remoteUrl }, (err, bundle) => {
                if (err || !bundle) {
                    return reject(err);
                }
                resolve(bundle);
            });
        });
    }
}
