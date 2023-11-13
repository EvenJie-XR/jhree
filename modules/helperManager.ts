import Stats from 'three/examples/jsm/libs/stats.module';
import { EventType, removeEventListener } from "./eventManager"
import { Jhree } from './jhree';

/**
 * 用于封装一些常用的帮助对象
 * 例如：status性能监控
 */
export class HelperManager {
    status: Stats | undefined
    isEnabledStatus: boolean = false
    private _statusTickEventRemoveCallback: removeEventListener | undefined
    constructor(private jhree: Jhree) {
        
    }
    /**
     * 开启或关闭Status
     * @param enable 是否启用Status
     * @param threeContainer status添加到的three容器
     */
    enableStatus(enable: boolean = true, threeContainer: HTMLDivElement) {
        /*
            移除操作
            1. 移除更新status的tick事件
            2. 移除加入到threeContainer里面的status的dom
            3. 把isEnabledStatus状态属性设置成false
        */
        if(!enable) { // 如果是关闭就判断有没有statusTickEventRemoveCallback如果有就说明之前有启动过
            // 如果没有回调函数就不用管，直接退出整个函数
            if(!this._statusTickEventRemoveCallback) return;

            this._statusTickEventRemoveCallback();
            this._statusTickEventRemoveCallback = undefined;
            // 如果有status对象那么status加入到dom里面的元素也需要移除
            this.status && threeContainer.removeChild(this.status.dom);
            this.isEnabledStatus = false;
            return;
        }

        /*
            启动操作
            1. 判断是否之前初始化过status对象，如果没有就初始化一下
            2. 添加status的dom到threeContainer里面
            3. 添加每帧更新status的函数
            4. 把isEnabledStatus状态属性设置成true
        */
        if(!this.status) { // 如果status未实例化，就先实例化，如果实例化了就直接使用，这里保持单例
            this.status = new (Stats as any)();
        }

        // 如果有更新status的tick函数就说明已经有正在启动的了
        if(this._statusTickEventRemoveCallback) return;

        this.status && threeContainer.appendChild(this.status.dom);
        // 每帧更新status
        this._statusTickEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            this.status?.update();
        }, EventType.TICK);
        this.isEnabledStatus = true;
    }
}