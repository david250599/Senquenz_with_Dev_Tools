import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';

export function Scene1_old(props) {




    const backColor = new THREE.Color(1, 1, 1);
    const frontColor = new THREE.Color(0, 0, 0);

    const moveVec = new THREE.Vector3();
    let speed = props.visualsParameter.speed;




    const backObjects = useRef();
    const frontObjects = useRef();

    const {vec, transform, positions, objectAmount, objectSize, spacing, vertices} = useMemo(() => {
        const vec = new THREE.Vector3();
        const transform = new THREE.Matrix4();
        const objectAmount  = props.visualsParameter.structureSize*1200 + 20;
        const objectSize    = -props.visualsParameter.structureSize * 20 +22;
        const spacing       = -props.visualsParameter.urban *8 +8 + (objectSize*2 - objectSize/5);
        const vertices = Math.floor(-props.visualsParameter.hilly * 30 +27);

        let moveX = -150;
        let moveY =-70;
        console.log('memo');


        const positions = [...Array(objectAmount)].map((_, i) => {
            const position = new THREE.Vector3();


            position.x = moveX;
            position.y = moveY;

            moveX = moveX + spacing;

            if(moveX > 150){
                moveX = -150;
                moveY = moveY + spacing;
            }

            return position
        });


        return {vec, transform, positions, objectAmount, objectSize, spacing, vertices}
    }, []);




    useFrame(() => {


        for (let i = 0; i < positions.length; ++i) {
            vec.copy(positions[i]);
            transform.setPosition(vec);
            frontObjects.current.setMatrixAt(i, transform);


            vec.add(moveVec);
            transform.setPosition(vec);
            backObjects.current.setMatrixAt(i, transform);

        }

        if(moveVec.x >= spacing || moveVec.x <= 0){
            moveVec.y += speed;
        }
        if(moveVec.y >= spacing || moveVec.y <= 0){
            moveVec.x += speed;
        }


        if((moveVec.x >= spacing && moveVec.y >= spacing) || (moveVec.x <=0 && moveVec.y <=0)){
            speed = -speed;
        }











        backObjects.current.instanceMatrix.needsUpdate = true;
        frontObjects.current.instanceMatrix.needsUpdate = true;


    });

    return (
        <group>
            <instancedMesh
                ref={backObjects}
                args={[null, null, objectAmount]}>
                <circleBufferGeometry args={[objectSize, vertices]}/>
                <meshBasicMaterial color={backColor}/>
            </instancedMesh>
            <instancedMesh
                ref={frontObjects}
                args={[null, null, objectAmount]}>
                <circleBufferGeometry args={[objectSize/3, vertices]}/>
                <meshBasicMaterial color={frontColor}/>
            </instancedMesh>
        </group>

    )
}


/////////////////////////////////////////////////////////////////////////////ä

import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';


export function TestScene(props){
    const ref = useRef();

    let speed = props.speed;


    const { vec, transform, positions, distances } = useMemo(() => {
        const vec           = new THREE.Vector3();
        const transform     = new THREE.Matrix4();
        const positions     = [...Array(10000)].map((_, i) => {
            const position  = new THREE.Vector3();

            //Grid
            position.x      = (i % 200) - 100;
            position.y      = Math.floor(i / 100) - 50;

            //Offset every 2. column


            //Add some noise
            position.x      += Math.random() * 0.3;
            position.y      += Math.random() * 0.3;
            return position
        });
        const distances = positions.map(pos => pos.length())


        return {vec, transform, positions, distances}
    }, []);

    useFrame(({clock}) => {

        for (let i = 0; i < 10000; ++i){
            const t = clock.elapsedTime - distances[i] / 80;
            const wave = roundedSquareWave(t, 0.1, 1, 1 /3);
            const scale = 1 + wave * speed;
            vec.copy(positions[i]);
            vec.multiplyScalar(scale);
            transform.setPosition(vec);
            ref.current.setMatrixAt(i, transform);

        }
        ref.current.instanceMatrix.needsUpdate = true;


    });

    const roundedSquareWave = (t, delta, a, f) => {
        return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
    }



    return(
        <instancedMesh
            ref={ref}
            args={[null, null, 10000]}>
            <circleBufferGeometry args={[0.2, 30]}/>
            <meshBasicMaterial/>
        </instancedMesh>
    )

}

