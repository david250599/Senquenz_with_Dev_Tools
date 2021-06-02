import * as THREE from "three";

export class SceneA{
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
    }

    load(visualsParameter, colors){
        let oAmount     = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize
                           + this.config.minSize;
        let oVertices   = Math.floor(this.config.theMoreTheLes * visualsParameter.hilly *
                          this.config.maxVertices + this.config.maxVertices);
        let spacing     = this.config.theMoreTheLes * visualsParameter.urban *8 +6 + oSize*2;

        this.scene.background = colors.backgroundColor;

        //Setup objects of the Scene
        this.geometry   = new THREE.CircleGeometry(oSize, oVertices);



        this.material   = new THREE.MeshBasicMaterial({color: colors.colorA});

        this.group = new THREE.Group();
        let positionX = 0;
        for(let i = 0; i < oAmount; i++){
            let circle = new THREE.Mesh(this.geometry, this.material);
            circle.position.x = positionX;
            this.group.add(circle);
            positionX += spacing;
        }

        this.scene.add(this.group);
    }

    onRender(speed){
        this.group.rotation.z += speed * 0.5;
        let scale = speed *1 + 1;
        this.group.scale.set(scale, scale, scale);
    }

    delete(){
        this.scene.remove(this.group);
        this.geometry.dispose();
        this.material.dispose();
        this.group = null;
    }
}