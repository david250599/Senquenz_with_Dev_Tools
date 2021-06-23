import * as THREE from "three";

export class SceneA {
    constructor(config) {
        this.config         = config;
        this.scene          = new THREE.Scene();
        this.colorMode      = 'sw';
    }

    load(visualsParameter, colors){
        this.angle          = 0;
        this.normalSpeed    = 0.2;
        this.lastAudio      = 0;
        this.timeOut        = 0;
        this.rotate         = false;
        this.targetDegree   = 45;
        this.currentDegree  = 0;

        let oAmount     = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
                          this.config.maxSize + this.config.minSize;
        let spacing     = this.config.theMoreTheLes * visualsParameter.urban * this.config.spacingMax +
                          this.config.spacingMax + this.config.spacingMin + oSize*2;

        this.scene.background = colors.backgroundColor;



        //Setup geometry of the Objects
        if(visualsParameter.hilly <= this.config.makePlane){
            this.geometry   = new THREE.PlaneGeometry(oSize*2, oSize*2);
        }else if(visualsParameter.hilly > this.config.makePlane && visualsParameter.hilly <= this.config.makeTriangle){
            this.geometry   = new THREE.CircleGeometry(oSize, 35);
        }else{
            this.geometry   = new THREE.CircleGeometry(oSize, 3);
        }

        this.material   = new THREE.MeshBasicMaterial({ color: colors.colorA,
                                                                  blending: THREE.NoBlending,
                                                                  opacity: 0.7,
                                                                  transparent: true});

        if( visualsParameter.brightness < 0.3 && this.colorMode === 'sw'){
            this.material.blending      = THREE.AdditiveBlending;
        }

        this.groupA = new THREE.Group();
        this.groupB = new THREE.Group();

        this.createGrid(this.geometry,
                        this.material,
                        this.config.gridMinX,
                        this.config.gridMinY,
                    1,
                        oAmount,
                        spacing,
                        this.config.gidMaxX,
                        this.config.gridMinX,
                        this.groupA);

        this.createGrid(this.geometry,
                        this.material,
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

    createGrid(geometry, material, posX, posY, posZ, oAmount, spacing, maxX, minX, group){

        for(let i = 0; i < oAmount; i++){
            let object = new THREE.Mesh(geometry, material);
            object.position.x = posX;
            object.position.y = posY;
            object.position.z = posZ;

            group.add(object);

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

    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
        this.geometry.dispose();
        this.material.dispose();
        this.groupA = null;
        this.groupB = null;
    }

}