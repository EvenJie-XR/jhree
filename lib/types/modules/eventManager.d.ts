/**
 * 用于管理jhree的一些事件
 */
export declare class EventManager {
    eventList: EventList;
    constructor();
    addEventListener(callback: () => void, eventType: EventType): removeEventListener;
}
declare type removeEventListener = () => void;
declare type EventList = {
    tick: (() => void)[];
};
export declare enum EventType {
    TICK = "tick"
}
export {};
