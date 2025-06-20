import { _decorator, Component, Node, Sprite } from 'cc';
import { MessageMgr } from '../MessageManager';
import { EDITOR } from 'cc/env';
const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple } = _decorator;

@ccclass('L10nSprite')
@requireComponent(Sprite)
@executeInEditMode
@disallowMultiple
export class L10nSprite extends Component {
    @property({ visible: false })
    private sprite: Sprite | null = null;
    @property
    protected key: string = "";
    @property
    protected value: string = "";

    start() {

    }

    onDestroy() {
        MessageMgr.offAll(this);
    }

    updateImage() {
        // let lstring = LanguageMgr.getText(this.key);
        // this.label.string = (lstring.length == 0) ? "--Error-" : lstring;
    }

    updateData(key: string, value: string) {
        this.key = key;
        this.value = value;
        if (EDITOR) {
            if (this.sprite) {
                //this.sprite.spriteFrame = this.value;
            }
        }
    }
}
