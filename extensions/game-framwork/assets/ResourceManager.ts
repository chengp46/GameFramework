import { assetManager, SpriteFrame, Texture2D, resources, Asset } from 'cc';

export default class ResourceManager {
    // 加载本地资源
    static loadLocal<T extends Asset>(path: string, callback: (asset: T) => void) {
        resources.load(path, (err, asset: T) => {
            if (err) {
                console.error("本地资源加载失败", err);
                callback(null);
                return;
            }
            callback(asset);
        });
    }

    // 异步加载本地资源
    static loadLocalAsync<T extends Asset>(path: string) {
        return new Promise<T>((resolve, reject) => {
            ResourceManager.loadLocal(path, (asset: T) => {
                resolve(asset);
            });
        });
    }

    // 加载本地其它包资源
    static loadLocalOther<T extends Asset>(path: string, bundleName: string, callback: (asset: T) => void) {
        let bundle = assetManager.bundles.get(bundleName);
        if (!bundle) {
            ResourceManager.loadBundle(bundleName, (sBundle: any) => {
                sBundle.load(path, (err, asset: T) => {
                    if (err) {
                        console.error("本地资源加载失败", err);
                        callback(null);
                        return;
                    }
                    callback(asset);
                });
            });
        } else {
            bundle.load(path, (err, asset: T) => {
                if (err) {
                    console.error("本地资源加载失败", err);
                    callback(null);
                    return;
                }
                callback(asset);
            });
        }
    }

    // 异步加载本地其它包资源
    static loadLocalOtherAsync<T extends Asset>(path: string, bundleName: string) {
        return new Promise<T>((resolve, reject) => {
            ResourceManager.loadLocalOther(path, bundleName, (asset: T) => {
                resolve(asset);
            });
        });
    }

    // 加载远程资源
    static loadRemote<T extends Asset>(url: string, callback: (asset: T) => void) {
        assetManager.loadRemote(url, { cacheEnabled: true }, (err, asset: T) => {
            if (err) {
                console.error("远程资源加载失败", err);
                callback(null);
                return;
            }
            callback(asset);
        });
    }

    // 异步加载远程资源
    static loadRemoteAsync<T extends Asset>(url: string) {
        return new Promise<T>((resolve, reject) => {
            ResourceManager.loadRemote(url, (asset: T) => {
                resolve(asset);
            });
        });
    }

    // 加载资源包
    static loadBundle(bundleName: string, callback: (bundle: any) => void) {
        assetManager.loadBundle(bundleName, (err, bundle) => {
            if (err) {
                console.error("资源包加载失败", err);
                callback(null);
                return;
            }
            callback(bundle);
        });
    }

    // 异步加载资源包
    static loadBundleAsync(bundleName: string) {
        return new Promise((resolve, reject) => {
            ResourceManager.loadRemote(bundleName, (bundle) => {
                resolve(bundle);
            });
        });
    }

    // 释放资源
    static releaseAsset(asset: any) {
        assetManager.releaseAsset(asset);
    }

    /**
     * 释放资源包与包中所有资源
     * @param bundleName 资源地址
     */
    static removeBundle(bundleName: string) {
        let bundle = assetManager.bundles.get(bundleName);
        if (bundle) {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        }
    }
}
