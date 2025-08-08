import { Node, Vec3, tween, Sprite, Color, v3, UIOpacity } from "cc";

export type AnimationTask = () => Promise<void>;

export class TweenUtils {
    // 移动
    static moveTo(node: Node, pos: Vec3, duration = 0.2, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                tween(node)
                    .to(duration, { position: pos }, { easing: 'quadOut' })
                    .call(() => {
                        callback && callback();
                        resolve();
                    })
                    .start();
            } catch (e) {
                console.warn("Tween moveTo error:", e);
                reject(e);
            }
        });
    }

    // 缩放
    static scaleTo(node: Node, scale: number, duration = 0.2, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                tween(node)
                    .to(duration, { scale: v3(scale, scale, scale) }, { easing: 'backOut' })
                    .call(() => {
                        callback && callback();
                        resolve();
                    })
                    .start();
            } catch (e) {
                console.warn("Tween scaleTo error:", e);
                reject(e);
            }
        });
    }

    // 节点旋转到指定角度
    static rotateTo(node: Node, angle: number, duration = 0.2, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                tween(node)
                    .to(duration, { angle }, { easing: 'sineOut' })
                    .call(() => {
                        callback && callback();
                        resolve();
                    })
                    .start();
            } catch (e) {
                console.warn("Tween rotateTo error:", e);
                reject(e);
            }
        });
    }

    // 节点颜色渐变
    static colorTo(sprite: Sprite, color: Color, duration = 0.3, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                tween(sprite)
                    .to(duration, { color: color })
                    .call(() => {
                        callback && callback();
                        resolve();
                    })
                    .start();
            } catch (e) {
                console.warn("Tween colorTo error:", e);
                reject(e);
            }
        });
    }

    /**
     * 围绕中心点随机圆形震动
     * @param node 目标节点
     * @param amplitude  最大振幅（震动范围）
     * @param duration 总持续时间（如 0.3 秒）
     * @param interval 每次震动间隔（如 0.03 秒）
     */
    static shake(node: Node, amplitude: number = 10, duration: number = 0.5, interval: number = 0.05, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const originalPos = node.position.clone();
                const shakeCount = Math.floor(duration / interval);
                let count = 0;
                const shakeHorizontal = () => {
                    if (count >= shakeCount) {
                        node.setPosition(originalPos); // 恢复原位
                        callback && callback();
                        resolve();
                        return;
                    }
                    const offsetX = (Math.random() - 0.5) * amplitude * 2;
                    const offsetY = (Math.random() - 0.5) * amplitude * 2;
                    node.setPosition(originalPos.x + offsetX, originalPos.y + offsetY);
                    count++;
                    setTimeout(() => {
                        shakeHorizontal();
                    }, interval);
                };
                shakeHorizontal();
            } catch (e) {
                console.warn("Tween shake error:", e);
                reject(e);
            }
        });
    }

    /**
     * 缩放震动动画（放大缩小快速切换）
     * @param node 要震动的节点
     * @param amplitude 缩放振幅，例如 0.1 表示 ±10%
     * @param times 震动次数（1 次表示放大+缩小算一次）
     * @param duration 每次缩放时间（单次缩放：放大或缩小）
     */
    static scaleShake(node: Node, amplitude: number = 0.1, times: number = 3, duration: number = 0.05, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const originalScale = node.scale.clone();
                const tweens = [];

                for (let i = 0; i < times; i++) {
                    const scaleUp = new Vec3(
                        originalScale.x * (1 + amplitude),
                        originalScale.y * (1 + amplitude),
                        originalScale.z
                    );
                    const scaleDown = new Vec3(
                        originalScale.x * (1 - amplitude),
                        originalScale.y * (1 - amplitude),
                        originalScale.z
                    );
                    tweens.push(
                        tween(node).to(duration, { scale: scaleUp }),
                        tween(node).to(duration, { scale: scaleDown })
                    );
                }

                // 最后回到原始大小
                tweens.push(tween(node).to(duration, { scale: originalScale }));

                // 串行动画
                tween(node)
                    .sequence(...tweens)
                    .call(() => {
                        callback && callback();
                        resolve();
                    }).start();

            } catch (e) {
                console.warn("Tween scaleShake error:", e);
                reject(e);
            }
        });
    }

    // 淡出动画
    static fadeOut(node: Node, duration = 0.2, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                let uiOpacity = node.getComponent(UIOpacity);
                if (!uiOpacity) {
                    uiOpacity = node.addComponent(UIOpacity);
                }
                tween(uiOpacity)
                    .to(duration, { opacity: 0 })
                    .call(() => {
                        callback && callback();
                        resolve();
                    })
                    .start();
            } catch (e) {
                console.warn("Tween fadeOut error:", e);
                reject(e);
            }
        });
    }

    // 淡入动画
    static fadeIn(node: Node, duration = 0.2, callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                let uiOpacity = node.getComponent(UIOpacity);
                if (!uiOpacity) {
                    uiOpacity = node.addComponent(UIOpacity);
                }
                uiOpacity.opacity = 0;
                tween(uiOpacity)
                    .to(duration, { opacity: 255 })
                    .call(() => {
                        callback && callback();
                        resolve();
                    })
                    .start();
            } catch (e) {
                console.warn("Tween fadeOut error:", e);
                reject(e);
            }
        });
    }

    // 延迟执行
    static delay(seconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    // 并行动画工具：多个动画并行执行，全部完成后 resolve
    static parallel(tasks: Promise<void>[]): Promise<void> {
        return Promise.all(tasks)
            .then(() => void 0)
            .catch((e) => {
                console.warn("TweenUtils.parallel error:", e);
            });
    }

    // 动画序列（链式 多动画串行）
    static sequence(tasks: AnimationTask[]): Promise<void> {
        return tasks.reduce((chain, task) => chain.then(() => task()), Promise.resolve());
    }

    // 异步执行函数
    static asyncFunc(callback: (res, rej) => void) {
        return new Promise((resolve, reject) => {
            callback && callback(resolve, reject);
        });
    }
}