//////////////////////////////////////////////////////////

import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';

export function GetItDone(props){

    const instances = [];
    const number = 4;
    const objectSize = 5;
    const itemColor = new THREE.Color(1, 0, 0);
    const vertices  = 30;

    const ref = useRef();

    for(let i = 0; i< number; i++){
        instances.push(
            <mesh position={[i+objectSize*i*2, 0, 0]} key={i}>
                <circleBufferGeometry args={[objectSize, vertices]}/>
                <meshBasicMaterial color={itemColor}/>
            </mesh>)

    }

    useFrame(({clock}) => {
        let time = clock.elapsedTime;


        ref.current.rotation.z = time + props.speed *10;



    })

    return(
        <group ref={ref}>
            {instances}
        </group>
    )
}

///////////////////////////////////////////////////////////

this.scene = new THREE.Scene();
this.testScene = new THREE.Scene();

//Setup parameter with the location data
const c_scene1 = this.props.config.scene1;
this.oAmount     = this.props.visualsParameter.structureSize * c_scene1.maxAmount + c_scene1.minAmount;
this.oSize       = c_scene1.theMoreTheLes * this.props.visualsParameter.structureSize * c_scene1.maxSize
    + c_scene1.minSize;
this.oVertices   = Math.floor(c_scene1.theMoreTheLes * this.props.visualsParameter.hilly *
    c_scene1.maxVertices + c_scene1.maxVertices);
this.spacing     = c_scene1.theMoreTheLes * this.props.visualsParameter.urban *8 +6 + this.oSize*2;

//Setup objects of the Scene
const geometry = new THREE.CircleGeometry(this.oSize, this.oVertices);
const color = new THREE.Color(this.props.visualsParameter.brightness,0,0);
const material = new THREE.MeshBasicMaterial({color: color});

this.group = new THREE.Group();
let positionX = 0;
for(let i = 0; i < this.oAmount; i++){
    let circle = new THREE.Mesh(geometry, material);
    circle.position.x = positionX;
    this.group.add(circle);
    positionX += this.spacing;
}


this.test = new THREE.Group();
for(let i = 0; i < 1000; i++){
    let circle = new THREE.Mesh(geometry, material);
    circle.position.x = 50;
    this.test.add(circle);
}
this.testScene.add(this.test);

this.scene.add(this.group);

///////////////////////////////////////////////////////////

import * as THREE from "three";

