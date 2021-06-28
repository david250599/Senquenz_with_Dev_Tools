import * as THREE           from 'three';


export class SceneD {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.colorMode = 'color';


    }

    load(visualsParameter, colors){
        this.scene.background = colors.backgroundColor;



    }

    onRender(audio, avg){

    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }

        this.geometry.dispose();
        this.material.dispose();
    }

}
