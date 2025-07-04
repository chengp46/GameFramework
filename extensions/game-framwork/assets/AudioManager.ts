// AudioSourceManager.ts

import { _decorator, Component, AudioSource, AudioClip, Node, director, find } from 'cc';
import { ResLoader } from './ResLoader';
import { SceneMgr } from './SceneManager';
const { ccclass, property } = _decorator;

class AudioSourceItem {
    sourceId: number;
    srcPath: string;
    bundle: string;
    audio: AudioClip;
    sceneId: number;
}

export interface ILocalizedAudio {
    key?: string;
    path?: string;
    name?: string;
    bLanguage?: number;
    bSex?: number;
}

@ccclass('AudioSourceManager')
export class AudioSourceManager {
    // AudioSourceManager全局实例
    private static _instance: AudioSourceManager = null;
    // 背景音乐 AudioSource
    private bgmSource: AudioSource = null;
    // 音效 AudioSource
    private effectSource: AudioSource = null;
    // 资源列表
    private sourceList: AudioSourceItem[] = [];
    private mapSourceList = new Map<string, ILocalizedAudio>();
    // 音效开始回调函数
    private startFunc: () => void = null;
    // 音效结束回调函数
    private endFunc: () => void = null;

    public static get instance(): AudioSourceManager {
        if (!this._instance) {
            this._instance = new AudioSourceManager();
        }
        return this._instance;
    }

    /**
     * 设置背景音乐音量
     * @param volume 音量 (0 ~ 1)
     */
    set BGMVolume(volume: number) {
        if (this.bgmSource) {
            this.bgmSource.volume = volume;
        }
    }

    get BGMVolume() {
        return this.bgmSource.volume;
    }

    /**
     * 设置音效音量
     * @param volume 音量 (0 ~ 1)
     */
    set EffectVolume(volume: number) {
        if (this.effectSource) {
            this.effectSource.volume = volume;
        }
    }

    get EffectVolume() {
        return this.effectSource.volume;
    }


    init() {
        // 初始化背景音乐 AudioSource
        this.bgmSource = SceneMgr.SceneNode.addComponent(AudioSource);
        this.bgmSource.loop = true; // 背景音乐循环播放
        this.bgmSource.volume = 0.5; // 设置初始音量

        // 初始化音效 AudioSource
        this.effectSource = SceneMgr.SceneNode.addComponent(AudioSource);
        this.effectSource.loop = false; // 音效不循环
        this.effectSource.volume = 1.0; // 设置初始音量

        this.effectSource.node.on(AudioSource.EventType.STARTED, this.onAudioStarted, this);
        this.effectSource.node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    }

    release(): void {
        this.effectSource.node.off(AudioSource.EventType.STARTED, this.onAudioStarted, this);
        this.effectSource.node.off(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    }

    onAudioStarted() {
        this.startFunc && this.startFunc();
    }

    onAudioEnded() {
        if (this.endFunc) {
            this.endFunc();
        }
    }

    loadConfig(filePath: string, bundle: string = "") {

    }

    async register(sceneID: number, sourceId: number, srcPath: string, bundle: string = "") {
        for (let i = 0; i < this.sourceList.length; i++) {
            if (this.sourceList[i].sourceId == sourceId && this.sourceList[i].sceneId == sceneID) {
                return;
            }
        }
        if (0 == bundle.length) {
            bundle = "resources";
        }
        let sourceItem = new AudioSourceItem();
        sourceItem.sourceId = sourceId;
        sourceItem.srcPath = srcPath;
        sourceItem.bundle = bundle;
        sourceItem.sceneId = sceneID;
        sourceItem.audio = await ResLoader.load(sourceItem.srcPath, AudioClip, bundle);
        this.sourceList.push(sourceItem);
    }

    unregister(sceneId: number) {
        let sList: AudioSourceItem[] = [];
        for (let i = 0; i < this.sourceList.length; i++) {
            if (this.sourceList[i].sceneId == sceneId) {
                ResLoader.release(this.sourceList[i].srcPath, this.sourceList[i].bundle);
            }
            else {
                sList.push(this.sourceList[i]);
            }
        }
        this.sourceList = sList;
    }

    findAudioClip(sourceId: number): AudioClip {
        for (let i = 0; i < this.sourceList.length; i++) {
            if (sourceId == this.sourceList[i].sourceId) {
                return this.sourceList[i].audio;
            }
        }
        return null;
    }

    // 设置背景音乐
    public async setBackgroundMusic(srcPath: string, bundle: string = "", callback: () => void) {
        this.bgmSource.clip = await ResLoader.load(srcPath, AudioClip, bundle);
        callback && callback();
    }

    /**
     * 播放背景音乐
     */
    public playBackgroundMusic(): void {
        if (this.bgmSource && !this.bgmSource.playing) {
            this.bgmSource.play();
        }
    }

    /**
     * 暂停背景音乐
     */
    public pauseBackgroundMusic(): void {
        if (this.bgmSource && this.bgmSource.playing) {
            this.bgmSource.pause();
        }
    }

    /**
     * 停止背景音乐
     */
    public stopBackgroundMusic(): void {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    /**
     * 播放音效
     * @param startCall  音效开始回调函数
     * @param endCall    音效结束回调函数
     */
    public playEffect(sourceId: number, startCall: () => void = null, endCall: () => void = null): void {
        this.startFunc = startCall;
        this.endFunc = endCall;
        let effectClip = this.findAudioClip(sourceId);
        if (this.effectSource && effectClip) {
            this.effectSource.clip = effectClip;
            this.effectSource.play();
        }
    }

    /**
     * 暂停音乐
     */
    pause() {
        if (this.bgmSource) {
            this.bgmSource.pause();
        }
    }

    /**
     * 恢复音乐
     */
    public resume() {
        if (this.bgmSource) {
            this.bgmSource.play();
        }
    }

    /**
     * 停止所有音频
     */
    public stopAll(): void {
        this.stopBackgroundMusic();
        if (this.effectSource) {
            this.effectSource.stop();
        }
    }
}

export const AudioMgr = AudioSourceManager.instance;