export class SceneC {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
    }

    load(visualsParameter, colors){
        this.scene.background = colors.backgroundColor;

        let oAmount     = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
            this.config.maxSize + this.config.minSize;
        let spacing     = this.config.theMoreTheLes * visualsParameter.urban * this.config.spacingMax +
            this.config.spacingMax + this.config.spacingMin + oSize*2;

        this.geometry = new THREE.CircleGeometry(oSize, 30);
        this.material = new THREE.MeshBasicMaterial({color: colors.colorC});

        let posX = this.config.lineStartX;
        let posY = this.config.lineStartY;
        let posZ = this.config.lineStartZ;
        let objectInLine = 0;
        let oldLineX = this.config.lineStartX;
        let oldLineY = this.config.lineStartY;
        let moveLine = spacing;

        this.ObjectArray = [];

        console.log("Amount " + oAmount);
        for(let i = 0; i < oAmount; i++){
            if(posZ < this.config.maxPosZ - oSize*2){
                posX = oldLineX;
                posY = oldLineY + moveLine;
                posZ = this.config.lineStartZ;
                objectInLine = 0;

                oldLineX = posX;
                oldLineY = posY;
            }

            let object = new THREE.Mesh(this.geometry, this.material);
            object.position.x = posX;
            object.position.z = posZ;
            object.position.y = posY;

            this.ObjectArray.push(object);
            this.scene.add(object);

            posX += spacing;
            posY += Math.pow(objectInLine, 2) * visualsParameter.hilly;
            posZ -= spacing;
            objectInLine ++;


        }

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

/////////////////////////////////////////////////////////////////////
import * as THREE from "three";
import {color} from "three/examples/jsm/libs/dat.gui.module";

export class SceneC {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
    }

    load(visualsParameter, colors){
        this.scene.background = colors.backgroundColor;

        this.oAmount    = visualsParameter.structureSize * this.config.maxAmount + this.config.minAmount;
        let oSize       = this.config.theMoreTheLes * visualsParameter.structureSize * this.config.maxSize +
            this.config.maxSize + this.config.minSize;


        this.materialB = new THREE.MeshBasicMaterial({color: colors.colorB, opacity: 0.7, transparent: true});
        this.materialC = new THREE.MeshBasicMaterial({color: colors.colorC, opacity: 0.7, transparent: true});

        this.groupA = new THREE.Group();
        this.groupB = new THREE.Group();
        this.groupC = new THREE.Group();

        this.createCircles(oSize, visualsParameter.urban, colors.colorA, this.groupA);
        oSize += visualsParameter.hilly*2;
        this.createCircles(oSize, visualsParameter.urban, colors.colorB, this.groupB);



        // Duplicating groupA
        this.groupB.add(this.groupA.clone());
        this.groupC.add(this.groupA.clone());

        // Change position & colors for new groups
        this.groupB.rotateZ(60 * Math.PI / 180);
        this.groupC.rotateZ(120 * Math.PI / 180);

        /*
                this.groupB.traverse( (object) =>{
                    if ( object instanceof THREE.Mesh){
                        object.material = this.materialB;
                        object.position.z = -1;
                    }
                });

         */

        this.groupC.traverse((object) => {
            if ( object instanceof THREE.Mesh){
                object.material = this.materialC;
                object.position.z = -2;
            }
        });




        this.scene.add(this.groupA, this.groupB, this.groupC);
    }

    createCircles(oSize, urban, color, group){
        this.geometry  = new THREE.CircleGeometry(oSize, 30);
        this.material  = new THREE.MeshBasicMaterial({color: color, opacity: 0.7, transparent: true});

        let spacing    = this.config.theMoreTheLes * urban * this.config.spacingMax +
            this.config.spacingMax + this.config.spacingMin + oSize*2;
        let angle = 0;
        let circleSize = oSize + spacing/4;

        let angleStep = Math.floor(oSize*4);
        while (360 % angleStep !== 0){
            angleStep++;
        }

        for(let i = 0; i < this.oAmount; i++){
            let object = new THREE.Mesh(this.geometry, this.material);
            object.position.x = Math.cos(angle * Math.PI / 180) * circleSize;
            object.position.y = Math.sin(angle * Math.PI / 180) * circleSize;
            angle += angleStep;
            group.add(object);

            if(angle >= 360){
                angle = 0;
                circleSize += spacing;
            }
        }

    }

    onRender(audio, avg){
        this.groupA.rotateZ(audio * 0.01);

        this.groupB.rotateZ(- audio * 0.01);

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
        this.materialB.dispose();
        this.materialC.dispose();

    }
}

//////////////////////////////////////////////////////////////
//Background A
setupColors = () =>{
    const c_colors      = this.config.colors;
    const c_hueRange    = c_colors.hueRange;
    let brightness      = this.props.visualsParameter.brightness;

    let hueMain         = Math.round(Math.random()*c_hueRange);
    let saturation;
    let lightness;

    //Background
    if(brightness < c_colors.backMin){
        saturation = 0;
        lightness = saturation;
    }else{
        saturation = Math.round(this.props.projectValToInterval(
            brightness,
            c_colors.dataMin,
            c_colors.dataMax,
            c_colors.backSatMin,
            c_colors.backSatMax
        ));
        lightness = saturation;
    }
    let backgroundColor = new THREE.Color("hsl("+hueMain+","+ saturation + "%," + lightness + "%)");


    //Colors
    saturation = c_colors.colorSatMax;
    lightness = Math.round(this.props.projectValToInterval(
        brightness,
        c_colors.dataMin,
        c_colors.dataMax,
        c_colors.colorLiMin,
        c_colors.colorLiMax
    ));

    // Color A
    let hueA    = hueMain + c_hueRange/2;
    hueA        = this.checkColorAngle(hueA, c_hueRange);
    let colorA  = new THREE.Color("hsl("+hueA+","+ saturation + "%," + lightness + "%)");

    // Color B
    let hueB    = hueMain + c_hueRange/4;
    hueB        = this.checkColorAngle(hueB, c_hueRange);
    let colorB  = new THREE.Color("hsl("+hueB+","+ saturation + "%," + lightness + "%)");

    // Color C
    let hueC    = hueMain - c_hueRange/4;
    hueC        = this.checkColorAngle(hueC, c_hueRange);
    let colorC  = new THREE.Color("hsl("+hueC+","+ saturation + "%," + lightness + "%)");

    return {backgroundColor, colorA, colorB, colorC}
}

