import { _decorator, Component, Node, Vec3, Quat, Enum, UITransform, Sprite, Button, Widget, Label, Layout, assetManager, UIOpacity } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;


// 节点信息结构
interface NodeInfo {
    name: string;
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
    components: { [key: string]: any }; // 组件信息
    children: NodeInfo[]; // 子节点信息
}

@ccclass('SceneOrientationAdapter')
@executeInEditMode
export class SceneOrientationAdapter extends Component {
    // 保存配置
    protected saveConfig: boolean = false;
    // 场景状态索引
    protected stateIndex = 0;
    // 记录的场景信息
    private savedData: Record<number, any> = {}; // 存储多个标识的快照

    @property({ displayName: '保存配置', tooltip: "编辑好页面之后，手动勾选一下保存配置，保存完毕会自动取消勾选" })
    get SaveConfig() {
        return this.saveConfig;
    }

    set SaveConfig(value) {
        this.saveNodeInfo(this.stateIndex)
    }

    @property({ displayName: '适配类型', type: Enum({ "横屏": 0, "横屏-1": 1, "横屏-2": 2, "竖屏": 3, "竖屏-1": 4, "竖屏-2": 5 }) })
    get StateIndex() {
        return this.stateIndex;
    }

    set StateIndex(value) {
        if (this.stateIndex != value) {
            this.stateIndex = value;
            this.restoreNodeInfo(value);
        }
    }

    @property({ displayName: '是否修改SpriteFrame属性' })
    bSpriteFrame: boolean = true;

    @property({ displayName: 'UI配置信息', tooltip: "自动生成的配置", readonly: true })
    uiConfig: string = "{}";

    protected onLoad(): void {
        const rawData = JSON.parse(this.uiConfig);
        for (const key in rawData) {
            if (rawData.hasOwnProperty(key)) {
                this.savedData[Number(key)] = rawData[key];
            }
        }
        this.restoreNodeInfo(this.stateIndex);
    }

    /**
     * 记录当前节点及其子节点的信息
     * @param identifier 标识符
     */
    saveNodeInfo(identifier: number) {
        this.savedData[identifier] = this.recordNode(this.node);
        this.uiConfig = JSON.stringify(this.savedData);
    }

    /**
     * 还原节点信息
     * @param identifier 标识符
     */
    restoreNodeInfo(identifier: number) {
        const nodeInfo = this.savedData[identifier];
        if (nodeInfo) {
            this.applyNodeInfo(this.node, nodeInfo);
        } else {
            console.warn(`当前选项 ${identifier} 没有配置信息！`);
        }
    }

    /**
     * 记录节点信息
     * @param node 当前节点
     * @returns 节点信息
     */
    private recordNode(node: Node): NodeInfo {
        let state: any = {
            name: node.name,
            position: node.getPosition().clone(),
            rotation: node.getRotation().clone(),
            scale: node.getScale().clone(),
            components: {},
            children: []
        };

        // 记录指定组件的信息
        const uiTransform = node.getComponent(UITransform);
        if (uiTransform) {
            state.components.UITransform = {
                anchorX: uiTransform.anchorX,
                anchorY: uiTransform.anchorY,
                contentSize: uiTransform.contentSize.clone()
            };
        }

        const sprite = node.getComponent(Sprite);
        if (sprite) {
            state.components.Sprite = {
                color: sprite.color.clone(),
                sizeMode: sprite.sizeMode,
                spriteFrame: this.spriteState(sprite)
            };
        }

        const button = node.getComponent(Button);
        if (button) {
            state.components.Button = {
                interactable: button.interactable,
                transition: button.transition
            };
        }

        const widget = node.getComponent(Widget);
        if (widget) {
            state.components.Widget = {
                left: widget.left,
                right: widget.right,
                top: widget.top,
                bottom: widget.bottom,
                target: widget.target,
                alignMode: widget.alignMode
            };
        }

        const label = node.getComponent(Label);
        if (label) {
            state.components.Label = {
                string: label.string,
                fontSize: label.fontSize,
                lineHeight: label.lineHeight,
                horizontalAlign: label.horizontalAlign,
                verticalAlign: label.verticalAlign,
                overflow: label.overflow,
                enableWrapText: label.enableWrapText,
            };
        }

        const layout = node.getComponent(Layout);
        if (layout) {
            state.components.Layout = {
                type: layout.type,
                resizeMode: layout.resizeMode,
                alignHorizontal: layout.alignHorizontal,
                alignVertical: layout.alignVertical,
                startAxis: layout.startAxis,
                paddingLeft: layout.paddingLeft,
                paddingRight: layout.paddingRight,
                paddingTop: layout.paddingTop,
                paddingBottom: layout.paddingBottom,
                spacingX: layout.spacingX,
                spacingY: layout.spacingY,
                verticalDirection: layout.verticalDirection,
                horizontalDirection: layout.horizontalDirection,
            };
        }

        const opacity = node.getComponent(UIOpacity);
        if (opacity) {
            state.components.UIOpacity = {
                opacity: opacity.opacity,
            };
        }

        // 遍历子节点
        for (let child of node.children) {
            state.children.push(this.recordNode(child));
        }

        return state;
    }

