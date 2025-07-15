import { _decorator, Component, resources, TextAsset, director, JsonAsset, SpriteFrame, Sprite, Enum, find, Node, game } from 'cc';
import { SceneMgr } from '../SceneManager';
import { Singleton } from '../Decorators';
import { ResLoader } from '../ResLoader';
import { ConfigMgr } from '../ConfigManager';
import { MessageMgr } from '../MessageManager';

const { ccclass, property, executeInEditMode, disallowMultiple } = _decorator;
/**
 * 语种
 * @param ZH 简中
 * @param TW 中繁
 * @param EN 英文
 * @param JA 日语
 * @param KO 韩语
 * @param TH 泰语
 * @param VN 越南语
 * @param PU 葡语
 * @param ID 印尼语
 * @param ES 西班牙语
 * @param RU 俄语
 * @param DE 德语
 * @param sv 瑞典文
 * @param IT 意大利
 * @param DA 丹麦文
 * @param NL 荷兰文
 * @param FI 芬兰
 * @param FR 法文
 * @param NO 挪威
 * @param PL 波兰
 * @param RO 罗马尼亚
 * @param TR 土耳其
 * @param MY 缅甸
 */
export enum LanguageType {
    ZH = 'zh',
    TW = 'tw',
    EN = 'en',
    JA = 'ja',
    KO = 'ko',
    TH = 'th',
    VN = 'vn',
    PU = 'pu',
    ID = 'id',
    ES = 'es',
    RU = 'ru',
    DE = 'de',
    SV = 'sv',
    IT = 'it',
    DA = 'da',
    NL = 'nl',
    FI = 'fi',
    FR = 'fr',
    NO = 'no',
    PL = 'pl',
    RO = 'ro',
    TR = 'tr',
    MY = 'my',
}

export interface ILocalizedConfig {
    key?: string;
    zh?: string;
    tw?: string;
    en?: string;
    ko?: string;
    ja?: string;
    th?: string;
    vi?: string;
    po?: string;
    in?: string;
    sp?: string;
    bu?: string;
    remark?: string;
}

export interface ILocalizedImage {
    key?: string;
    path?: string;
    bLanguage?: boolean;
    imageName?: string;
    bundleName?: string;
}


/**
 * json、图片和声音资源配置约定在resources 本地bundle包下
 * Localized_text.json Localized_image.json Localized_audio.json 
*/
@ccclass('LanguageManager')
export class LanguageManager {
    public static _instance: LanguageManager;
    private textData: Map<string, ILocalizedConfig> = new Map();
    private imageData: Map<string, ILocalizedImage> = new Map();
    private currentLanguage = LanguageType.ZH;

    set CurrentLanguage(value: LanguageType) {
        this.currentLanguage = value;
        MessageMgr.dispatchEvent("UpdateLocalized");
    }

    get CurrentLanguage() {
        return this.currentLanguage;
    }

    public static getInstance(): LanguageManager {
        if (!this._instance) {
            this._instance = new LanguageManager();
        }
        return this._instance;
    }

    public loadTxtConfig(url: string, bundle: string = "resources"): void {
        let func = async () => {
            let data = await ResLoader.load(url, JsonAsset, bundle);
            data.json.forEach(vaule => {
                this.textData.set(vaule.key, vaule);
            });
        };
        func();
    }

    public loadImageConfig(url: string, bundle: string = "resources"): void {
        let func = async () => {
            let data = await ResLoader.load(url, JsonAsset, bundle);
            data.json.forEach(vaule => {
                vaule.bundleName = bundle;
                this.imageData.set(vaule.key, vaule);
            });
        };
        func();
    }

    public initConfig() {
        let textData = ConfigMgr.getConfig("Localized_text");
        if (textData) {
            textData.forEach(vaule => {
                this.textData.set(vaule.key, vaule);
            });
        }
        let imageData = ConfigMgr.getConfig("Localized_image");
        if (imageData) {
            imageData.forEach(vaule => {
                vaule.bundleName = "resources";
                this.imageData.set(vaule.key, vaule);
            });
        }
    }

    getLocalizedValue(data: ILocalizedConfig) {
        switch (this.currentLanguage) {
            case LanguageType.ZH:
                return data.zh;
            case LanguageType.TW:
                return data.tw;
            case LanguageType.EN:
                return data.en;
            case LanguageType.KO:
                return data.ko;
            case LanguageType.JA:
                return data.ja;
            case LanguageType.TH:
                return data.th;
            case LanguageType.VN:
                return data.vi;
            case LanguageType.PU:
                return data.po;
            case LanguageType.ID:
                return data.in;
            case LanguageType.ES:
                return data.sp;
            case LanguageType.MY:
                return data.bu;
            default:
                return null;
        }
    }

    // **获取文本**
    public getText(key: string): string {
        let data = this.textData.get(key);
        if (data == null) {
            return '';
        }
        return this.getLocalizedValue(data);
    }

    // **设置精灵帧**
    public setSpriteFrame(key: string, sprite: Sprite) {
        if (!key || key.length === 0 || sprite == null) {
            return;
        }
        let data = this.imageData.get(key);
        let func = async () => {
            data.path = data.path.trim();
            data.path = data.path.endsWith("/") ? data.path : data.path + "/";
            if (data.bLanguage) {
                data.path = data.path + this.currentLanguage + "/";
            }
            data.path = data.path + data.imageName + "/spriteFrame";
            let image = await ResLoader.load(data.path, SpriteFrame, data.bundleName);
            if (image) {
                sprite.spriteFrame = image;
            }
        };
        func();
    }
}

export const LanguageMgr = LanguageManager.getInstance();