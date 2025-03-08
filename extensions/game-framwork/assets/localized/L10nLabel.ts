import { _decorator, assetManager, Component, JsonAsset, Label, resources } from 'cc';
const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, executionOrder } = _decorator;
import { LanguageMgr, LanguageManager } from './LanguageManager'
import { Message } from '../MessageManager';
import ResourceManager from '../ResourceManager';
import { EDITOR } from 'cc/env';

@ccclass('L10nLabel')
@requireComponent(Label)
@executeInEditMode
@disallowMultiple
export class L10nLabel extends Component {
    @property({visible :false})
    private label: Label | null = null;
    @property
    public key: string = "";
    @property
    public value: string = "";


    protected onLoad() {
        // let ss = LanguageManager.getInstance().getText(this.key);
        // console.log(`加载key的数据: ${ss}`);
    }

    start() {
        this.label = this.node.getComponent(Label);
        if (this.label) {
            this.label.string = this.value;
        }
        Message.on("UpdateLocalized", this.updateLabel, this);
    }

    onDestroy() {
        Message.offAll(this);
    }

    updateLabel() {
        // let lstring = LanguageMgr.getText(this.key);
        // this.label.string = (lstring.length == 0) ? "Error" : lstring;
    }

    updateData(key: string, value: string) {
        this.key = key;
        this.value = value;
        if (EDITOR) {
            if (this.label) {
                this.label.string = this.value;
            }            
        }
    }
}


