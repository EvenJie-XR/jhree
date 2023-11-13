import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Jhree } from "./jhree"
import { removeEventListener, EventType } from "./eventManager"
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export class ControlsManager {
    controls: TrackballControls | OrbitControls | undefined
    private _controlsUpdateEventRemoveCallback: removeEventListener | undefined
    private _controlsHandleResizeEventRemoveCallback: removeEventListener | undefined
    constructor(private jhree: Jhree) {

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

        this.controls = new OrbitControls( this.jhree.camera, this.jhree.renderer.domElement );
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
        this._controlsUpdateEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            this.controls?.update();
        }, EventType.TICK)
    }
    /**
     * 切换到trackball
     */
    switchTrackballControls() {
        this.removeControls();

        this.controls = new TrackballControls( this.jhree.camera, this.jhree.renderer.domElement );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this._controlsHandleResizeEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            (this.controls as TrackballControls).handleResize();
        }, EventType.RESIZE)
        this._controlsUpdateEventRemoveCallback = this.jhree.eventManager.addEventListener(() => {
            this.controls?.update();
        }, EventType.TICK)
    }
    /**
     * 移除已存在的controls
     */
    removeControls() {
        if(!this.controls) return;
        this.controls.dispose();
        this._controlsUpdateEventRemoveCallback && this._controlsUpdateEventRemoveCallback();
        this._controlsHandleResizeEventRemoveCallback && this._controlsHandleResizeEventRemoveCallback();
    }
}