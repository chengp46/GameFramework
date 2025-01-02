import { _decorator, Component, Node } from 'cc';
import { SceneMgr } from './common/SceneManager';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    start() {
        SceneMgr.initScene();
    }

    update(deltaTime: number) {

    }
}


