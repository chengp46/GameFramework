"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
exports.load = load;
exports.unload = unload;
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const path = require("path");
const chokidar = require("chokidar");
const fs = require("fs");
let textPath = path.join(Editor.Project.path, "assets/resources/config/Localized_text.json");
let imagePath = path.join(Editor.Project.path, "assets/resources/config/Localized_image.json");
let jsonData = [];
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    textData: {},
    imageData: {},
    audioData: {},
    /**
     * 加载 JSON 文件数据
     */
    loadJsonData(index) {
        const filePathArray = [textPath, imagePath];
        if (fs.existsSync(filePathArray[index])) {
            const data = fs.readFileSync(filePathArray[index], "utf-8");
            jsonData[index] = JSON.parse(data);
            console.log("[JSON Watcher] JSON 数据已加载:", jsonData[index]);
        }
        else {
            console.warn("[JSON Watcher] JSON 文件不存在:", filePathArray[index]);
        }
    },
    /**
     * 重新加载 JSON 文件数据
     */
    loadResJsonData(args) {
        console.log(`收到loadResJsonData:${JSON.stringify(args)}`);
        textPath = path.join(Editor.Project.path, args.txtPath);
        imagePath = path.join(Editor.Project.path, args.imagePath);
        ;
        exports.methods.loadJsonData(0);
        exports.methods.loadJsonData(1);
    },
    /**
     * 启动监听 JSON 变更
     */
    startWatching() {
        const filePaths = [textPath, imagePath];
        filePaths.forEach((path, index) => {
            chokidar.watch(path, { persistent: true }).on("change", () => {
                console.log(`[JSON Watcher] ${path} 文件发生变更，重新加载...`);
                exports.methods.loadJsonData(index);
                Editor.Message.broadcast("json-watcher:reload", index);
            });
        });
    },
    /**
     * 获取 文本JSON 数据
     */
    getTextData() {
        if (!jsonData[0] || Object.keys(jsonData[0]).length === 0) {
            exports.methods.loadJsonData(0);
        }
        return jsonData[0];
    },
    /**
     * 获取 文本JSON 数据
     */
    getImageData() {
        if (!jsonData[1] || Object.keys(jsonData[1]).length === 0) {
            exports.methods.loadJsonData(0);
        }
        return jsonData[1];
    },
    /**
     * @en A method that can be triggered by message
     * @zh 通过 message 触发的方法
     */
    openPanel() {
        Editor.Panel.open(package_json_1.default.name);
    },
};
/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
function load() {
    exports.methods.loadJsonData(0);
    exports.methods.loadJsonData(1);
    exports.methods.startWatching();
}
/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
function unload() {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQWdHQSxvQkFJQztBQU1ELHdCQUNDO0FBM0dELGFBQWE7QUFDYixtRUFBMEM7QUFDMUMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFekIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzdGLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsOENBQThDLENBQUMsQ0FBQztBQUMvRixJQUFJLFFBQVEsR0FBMEIsRUFBRSxDQUFDO0FBRXpDOzs7R0FHRztBQUNVLFFBQUEsT0FBTyxHQVVoQjtJQUNBLFFBQVEsRUFBRSxFQUFFO0lBQ1osU0FBUyxFQUFFLEVBQUU7SUFDYixTQUFTLEVBQUUsRUFBRTtJQUViOztPQUVHO0lBQ0gsWUFBWSxDQUFDLEtBQWE7UUFDdEIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdEMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUQsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsT0FBTyxD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aW1wb3J0IHBhY2thZ2VKU09OIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxuY29uc3QgY2hva2lkYXIgPSByZXF1aXJlKFwiY2hva2lkYXJcIik7XHJcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG5cclxubGV0IHRleHRQYXRoID0gcGF0aC5qb2luKEVkaXRvci5Qcm9qZWN0LnBhdGgsIFwiYXNzZXRzL3Jlc291cmNlcy9jb25maWcvTG9jYWxpemVkX3RleHQuanNvblwiKTtcclxubGV0IGltYWdlUGF0aCA9IHBhdGguam9pbihFZGl0b3IuUHJvamVjdC5wYXRoLCBcImFzc2V0cy9yZXNvdXJjZXMvY29uZmlnL0xvY2FsaXplZF9pbWFnZS5qc29uXCIpO1xyXG5sZXQganNvbkRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBSZWdpc3RyYXRpb24gbWV0aG9kIGZvciB0aGUgbWFpbiBwcm9jZXNzIG9mIEV4dGVuc2lvblxyXG4gKiBAemgg5Li65omp5bGV55qE5Li76L+b56iL55qE5rOo5YaM5pa55rOVXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbWV0aG9kczoge1xyXG4gICAgdGV4dERhdGE6IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgICBpbWFnZURhdGE6IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgICBhdWRpb0RhdGE6IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgICBsb2FkSnNvbkRhdGE6IChpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xyXG4gICAgbG9hZFJlc0pzb25EYXRhOiAoYXJnczogYW55KT0+IHZvaWQ7XHJcbiAgICBzdGFydFdhdGNoaW5nOiAoKSA9PiB2b2lkO1xyXG4gICAgZ2V0VGV4dERhdGE6ICgpID0+IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgICBnZXRJbWFnZURhdGE6ICgpID0+IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgICBvcGVuUGFuZWw6ICgpID0+IHZvaWQ7XHJcbn0gPSB7XHJcbiAgICB0ZXh0RGF0YToge30sXHJcbiAgICBpbWFnZURhdGE6IHt9LFxyXG4gICAgYXVkaW9EYXRhOiB7fSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vSBKU09OIOaWh+S7tuaVsOaNrlxyXG4gICAgICovXHJcbiAgICBsb2FkSnNvbkRhdGEoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoQXJyYXkgPSBbdGV4dFBhdGgsIGltYWdlUGF0aF07XHJcbiAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGhBcnJheVtpbmRleF0pKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGhBcnJheVtpbmRleF0sIFwidXRmLThcIik7XHJcbiAgICAgICAgICAgIGpzb25EYXRhW2luZGV4XSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0pTT04gV2F0Y2hlcl0gSlNPTiDmlbDmja7lt7LliqDovb06XCIsIGpzb25EYXRhW2luZGV4XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0pTT04gV2F0Y2hlcl0gSlNPTiDmlofku7bkuI3lrZjlnKg6XCIsIGZpbGVQYXRoQXJyYXlbaW5kZXhdKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDph43mlrDliqDovb0gSlNPTiDmlofku7bmlbDmja5cclxuICAgICAqL1xyXG4gICAgbG9hZFJlc0pzb25EYXRhKGFyZ3M6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGDmlLbliLBsb2FkUmVzSnNvbkRhdGE6JHtKU09OLnN0cmluZ2lmeShhcmdzKX1gKTtcclxuICAgICAgICB0ZXh0UGF0aCA9IHBhdGguam9pbihFZGl0b3IuUHJvamVjdC5wYXRoLCBhcmdzLnR4dFBhdGgpO1xyXG4gICAgICAgIGltYWdlUGF0aCA9IHBhdGguam9pbihFZGl0b3IuUHJvamVjdC5wYXRoLCBhcmdzLmltYWdlUGF0aCk7O1xyXG4gICAgICAgIG1ldGhvZHMubG9hZEpzb25EYXRhKDApO1xyXG4gICAgICAgIG1ldGhvZHMubG9hZEpzb25EYXRhKDEpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog5ZCv5Yqo55uR5ZCsIEpTT04g5Y+Y5pu0XHJcbiAgICAgKi9cclxuICAgIHN0YXJ0V2F0Y2hpbmcoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZVBhdGhzID0gW3RleHRQYXRoLCBpbWFnZVBhdGhdO1xyXG4gICAgICAgIGZpbGVQYXRocy5mb3JFYWNoKChwYXRoLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjaG9raWRhci53YXRjaChwYXRoLCB7IHBlcnNpc3RlbnQ6IHRydWUgfSkub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtKU09OIFdhdGNoZXJdICR7cGF0aH0g5paH5Lu25Y+R55Sf5Y+Y5pu077yM6YeN5paw5Yqg6L29Li4uYCk7XHJcbiAgICAgICAgICAgICAgICBtZXRob2RzLmxvYWRKc29uRGF0YShpbmRleCk7XHJcbiAgICAgICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5icm9hZGNhc3QoXCJqc29uLXdhdGNoZXI6cmVsb2FkXCIsIGluZGV4KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5Yg5paH5pysSlNPTiDmlbDmja5cclxuICAgICAqL1xyXG4gICAgZ2V0VGV4dERhdGEoKSB7XHJcbiAgICAgICAgaWYgKCFqc29uRGF0YVswXSB8fCBPYmplY3Qua2V5cyhqc29uRGF0YVswXSkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIG1ldGhvZHMubG9hZEpzb25EYXRhKDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ganNvbkRhdGFbMF07XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5Yg5paH5pysSlNPTiDmlbDmja5cclxuICAgICAqL1xyXG4gICAgZ2V0SW1hZ2VEYXRhKCkge1xyXG4gICAgICAgIGlmICghanNvbkRhdGFbMV0gfHwgT2JqZWN0LmtleXMoanNvbkRhdGFbMV0pLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBtZXRob2RzLmxvYWRKc29uRGF0YSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGpzb25EYXRhWzFdO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEEgbWV0aG9kIHRoYXQgY2FuIGJlIHRyaWdnZXJlZCBieSBtZXNzYWdlXHJcbiAgICAgKiBAemgg6YCa6L+HIG1lc3NhZ2Ug6Kem5Y+R55qE5pa55rOVXHJcbiAgICAgKi9cclxuICAgIG9wZW5QYW5lbCgpIHtcclxuICAgICAgICBFZGl0b3IuUGFuZWwub3BlbihwYWNrYWdlSlNPTi5uYW1lKTtcclxuICAgIH0sXHJcbn07XHJcblxyXG4vKipcclxuICogQGVuIE1ldGhvZCBUcmlnZ2VyZWQgb24gRXh0ZW5zaW9uIFN0YXJ0dXBcclxuICogQHpoIOaJqeWxleWQr+WKqOaXtuinpuWPkeeahOaWueazlVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoKSB7XHJcbiAgICBtZXRob2RzLmxvYWRKc29uRGF0YSgwKTtcclxuICAgIG1ldGhvZHMubG9hZEpzb25EYXRhKDEpO1xyXG4gICAgbWV0aG9kcy5zdGFydFdhdGNoaW5nKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gTWV0aG9kIHRyaWdnZXJlZCB3aGVuIHVuaW5zdGFsbGluZyB0aGUgZXh0ZW5zaW9uXHJcbiAqIEB6aCDljbjovb3mianlsZXml7bop6blj5HnmoTmlrnms5VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmxvYWQoKSB7XHJcbn1cclxuIl19