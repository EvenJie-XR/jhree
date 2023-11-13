import { Scene, WebGLRenderer, PerspectiveCamera, sRGBEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * 用于管理jhree的一些事件
 */
class EventManager {
    eventList = {
        tick: []
    };
    constructor() {
    }
    // 添加事件监听函数
    addEventListener(callback, eventType) {
        this.eventList[eventType].push(callback);
        return () => {
            this.eventList[eventType].splice(this.eventList[eventType].indexOf(callback), 1);
        };
    }
}
var EventType;
(function (EventType) {
    EventType["TICK"] = "tick";
})(EventType || (EventType = {}));

class Jhree {
    threeContainer;
    scene = new Scene();
    camera;
    renderer;
    controls;
    eventManager = new EventManager();
    /**
     * 创建three场景
     * @param threeContainer three场景容器
     */
    constructor(threeContainer) {
        this.threeContainer = threeContainer;
        // 初始化renderer的一些设置
        this.renderer = new WebGLRenderer({ antialias: true });
        this.initRendererSetting();
        // 初始化camera的一些设置
        this.camera = new PerspectiveCamera(45, this.threeContainer.clientWidth / this.threeContainer.clientHeight, 0.1, 10000);
        this.initCameraSetting();
        // 初始化controls的一些设置
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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
    initControlsSetting() {
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
    }
    /**
     * 初始化camera的一些配置
     */
    initCameraSetting() {
        // 设置相机尺寸比，防止渲染内容变形
        this.camera.aspect = this.threeContainer.clientWidth / this.threeContainer.clientHeight;
        /*
            渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
            但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
            如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        */
        this.camera.updateProjectionMatrix();
        this.camera.position.set(0, 0, 10);
    }
    /**
     * 初始化renderer的一些配置
     */
    initRendererSetting() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.threeContainer.clientWidth, this.threeContainer.clientHeight);
        this.renderer.outputEncoding = sRGBEncoding;
        this.threeContainer.appendChild(this.renderer.domElement);
    }
    /**
     * 渲染帧函数
     */
    tick() {
        requestAnimationFrame(this.tick.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.eventManager.eventList["tick"].forEach(callback => {
            callback();
        });
    }
    /**
     * three场景适配container
     */
    onContainerResize() {
        // 设置相机尺寸比，防止渲染内容变形
        this.camera.aspect = this.threeContainer.clientWidth / this.threeContainer.clientHeight;
        /*
            渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
            但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
            如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        */
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.threeContainer.clientWidth, this.threeContainer.clientHeight);
    }
}

/**
 * jesium版本号
 */
const version = require("../package.json").version;

export { EventManager, EventType, Jhree, version };
