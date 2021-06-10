import * as THREE from "three";
import {color} from "three/examples/jsm/libs/dat.gui.module";

export class SceneC {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();

        this.lastAudio = 0;
        this.targetC = 1;
        this.scaleC = 1;
        this.scaleSpeed = 0.01;
        this.angle = 0;
        this.normalspeedZ = 0.2;

    }

    load(visualsParameter, colors){
        this.scene.background = colors.backgroundColor;

        this.oAmount    = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
                          this.config.maxSize + this.config.minSize;

        this.groupA = new THREE.Group();
        this.groupB = new THREE.Group();
        this.groupC = new THREE.Group();

        this.createCircles(oSize, visualsParameter.urban, colors.colorA, 0, this.groupA);
        oSize += visualsParameter.hilly*15;
        this.createCircles(oSize, visualsParameter.urban, colors.colorB, -10, this.groupB);
        oSize += visualsParameter.hilly*15;
        this.createCircles(oSize, visualsParameter.urban, colors.colorC, -20, this.groupC);

        this.groupB.rotateZ(60 * Math.PI / 180);
        this.groupC.rotateZ(120 * Math.PI / 180);

        this.scene.add(this.groupA, this.groupB, this.groupC);
    }

    createCircles(oSize, urban, color, z, group){
        this.geometry  = new THREE.CircleGeometry(oSize, 30);
        this.material  = new THREE.MeshBasicMaterial({color: color, opacity: 0.7, transparent: true});

        let spacing    = this.config.theMoreTheLes * urban * this.config.spacingMax +
                         this.config.spacingMax + this.config.spacingMin + oSize*2;
        let angle = 0;
        let circleSize = oSize + spacing/4;

        let angleStep = Math.floor(oSize*3);
        while (360 % angleStep !== 0){
            angleStep++;
        }

        for(let i = 0; i < this.oAmount; i++){
            let object = new THREE.Mesh(this.geometry, this.material);
            object.position.x = Math.cos(angle * Math.PI / 180) * circleSize;
            object.position.y = Math.sin(angle * Math.PI / 180) * circleSize;
            object.position.z = z;
            angle += angleStep;
            group.add(object);

            if(angle >= 360){
                angle = 0;
                circleSize += spacing;
            }
        }
    }

    onRender(audio, avg){
        this.groupA.rotateZ(audio * 0.03);
        this.groupB.rotateZ(- audio * 0.03);

        this.groupC.rotateZ(avg * 0.02);

        this.groupA.position.z = Math.cos(this.angle) * 10;
        this.groupB.position.z = Math.cos(this.angle + 1) *15;
        this.groupC.position.z = Math.cos(this.angle + 2) * 10;

        this.angle += this.normalspeedZ * avg;





        /*
        let x = Math.sign(this.deltaScale);
        this.deltaScale = x * 0.0001 + avg/4 * x;
        if(this.scaleC < 0.5 || this.scaleC > 15){
            this.deltaScale = -this.deltaScale;
        }
        this.scaleC += this.deltaScale;
        this.groupC.scale.set(this.scaleC, this.scaleC, this.scaleC);

         */
    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
        this.geometry.dispose();
        this.material.dispose();

    }
}