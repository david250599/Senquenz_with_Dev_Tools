import * as THREE           from 'three';


export class SceneC {
    constructor(config) {
        this.config    = config;
        this.scene     = new THREE.Scene();
    }

    load(visualsParameter, colors){
        this.timerRotation    = 0;
        this.rotate           = false;
        this.reset            = false;
        this.targetDegree     = this.config.targetDegree;
        this.currentDegree    = 0;
        this.switch           = false;
        this.timerSwitch      = this.config.timerSwitch;


        let oAmount     = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
                          this.config.maxSize + this.config.minSize;
        let probability = this.config.theMoreTheLes * visualsParameter.urban * this.config.maxProb +
                          this.config.maxProb + this.config.minProb;


        this.groupA    = new THREE.Group();
        this.groupB    = new THREE.Group();


        if(visualsParameter.water > 0.9 && colors.backgroundBW.r === 1){
            this.scene.background = colors.backgroundColor;
            this.materialA        = new THREE.MeshBasicMaterial({color: colors.wColor});
            this.materialB        = new THREE.MeshBasicMaterial({color: colors.wColor});
        }else{
            this.scene.background = colors.backgroundBW;
            this.materialA        = new THREE.MeshBasicMaterial({color: colors.randomColorB});
            this.materialB        = new THREE.MeshBasicMaterial({color: colors.fixColor});
        }





        let downPoints = [];
        let upPoints   = [];
        let depth      = 0.1;
        let thickness  = 0.1;

        // Setup object geometry
        if(visualsParameter.hilly <= this.config.makePlane){
            // Straight
            downPoints.push( new THREE.Vector2( -1,  1));
            downPoints.push( new THREE.Vector2( 1, -1));
            downPoints.push( new THREE.Vector2( 1 + thickness, -1 + thickness));
            downPoints.push( new THREE.Vector2( -1 + thickness, 1 + thickness));

            upPoints.push( new THREE.Vector2( -1,  -1));
            upPoints.push( new THREE.Vector2( 1, 1));
            upPoints.push( new THREE.Vector2( 1 - thickness, 1 + thickness));
            upPoints.push( new THREE.Vector2( -1 - thickness, -1 + thickness));

        }else if(visualsParameter.hilly > this.config.makePlane && visualsParameter.hilly <= this.config.makeTriangle){
            //Curved
            let downCurveA = new THREE.SplineCurve( [
                new THREE.Vector2(-1, 1),
                new THREE.Vector2(0.3, 0.3),
                new THREE.Vector2( 1, -1)
            ]);
            let downCurveB = new THREE.SplineCurve( [
                new THREE.Vector2( 1 + thickness, -1 + thickness),
                new THREE.Vector2(0.3 + thickness, 0.3 +thickness),
                new THREE.Vector2(-1 + thickness, 1 +thickness),
            ]);

            downPoints = downCurveA.getPoints(20);
            downPoints.push( new THREE.Vector2(1 + thickness, -1));
            let pointsB = downCurveB.getPoints(20);

            pointsB.forEach(element =>{
                downPoints.push(element);
            });
            downPoints.push( new THREE.Vector2(-1, 1 +thickness));

            let upCurveA = new THREE.SplineCurve( [
                new THREE.Vector2(-1, -1),
                new THREE.Vector2(-0.3, 0.3),
                new THREE.Vector2( 1, 1)
            ]);
            let upCurveB = new THREE.SplineCurve( [
                new THREE.Vector2( 1 - thickness, 1 + thickness),
                new THREE.Vector2(-0.3 - thickness, 0.3 + thickness),
                new THREE.Vector2(-1 - thickness, -1 + thickness)

            ]);

            upPoints = upCurveA.getPoints(20);
            upPoints.push( new THREE.Vector2(1, 1 + thickness));
            pointsB = upCurveB.getPoints(20);

            pointsB.forEach(element => {
                upPoints.push(element);
            });
            upPoints.push( new THREE.Vector2(-1 - thickness, -1 ));

        }else{
            //Zic Zac
            downPoints.push( new THREE.Vector2( -1,  1));
            downPoints.push( new THREE.Vector2(  0.5,  0.5));
            downPoints.push( new THREE.Vector2(  1, -1));
            downPoints.push( new THREE.Vector2(  1 + thickness, -1));
            downPoints.push( new THREE.Vector2(  1 + thickness, -1 + thickness));
            downPoints.push( new THREE.Vector2(  0.5 + thickness,  0.5 + thickness));
            downPoints.push( new THREE.Vector2( -1 + thickness,  1 + thickness));
            downPoints.push( new THREE.Vector2( -1,  1 + thickness));

            upPoints.push( new THREE.Vector2( -1,  -1));
            upPoints.push( new THREE.Vector2( -0.5,  0.5));
            upPoints.push( new THREE.Vector2(  1,  1));
            upPoints.push( new THREE.Vector2(  1,  1 + thickness));
            upPoints.push( new THREE.Vector2(  1 - thickness, 1 + thickness));
            upPoints.push( new THREE.Vector2( -0.5 - thickness,  0.5 + thickness));
            upPoints.push( new THREE.Vector2( -1 - thickness, -1 + thickness));
            upPoints.push( new THREE.Vector2( -1 - thickness,  -1));
        }

        this.downShape = new THREE.Shape(downPoints);
        this.upShape   = new THREE.Shape(upPoints);

        let extrudeSettings = { depth: depth, bevelEnabled: false};
        this.geometrydown = new THREE.ExtrudeGeometry( this.downShape, extrudeSettings);
        this.geometryup   = new THREE.ExtrudeGeometry( this.upShape, extrudeSettings);

        let maxX = this.config.endWindowX;
        let minX = this.config.startWindowX;

        let posX = minX;
        let posY = this.config.startWindowY;
        let posZ = 0;

        for(let i = 0; i < oAmount; i++){
           let line;

           //Switch between patterns
            if(Math.random() < probability){
                line = new THREE.Mesh(this.geometryup, this.materialA);
                this.groupA.add(line);
            }else{
                line = new THREE.Mesh(this.geometrydown, this.materialB);
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

    onRender(beat, avg){

        // Rotate objects
        if(avg > 0.3 && this.timerRotation < 0){
            this.rotate           = true;
            this.timerRotation    = this.config.timerRotation;
        }
        if(this.currentDegree === this.targetDegree){
            this.reset = true;
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
            if(Math.round(this.currentDegree) >= this.targetDegree){
                this.currentDegree = this.targetDegree;
            }
        }

        if(this.reset){
            this.reset  = false;
            this.rotate = false;
            this.currentDegree = 0;
        }

        this.timerRotation --;


        // Beat
        let extrudeSettings, newGeometry, array = [];

        if(beat < 0.1 && this.timerSwitch < 0){
            this.switch =! this.switch;
            this.timerSwitch = this.config.timerSwitch;
        }

        if(this.switch){
            extrudeSettings = { depth: -beat, bevelEnabled: false};
            newGeometry = new THREE.ExtrudeGeometry( this.upShape, extrudeSettings);
            array = this.groupA.children;
            array.forEach(element => {
                if(element instanceof THREE.Mesh){
                    element.geometry = newGeometry;
                }
            });
        }else{
            extrudeSettings = { depth: beat, bevelEnabled: false};
            newGeometry = new THREE.ExtrudeGeometry( this.downShape, extrudeSettings);
            array = this.groupB.children;
            array.forEach(element => {
                if(element instanceof THREE.Mesh){
                    element.geometry = newGeometry;
                }
            });
        }
        this.timerSwitch--;
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