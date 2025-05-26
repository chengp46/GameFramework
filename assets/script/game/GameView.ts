import { _decorator, Canvas, Component, log, Node, Sprite, UITransform, view, screen, ResolutionPolicy, Label, SpriteFrame, resources, input, Input, EventKeyboard, KeyCode } from 'cc';
import { SetDialog } from './SetDialog';
import * as protobuf from "./network/proto/player.js";
import { prefabResource, SceneMgr, UIView } from '../../../extensions/game-framwork/assets/SceneManager';
import { AudioMgr } from '../../../extensions/game-framwork/assets/AudioManager';
import { ConfigMgr } from '../../../extensions/game-framwork/assets/ConfigManager';
import HttpRequest from '../../../extensions/game-framwork/assets/HttpRequest';
import { SceneOrientationAdapter } from '../../../extensions/game-framwork/assets/component/SceneOrientationAdapter';
import { LayerUtil } from '../../../extensions/game-framwork/assets/utils/LayerUtil';
const { Player } = protobuf?.default;


const { ccclass, property } = _decorator;

export enum eSoundConfig {
    GIRL = 1,
}

@ccclass('GameView')
@prefabResource("prefabs/gameView")
export class GameView extends UIView {
    @property(Label)
    label: Label | null = null;

    @property(SpriteFrame)
    bg: SpriteFrame = null;

    @property({ type: Node, displayName: "摄像机节点" })
    camera: Node = null;

    @property({ type: Sprite, displayName: "背景" })
    background: Sprite = null;

    start() {
        AudioMgr.SceneID = 10;
        AudioMgr.register(eSoundConfig.GIRL, "sounds/Girl");

        // // 获取屏幕的宽度和高度
        // const screenSize = view.getVisibleSize();
        // console.log(`窗口可视区域宽度: ${screenSize.width}, 窗口可视区域高度: ${screenSize.height}`);

        // // 获取设计分辨率的宽度和高度
        // const designResolution = view.getDesignResolutionSize();
        // console.log(`设计分辨率的宽度: ${designResolution.width}, 设计分辨率的高度: ${designResolution.height}`);

        // // 获取视口的宽度和高度
        // const viewportSize = view.getViewportRect();
        // console.log(`Viewport Width: ${viewportSize.width}, Viewport Height: ${viewportSize.height}`);

        // // 获取设备像素比
        // const devicePixelRatio = screen.devicePixelRatio;
        // console.log(`Device Pixel Ratio: ${devicePixelRatio}`);

        // // 获取 Canvas 的宽度和高度
        // const canvasSize = screen.windowSize;
        // console.log(`Canvas Width: ${canvasSize.width}, Canvas Height: ${canvasSize.height}`);

        let global = ConfigMgr.getValue("gameConfig", "global");
        console.log(`config: ${global?.server}`);
        // // 监听窗口大小变化
        // view.on('resize', () => {
        //     const windowSize = view.getVisibleSize();
        //     console.log(`窗口大小变化 ${windowSize.width}   ${windowSize.height}`);
        //     // 设置新的设计分辨率
        //     const newWidth = windowSize.width;
        //     const newHeight = windowSize.height;
        //     // 设置设计分辨率，并指定适配策略
        //     view.setDesignResolutionSize(newWidth, newHeight, ResolutionPolicy.SHOW_ALL);
        // }, this);
        //console.log(screen);

        // let text = this.label?.getComponent(L10nLabel);
        // text.label.string = 'hello world';


        // ResourceManager.loadLocal("textures/BG", SpriteFrame, (asset: SpriteFrame) => {
        //     let bg = SceneMgr.Background.getComponent(Sprite);
        //     if (bg) {
        //         bg.spriteFrame = asset;
        //     }
        // });

        // LayerUtil.setNodeLayer(LayerUtil.UI_2D, SceneMgr.Scene);
        // let bg = SceneMgr.Scene.addComponent(Sprite);
        // if (bg) {
        //     bg.spriteFrame = this.bg;
        // }
        // let bg = SceneMgr.Background.getComponent(Sprite);
        // SceneMgr.setSpriteFrame("textures/bg2", bg);

        SceneMgr.setSpriteFrame("textures/bg2/spriteFrame", this.background);

        // 创建 Protobuf 对象
        let playerData = Player.create({ name: "你好呀", level: 10 });

        // 序列化
        let buffer = Player.encode(playerData).finish();
        console.log("Encoded Buffer:", buffer);

        // 反序列化
        let decodedPlayer = Player.decode(buffer);
        console.log("Decoded Player:", decodedPlayer);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        //input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    }

    update(deltaTime: number) {
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.camera.x += 0.1;
                break;
            case KeyCode.KEY_D:
                this.camera.x -= 0.1;
                break;
            case KeyCode.KEY_W:
                this.camera.z += 0.1;
                break;
            case KeyCode.KEY_S:
                this.camera.z -= 0.1;
                break;
        }
    }

    onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case '1':
                AudioMgr.playEffect(eSoundConfig.GIRL, () => {
                    console.log('播放开始');
                }, () => {
                    console.log('播放结束');
                })
                let httpReq = new HttpRequest();
                httpReq.get("http://127.0.0.1:8000/items/100", "", (data => {
                    if (data.success) {
                        console.log(data.response);
                    } else {
                        console.log(data.error);
                    }
                }));
                break;
            case '2':
                SceneMgr.openDialog(SetDialog, (dialog: SetDialog) => {

                });
                break;
            case '3':
                let record = this.node.getComponent(SceneOrientationAdapter);
                record.StateIndex = 1;
            default:
                break;
        }
    }
}


