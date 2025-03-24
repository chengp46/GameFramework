import { _decorator, Component, view, director, Size, ResolutionPolicy, size, Canvas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DynamicResolutionAdapter')
export class DynamicResolutionAdapter extends Component {


    onLoad() {
        
        this.adaptScreen();
        window.addEventListener("resize", this.adaptScreen.bind(this)); // 监听窗口变化
    }

    adaptScreen() {
        const viewDesignSize = size(1280, 720); // 设计分辨率（16:9）
        const isLandscape = window.innerWidth > window.innerHeight;
        const designResolution = isLandscape ? size(viewDesignSize.width, viewDesignSize.height)
            : size(viewDesignSize.height, viewDesignSize.width);
        const screenSize = new Size(window.innerWidth, window.innerHeight); // 获取当前窗口大小

        const screenRatio = screenSize.width / screenSize.height;
        const designRatio = designResolution.width / designResolution.height;

        if (screenRatio > designRatio) {
            // 🌟 屏幕更宽（21:9）-> 适配高度
            console.log("21:9 或更宽适配，适配高度");
            view.setDesignResolutionSize(designResolution.width * (screenRatio / designRatio), designResolution.height, ResolutionPolicy.SHOW_ALL);
        } else {
            // 🌟 屏幕更窄（4:3）-> 适配宽度
            console.log("16:9 或更窄适配，适配宽度");
            view.setDesignResolutionSize(designResolution.width, designResolution.height, ResolutionPolicy.SHOW_ALL);
        }
        view.resizeWithBrowserSize(true);
        console.log(`Window: ${screenSize.width}x${screenSize.height}, Ratio: ${screenRatio}`);
    }
}
