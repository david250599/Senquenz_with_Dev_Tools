import React from "react";
import * as THREE from "three";

import {SceneA} from "./scenes/SceneA"
import {SceneB} from "./scenes/SceneB"


export class VisualsRoot extends React.Component {
    constructor(props) {
        super(props);
        //this.updateScene    = window.setTimeout(() => this.changeScene(), 5000 );
    }

    componentDidMount() {
        console.log('Mount');
        this.rootSetup();

        this.currentScene = 1;
        this.loadScene(this.currentScene);

        this.startAnimationLoop();
        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount() {
        this.allScenes[this.currentScene].delete();
        window.removeEventListener("resize", this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        window.clearTimeout(this.updateScene);
    }


    rootSetup = () => {
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;

        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );

        this.camera.position.z = 100;
        this.camera.lookAt(0, 0, 0);

        // Setup Scenes
        this.allScenes = [
            new SceneA(this.props.config.sceneA),
            new SceneB(this.props.config.sceneB),
            0
        ]

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.el.appendChild(this.renderer.domElement);
    };

    setupColors = () =>{
        const c_colors = this.props.config.colors;
        const c_hueRange = c_colors.hueRange;
        let brightness = this.props.visualsParameter.brightness;

        let hueMain = Math.round(Math.random()*c_hueRange);
        let saturation;
        let lightness;

        //Background
        if(brightness < 0.1){
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
        let hueA = hueMain + c_hueRange/2;
        hueA = this.checkColorAngle(hueA, c_hueRange);
        let colorA = new THREE.Color("hsl("+hueA+","+ saturation + "%," + lightness + "%)");

        // Color B
        let hueB = hueMain + c_hueRange/4;
        hueB = this.checkColorAngle(hueB, c_hueRange);
        let colorB = new THREE.Color("hsl("+hueB+","+ saturation + "%," + lightness + "%)");

        // Color C
        let hueC = hueMain - c_hueRange/4;
        hueC = this.checkColorAngle(hueC, c_hueRange);
        let colorC = new THREE.Color("hsl("+hueC+","+ saturation + "%," + lightness + "%)");


        return {backgroundColor, colorA, colorB, colorC}

    }

    checkColorAngle(val, maxRange){
        if(val > maxRange){
            val -= maxRange;
        }else if (val < 0){
            val += maxRange;
        }
        return val;
    }

    loadScene = (index) => {
        let colors = this.setupColors();
        this.allScenes[index].load(this.props.visualsParameter, colors);
    };

    changeScene = () => {
        window.clearTimeout(this.updateScene);
        let indexNew;

        if(this.currentScene === 1){
            indexNew = 0;
        }else{
            indexNew = 1;
        }

        this.loadScene(indexNew);
        this.allScenes[this.currentScene].delete();
        this.currentScene = indexNew;

        this.updateScene    = window.setTimeout(() => this.changeScene(), 5000 );
    }

    startAnimationLoop = () => {
        this.allScenes[this.currentScene].onRender(this.props.speed, this.props.avg);

        this.renderer.render(this.allScenes[this.currentScene].scene, this.camera);

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    render() {
        return <div className={this.props.className} ref={ref => (this.el = ref)} />;
    }
}



