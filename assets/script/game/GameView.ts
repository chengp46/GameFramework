import { _decorator, Node, Sprite, Label, SpriteFrame, input, Input, EventKeyboard, KeyCode } from 'cc';
import { SetDialog } from './SetDialog';
import * as protobuf from "./network/proto/player.js";
import { PrefabResource } from '../../../extensions/game-framwork/assets/Decorators';
import { UIView } from '../../../extensions/game-framwork/assets/SceneManager';
import { core } from '../../../extensions/game-framwork/assets/GameCore';
import { LanguageMgr, LanguageType } from '../../../extensions/game-framwork/assets/localized/LanguageManager';
import { L10nLabel } from '../../../extensions/game-framwork/assets/localized/L10nLabel';
const { Player } = protobuf?.default;


const { ccclass, property } = _decorator;

export enum eSoundConfig {
    GIRL = 1,
}

@ccclass('GameView')
@PrefabResource("prefabs/gameView")
export class GameView extends UIView {
    @property(L10nLabel)
    label: L10nLabel | null = null;

    @property(SpriteFrame)
    bg: SpriteFrame = null;

    @property({ type: Node, displayName: "摄像机节点" })
    camera: Node = null;

    @property({ type: Sprite, displayName: "背景" })
    background: Sprite = null;

    pressed: boolean = false;
    curkeyCode: KeyCode;

    index: number = 31;
    count: number = 1;

    start() {
        core.audio.register(10, eSoundConfig.GIRL, "sounds/Girl");

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

        let global = core.config.getValue("gameConfig", "global");
        console.log(`config: ${global?.server}`);
        console.log(`config: ${JSON.stringify(global)}`);

        let image = core.config.getConfig("Localized_image");
        console.log(`config: ${JSON.stringify(image)}`);

        //SceneMgr.setSpriteFrame("textures/bg2/spriteFrame", this.background);

        // 创建 Protobuf 对象
        let playerData = Player.create({ name: "你好呀", level: 10 });

        // 序列化
        let buffer = Player.encode(playerData).finish();
        console.log("Encoded Buffer:", buffer);

        // 反序列化
        let decodedPlayer = Player.decode(buffer);
        console.log("Decoded Player:", decodedPlayer);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    }

    update(deltaTime: number) {
        if (this.pressed) {
            switch (this.curkeyCode) {
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
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        this.pressed = true;
        this.curkeyCode = event.keyCode;
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode == this.curkeyCode) {
            this.pressed = false;
            this.curkeyCode = KeyCode.NONE;
        }
    }

    onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case '1':
                core.audio.playEffect(eSoundConfig.GIRL, () => {
                    console.log('播放开始');
                }, () => {
                    console.log('播放结束');
                })
                let httpReq = new core.httpReq();
                httpReq.get("http://127.0.0.1:8000/items/100", "", (data => {
                    if (data.success) {
                        console.log(data.response);
                    } else {
                        console.log(data.error);
                    }
                }));
                break;
            case '2':
                core.scene.openDialog(SetDialog, (dialog: SetDialog) => {

                });
                break;
            case '3':
                // let record = this.node.getComponent(SceneOrientationAdapter);
                // record.StateIndex = 1;
                this.label.Key = "197001301_SITE_NAME_" + this.index++;
                break;
            case '4':
                let lang = this.count++ % 2 == 0 ? LanguageType.ZH : LanguageType.EN;
                LanguageMgr.CurrentLanguage = lang;
                break;
            default:
                break;
        }
    }
}


