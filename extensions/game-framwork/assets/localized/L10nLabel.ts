import { _decorator, assetManager, Component, JsonAsset, Label, resources } from 'cc';
const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, executionOrder } = _decorator;
import { LanguageMgr, LanguageManager } from './LanguageManager'
import { MessageMgr } from '../MessageManager';
import { EDITOR } from 'cc/env';

@ccclass('L10nLabel')
@requireComponent(Label)
@executeInEditMode
@disallowMultiple
export class L10nLabel extends Component {
    @property({ visible: false })
    private label: Label | null = null;
    @property
    protected key: string = "";
    @property
    protected value: string = "";

    set Key(value: string) {
        this.key = value;
        this.value = LanguageMgr.getText(this.key);
        this.label.string = (this.value.length == 0) ? "--Error-" : this.value;
    }

    get Key() {
        return this.key;
    }

    get String(): string {
        return this.value;
    }

    protected onLoad() {
    }

    start() {
        this.label = this.node.getComponent(Label);
        if (this.label) {
            this.label.string = this.value;
        }
        MessageMgr.on("UpdateLocalized", this.updateLabel, this);
    }

    onDestroy() {
        MessageMgr.offAll(this);
    }

    updateLabel() {
        let lstring = LanguageMgr.getText(this.key);
        this.label.string = (lstring.length == 0) ? "--Error-" : lstring;
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


