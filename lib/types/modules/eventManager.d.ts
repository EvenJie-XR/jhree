/**
 * 用于管理jhree的一些事件
 */
export declare class EventManager {
    eventList: EventList;
    constructor();
    addEventListener(callback: () => void, eventType: EventType): removeEventListener;
    triggerEvent(name: String): void;
}
export declare type removeEventListener = () => void;
declare type EventList = {
    tick: (() => void)[];
    resize: (() => void)[];
};
export declare enum EventType {
    TICK = "tick",
    RESIZE = "resize"
}
export {};
