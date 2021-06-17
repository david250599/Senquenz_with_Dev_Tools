import * as THREE from "three";

export class SceneB{
    constructor(config) {
        this.config         = config;
        this.scene          = new THREE.Scene();
        this.colorMode      = 'sw';

        this.angle          = 0;
        this.normalSpeed    = 0.2;
        this.lastAudio      = 0;
        this.timeOut        = 0;
        this.rotate         = false;
        this.targetDegree   = 45;
        this.currentDegree  = 0;
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
            this.geometry   = new THREE.PlaneGeometry(oSize*2, oSize*2);
        }else if(visualsParameter.hilly > this.config.makePlane && visualsParameter.hilly <= this.config.makeTriangle){
            this.geometry   = new THREE.CircleGeometry(oSize, 30);
        }else{
            this.geometry   = new THREE.CircleGeometry(oSize, 3);
        }

        this.materialA   = new THREE.MeshBasicMaterial({color: colors.colorB});
        this.materialB   = new THREE.MeshBasicMaterial({color: colors.colorA});
        this.materialA.side = THREE.DoubleSide;
        this.materialB.side = THREE.DoubleSide;


        if( visualsParameter.brightness < 0.5){
            this.materialA.blending      = THREE.AdditiveBlending;
            this.materialB.blending      = THREE.AdditiveBlending;
        }


        /* Color mode
        // adjust blending if background is to bright
        if ( visualsParameter.brightness <= 0.8){
            this.materialA.blending      = THREE.AdditiveBlending;
            this.materialB.blending      = THREE.AdditiveBlending;
        }else if(visualsParameter.brightness > 0.8){
            this.materialA.opacity       = 0.7;
            this.materialA.transparent   = true;
            this.materialB.opacity       = 0.7;
            this.materialB.transparent   = true;
        }
*/




        this.groupA = new THREE.Group();
        this.groupB = new THREE.Group();

        this.createGrid(this.geometry,
                        this.materialA,
                        colors.colorC,
                        false,
                        this.config.gridMinX,
                        this.config.gridMinY,
                    -1,
                        oAmount,
                        spacing,
                        this.config.gidMaxX,
                        this.config.gridMinX,
                        this.groupA);

        this.createGrid(this.geometry,
                        this.materialB,
                        colors.colorC,
                    false,
                    this.config.gridMinX + this.config.offset,
                    this.config.gridMinY + this.config.offset,
                    0,
                        oAmount,
                        spacing,
                    this.config.gidMaxX + this.config.offset,
                    this.config.gridMinX + this.config.offset,
                        this.groupB);


        this.scene.add(this.groupA, this.groupB);
    }

    createGrid(geometry, material, colorOutline, createOutline, posX, posY, posZ, oAmount, spacing, maxX, minX, group){
        let outlineMaterial = new THREE.MeshBasicMaterial( { color: colorOutline} );


        for(let i = 0; i < oAmount; i++){
            let object = new THREE.Mesh(geometry, material);
            object.renderOrder = 1;
            object.position.x = posX;
            object.position.y = posY;
            object.position.z = posZ;

            group.add(object);

            if(createOutline){
                let outlineMesh = new THREE.Mesh( geometry, outlineMaterial );
                outlineMesh.position.x = object.position.x;
                outlineMesh.position.y = object.position.y;
                outlineMesh.position.z = object.position.z;

                outlineMesh.scale.multiplyScalar(1.1);
                group.add(outlineMesh);
            }





            posX += spacing;
            if(posX > maxX){
                posX = minX;
                posY += spacing;
            }
        }
    }

    onRender(audio, avg){
        this.groupA.position.x = Math.cos(this.angle) * 15;
        this.groupA.position.y = Math.sin(this.angle) * 15;
        this.groupB.position.x = Math.cos(-this.angle) * 15;
        this.groupB.position.y = Math.sin(-this.angle) * 15;

        //Reverse after beat
        if(audio > 0.8 && audio > this.lastAudio) {
            this.lastAudio = audio;
            this.normalSpeed = -this.normalSpeed
        }
        this.angle      += this.normalSpeed * avg;
        this.lastAudio  -= 0.01;


        // Rotate Objects
        if(avg > 0.25 && this.timeOut < 0){
            this.rotate   = true;
            this.timeOut  = 500;

        }
        if(this.rotate && this.currentDegree <= this.targetDegree){
            let array = this.groupA.children;
            array.forEach(element => {
                if(element instanceof THREE.Mesh){
                    element.rotateZ(avg * Math.PI / 180);
                }
            });
            array = this.groupB.children;
            array.forEach(element => {
                if(element instanceof THREE.Mesh){
                    element.rotateZ(-avg * Math.PI / 180);
                }
            })

            this.currentDegree += avg;


        }else if(this.currentDegree >= this.targetDegree){
            this.rotate = false;
            this.currentDegree = 0;
        }

        this.timeOut --;

        /*
        this.groupB.position.z = Math.cos(this.angleB) * 40;
        this.groupB.position.x = Math.cos(this.angleB) * 15;
        this.groupB.position.y = Math.cos(this.angleB) * 15;
        this.angleB += this.normalSpeedB * avg;
*/

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