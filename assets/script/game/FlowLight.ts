import { _decorator, Component, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlowLight')
export class FlowLight extends Component {
    @property(Material)
    mat: Material = null!;

    private _time = 0;

    update(dt: number) {
        this._time += dt;
        if (this.mat) {
            this.mat.setProperty('time', this._time);
        }
    }
}