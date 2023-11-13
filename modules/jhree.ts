import { PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EventManager, EventType } from "./eventManager";
import { HelperManager } from "./helperManager"
import { ControlsManager } from "./controlsManager"


export class Jhree {
    scene: Scene = new Scene()
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;

    eventManager: EventManager = new EventManager(); // 用于事件管理
    helperManager: HelperManager // 用于一些帮助对象
    controlsManager: ControlsManager
    /**
     * 创建three场景
     * @param threeContainer three场景容器
     */
    constructor(protected threeContainer: HTMLDivElement) {
        // 初始化renderer的一些设置
        this.renderer = new WebGLRenderer({antialias: true});
        this.initRendererSetting();

        // 初始化camera的一些设置
        this.camera = new PerspectiveCamera(45, this.threeContainer.clientWidth / this.threeContainer.clientHeight, 0.1, 10000);
        this.initCameraSetting();

        this.renderer.render(this.scene, this.camera);
        // 开始渲染场景
        this.tick();
        // three场景适配container
        window.addEventListener("resize", this.onContainerResize.bind(this));

        // 初始化manager
        this.helperManager = new HelperManager(this);
        this.controlsManager = new ControlsManager(this);
    }
    /**
     * 初始化camera的一些配置
     */
    private initCameraSetting() {
        // 设置相机尺寸比，防止渲染内容变形
        this.camera.aspect = this.threeContainer.clientWidth / this.threeContainer.clientHeight;
        /*
            渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
            但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
            如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        */
        this.camera.updateProjectionMatrix();
        this.camera.position.set( 0, 0, 10 );
    }
    /**
     * 初始化renderer的一些配置
     */
    private initRendererSetting() {
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.threeContainer.clientWidth, this.threeContainer.clientHeight );
        this.renderer.outputEncoding = sRGBEncoding;
        this.threeContainer.appendChild( this.renderer.domElement );
    }
    /**
     * 渲染帧函数
     */
    private tick() {
        requestAnimationFrame(this.tick.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.eventManager.triggerEvent(EventType.TICK);
    }
    /**
     * three场景适配container
     */
    private onContainerResize() {
        // 设置相机尺寸比，防止渲染内容变形
        this.camera.aspect = this.threeContainer.clientWidth / this.threeContainer.clientHeight;
        /*
            渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
            但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
            如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        */
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.threeContainer.clientWidth, this.threeContainer.clientHeight );
        this.eventManager.triggerEvent(EventType.RESIZE);
    }
}