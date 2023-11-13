import { PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EventManager } from "./eventManager";
import { HelperManager } from "./helperManager"


export class Jhree {
    scene: Scene = new Scene()
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;

    eventManager: EventManager = new EventManager(); // 用于事件管理
    helperManager: HelperManager // 用于一些帮助对象
    /**
     * 创建three场景
     * @param threeContainer three场景容器
     */
    constructor(public threeContainer: HTMLDivElement) {
        // 初始化renderer的一些设置
        this.renderer = new WebGLRenderer({antialias: true});
        this.initRendererSetting();

        // 初始化camera的一些设置
        this.camera = new PerspectiveCamera(45, this.threeContainer.clientWidth / this.threeContainer.clientHeight, 0.1, 10000);
        this.initCameraSetting();

        // 初始化controls的一些设置
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.initControlsSetting();

        this.renderer.render(this.scene, this.camera);
        // 开始渲染场景
        this.tick();
        // three场景适配container
        this.threeContainer.addEventListener("resize", this.onContainerResize.bind(this));


    }
    /**
     * 初始化controls的一些配置
     */
    private initControlsSetting() {
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
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
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.eventManager.eventList["tick"].forEach(callback => {
            callback();
        })
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
    }
}