import * as THREE           from 'three';

import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils.js';

export class SceneD {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.colorMode = 'sw';


    }

    load(visualsParameter, colors){


    }

    onRender(audio, avg){

    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
    }

}
