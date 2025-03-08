import { _decorator } from 'cc';
import { NetNode } from '../../../../extensions/game-framwork/assets/net/NetNode';
const { ccclass, property } = _decorator;


export class CommonProtocol {
    //网络节点
    private netNode: NetNode | null = null;

    set NetNode(node: NetNode) {
        this.netNode = node;
    }

    get NetNode() {
        return this.NetNode;
    }
}