export class AnimationQueue {
    private queue: AnimationTask[] = [];
    private isPlaying: boolean = false;

    /**
     * 添加一个动画任务到队列中（返回 this 可链式调用）
     */
    add(task: AnimationTask): this {
        this.queue.push(task);
        return this;
    }

    /**
     * 添加一个延迟任务（单位：秒）
     */
    delay(seconds: number): this {
        this.queue.push(() => new Promise(resolve => setTimeout(resolve, seconds * 1000)));
        return this;
    }

    /**
     * 播放所有任务，按顺序执行
     */
    async play(): Promise<void> {
        if (this.isPlaying) return;
        this.isPlaying = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) await task();
        }

        this.isPlaying = false;
    }

    /**
     * 清空队列（如果需要强制停止）
     */
    clear(): void {
        this.queue.length = 0;
        this.isPlaying = false;
    }
}

/**
 * 使用示例
const queue = new AnimationQueue();

queue.add(() => TweenUtils.moveTo(tile1.node, tile2.node.position, 0.2))
  .add(() => TweenUtils.moveTo(tile2.node, tile1.node.position, 0.2))
  .delay(0.1)
  .add(() => TweenUtils.scaleTo(tile1.node, 1.5, 0.1))
  .add(() => TweenUtils.fadeOut(tile1.node, 0.2));

await queue.play();


* 多动画顺序 + 并行结合
await TweenUtils.moveTo(tile.node, cc.v3(100, 0));
await TweenUtils.delay(0.1);

await TweenUtils.parallel([
  TweenUtils.scaleTo(tile.node, 1.2),
  TweenUtils.fadeOut(tile.node)
]);

* 动画序列（链式）
await TweenUtils.sequence([
  () => TweenUtils.moveTo(tile.node, cc.v3(100, 0)),
  () => TweenUtils.scaleShake(tile.node),
  () => TweenUtils.fadeOut(tile.node)
]);
 */
