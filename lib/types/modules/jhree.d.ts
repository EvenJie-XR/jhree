import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { EventManager } from "./eventManager";
import { HelperManager } from "./helperManager";
import { ControlsManager } from "./controlsManager";
export declare class Jhree {
    protected threeContainer: HTMLDivElement;
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    eventManager: EventManager;
    helperManager: HelperManager;
    controlsManager: ControlsManager;
    /**
     * 创建three场景
     * @param threeContainer three场景容器
     */
    constructor(threeContainer: HTMLDivElement);
    /**
     * 初始化camera的一些配置
     */
    private initCameraSetting;
    /**
     * 初始化renderer的一些配置
     */
    private initRendererSetting;
    /**
     * 渲染帧函数
     */
    private tick;
    /**
     * three场景适配container
     */
    private onContainerResize;
}
