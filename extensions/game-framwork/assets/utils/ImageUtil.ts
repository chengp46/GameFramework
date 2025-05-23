import { Color, ImageAsset, SpriteFrame, Texture2D } from "cc";

/**
 * 图像工具
 */
export class ImageUtil {
    /**
     * 获取纹理中指定像素的颜色，原点为左上角，从像素 (1, 1) 开始。
     * @param texture 纹理
     * @param x x 坐标
     * @param y y 坐标
     * @example
        // 获取纹理左上角第一个像素的颜色
        const color = ImageUtil.getPixelColor(texture, 1, 1);
        cc.color(50, 100, 123, 255);
     */
    static getPixelColor(texture: Texture2D, x: number, y: number): Color {
        let imageAsset = texture.image as ImageAsset;
        // 获取像素数据 (Uint8Array，每 4 个数值代表一个像素的 RGBA)
        let pixels = imageAsset.data as Uint8Array;
        let width = imageAsset.width;
        let height = imageAsset.height;

        if (x < 0 || x >= width || y < 0 || y >= height) {
            console.error("坐标超出范围");
            return new Color();
        } else {
            // 计算像素索引（每个像素由 4 个字节组成，索引 = (y * width + x) * 4）
            let index = (y * width + x) * 4;
            let r = pixels[index];
            let g = pixels[index + 1];
            let b = pixels[index + 2];
            let a = pixels[index + 3];
            let color = new Color(r, g, b, a);
            return color;
        }
    }

    static createPureColorSpriteFrame(color: Color): SpriteFrame {
        const canvas = document.createElement("canvas");
        canvas.width = 2;
        canvas.height = 2;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
        ctx.fillRect(0, 0, 2, 2);

        const imgAsset = new ImageAsset(canvas);
        const texture = new Texture2D();
        texture.image = imgAsset;

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;

        return spriteFrame;
    }
}
