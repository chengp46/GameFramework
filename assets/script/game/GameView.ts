import { _decorator, Canvas, Component, log, Node, Sprite, UITransform, view, screen, ResolutionPolicy, Label } from 'cc';
import { SetDialog } from './SetDialog';
import * as protobuf from "./network/proto/player.js";
import { prefabResource, SceneMgr, UIView } from '../../../extensions/game-framwork/assets/SceneManager';
import { AudioMgr } from '../../../extensions/game-framwork/assets/AudioManager';
import { ConfigMgr } from '../../../extensions/game-framwork/assets/ConfigManager';
import HttpRequest from '../../../extensions/game-framwork/assets/HttpRequest';
import { SceneOrientationAdapter } from '../../../extensions/game-framwork/assets/component/SceneOrientationAdapter';
const {Player } = protobuf?.default;


const { ccclass, property } = _decorator;

export enum eSoundConfig {
    GIRL = 1,
}



@ccclass('GameView')
@prefabResource("prefabs/gameView")
export class GameView extends UIView {
    @property(Label)
    label: Label | null = null;

    start() {
        AudioMgr.SceneID = 10;
        AudioMgr.register(eSoundConfig.GIRL, "sounds/Girl");

        // 获取屏幕的宽度和高度
        const screenSize = view.getVisibleSize();
        console.log(`窗口可视区域宽度: ${screenSize.width}, 窗口可视区域高度: ${screenSize.height}`);

        // 获取设计分辨率的宽度和高度
        const designResolution = view.getDesignResolutionSize();
        console.log(`设计分辨率的宽度: ${designResolution.width}, 设计分辨率的高度: ${designResolution.height}`);

        // 获取视口的宽度和高度
        const viewportSize = view.getViewportRect();
        console.log(`Viewport Width: ${viewportSize.width}, Viewport Height: ${viewportSize.height}`);

        // 获取设备像素比
        const devicePixelRatio = screen.devicePixelRatio;
        console.log(`Device Pixel Ratio: ${devicePixelRatio}`);

        // 获取 Canvas 的宽度和高度
        const canvasSize = screen.windowSize;
        console.log(`Canvas Width: ${canvasSize.width}, Canvas Height: ${canvasSize.height}`);

        console.log(`config ${ConfigMgr.get("global").url}`)
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
        console.log(screen);

        // let text = this.label?.getComponent(L10nLabel);
        // text.label.string = 'hello world';


        // 创建 Protobuf 对象
        let playerData = Player.create({ name: "你好呀", level: 10 });

        // 序列化
        let buffer = Player.encode(playerData).finish();
        console.log("Encoded Buffer:", buffer);

        // 反序列化
        let decodedPlayer = Player.decode(buffer);
        console.log("Decoded Player:", decodedPlayer);

    }

    update(deltaTime: number) {
    }

    onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case '1':
                AudioMgr.playEffect(eSoundConfig.GIRL, () => {
                    console.log('播放开始');
                }, () => {
                    console.log('播放结束');
                })
                // let httpReq = new HttpRequest();
                // httpReq.get("http://127.0.0.1:8000/items/100", "", (data => {
                //     if (data.success) {
                //         console.log(data.response);
                //     } else {
                //         console.log(data.error);
                //     }
                // }));
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


