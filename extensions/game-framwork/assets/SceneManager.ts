import { _decorator, Component, macro, Node, UITransform, Prefab, error, resources, instantiate, Button, v3, tween, Sprite, Color, isValid, size, Game, director, game, screen, view, Vec3, ResolutionPolicy, find } from 'cc';
import { Message } from './MessageManager';
import ResourceManager from './ResourceManager';
import { LanguageManager } from './localized/LanguageManager';
import { AudioSourceManager } from './AudioManager';
const { ccclass, property } = _decorator;

export enum ScreenEvent {
    WindowSize = '__WindowSize',
    OrientationChange = '__OrientationChange',
    FullScreenChange = '__FullScreenChange',
    EventShowAndHide = '__EventShowAndHide',
}

export enum ScreenOrientation {
    ORIENTATION_LANDSCAPE = 0,
    ORIENTATION_PORTRAIT,
}

class UIResource {
    resPath: string;
    bundle: string;
}

export abstract class UIView extends Component {
    protected onLoad(): void {
        Message.on(ScreenEvent.EventShowAndHide, (event, bShow: boolean) => {
            this.onEventShow(bShow);
        }, this);
    }

    protected onDestroy(): void {
        Message.offAll(this);
    }

    onEventShow(bShow: boolean) {
    }

    show() {
        this.node.active = true;
    }

    close() {

    }
}

export abstract class UIDialog extends Component {
    @property({ type: Node, displayName: '背景遮罩' })
    backgroundMask: Node | null = null;

    @property({ type: Node, displayName: '背景框' })
    background: Node | null = null;

    @property({ type: Button, displayName: '关闭按钮' })
    closeBtn: Button = null;

    // 对话框的初始缩放比例
    protected initialScale: Vec3 = new Vec3(0, 0, 1);

    protected onLoad(): void {
        this.backgroundMask?.on(Node.EventType.TOUCH_START, this.onMaskClick, this);
        this.background?.on(Node.EventType.TOUCH_START, this.onDialogClick, this);
        this.closeBtn?.node.on(Button.EventType.CLICK, this.onClose, this);
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
        Message.offAll(this);
    }

