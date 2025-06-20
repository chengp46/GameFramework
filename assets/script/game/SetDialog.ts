import { _decorator, Component, Node } from 'cc';
import { PrefabResource } from '../../../extensions/game-framwork/assets/Decorators';
import { UIDialog } from '../../../extensions/game-framwork/assets/SceneManager';
const { ccclass, property } = _decorator;

@ccclass('SetDialog')
@PrefabResource("prefabs/dialog")
export class SetDialog extends UIDialog {
    start() {

    }

    update(deltaTime: number) {
        
    }

    showDialog() {
        super.showDialog();
        //SceneMgr.MaskClick = false;
    }
}


