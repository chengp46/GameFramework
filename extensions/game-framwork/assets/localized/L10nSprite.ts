import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple } = _decorator;

@ccclass('L10nSprite')
@requireComponent(Sprite)
@executeInEditMode
@disallowMultiple
export class L10nSprite extends Component {

    start() {

    }

    update(deltaTime: number) {

    }
}


