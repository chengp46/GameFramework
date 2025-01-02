import { _decorator, Component, macro, Node, UITransform, Prefab, error, resources, instantiate, Button, v3, tween, Sprite, Color, isValid, size, Game, director, game, screen, view } from 'cc';
import { Message } from './MessageManager';
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
        Message.on(ScreenEvent.WindowSize, (event, width: number, height: number) => {
            this.onSize(width, height);
        }, this);

        Message.on(ScreenEvent.OrientationChange, (event, orientation: ScreenOrientation) => {
            this.onOrientationChange(orientation);
        }, this);

        Message.on(ScreenEvent.FullScreenChange, (event, width: number, height: number) => {
            this.onFullScreenChange(width, height);
        }, this);

        Message.on(ScreenEvent.EventShowAndHide, (event, bShow: boolean) => {
            this.onEventShow(bShow);
        }, this);
    }

    protected onDestroy(): void {
        Message.offAll(this);
    }

    onSize(width: number, height: number) {
    }

    onOrientationChange(orientation: ScreenOrientation) {
    }

    onFullScreenChange(width: number, height: number) {
    }

    onEventShow(bShow: boolean) {
    }

    show() {

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
            this.background.scale = v3(0.1, 0.1, 0.1);
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
            this.background.scale = v3(1, 1, 1);
            this.background.active = true;
            tween(this.node).to(0.2, { scale: v3(0.1, 0.1, 0.1) }, { easing: "backIn" })
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

type Consturctor = { new(...args: any[]): any };
export type __TYPE__<T> = new (...args: any[]) => T;
export function prefabResource(path: string, bundle: string = '') {
    return <T extends Consturctor>(dialog: T) => {
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

class SceneManager {
    static instance: SceneManager = new SceneManager();
    protected sceneLayer!: Node;
    protected popupLayer!: Node;
    protected topLayer!: Node;
    protected currentView: UIView = null;
    protected resourceMap: Map<string, UIResource> = new Map;
    protected prefabResource: Map<string, Prefab> = new Map;
    protected bGlobalEvent = false;
    protected playSpeed = 1; 
    protected cacheTick = director.tick;

    protected constructor() {

    }

    get ResourceMap() {
        return this.resourceMap;
    }

    get PrefabResource() {
        return this.prefabResource;
    }

    set PlaySpeed(value: number) {
        this.playSpeed = value;
    }

    get PlaySpeed() {
        return this.playSpeed;
    }

    initScene() {
        let scene = director.getScene();
        let rootNode = new Node;
        rootNode.name = 'Scene';
        rootNode.parent = scene;
        let contentSize = size(1280, 720);
        this.sceneLayer = new Node;
        this.sceneLayer.name = 'GameView';
        this.sceneLayer.addComponent(UITransform).contentSize = contentSize;
        this.sceneLayer.parent = rootNode;
        this.popupLayer = new Node;
        this.popupLayer.name = 'PopupView';
        this.popupLayer.addComponent(UITransform).contentSize = contentSize;
        this.popupLayer.parent = rootNode;
        this.topLayer = new Node;
        this.topLayer.name = 'TopView';
        this.topLayer.addComponent(UITransform).contentSize = contentSize;
        this.topLayer.parent = rootNode;

        if (!this.bGlobalEvent) {
            this.bGlobalEvent = true;
            // 监听窗口大小改变
            window.addEventListener('resize', () => {
                screen.windowSize = size(window.innerWidth, window.innerHeight);
            });

            // 监听窗口大小变化
            screen.on('window-resize', (width: number, height: number) => {
                Message.dispatchEvent(ScreenEvent.WindowSize, width, height);
            }, this);

            // 监听屏幕方向变化
            screen.on('orientation-change', (orientation: number) => {
                if (orientation === macro.ORIENTATION_LANDSCAPE_LEFT || orientation === macro.ORIENTATION_LANDSCAPE_RIGHT) {
                    Message.dispatchEvent(ScreenEvent.OrientationChange, ScreenOrientation.ORIENTATION_LANDSCAPE);
                } else {
                    Message.dispatchEvent(ScreenEvent.OrientationChange, ScreenOrientation.ORIENTATION_PORTRAIT);
                }
            }, this);

            // 监听全屏变化
            screen.on('fullscreen-change', (width: number, height: number) => {
                Message.dispatchEvent(ScreenEvent.FullScreenChange, width, height);
            }, this);

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
                resources.load(resource.resPath, Prefab, (err, prefab) => {
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
        let prefabRes = this.PrefabResource.get(resource.resPath);
        if (!prefabRes) {
            if (0 == resource.bundle.length) {
                resources.load(resource.resPath, Prefab, (err, prefab) => {
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