"colors":
{ "hueRange":           360,
    "dataMin":            0.01,
    "dataMax":            1,
    "backMin":            0.1,
    "backSatMin":         40,
    "backSatMax":         90,
    "colorSatMax":        100,
    "colorLiMin":         30,
    "colorLiMax":         70

}

//////////////////////////////////////////////////////////////
//Background B
this.materialA.blending = THREE.AdditiveBlending;
this.materialB.blending = THREE.AdditiveBlending;

setupColors = () =>{
    const c_colors      = this.config.colors;
    const c_hueRange    = c_colors.hueRange;
    let brightness      = this.props.visualsParameter.brightness;

    let saturation;
    let lightness;

    let hueBack = Math.round(this.props.projectValToInterval(
        brightness,
        c_colors.dataMin,
        c_colors.dataMax,
        0,
        180
    ));
    let hueRandom         = Math.round(Math.random()*180);
    if(hueRandom > this.checkColorAngle(hueBack+30, 180) && hueRandom < this.checkColorAngle(hueBack-30, 180)){
        hueRandom += 30;
    }
    hueRandom = this.checkColorAngle(hueRandom, 180);

    //Background
    if(brightness < c_colors.backMin){
        saturation  = 0;
        lightness   = 0;
    }else{
        saturation  = c_colors.colorSatMax;
        lightness   = Math.round(this.props.projectValToInterval(
            brightness,
            c_colors.dataMin,
            c_colors.dataMax,
            10,
            80
        ));
        hueBack = this.checkColorAngle(240 + hueBack, c_hueRange);
    }
    let backgroundColor = new THREE.Color("hsl("+hueBack+","+ saturation + "%," + lightness + "%)");


    //Colors
    saturation = c_colors.colorSatMax;
    lightness = Math.round(this.props.projectValToInterval(
        brightness,
        c_colors.dataMin,
        c_colors.dataMax,
        c_colors.colorLiMin,
        c_colors.colorLiMax
    ));

    // Color A
    let hueA    = hueRandom;
    hueA        = this.checkColorAngle(240 + hueA, c_hueRange);
    let colorA  = new THREE.Color("hsl("+hueA+","+ saturation + "%," + lightness + "%)");

    // Color B
    let hueB    = hueRandom + 30;
    hueB        = this.checkColorAngle(hueB, 180);
    hueB        = this.checkColorAngle(240 + hueB, c_hueRange);
    let colorB  = new THREE.Color("hsl("+hueB+","+ saturation + "%," + lightness + "%)");

    // Color C
    let hueC    = hueRandom + 60;
    hueC        = this.checkColorAngle(hueC, 180);
    hueC        = this.checkColorAngle(240 + hueC, c_hueRange);
    let colorC  = new THREE.Color("hsl("+hueC+","+ saturation + "%," + lightness + "%)");

    return {backgroundColor, colorA, colorB, colorC}
}
"hueRange":           360,
    "dataMin":            0.01,
    "dataMax":            1,
    "backMin":            0.1,
    "backSatMin":         40,
    "backSatMax":         90,
    "colorSatMax":        100,
    "colorLiMin":         30,
    "colorLiMax":         70


/////////////////////////////////////////////////////////



