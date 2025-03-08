import { log, warn } from "cc";

type ListenerFunc = (event: string | number, ...args: any) => void;

class EventData {
  event!: string | number;
  listener!: ListenerFunc;
  object: any;
  order: number;
}

export class MessageManager {
  static instance = new MessageManager;
  private events: Map<string | number, Array<EventData>> = new Map();

  protected constructor() {

  }

  /**
   * 注册全局事件
   * @param event      事件名
   * @param listener   处理事件的侦听器函数
   * @param object     侦听函数绑定的作用域对象
   * @param order      事件排序,值小的先触发
   */
  on(event: string | number, listener: ListenerFunc, object: object, order: number = 0) {
    if (!event || !listener) {
      warn(`注册【${event}】事件的侦听器函数为空`);
      return;
    }

    let eds = this.events.get(event);
    if (eds == null) {
      eds = [];
      this.events.set(event, eds);
    }

    let length = eds.length;
    for (let i = 0; i < length; i++) {
      let bin = eds[i];
      if (bin.listener == listener && bin.object == object) {
        warn(`名为【${event}】的事件重复注册侦听器`);
      }
    }

    let data: EventData = new EventData();
    data.event = event;
    data.listener = listener;
    data.object = object;
    data.order = order;
    eds.push(data);
    if (0 != order) {
      eds.sort((a: EventData, b: EventData) => a.order - b.order);
    }
  }

  /**
   * 监听一次事件，事件响应后，该监听自动移除
   * @param event     事件名
   * @param listener  事件触发回调方法
   * @param object    侦听函数绑定的作用域对象
   */
  once(event: string | number, listener: ListenerFunc, object: object) {
    let _listener: any = ($event: string, ...$args: any) => {
      this.off(event, _listener, object);
      _listener = null;
      listener.call(object, $event, $args);
    };
    this.on(event, _listener, object);
  }

  /**
   * 移除全局事件
   * @param event     事件名
   * @param listener  处理事件的侦听器函数
   * @param object    侦听函数绑定的作用域对象
   */
  off(event: string | number, listener: Function, object: object) {
    let eds = this.events.get(event);

    if (!eds) {
      log(`名为【${event}】的事件不存在`);
      return;
    }

    let length = eds.length;
    for (let i = 0; i < length; i++) {
      let bin: EventData = eds[i];
      if (bin.listener == listener && bin.object == object) {
        eds.splice(i, 1);
        break;
      }
    }

    if (eds.length == 0) {
      this.events.delete(event);
    }
  }

  /**
   * 移除对象上所有注册事件
   * @param object 侦听函数绑定的作用域对象
   */
  offAll(object: object) {
    this.events.forEach((item, key) => {
      item = item.filter((value) => object != value.object);
      if (item.length == 0) {
        this.events.delete(key);
      } else {
        this.events.set(key, item);
      }
    });
  }

  /**
   * 触发全局事件
   * @param event      事件名
   * @param args       事件参数
   */
  dispatchEvent(event: string | number, ...args: any) {
    let list = this.events.get(event);
    if (list != null) {
      let eds: Array<EventData> = list.concat();
      let length = eds.length;
      for (let i = 0; i < length; i++) {
        let eventBin = eds[i];
        eventBin.listener.call(eventBin.object, event, ...args);
      }
    }
  }
}

export const Message = MessageManager.instance;
