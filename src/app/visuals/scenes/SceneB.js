import * as THREE from "three";

export class SceneB {
    constructor(config) {
        this.config       = config;
        this.scene        = new THREE.Scene();
    }

    load(visualsParameter, colors){
        this.angle         = 0;
        this.normalspeed   = this.config.speedAB;
        this.angleC        = 0;
        this.normalspeedC  = this.config.speedC;
        this.direction     = 1;
        this.timer         = this.config.timer;

        this.oAmount    = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
                          this.config.maxSize + this.config.minSize;

        this.groupA = new THREE.Group();
        this.groupB = new THREE.Group();
        this.groupC = new THREE.Group();

        let colorA, colorB, colorC;
        if(visualsParameter.water > 0.9 && colors.backgroundBW.r === 1){
            this.scene.background = colors.backgroundColor;
            colorA = colors.wColor;
            colorB = colors.randomColorA;
            colorC = colors.randomColorB;
        }else{
            this.scene.background = colors.backgroundBW;
            colorA = colors.randomColorA;
            colorB = colors.randomColorB;
            colorC = colors.fixColor;
        }

        let sizeFactor = this.config.sizeFactor;
        let positionZ  = this.config.positionZ;

        // initialized in a different order for blending setup
        oSize += visualsParameter.hilly * sizeFactor.c;
        this.createCircles(oSize, visualsParameter.urban, colorC, positionZ.c, this.groupC);
        oSize -= visualsParameter.hilly * sizeFactor.b;
        this.createCircles(oSize, visualsParameter.urban, colorB, positionZ.b, this.groupB);
        oSize -= visualsParameter.hilly * sizeFactor.a;
        this.createCircles(oSize, visualsParameter.urban, colorA, positionZ.a, this.groupA);

        this.groupB.rotateZ(this.config.startDegreeB * Math.PI / 180);
        this.groupC.rotateZ(this.config.startDegreeC * Math.PI / 180);

        this.scene.add(this.groupA, this.groupB, this.groupC);
    }

    createCircles(oSize, urban, color, z, group){
        this.geometry  = new THREE.CircleGeometry(oSize, 30);
        this.material  = new THREE.MeshBasicMaterial({color: color, opacity: 0.7});

        // adjust blending if background is to bright
        if(this.scene.background.r === 1 && this.scene.background.g === 1){
            this.material.blennding     = THREE.NormalBlending;
            this.material.transparent   = true;
        }else{
            this.material.blending      = THREE.AdditiveBlending;
            this.material.transparent   = false;
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

    onRender(beat, avg){

        if( beat >= 0.6 && this.timer < 0){
            this.direction = this.direction * -1;
            this.timer = this.config.timer;
        }
        this.timer--;

        let speedR = this.config.speedRotate;
        this.groupA.rotateZ(avg * speedR.a * this.direction);
        this.groupB.rotateZ(- avg * speedR.b * this.direction);
        this.groupC.rotateZ(avg * speedR.c);

        let sizeC = this.config.sizeCircle;
        this.groupA.position.z = Math.cos(this.angle) * sizeC.a;
        this.groupB.position.z = Math.cos(this.angle + 1 ) * sizeC.b;
        this.groupC.position.z = Math.cos(this.angleC) * sizeC.c;

        this.angle += this.normalspeed * avg;
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