    /**
     * 应用节点信息
     * @param node 当前节点
     * @param nodeInfo 节点信息
     */
    private applyNodeInfo(node: Node, state: any) {
        node.setPosition(state.position as Vec3);
        node.setRotation(state.rotation);
        node.setScale(state.scale as Vec3);

        // 还原组件信息
        const uiTransform = node.getComponent(UITransform);
        if (uiTransform && state.components.UITransform) {
            uiTransform.anchorX = state.components.UITransform.anchorX;
            uiTransform.anchorY = state.components.UITransform.anchorY;
            uiTransform.contentSize = state.components.UITransform.contentSize;
        }

        const sprite = node.getComponent(Sprite);
        if (sprite && state.components.Sprite) {
            sprite.color = state.components.Sprite.color;
            sprite.sizeMode = state.components.Sprite.sizeMode;
            if (this.bSpriteFrame) {
                this.getSpriteFrame(sprite, state.components.Sprite.spriteFrame);
            }
        }

        const button = node.getComponent(Button);
        if (button && state.components.Button) {
            button.interactable = state.components.Button.interactable;
            button.transition = state.components.Button.transition;
        }

        const widget = node.getComponent(Widget);
        if (widget && state.components.Widget) {
            widget.left = state.components.Widget.left;
            widget.right = state.components.Widget.right;
            widget.top = state.components.Widget.top;
            widget.bottom = state.components.Widget.bottom;
            widget.target = state.components.Widget.target;
            widget.alignMode = state.components.Widget.alignMode;
        }

        const label = node.getComponent(Label);
        if (label && state.components.Label) {
            label.string = state.components.Label.string;
            label.fontSize = state.components.Label.fontSize;
            label.lineHeight = state.components.Label.lineHeight;
            label.horizontalAlign = state.components.Label.horizontalAlign;
            label.verticalAlign = state.components.Label.verticalAlign;
            label.overflow = state.components.Label.overflow;
            label.enableWrapText = state.components.Label.enableWrapText;
        }

        const layout = node.getComponent(Layout);
        if (layout && state.components.Layout) {
            layout.type = state.components.Layout.type;
            layout.resizeMode = state.components.Layout.resizeMode;
            layout.alignHorizontal = state.components.Layout.alignHorizontal;
            layout.alignVertical = state.components.Layout.alignVertical;
            layout.startAxis = state.components.Layout.startAxis;
            layout.paddingLeft = state.components.Layout.paddingLeft;
            layout.paddingRight = state.components.Layout.paddingRight;
            layout.paddingTop = state.components.Layout.paddingTop;
            layout.paddingBottom = state.components.Layout.paddingBottom;
            layout.spacingX = state.components.Layout.spacingX;
            layout.spacingY = state.components.Layout.spacingY;
            layout.verticalDirection = state.components.Layout.verticalDirection;
            layout.horizontalDirection = state.components.Layout.horizontalDirection;
        }

        const opacity = node.getComponent(UIOpacity);
        if (opacity && state.components.UIOpacity) {
            opacity.opacity = state.components.UIOpacity.opacity;
        }

        // 递归还原子节点
        for (let i = 0; i < state.children.length; i++) {
            let subNode = node.getChildByName(state.children[i].name);
            if (subNode) {
                this.applyNodeInfo(subNode, state.children[i]);
            }
        }
    }

    spriteState(sprite: Sprite) {
        let spriteFrame = sprite.spriteFrame;
        let atlas = sprite.spriteAtlas;
        let spriteFramePath = spriteFrame ? spriteFrame.uuid : null;
        let atlasPath = atlas ? atlas.uuid : null;
        let state = {
            spriteFrame: spriteFramePath,
            spriteAtlas: atlasPath
        };
        return JSON.stringify(state);
    }

    getSpriteFrame(sprite: Sprite, spriteState: string) {
        let state = JSON.parse(spriteState);
        if (state.spriteAtlas) {
            assetManager.loadAny([state.spriteAtlas], (err, assets) => {
                if (err) {
                    console.error('加载失败', err);
                    return;
                }
                sprite.spriteAtlas = assets;
            });
        }
        if (state.spriteFrame) {
            assetManager.loadAny([state.spriteFrame], (err, assets) => {
                if (err) {
                    console.error('加载失败', err);
                    return;
                }
                sprite.spriteFrame = assets;
            });
        }
    }
}

