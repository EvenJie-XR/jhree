import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Jhree } from "./jhree";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
export declare class ControlsManager {
    private jhree;
    controls: TrackballControls | OrbitControls | undefined;
    private _controlsUpdateEventRemoveCallback;
    private _controlsHandleResizeEventRemoveCallback;
    constructor(jhree: Jhree);
    /**
     * 切换到orbit
     */
    switchOrbitControls(): void;
    /**
     * 切换到trackball
     */
    switchTrackballControls(): void;
    /**
     * 移除已存在的controls
     */
    removeControls(): void;
}
