import { _decorator, Component, Node } from 'cc';
import { GameView } from './game/GameView';
import { core } from './global';
const { ccclass, property } = _decorator;


@ccclass('MainScene')
export class MainScene extends Component {
    start() {
        core.scene.initScene();
        core.audio.init();
        let func = async () => {
            await core.config.loadAllConfigs();       
            await core.language.initConfig();
            core.scene.changeView(GameView);
        };
        func();  
    }

    update(deltaTime: number) {

    }
}


