import * as THREE from "three";

export class SceneB{
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.angleA = 0;
        this.normalSpeedA =  0.3;
        this.angleB = 0;
        this.normalSpeedB = 0.1;
        this.lastAudio = 0;
    }

    load(visualsParameter, colors){
        let oAmount     = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
                          this.config.maxSize + this.config.minSize;
        let spacing     = this.config.theMoreTheLes * visualsParameter.urban * this.config.spacingMax +
                          this.config.spacingMax + this.config.spacingMin + oSize*2;

        this.scene.background = colors.backgroundColor;

        //Setup objects of the Scene
        if(visualsParameter.hilly <= this.config.makePlane){
            this.geometry = new THREE.PlaneGeometry(oSize*2, oSize*2);
        }else if(visualsParameter.hilly > this.config.makePlane && visualsParameter.hilly <= this.config.makeTriangle){
            this.geometry   = new THREE.CircleGeometry(oSize, 30);
        }else{
            this.geometry   = new THREE.CircleGeometry(oSize, 3);
        }

        this.materialA   = new THREE.MeshBasicMaterial({color: colors.colorA});
        this.materialB   = new THREE.MeshBasicMaterial({color: colors.colorB});

        this.groupA = new THREE.Group();
        let posX = this.config.gridMinX;
        let posY = this.config.gridMinY;

        for(let i = 0; i < oAmount; i++){
            let object = new THREE.Mesh(this.geometry, this.materialA);
            object.position.x = posX;
            object.position.y = posY;
            this.groupA.add(object);

            posX += spacing;
            if(posX > this.config.gidMaxX){
                posX = this.config.gridMinX;
                posY += spacing;
            }
        }

        this.groupB = new THREE.Group();
        posX = this.config.gridMinX + this.config.offset;
        posY = this.config.gridMinY + this.config.offset;
        for(let i = 0; i < oAmount; i++){
            let object = new THREE.Mesh(this.geometry, this.materialB);
            object.position.x = posX;
            object.position.y = posY;
            this.groupB.add(object);

            posX += spacing;
            if(posX > this.config.gidMaxX+ this.config.offset){
                posX = this.config.gridMinX + this.config.offset;
                posY += spacing;
            }
        }

        this.scene.add(this.groupA, this.groupB);
    }

    onRender(audio, avg){
        this.groupA.position.x = Math.cos(this.angleA) * 15;
        this.groupA.position.y = Math.sin(this.angleA) * 15;

        if(audio > 0.6 && audio > this.lastAudio) {
            this.lastAudio = audio;
            this.normalSpeedA = -this.normalSpeedA
        }

        this.angleA += this.normalSpeedA * avg;
        this.lastAudio -= 0.01;


        this.groupB.position.z = Math.cos(this.angleB) * 40;
        this.groupB.position.x = Math.cos(this.angleB) * 15;
        this.groupB.position.y = Math.cos(this.angleB) * 15;

        this.angleB += this.normalSpeedB * avg;


    }

    delete(){
        this.scene.remove(this.groupA);
        this.scene.remove(this.groupB);
        this.geometry.dispose();
        this.materialA.dispose();
        this.materialB.dispose();
        this.groupA = null;
        this.groupB = null;
    }
}