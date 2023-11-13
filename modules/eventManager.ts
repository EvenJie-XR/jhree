
/**
 * 用于管理jhree的一些事件
 */
export class EventManager {
    eventList: EventList = {
        tick: [] as unknown as (() => void)[]
    }
    constructor() {
        
    }
    // 添加事件监听函数
    addEventListener(callback: () => void, eventType: EventType): removeEventListener {
        this.eventList[eventType].push(callback);
        return () => {
            this.eventList[eventType].splice(this.eventList[eventType].indexOf(callback), 1);
        }
    }
}

type removeEventListener = () => void;

type EventList = {
    tick: (() => void)[]
}

export enum EventType {
    TICK = "tick"
}