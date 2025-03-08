import { _decorator, Component, Node } from 'cc';
import { ConfigMgr } from '../../extensions/game-framwork/assets/ConfigManager';
import { SceneMgr } from '../../extensions/game-framwork/assets/SceneManager';
import { GameView } from './game/GameView';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    start() {
        SceneMgr.initScene();
        ConfigMgr.loadConfig();
        SceneMgr.changeView(GameView, (view: GameView)=>{

        });
    }

    update(deltaTime: number) {

    }
}


