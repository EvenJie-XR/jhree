import { Scene, WebGLRenderer, PerspectiveCamera, sRGBEncoding } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

/**
 * 用于管理jhree的一些事件
 */
class EventManager {
    eventList = {
        tick: [],
        resize: []
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
    triggerEvent(name) {
        // @ts-ignore
        this.eventList[name].forEach((callback) => {
            callback();
        });
    }
}
var EventType;
(function (EventType) {
    EventType["TICK"] = "tick";
    EventType["RESIZE"] = "resize";
})(EventType || (EventType = {}));

/**
 * 用于封装一些常用的帮助对象
 * 例如：status性能监控
 */
class HelperManager {
    jhree;
    status;
    isEnabledStatus = false;
    _statusTickEventRemoveCallback;
    constructor(jhree) {
        this.jhree = jhree;
    }
    /**
     * 开启或关闭Status
     * @param enable 是否启用Status
     * @param threeContainer status添加到的three容器
     */
    enableStatus(enable = true, threeContainer) {
        /*
            移除操作
            1. 移除更新status的tick事件
            2. 移除加入到threeContainer里面的status的dom
            3. 把isEnabledStatus状态属性设置成false
        */
        if (!enable) { // 如果是关闭就判断有没有statusTickEventRemoveCallback如果有就说明之前有启动过
            // 如果没有回调函数就不用管，直接退出整个函数
            if (!this._statusTickEventRemoveCallback)
                return;
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
        if (!this.status) { // 如果status未实例化，就先实例化，如果实例化了就直接使用，这里保持单例
            this.status = new Stats();
        }
        // 如果有更新status的tick函数就说明已经有正在启动的了
        if (this._statusTickEventRemoveCallback)
            return;
        this.status && threeContainer.appendChild(this.status.dom);
        // 每帧更新status
        this._statusTickEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            this.status?.update();
        }, EventType.TICK);
        this.isEnabledStatus = true;
    }
}

class ControlsManager {
    jhree;
    controls;
    _controlsUpdateEventRemoveCallback;
    _controlsHandleResizeEventRemoveCallback;
    constructor(jhree) {
        this.jhree = jhree;
    }
    /**
     * 切换到orbit
     */
    switchOrbitControls() {
        /*
            已存在controls的情况下
            1. 移除update controls的tick事件监听
            2. 释放之前的controls
        */
        this.removeControls();
        this.controls = new OrbitControls(this.jhree.camera, this.jhree.renderer.domElement);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
        this._controlsUpdateEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            this.controls?.update();
        }, EventType.TICK);
    }
    /**
     * 切换到trackball
     */
    switchTrackballControls() {
        this.removeControls();
        this.controls = new TrackballControls(this.jhree.camera, this.jhree.renderer.domElement);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this._controlsHandleResizeEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            this.controls.handleResize();
        }, EventType.RESIZE);
        this._controlsUpdateEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            this.controls?.update();
        }, EventType.TICK);
    }
    /**
     * 移除已存在的controls
     */
    removeControls() {
        if (!this.controls)
            return;
        this.controls.dispose();
        this._controlsUpdateEventRemoveCallback && this._controlsUpdateEventRemoveCallback();
        this._controlsHandleResizeEventRemoveCallback && this._controlsHandleResizeEventRemoveCallback();
    }
}

class Jhree {
    threeContainer;
    scene = new Scene();
    camera;
    renderer;
    animationId;
    eventManager = new EventManager(); // 用于事件管理
    helperManager; // 用于一些帮助对象
    controlsManager;
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
        this.animationId = requestAnimationFrame(this.tick.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.eventManager.triggerEvent(EventType.TICK);
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
        this.eventManager.triggerEvent(EventType.RESIZE);
    }
    disposeNode(node, recursive = false) {
        if (!node)
            return;
        if (recursive && node.children)
            for (const child of node.children)
                this.disposeNode(child, recursive);
        node.geometry && node.geometry.dispose();
        if (!node.material)
            return;
        const materials = node.material.length === undefined ? [node.material] : node.material;
        for (const material of materials) {
            for (const key in material) {
                const value = material[key];
                if (value && typeof value === 'object' && 'minFilter' in value)
                    value.dispose();
            }
            material && material.dispose();
        }
    }
    destory() {
        this.disposeNode(this.scene);
        this.scene.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.controlsManager.removeControls();
        this.animationId && cancelAnimationFrame(this.animationId);
        const gl = this.renderer.domElement.getContext('webgl');
        gl && gl.getExtension('WEBGL_lose_context')?.loseContext();
        console.log(this.renderer.info);
    }
}

/**
 * jesium版本号
 */
const version = require("../package.json").version;

export { EventManager, EventType, Jhree, version };
