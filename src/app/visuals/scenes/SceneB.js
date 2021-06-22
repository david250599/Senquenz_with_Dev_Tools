import * as THREE from "three";

export class SceneB {
    constructor(config) {
        this.config       = config;
        this.scene        = new THREE.Scene();
        this.colorMode    = 'sw';

        this.angle        = 0;
        this.normalspeedZ = 0.2;
        this.angleC        = 0;
        this.normalspeedC = 0.1;

    }

    load(visualsParameter, colors){
        this.visualsParameter = visualsParameter;
        this.scene.background = colors.backgroundColor;

        this.oAmount    = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
                          this.config.maxSize + this.config.minSize;

        this.groupA = new THREE.Group();
        this.groupB = new THREE.Group();
        this.groupC = new THREE.Group();

        oSize += visualsParameter.hilly*30;
        this.createCircles(oSize, visualsParameter.urban, colors.colorA, -50, this.groupC);
        oSize -= visualsParameter.hilly*15;
        this.createCircles(oSize, visualsParameter.urban, colors.colorB, 0, this.groupB);
        oSize -= visualsParameter.hilly*15;
        this.createCircles(oSize, visualsParameter.urban, colors.colorC, 10, this.groupA);

        this.groupB.rotateZ(60 * Math.PI / 180);
        this.groupC.rotateZ(120 * Math.PI / 180);

        this.scene.add(this.groupA, this.groupB, this.groupC);
    }

    createCircles(oSize, urban, color, z, group){
        this.geometry  = new THREE.CircleGeometry(oSize, 30);
        this.material  = new THREE.MeshBasicMaterial({color: color, opacity: 0.7});

        // adjust blending if background is to bright
        if(this.colorMode === 'color'){
            if ( this.visualsParameter.brightness <= 0.8){
                this.material.blending      = THREE.AdditiveBlending;
                this.material.transparent   = false;
            }else if(this.visualsParameter.brightness > 0.8){
                this.material.blending      = THREE.NormalBlending;
                this.material.transparent   = true;
            }
        }

        if(this.colorMode === 'sw'){
            if(this.visualsParameter.brightness > 0.3){
                this.material.blennding     = THREE.NormalBlending;
                this.material.transparent   = true;
            }else{
                this.material.blending      = THREE.AdditiveBlending;
                this.material.transparent   = false;
            }

        }

        let spacing     = this.config.theMoreTheLes * urban * this.config.spacingMax +
                          this.config.spacingMax + this.config.spacingMin + oSize*2;
        let angle       = 0;
        let circleSize  = oSize + spacing/4;

        let angleStep   = Math.floor(oSize*3);
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
        this.groupB.position.z = Math.cos(this.angle +1 ) * 10;
        this.groupC.position.z = Math.cos(this.angleC) * 50;

        this.angle += this.normalspeedZ * avg;
        this.angleC += this.normalspeedC * avg;
    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
        this.geometry.dispose();
        this.material.dispose();
    }
}