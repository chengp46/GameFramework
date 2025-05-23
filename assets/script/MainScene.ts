import { _decorator, Component, Node } from 'cc';
import { ConfigMgr } from '../../extensions/game-framwork/assets/ConfigManager';
import { SceneMgr } from '../../extensions/game-framwork/assets/SceneManager';
import { GameView } from './game/GameView';
import { AudioMgr } from '../../extensions/game-framwork/assets/AudioManager';
import { LanguageMgr } from '../../extensions/game-framwork/assets/localized/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    start() {
        SceneMgr.initScene();
        ConfigMgr.loadAllConfigs();
        AudioMgr.initConfig();
        LanguageMgr.initConfig();
        SceneMgr.changeView(GameView);
    }

    update(deltaTime: number) {

    }
}


