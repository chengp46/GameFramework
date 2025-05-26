import { _decorator, Component, Node } from 'cc';
import { prefabResource, SceneMgr, UIDialog } from '../../../extensions/game-framwork/assets/SceneManager';
const { ccclass, property } = _decorator;

@ccclass('SetDialog')
@prefabResource("prefabs/dialog")
export class SetDialog extends UIDialog {
    start() {

    }

    update(deltaTime: number) {
        
    }

    showDialog() {
        super.showDialog();
        SceneMgr.MaskClick = false;
    }
}


