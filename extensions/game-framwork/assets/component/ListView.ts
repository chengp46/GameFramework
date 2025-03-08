import { _decorator, Component, Node, ScrollView, Prefab, instantiate, Vec3, UITransform, Vec2, Pool, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ListView')
export class ListView extends Component {
    @property(ScrollView) 
    scrollView: ScrollView = null!;
    
    @property(Prefab) 
    itemPrefab: Prefab = null!;

    @property(Node) 
    content: Node = null!;

    private itemHeight: number = 0; // 单个Item高度
    private visibleItemCount: number = 0; // 可见的Item数量
    private itemPool: Pool<Node> = null; // 对象池
    private items: Node[] = []; // 当前显示的Item
    private data: any[] = []; // 数据源
    private startIndex: number = 0; // 记录当前第一个Item的索引

    onLoad() {
        this.scrollView.node.on('scrolling', this.onScroll, this);
        this.initItemHeight();

        this.itemPool = new Pool(() => instantiate(this.itemPrefab), this.visibleItemCount + 1);
    }

    /** 初始化Item高度 */
    private initItemHeight() {
        const tempItem = instantiate(this.itemPrefab);
        this.itemHeight = tempItem.getComponent(UITransform)!.height;
        tempItem.destroy();
        this.calculateVisibleItemCount();
    }

    /** 计算可见Item数量 */
    private calculateVisibleItemCount() {
        const viewHeight = this.scrollView.node.getComponent(UITransform)!.height;
        this.visibleItemCount = Math.ceil(viewHeight / this.itemHeight) + 1; // 多加1行防止空白
    }

    /** 设置数据 */
    public setData(data: any[]) {
        this.data = data;
        this.startIndex = 0;
        this.content.removeAllChildren();
        this.items.forEach(item => this.itemPool.free(item));
        this.items = [];

        const totalHeight = this.data.length * this.itemHeight;
        this.content.getComponent(UITransform)!.height = totalHeight;

        this.spawnVisibleItems();
    }

    /** 生成可见Item */
    private spawnVisibleItems() {
        for (let i = 0; i < Math.min(this.visibleItemCount, this.data.length); i++) {
            this.createItem(i);
        }
    }

    /** 创建Item */
    private createItem(index: number) {
        let item = this.itemPool.alloc();
        item.setParent(this.content);
        this.updateItem(item, index);
        this.items.push(item);
    }

    /** 更新Item */
    private updateItem(item: Node, index: number) {
        item.setPosition(0, -index * this.itemHeight, 0);
        // 这里可以自定义更新Item的逻辑，例如设置Label
        item.getChildByName('Label')!.getComponent(Label)!.string = `Item ${index}`;
    }

    /** 监听滚动 */
    private onScroll() {
        const scrollOffset = this.scrollView.getScrollOffset().y;
        const newStartIndex = Math.floor(scrollOffset / this.itemHeight);

        if (newStartIndex !== this.startIndex) {
            this.startIndex = newStartIndex;
            this.updateVisibleItems();
        }
    }

    /** 更新可见Item */
    private updateVisibleItems() {
        for (let i = 0; i < this.items.length; i++) {
            const newIndex = this.startIndex + i;
            if (newIndex < this.data.length) {
                this.updateItem(this.items[i], newIndex);
            } else {
                this.items[i].active = false;
            }
        }
    }
}
