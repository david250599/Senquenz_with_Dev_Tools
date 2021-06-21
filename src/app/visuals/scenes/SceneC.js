import * as THREE           from 'three';


export class SceneC {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.colorMode = 'color';


    }

    load(visualsParameter, colors){

        this.scene.background = colors.backgroundColor;

        let oAmount = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize   = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
                      this.config.maxSize + this.config.minSize;
        let probability = this.config.theMoreTheLes * visualsParameter.urban * 0.6 + 0.6 - 0.1;

        this.groupA = new THREE.Group();
        this.groupB = new THREE.Group();

        this.materialA = new THREE.LineBasicMaterial({color: colors.colorA, linewidth: 15});
        this.materialB = new THREE.LineBasicMaterial({color: colors.colorB, linewidth: 15});

        let downPoints = [];
        let upPoints = [];


        // Setup object geometry
        if(visualsParameter.hilly <= this.config.makePlane){
            // Straight
            downPoints.push( new THREE.Vector3( -1,  1, 0));
            downPoints.push( new THREE.Vector3( 0,  0, 0));
            downPoints.push( new THREE.Vector3( 1, -1 , 0));
            this.geometrydown = new THREE.BufferGeometry().setFromPoints(downPoints);

            upPoints.push( new THREE.Vector3( -1, -1, 0));
            upPoints.push( new THREE.Vector3( 1,  1, 0 ));
            this.geometryup = new THREE.BufferGeometry().setFromPoints(upPoints);

        }else if(visualsParameter.hilly > this.config.makePlane && visualsParameter.hilly <= this.config.makeTriangle){
            //Curved
            let curveDown = new THREE.CatmullRomCurve3( [
                new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(0.5, 0.5, 0),
                new THREE.Vector3( 1, -1, 0)
            ]);
            let points = curveDown.getPoints(10);
            this.geometrydown = new THREE.BufferGeometry().setFromPoints(points);

            let curveUp = new THREE.CatmullRomCurve3( [
                new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-0.5, 0.5, 0),
                new THREE.Vector3( 1, 1, 0)
            ]);
            points = curveUp.getPoints(10);
            this.geometryup = new THREE.BufferGeometry().setFromPoints(points);

        }else{
            //Zic Zac
            downPoints.push( new THREE.Vector3( -1,  1, 0));
            downPoints.push( new THREE.Vector3( Math.random(),  0.6, 0));
            downPoints.push( new THREE.Vector3( Math.random(),  -0.6, 0));
            downPoints.push( new THREE.Vector3( 1, -1 , 0));
            this.geometrydown = new THREE.BufferGeometry().setFromPoints(downPoints);

            upPoints.push( new THREE.Vector3( -1, -1, 0));
            upPoints.push( new THREE.Vector3( Math.random(), -0.6, 0));
            upPoints.push( new THREE.Vector3( Math.random(), 0.6, 0));
            upPoints.push( new THREE.Vector3( 1,  1, 0 ));
            this.geometryup = new THREE.BufferGeometry().setFromPoints(upPoints);

        }



        let posX = -200;
        let posY = -100;
        let posZ = 0;

        let maxX = 200;
        let minX = -200;

        for(let i = 0; i < oAmount; i++){
           let line;

           //Switch between patterns
            if(Math.random() < probability){
                line = new THREE.Line(this.geometryup, this.materialA);
                this.groupA.add(line);
            }else{
                line = new THREE.Line(this.geometrydown, this.materialB);
                this.groupB.add(line);
            }

            line.scale.multiplyScalar(oSize);

            line.position.set(posX, posY, posZ);

            posX += oSize *2;

            if(posX >= maxX){
                posY += oSize * 2;
                posX = minX;
            }

        }

        this.scene.add(this.groupA, this.groupB);


    }

    onRender(audio, avg){





        /*
        let array = this.groupA.children;
        array.forEach(element =>{
            if(element instanceof THREE.Line){
                element.rotateZ(0.01);
            }
        })

        array = this.groupB.children;
        array.forEach(element =>{
            if(element instanceof THREE.Line){
                element.rotateZ(-0.01);
            }
        })
*/

    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
        this.geometryup.dispose();
        this.geometrydown.dispose();
        this.materialA.dispose();
        this.materialB.dispose();
    }

}