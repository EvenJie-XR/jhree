<template>
	<div class="three-container" ref="threeContainer"></div>
</template>
<script lang="ts" setup>
import {reactive,toRefs,defineComponent, ref, onMounted, onBeforeUnmount} from "vue"
import { Jhree } from "../modules/jhree"
import { EventType } from "../modules/eventManager"
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as THREE from "three"
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader"

const threeContainer = ref();
onMounted(() => {
	const jhree = new Jhree(threeContainer.value);
	jhree.scene.background = new THREE.Color( 0xbfe3dd );
	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	jhree.scene.add( light );
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set(0, 48, 0);
	jhree.scene.add( directionalLight );
	// -------------------------------------------以上是场景初始内容-----------------------------------------
	
	const box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({
		color: '#f00'
	}));
	jhree.scene.add(box);
	jhree.controlsManager.switchTrackballControls();

})
</script>

<style lang="scss" scoped>
.three-container {
	width: 100%;
	height: 100%;
}
</style>
