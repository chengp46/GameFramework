// @ts-ignore
import packageJSON from '../package.json';
const path = require("path");
const chokidar = require("chokidar");
const fs = require("fs");

const textPath = path.join(Editor.Project.path, "assets/resources/config/Localized_text.json");
const imagePath = path.join(Editor.Project.path, "assets/resources/config/Localized_text.json");
const audioPath = path.join(Editor.Project.path, "assets/resources/config/Localized_text.json");
let jsonData: Record<string, any>[] = [];

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: {
    textData: Record<string, any>;
    imageData: Record<string, any>;
    audioData: Record<string, any>;
    loadJsonData: (index: number) => void;
    startWatching: () => void;
    getTextData: () => Record<string, any>;
    getImageData: () => Record<string, any>;
    getAudioData: () => Record<string, any>;
    openPanel: () => void;
} = {
    textData: {},
    imageData: {},
    audioData: {},

    /**
     * 加载 JSON 文件数据
     */
    loadJsonData(index: number) {
        //let jsonDataArray  = [methods.textData, methods.imageData, methods.audioData];
        const filePathArray = [textPath, imagePath, audioPath];
        if (fs.existsSync(filePathArray[index])) {
            const data = fs.readFileSync(filePathArray[index], "utf-8");
            jsonData[index] = JSON.parse(data);
            console.log("[JSON Watcher] JSON 数据已加载:", jsonData[index]);
        } else {
            console.warn("[JSON Watcher] JSON 文件不存在:", filePathArray[index]);
        }
    },
    /**
     * 启动监听 JSON 变更
     */
    startWatching() {
        const filePaths = [textPath, imagePath, audioPath];
        filePaths.forEach((path, index) => {
            chokidar.watch(path, { persistent: true }).on("change", () => {
                console.log(`[JSON Watcher] ${path} 文件发生变更，重新加载...`);
                methods.loadJsonData(index);
                Editor.Message.broadcast("json-watcher:reload", index);
            });
        });
    },
    /**
     * 获取 文本JSON 数据
     */
    getTextData() {
        if (!jsonData[0] || Object.keys(jsonData[0]).length === 0) {
            methods.loadJsonData(0);
        }
        return jsonData[0];
    },
    /**
     * 获取 文本JSON 数据
     */
    getImageData() {
        if (!jsonData[1] || Object.keys(jsonData[1]).length === 0) {
            methods.loadJsonData(0);
        }
        return jsonData[1];
    },
    /**
    * 获取 文本JSON 数据
    */
    getAudioData() {
        return this.audioData;
    },
    /**
     * @en A method that can be triggered by message
     * @zh 通过 message 触发的方法
     */
    openPanel() {
        Editor.Panel.open(packageJSON.name);
    },
};

/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export function load() {
    methods.loadJsonData(0);
    methods.loadJsonData(1);
    methods.loadJsonData(2);
    methods.startWatching();
}

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() {
}
