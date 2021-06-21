import * as THREE           from 'three';


export class SceneD {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.colorMode = 'color';


    }

    load(visualsParameter, colors){
        this.scene.background = colors.backgroundColor;
        this.groupA = new THREE.Group();

        console.log('scene D load');
        let thickness = 0.05;

        let downPoints = [];
        downPoints.push( new THREE.Vector2( -1,  1));
        downPoints.push( new THREE.Vector2( 1, -1));
        downPoints.push( new THREE.Vector2( 1 + thickness, -1 + thickness));
        downPoints.push( new THREE.Vector2( -1 + thickness, 1 + thickness));
        let downShape = new THREE.Shape(downPoints);

        let curveA = new THREE.SplineCurve( [
            new THREE.Vector2(-1, 1),
            new THREE.Vector2(0.5, 0.5),
            new THREE.Vector2( 1, -1)
        ]);

        let curveB = new THREE.SplineCurve( [
            new THREE.Vector2( 1 + thickness, -1 +thickness),
            new THREE.Vector2(0.5 + thickness, 0.5 +thickness),
            new THREE.Vector2(-1 + thickness, 1 +thickness),
        ]);

        let curvePointsA = curveA.getPoints(20);
        let curvePointsB = curveB.getPoints(20);

        curvePointsB.forEach(element => {
            curvePointsA.push(element);
        })
        let curveShape = new THREE.Shape(curvePointsA);

        let extrudeSettings = { depth: 2, bevelEnabled: false};

        this.geometry = new THREE.ExtrudeGeometry( curveShape, extrudeSettings);
        this.material = new THREE.MeshBasicMaterial({color: colors.colorA});
        this.material.side = THREE.DoubleSide;

        let downMesh = new THREE.Mesh( this.geometry, this.material);

        downMesh.scale.multiplyScalar(8);


        this.groupA.add(downMesh);

        this.scene.add(this.groupA);


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
