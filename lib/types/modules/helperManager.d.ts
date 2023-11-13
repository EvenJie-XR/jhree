import Stats from 'three/examples/jsm/libs/stats.module';
import { Jhree } from './jhree';
/**
 * 用于封装一些常用的帮助对象
 * 例如：status性能监控
 */
export declare class HelperManager {
    private jhree;
    status: Stats | undefined;
    isEnabledStatus: boolean;
    private _statusTickEventRemoveCallback;
    constructor(jhree: Jhree);
    /**
     * 开启或关闭Status
     * @param enable 是否启用Status
     * @param threeContainer status添加到的three容器
     */
    enableStatus(enable: boolean | undefined, threeContainer: HTMLDivElement): void;
}
