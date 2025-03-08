import { _decorator, Component, Vec3, Tween, tween, Quat, Node, misc } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PathMoveComponent')
export class PathMoveComponent extends Component {
    @property({ type: [Vec3], displayName: '预设路径点' })
    public waypoints: Vec3[] = [];

    @property({ displayName: '初始速度', tooltip: '单位（像素/秒）' })
    public speed: number = 100;

    @property({ displayName: '是否循环路径', tooltip:'沿着循环路径移动' })
    public loop: boolean = true;

    @property({ displayName: '是否循环路径', tooltip: '从终点倒回起点' })
    public reverse: boolean = false;

    @property({ displayName: '是否旋转朝向', tooltip: '以朝向移动的方向旋转节点' })
    public enableRotation: boolean = true;

    private currentIndex: number = 0; // 当前路径点索引
    private isMoving: boolean = false; // 是否正在移动
    private moveTween: Tween<Node> | null = null; // 缓动对象

    start() {
        if (this.waypoints.length > 0) {
            this.startMoving();
        }
    }

    /** 开始路径移动 */
    private startMoving() {
        this.isMoving = true;
        this.moveToNextWaypoint();
    }

    /** 移动到下一个路径点 */
    private moveToNextWaypoint() {
        if (!this.isMoving || this.waypoints.length === 0) return;

        let targetPos = this.waypoints[this.currentIndex]; // 目标点
        let currentPos = this.node.position; // 当前节点位置
        let distance = Vec3.distance(currentPos, targetPos); // 计算距离
        let duration = distance / this.speed; // 计算所需时间

        // 计算旋转角度（让节点朝向移动方向）
        if (this.enableRotation) {
            this.rotateTowards(targetPos);
        }

        // 使用 Tween 进行缓动移动
        this.moveTween = tween(this.node)
            .to(duration, { position: targetPos }, { easing: 'smooth' }) // 平滑过渡
            .call(() => this.onReachWaypoint()) // 到达路径点后回调
            .start();
    }

    /** 旋转节点朝向目标点 */
    private rotateTowards(targetPos: Vec3) {
        let direction = new Vec3();
        Vec3.subtract(direction, targetPos, this.node.position); // 计算方向向量
        direction.normalize();

        let angle = Math.atan2(direction.y, direction.x); // 计算角度
        let degree = misc.radiansToDegrees(angle); // 转换为度数

        let rotationQuat = new Quat();
        Quat.fromEuler(rotationQuat, 0, 0, degree); // 生成旋转四元数
        this.node.setRotation(rotationQuat);
    }

    /** 到达路径点后的处理 */
    private onReachWaypoint() {
        if (this.reverse) {
            this.currentIndex--; // 倒序播放
        } else {
            this.currentIndex++; // 正序播放
        }

        if (this.currentIndex >= this.waypoints.length || this.currentIndex < 0) {
            if (this.loop) {
                this.currentIndex = this.reverse ? this.waypoints.length - 1 : 0; // 重新回到起点或终点
            } else {
                this.isMoving = false; // 停止移动
                return;
            }
        }

        this.moveToNextWaypoint(); // 继续移动
    }

    /** 暂停移动 */
    public pauseMove() {
        if (this.moveTween) {
            this.moveTween.stop();
            this.moveTween = null;
        }
        this.isMoving = false;
    }

    /** 恢复移动 */
    public resumeMove() {
        if (!this.isMoving) {
            this.isMoving = true;
            this.moveToNextWaypoint();
        }
    }

    /** 设置速度（可用于加速或减速） */
    public setSpeed(newSpeed: number) {
        this.speed = newSpeed;
    }

    /** 切换路径方向（正向/反向） */
    public toggleReverse() {
        this.reverse = !this.reverse;
        this.currentIndex = this.reverse ? this.waypoints.length - 1 : 0;
        this.moveToNextWaypoint();
    }
}