    showDialog() {
        if (this.backgroundMask) {
            this.backgroundMask!.active = false;
        }
        this.node.active = true;
        if (this.background) {
            this.background.scale = this.initialScale;
            this.background.active = true;
            tween(this.background).to(0.2, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                .call(() => {
                    if (this.backgroundMask) {
                        this.backgroundMask!.active = true;
                    }
                }).start();
        }
    }

    hideDialog() {
        if (this.backgroundMask) {
            let sprite = this.backgroundMask!.getComponent(Sprite);
            sprite.color = new Color(0, 0, 0, 0);
        }
        if (this.background) {
            this.background.active = true;
            tween(this.node).to(0.2, { scale: this.initialScale }, { easing: "backIn" })
                .call(() => {
                    this.node.destroy();
                }).start();
        }
    }

    onMaskClick(event) {
        this.hideDialog();
    }

    onDialogClick(event) {
        event.propagationStopped = true
    }

    onClose() {
        this.hideDialog();
    }
}

type Constructor<T = {}> = { new(...args: any[]): any };
export type __TYPE__<T> = new (...args: any[]) => T;
export function prefabResource(path: string, bundle: string = '') {
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

export class SceneManager {
    static instance: SceneManager = new SceneManager();
    protected sceneNode!: Node;
    protected sceneLayer!: Node;
    protected popupLayer!: Node;
    protected topLayer!: Node;
    protected currentView: UIView = null;
    protected resourceMap: Map<string, UIResource> = new Map;
    protected prefabResource: Map<string, Prefab> = new Map;
    protected bGlobalEvent = false;
    // 游戏运行速度
    protected playSpeed = 1;
    protected cacheTick = director.tick;

    protected constructor() {
    }

    get SceneNode() {
        return this.sceneNode;
    }

    get ResourceMap() {
        return this.resourceMap;
    }

    get PrefabResource() {
        return this.prefabResource;
    }

    // 设置游戏速度
    set PlaySpeed(value: number) {
        this.playSpeed = value;
    }

    get PlaySpeed() {
        return this.playSpeed;
    }

    initScene() {
        let scene = director.getScene();
        this.sceneNode = new Node;
        this.sceneNode.name = 'Scene';
        this.sceneNode.parent = scene;
        let contentSize = size(1280, 720);
        this.sceneLayer = new Node;
        this.sceneLayer.name = 'GameView';
        this.sceneLayer.addComponent(UITransform).contentSize = contentSize;
        this.sceneLayer.parent = this.sceneNode;
        this.popupLayer = new Node;
        this.popupLayer.name = 'PopupView';
        this.popupLayer.addComponent(UITransform).contentSize = contentSize;
        this.popupLayer.parent = this.sceneNode;
        this.topLayer = new Node;
        this.topLayer.name = 'TopView';
        this.topLayer.addComponent(UITransform).contentSize = contentSize;
        this.topLayer.parent = this.sceneNode;

        if (!this.bGlobalEvent) {
            this.bGlobalEvent = true;

            // 切换到前台事件
            game.on(Game.EVENT_SHOW, () => {
                Message.dispatchEvent(ScreenEvent.EventShowAndHide, true);
            }, this);

            // 进入后台时触发的事件
            game.on(Game.EVENT_HIDE, () => {
                Message.dispatchEvent(ScreenEvent.EventShowAndHide, false);
            }, this);
        }

        director.tick = (dt: number) => {
            this.cacheTick.call(director, dt * this.playSpeed);
        };
    }

    changeView<T extends UIView>(viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        let resource = this.resourceMap.get(viewType.name);
        if (!resource) {
            error(`${viewType.name} 没有配置预制体资源....`);
            return;
        }
        let prefabRes = this.PrefabResource.get(resource.resPath);
        if (!prefabRes) {
            if (0 == resource.bundle.length) {
                ResourceManager.loadLocal(resource.resPath, (prefab: Prefab) => {
                    this.prefabResource.set(viewType.name, prefab);
                    this.showView(prefab, viewType, callback);
                });
            } else {
                ResourceManager.loadLocalOther(resource.resPath, resource.bundle, (prefab: Prefab) => {
                    this.prefabResource.set(viewType.name, prefab);
                    this.showView(prefab, viewType, callback);
                });
            }
        } else {
            this.showView(prefabRes, viewType, callback);
        }
    }

    protected showView<T extends UIView>(prefab: Prefab, viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        const newNode = instantiate(prefab);
        newNode.parent = this.sceneLayer;
        newNode.active = false;
        let view = newNode.getComponent(viewType);
        view.show();
        if (callback) {
            callback(view);
        }
        if (this.currentView) {
            this.currentView.close();
            if (isValid(this.currentView.node)) {
                this.currentView.node.destroy();
            }
        }
        this.currentView = view;
    }

    openDialog<T extends UIDialog>(dialogType: __TYPE__<T>, callback?: (dialog: T) => T | void) {
        let resource = this.resourceMap.get(dialogType.name);
        if (!resource) {
            error(`${dialogType.name} 没有配置预制体资源....`);
            return;
        }
        let prefabRes = this.PrefabResource.get(dialogType.name);
        if (!prefabRes) {
            if (0 == resource.bundle.length) {
                ResourceManager.loadLocal(resource.resPath, (prefab: Prefab) => {
                    this.prefabResource.set(dialogType.name, prefab);
                    this.showDialog(prefab, dialogType, callback);
                });
            } else {
                ResourceManager.loadLocalOther(resource.resPath, resource.bundle, (prefab: Prefab) => {
                    this.prefabResource.set(dialogType.name, prefab);
                    this.showDialog(prefab, dialogType, callback);
                });
            }
        } else {
            this.showDialog(prefabRes, dialogType, callback);
        }
    }

    protected showDialog<T extends UIDialog>(prefab: Prefab, viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        const newNode = instantiate(prefab);
        newNode.parent = this.popupLayer;
        newNode.active = false;
        let view = newNode.getComponent(viewType);
        view.showDialog();
        if (callback) {
            callback(view);
        }
    }

    closeAllDialog() {
        this.popupLayer?.removeAllChildren();
    }

    addTopView<T extends UIView>(viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        let resource = this.resourceMap.get(viewType.name);
        if (!resource) {
            error(`${viewType.name} 没有配置预制体资源....`);
            return;
        }
        let prefabRes = this.PrefabResource.get(resource.resPath);
        if (!prefabRes) {

        }
    }

    closeAllTopView() {
        this.topLayer?.removeAllChildren();
    }
}

export const SceneMgr = SceneManager.instance;
