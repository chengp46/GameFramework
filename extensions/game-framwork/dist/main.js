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
const textPath = path.join(Editor.Project.path, "assets/resources/config/Localized_text.json");
const imagePath = path.join(Editor.Project.path, "assets/resources/config/Localized_text.json");
const audioPath = path.join(Editor.Project.path, "assets/resources/config/Localized_text.json");
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
        //let jsonDataArray  = [methods.textData, methods.imageData, methods.audioData];
        const filePathArray = [textPath, imagePath, audioPath];
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
     * 启动监听 JSON 变更
     */
    startWatching() {
        console.log(`[JSON Watcher] 监听 JSON 文件`);
        const filePaths = [textPath, imagePath, audioPath];
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
        return this.imageData;
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
    exports.methods.loadJsonData(2);
    exports.methods.startWatching();
}
/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
function unload() {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQTZGQSxvQkFLQztBQU1ELHdCQUlDO0FBNUdELGFBQWE7QUFDYixtRUFBMEM7QUFDMUMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFekIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQy9GLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsNkNBQTZDLENBQUMsQ0FBQztBQUNoRyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLDZDQUE2QyxDQUFDLENBQUM7QUFDaEcsSUFBSSxRQUFRLEdBQTBCLEVBQUUsQ0FBQztBQUV6Qzs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FVaEI7SUFDQSxRQUFRLEVBQUUsRUFBRTtJQUNaLFNBQVMsRUFBRSxFQUFFO0lBQ2IsU0FBUyxFQUFFLEVBQUU7SUFFYjs7T0FFRztJQUNILFlBQVksQ0FBQyxLQUFhO1FBQ3RCLGdGQUFnRjtRQUNoRixNQUFNLGFBQWEsR0FBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEQsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdEMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUQsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckUsQ0FBQztJQUNMLENBQUM7SUFDRDs7T0FFRztJQUNILGFBQWE7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFekMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDOUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNyRCxlQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNEOztPQUVHO0lBQ0gsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDeEQsZUFBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQ0QsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUNEOztPQUVHO0lBQ0gsWUFBWTtRQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBQ0Q7O01BRUU7SUFDRixZQUFZO1FBQ1IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFDRDs7O09BR0c7SUFDSCxTQUFTO1FBQ0wsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsc0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0osQ0FBQztBQUVGOzs7R0FHRztBQUNILFNBQWdCLElBQUk7SUFDaEIsZUFBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixlQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLGVBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsZUFBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixNQUFNO0FBSXRCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtaWdub3JlXHJcbmltcG9ydCBwYWNrYWdlSlNPTiBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IGNob2tpZGFyID0gcmVxdWlyZShcImNob2tpZGFyXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuXHJcbmNvbnN0IHRleHRQYXRoID0gcGF0aC5qb2luKEVkaXRvci5Qcm9qZWN0LnBhdGgsIFwiYXNzZXRzL3Jlc291cmNlcy9jb25maWcvTG9jYWxpemVkX3RleHQuanNvblwiKTtcclxuY29uc3QgaW1hZ2VQYXRoID0gcGF0aC5qb2luKEVkaXRvci5Qcm9qZWN0LnBhdGgsIFwiYXNzZXRzL3Jlc291cmNlcy9jb25maWcvTG9jYWxpemVkX3RleHQuanNvblwiKTtcclxuY29uc3QgYXVkaW9QYXRoID0gcGF0aC5qb2luKEVkaXRvci5Qcm9qZWN0LnBhdGgsIFwiYXNzZXRzL3Jlc291cmNlcy9jb25maWcvTG9jYWxpemVkX3RleHQuanNvblwiKTtcclxubGV0IGpzb25EYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gUmVnaXN0cmF0aW9uIG1ldGhvZCBmb3IgdGhlIG1haW4gcHJvY2VzcyBvZiBFeHRlbnNpb25cclxuICogQHpoIOS4uuaJqeWxleeahOS4u+i/m+eoi+eahOazqOWGjOaWueazlVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1ldGhvZHM6IHtcclxuICAgIHRleHREYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG4gICAgaW1hZ2VEYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG4gICAgYXVkaW9EYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG4gICAgbG9hZEpzb25EYXRhOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZDtcclxuICAgIHN0YXJ0V2F0Y2hpbmc6ICgpID0+IHZvaWQ7XHJcbiAgICBnZXRUZXh0RGF0YTogKCkgPT4gUmVjb3JkPHN0cmluZywgYW55PjtcclxuICAgIGdldEltYWdlRGF0YTogKCkgPT4gUmVjb3JkPHN0cmluZywgYW55PjtcclxuICAgIGdldEF1ZGlvRGF0YTogKCkgPT4gUmVjb3JkPHN0cmluZywgYW55PjtcclxuICAgIG9wZW5QYW5lbDogKCkgPT4gdm9pZDtcclxufSA9IHtcclxuICAgIHRleHREYXRhOiB7fSxcclxuICAgIGltYWdlRGF0YToge30sXHJcbiAgICBhdWRpb0RhdGE6IHt9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L29IEpTT04g5paH5Lu25pWw5o2uXHJcbiAgICAgKi9cclxuICAgIGxvYWRKc29uRGF0YShpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy9sZXQganNvbkRhdGFBcnJheSAgPSBbbWV0aG9kcy50ZXh0RGF0YSwgbWV0aG9kcy5pbWFnZURhdGEsIG1ldGhvZHMuYXVkaW9EYXRhXTtcclxuICAgICAgICBjb25zdCBmaWxlUGF0aEFycmF5ICA9IFt0ZXh0UGF0aCwgaW1hZ2VQYXRoLCBhdWRpb1BhdGhdO1xyXG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoQXJyYXlbaW5kZXhdKSkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoQXJyYXlbaW5kZXhdLCBcInV0Zi04XCIpO1xyXG4gICAgICAgICAgICBqc29uRGF0YVtpbmRleF0gPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltKU09OIFdhdGNoZXJdIEpTT04g5pWw5o2u5bey5Yqg6L29OlwiLCBqc29uRGF0YVtpbmRleF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltKU09OIFdhdGNoZXJdIEpTT04g5paH5Lu25LiN5a2Y5ZyoOlwiLCBmaWxlUGF0aEFycmF5W2luZGV4XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog5ZCv5Yqo55uR5ZCsIEpTT04g5Y+Y5pu0XHJcbiAgICAgKi9cclxuICAgIHN0YXJ0V2F0Y2hpbmcoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtKU09OIFdhdGNoZXJdIOebkeWQrCBKU09OIOaWh+S7tmApO1xyXG5cclxuICAgICAgICBjb25zdCBmaWxlUGF0aHMgPSBbdGV4dFBhdGgsIGltYWdlUGF0aCwgYXVkaW9QYXRoXTtcclxuICAgICAgICBmaWxlUGF0aHMuZm9yRWFjaCgocGF0aCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY2hva2lkYXIud2F0Y2gocGF0aCwgeyBwZXJzaXN0ZW50OiB0cnVlIH0pLm9uKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbSlNPTiBXYXRjaGVyXSAke3BhdGh9IOaWh+S7tuWPkeeUn+WPmOabtO+8jOmHjeaWsOWKoOi9vS4uLmApO1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5sb2FkSnNvbkRhdGEoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UuYnJvYWRjYXN0KFwianNvbi13YXRjaGVyOnJlbG9hZFwiLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog6I635Y+WIOaWh+acrEpTT04g5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIGdldFRleHREYXRhKCkge1xyXG4gICAgICAgIGlmICghanNvbkRhdGFbMF0gfHwgT2JqZWN0LmtleXMoanNvbkRhdGFbMF0pLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBtZXRob2RzLmxvYWRKc29uRGF0YSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGpzb25EYXRhWzBdO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog6I635Y+WIOaWh+acrEpTT04g5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIGdldEltYWdlRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZURhdGE7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAqIOiOt+WPliDmlofmnKxKU09OIOaVsOaNrlxyXG4gICAgKi9cclxuICAgIGdldEF1ZGlvRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdWRpb0RhdGE7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQSBtZXRob2QgdGhhdCBjYW4gYmUgdHJpZ2dlcmVkIGJ5IG1lc3NhZ2VcclxuICAgICAqIEB6aCDpgJrov4cgbWVzc2FnZSDop6blj5HnmoTmlrnms5VcclxuICAgICAqL1xyXG4gICAgb3BlblBhbmVsKCkge1xyXG4gICAgICAgIEVkaXRvci5QYW5lbC5vcGVuKHBhY2thZ2VKU09OLm5hbWUpO1xyXG4gICAgfSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gTWV0aG9kIFRyaWdnZXJlZCBvbiBFeHRlbnNpb24gU3RhcnR1cFxyXG4gKiBAemgg5omp5bGV5ZCv5Yqo5pe26Kem5Y+R55qE5pa55rOVXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbG9hZCgpIHtcclxuICAgIG1ldGhvZHMubG9hZEpzb25EYXRhKDApO1xyXG4gICAgbWV0aG9kcy5sb2FkSnNvbkRhdGEoMSk7XHJcbiAgICBtZXRob2RzLmxvYWRKc29uRGF0YSgyKTtcclxuICAgIG1ldGhvZHMuc3RhcnRXYXRjaGluZygpO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIE1ldGhvZCB0cmlnZ2VyZWQgd2hlbiB1bmluc3RhbGxpbmcgdGhlIGV4dGVuc2lvblxyXG4gKiBAemgg5Y246L295omp5bGV5pe26Kem5Y+R55qE5pa55rOVXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkKCkge1xyXG5cclxuXHJcblxyXG59XHJcbiJdfQ==