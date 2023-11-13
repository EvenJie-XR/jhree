import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EventManager } from "./eventManager";
export declare class Jhree {
    threeContainer: HTMLDivElement;
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;
    eventManager: EventManager;
    /**
     * 创建three场景
     * @param threeContainer three场景容器
     */
    constructor(threeContainer: HTMLDivElement);
    /**
     * 初始化controls的一些配置
     */
    private initControlsSetting;
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
