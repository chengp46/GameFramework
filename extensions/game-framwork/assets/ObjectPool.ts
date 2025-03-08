// ObjectPool.ts

import { _decorator, Node, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPool')
export default class ObjectPool {

    private pool: Node[] = []; // 对象池
    private prefab: Prefab = null; // 预制体

    /**
     * 初始化对象池
     * @param prefab 预制体
     * @param size 初始对象数量
     */
    public init(prefab: Prefab, size: number): void {
        this.prefab = prefab;
        for (let i = 0; i < size; i++) {
            const obj = instantiate(prefab); // 创建对象
            this.pool.push(obj);
        }
    }

    /**
     * 从对象池中获取对象
     * @returns 可用的对象
     */
    public get(): Node {
        if (this.pool.length > 0) {
            return this.pool.pop(); // 从池中取出对象
        } else {
            return instantiate(this.prefab); // 如果池为空，创建新对象
        }
    }

    /**
     * 将对象放回对象池
     * @param obj 需要回收的对象
     */
    public put(obj: Node): void {
        obj.removeFromParent(); // 从场景中移除对象
        this.pool.push(obj); // 将对象放回池中
    }

    /**
     * 清空对象池
     */
    public clear(): void {
        this.pool.forEach(obj => obj.destroy()); // 销毁所有对象
        this.pool = [];
    }
}

