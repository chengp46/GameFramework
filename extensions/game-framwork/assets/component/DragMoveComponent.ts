import { _decorator, Component, Node, EventTouch, Vec3, UITransform, v3, tween, Input, EventTarget, Rect, clamp } from 'cc';
import { Message } from '../MessageManager';
const { ccclass, property } = _decorator;

@ccclass('DragMoveComponent')
export class DragMoveComponent extends Component {
    @property({ type: Rect, displayName: "拖拽范围", tooltip: "拖拽范围（本地坐标）" })
    dragArea: Rect = new Rect(-500, -300, 1000, 600); // x, y, width, height

    @property({ type: [Vec3], displayName: "吸附点坐标", tooltip: "吸附点列表（本地坐标）" })
    snapPoints: Vec3[] = [];

    @property({ displayName: "吸附半径", tooltip: "吸附半径（0为不吸附）" })
    snapRadius: number = 50;

    @property({ displayName: "吸附动画", tooltip: "吸附是否播放动画" })
    useSnapTween: boolean = true;

    static EventType = {
        DragStart: 'drag-start',
        DragMove: 'drag-move',
        DragEnd: 'drag-end',
    };

    public static EventBus = new EventTarget();

    private _offset = new Vec3();
    private _isDragging = false;

    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this._onTouchEnd, this);

        // 鼠标事件也支持
        this.node.on(Input.EventType.MOUSE_DOWN, this._onTouchStart, this);
        this.node.on(Input.EventType.MOUSE_MOVE, this._onTouchMove, this);
        this.node.on(Input.EventType.MOUSE_UP, this._onTouchEnd, this);
    }

    protected _onTouchStart(event: EventTouch) {
        const localPos = this._getTouchLocalPos(event);
        Vec3.subtract(this._offset, this.node.position, localPos);
        this._isDragging = true;
        Message.dispatchEvent(DragMoveComponent.EventType.DragStart, this.node);
    }

    protected _onTouchMove(event: EventTouch) {
        if (!this._isDragging) {
            return;
        }
        const localPos = this._getTouchLocalPos(event);
        const targetPos = localPos.add(this._offset);

        // 限制范围
        targetPos.x = clamp(targetPos.x, this.dragArea.xMin, this.dragArea.xMax);
        targetPos.y = clamp(targetPos.y, this.dragArea.yMin, this.dragArea.yMax);

        this.node.position = targetPos;
        Message.dispatchEvent(DragMoveComponent.EventType.DragMove, this.node);
    }

    protected _onTouchEnd(event: EventTouch) {
        this._isDragging = false;
        this._trySnap();
        Message.dispatchEvent(DragMoveComponent.EventType.DragEnd, this.node);
    }

    private _getTouchLocalPos(event: EventTouch): Vec3 {
        const touchPos = event.getUILocation();
        return this.node.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(v3(touchPos.x, touchPos.y, 0));
    }

    private _trySnap() {
        if (this.snapRadius <= 0 || this.snapPoints.length === 0) {
            return;
        }
        let closest: Vec3 | null = null;
        let minDist = Infinity;
        for (const point of this.snapPoints) {
            const dist = Vec3.distance(this.node.position, point);
            if (dist < this.snapRadius && dist < minDist) {
                minDist = dist;
                closest = point;
            }
        }

        if (closest) {
            if (this.useSnapTween) {
                tween(this.node)
                    .to(0.2, { position: closest }, { easing: 'quadOut' })
                    .start();
            } else {
                this.node.setPosition(closest);
            }
        }
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this._onTouchEnd, this);

        this.node.off(Input.EventType.MOUSE_DOWN, this._onTouchStart, this);
        this.node.off(Input.EventType.MOUSE_MOVE, this._onTouchMove, this);
        this.node.off(Input.EventType.MOUSE_UP, this._onTouchEnd, this);
    }
}
