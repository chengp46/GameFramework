import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { MessageMgr } from '../MessageManager';
import { EDITOR } from 'cc/env';
import { ILocalizedImage, LanguageMgr } from './LanguageManager';
import { ResLoader } from '../ResLoader';
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
    @property
    protected language: number = 0;
    @property
    protected imageName: string = "";
    @property
    protected bundle: string = "";

    start() {
        this.sprite = this.node.getComponent(Sprite);
        if (this.sprite) {
            LanguageMgr.setSpriteFrame(this.key, this.sprite);
        }
    }

    onDestroy() {
        MessageMgr.offAll(this);
    }

    updateImage() {
        // let lstring = LanguageMgr.getText(this.key);
        // this.label.string = (lstring.length == 0) ? "--Error-" : lstring;
    }

    updateData(key: string, imgData: any) {
        this.key = key;
        this.value = imgData.path;
        this.language = imgData.language;
        this.imageName = imgData.imageName;
        this.bundle = imgData.bundle == null ? 'resources' : imgData.bundle;
        console.log(`L10nSprite imgData:${JSON.stringify(imgData)}  bundle:${this.bundle}`);
        if (EDITOR) {
            if (this.sprite) {
                let func = async () => {
                    //let url = imgData.path + '/' + imgData.imageName + "/spriteFrame";
                    let url = imgData.path + '/' + imgData.imageName;
                    let spriteFrame = await ResLoader.load(url, SpriteFrame, this.bundle);
                    console.log(`spriteFrame: ${spriteFrame}`);
                    this.sprite.spriteFrame = spriteFrame;
                };
                func();
            }
        }
    }
}
