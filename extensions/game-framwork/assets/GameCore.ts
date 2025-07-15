import { AudioMgr } from "./AudioManager";
import { ConfigMgr } from "./ConfigManager";
import HttpRequest from "./HttpRequest";
import { LanguageMgr } from "./localized/LanguageManager";
import { MessageMgr } from "./MessageManager";
import ObjectPool from "./ObjectPool";
import { ResLoader } from "./ResLoader";
import { SceneMgr } from "./SceneManager";
import { StorageMgr } from "./StorageManager";
import { ArrayUtil } from "./utils/ArrayUtil";
import { CameraUtil } from "./utils/CameraUtil";
import { DeviceUtil } from "./utils/DeviceUtil";
import { ImageUtil } from "./utils/ImageUtil";
import { LayerUtil } from "./utils/LayerUtil";
import { MathUtil } from "./utils/MathUtil";
import { ObjectUtil } from "./utils/ObjectUtil";
import { PhysicsUtil } from "./utils/PhysicsUtil";
import { PlatformUtil } from "./utils/PlatformUtil";
import { RotateUtil } from "./utils/RotateUtil";
import { StringUtil } from "./utils/StringUtil";
import { Timer } from "./utils/TimeUtils";
import { Vec3Util } from "./utils/Vec3Util";

export class GameCore {
    audio = AudioMgr;
    language = LanguageMgr;
    scene = SceneMgr;
    config = ConfigMgr;
    message = MessageMgr;
    storage = StorageMgr;
    httpReq = HttpRequest;
    loader = ResLoader;
    objectPool = ObjectPool;
    arrayUtil = ArrayUtil;
    cameraUtil = CameraUtil;
    deviceUtil = DeviceUtil;
    imageUtil = ImageUtil;
    layerUtil = LayerUtil;
    mathUtil = MathUtil;
    objectUtil = ObjectUtil;
    physicsUtil = PhysicsUtil;
    platformUtil = PlatformUtil;
    rotateUtil = RotateUtil;
    stringUtil = StringUtil;
    timer = Timer;
    vec3Util = Vec3Util;
}

// /** 全局 Window 接口 */
// declare global {
//     interface Window {
//         core: GameCore;
//     }
//     var core: GameCore;
// }

// // 初始化实例并挂载到全局
// const _gameCore = new GameCore();
// window.core = _gameCore;    
// export { _gameCore as core };