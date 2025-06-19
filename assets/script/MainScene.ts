import { _decorator, Component, Node } from 'cc';
import { GameView } from './game/GameView';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    start() {
        game.scene.initScene();
        game.config.loadAllConfigs();
        game.audio.init();
        game.language.initConfig();
        game.scene.changeView(GameView);
    }

    update(deltaTime: number) {

    }
}


