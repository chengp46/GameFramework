import { SceneMgr } from "./SceneManager";

export class UIResource {
    resPath: string;
    bundle: string;
}

type Constructor<T = {}> = { new(...args: any[]): any };
export type __TYPE__<T> = new (...args: any[]) => T;
export function PrefabResource(path: string, bundle: string = '') {
    if (0 == bundle.length) {
        bundle = "resources";
    }
    return <T extends Constructor>(dialog: T) => {
        let uiRes = SceneMgr.ResourceMap.get(dialog.name);
        if (!uiRes) {
            uiRes = new UIResource();
            uiRes.resPath = path;
            uiRes.bundle = bundle;
            SceneMgr.ResourceMap.set(dialog.name, uiRes);
        }
        return dialog;
    }
}

export function Singleton(): ClassDecorator {
    return (target: any) => {
        let instance: any;

        target.Instance = function () {
            if (!instance) {
                instance = new target();
            }
            return instance;
        };

        Object.defineProperty(target, '__instance__', {
            get: () => instance,
            enumerable: false,
            configurable: false,
        });
    };
}
