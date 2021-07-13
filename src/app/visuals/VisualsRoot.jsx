// Main component fpr the visualization
// React - Three.js Setup is inspired by Alexander Solovyev - https://codeburst.io/react-16-three-js-integration-tips-2019-b6afe19c0b83
// Holds all scenes as classes. Each one got a load, onRender and delete function
// Animation and setup of the visualization elements is done by the scenes and controlled by the VisualsRoot
// Rendering, camera setup, color picking, switching between scenes is handled here


import React                from 'react';
import * as THREE           from 'three';
import {EffectComposer}     from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass}         from 'three/examples/jsm/postprocessing/RenderPass';
import {AfterimagePass}     from 'three/examples/jsm/postprocessing/AfterimagePass';

import {SceneA}             from './scenes/SceneA';
import {SceneB}             from './scenes/SceneB';
import {SceneC}             from './scenes/SceneC';
import {SceneD}             from './scenes/SceneD';


export class VisualsRoot extends React.Component {
    constructor(props) {
        super(props);
        this.config         = props.config;
        this.updateScene    = window.setTimeout(() => this.changeScene(), this.config.updateDuration );
    }

    componentDidMount() {
        this.rootSetup();

        this.currentScene       = Math.round(Math.random() * (this.allScenes.length - 1));
        this.lastFourRendered   = [];

        this.loadScene(this.currentScene);

        this.startAnimationLoop();
        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount() {
        this.allScenes[this.currentScene].delete();
        this.composer.removePass(this.renderPass);
        this.composer.removePass(this.afterimagePass);
        window.removeEventListener("resize", this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        window.clearTimeout(this.updateScene);
    }

    rootSetup = () => {
        // Setup camera
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;

        this.camera = new THREE.PerspectiveCamera(
            this.config.camera.fov,
            width / height,
            this.config.camera.near,
            this.config.camera.far
        );
        this.camera.position.z = this.config.camera.positionZ;
        this.camera.lookAt(0, 0, 0);

        // Setup Scenes
        this.allScenes = [
            new SceneA(this.config.sceneA),
            new SceneB(this.config.sceneB),
            new SceneC(this.config.sceneC),
            new SceneD(this.config.sceneD)
        ]

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(width, height);

        this.el.appendChild(this.renderer.domElement);

        // Add effects on rendered image, is needed for water effect
        this.composer       = new EffectComposer( this.renderer);
    };

    loadScene = (index) => {
        let colors = this.setupColors();
        this.allScenes[index].load(this.props.visualsParameter, colors);

        if(this.renderPass){
            this.composer.removePass(this.renderPass);
        }
        if(this.afterimagePass){
            this.composer.removePass(this.afterimagePass);
        }


        // Add the afterimage effect to the render pipeline
        // Is used to display the water parameter
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_afterimage.html
        this.renderPass = new RenderPass(this.allScenes[index].scene, this.camera)
        this.composer.addPass( this.renderPass);

        if(this.props.visualsParameter.water >= 0.5){
            let strength = this.props.projectValToInterval(
                this.props.visualsParameter.water,
                0.5,
                this.config.effects.dataMax,
                this.config.effects.minBlur,
                this.config.effects.maxBlur
            );
            this.afterimagePass = new AfterimagePass(strength);
            this.composer.addPass(this.afterimagePass);
        }
    };

    changeScene = () => {
        window.clearTimeout(this.updateScene);

        // Get index of new scene
        this.lastFourRendered.push(this.currentScene);
        if(this.lastFourRendered.length === 4){this.lastFourRendered = []}
        let indexNew = this.nextScene();


        // Load new scene and 'delete' old
        this.loadScene(indexNew);
        this.allScenes[this.currentScene].delete();
        this.currentScene   = indexNew;

        // call again in 30sec
        this.updateScene    = window.setTimeout(() => this.changeScene(), this.config.updateDuration );
    }

    nextScene(){
        // The index is set randomly
        // But if its the current index or one of the last rendered scenes, it is set again
        // On that way the order is random, but all scenes appear equally often
        let indexNew = Math.round(Math.random() * (this.allScenes.length - 1));
        if( indexNew === this.currentScene || this.lastFourRendered.indexOf(indexNew) !== -1){
            indexNew = this.nextScene();
        }
        return indexNew
    }

    startAnimationLoop = () => {
        // Call animation function from current scene
        if(this.props.play){
            this.allScenes[this.currentScene].onRender(this.props.beat, this.props.avg);
            this.composer.render();
        }

        if(this.props.changeVisuals){
            this.changeScene();
            this.props.stopReload();
        }

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width  = this.el.clientWidth;
        const height = this.el.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.composer.setSize(width, height);

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    setupColors = () =>{
        const c_colors      = this.config.colors;
        const c_hueRange    = c_colors.hueRange;
        let brightness      = this.props.visualsParameter.brightness;

        let backgroundBW, backgroundColor, bColor, wColor, fixColor, randomColorA, randomColorB;
        let saturation, lightness;

        // Black & white color
        bColor = new THREE.Color(0, 0, 0);
        wColor = new THREE.Color(1, 1, 1);

        // Setup background colors
        if(!this.props.projectionMode){

            // Background BW
            if(brightness > 0.3){
                saturation = c_colors.maxSat;
                lightness  = c_colors.maxLi;
            }else{
                saturation = 0;
                lightness  = 0;
            }
            backgroundBW = new THREE.Color("hsl(0,"+ saturation + "%," + lightness + "%)");


            // Background Color
            if( brightness >= 0.1){

                // Select hue in limited range based on brightness
                let hueB = Math.round(this.props.projectValToInterval(
                    brightness,
                    0.1,
                    c_colors.dataMax,
                    0,
                    180
                ));

                // Map color from selected area to real color wheel
                hueB = this.checkColorAngle(c_colors.startColor + hueB, c_hueRange);

                // Map brightness to lightness
                lightness = Math.round(this.props.projectValToInterval(
                    brightness,
                    0.1,
                    c_colors.dataMax,
                    c_colors.colorLiMin,
                    c_colors.colorLiMax
                ));

                saturation = 100;
                backgroundColor = new THREE.Color("hsl("+ hueB +","+ saturation + "%," + lightness + "%)");

            }else{
                backgroundColor = backgroundBW.clone();
            }

        }else{
            // Background colors for projection mode
            backgroundBW    = bColor.clone();
            backgroundColor = bColor.clone();
        }


        // Setup fixColor
        // Select hue in limited range based on brightness
        let hueFixLimited = Math.round(this.props.projectValToInterval(
            brightness,
            c_colors.dataMin,
            c_colors.dataMax,
            0,
            180
        ));
        // Map color from selected area to real color wheel
        let hueFixReal = this.checkColorAngle(c_colors.startColor + hueFixLimited, c_hueRange);

        // Map brightness to lightness
        lightness = Math.round(this.props.projectValToInterval(
            brightness,
            c_colors.dataMin,
            c_colors.dataMax,
            c_colors.colorLiMin,
            c_colors.colorLiMax
        ));
        saturation = c_colors.maxSat;
        fixColor = new THREE.Color("hsl("+ hueFixReal +","+ saturation + "%," + lightness + "%)");


        // Setup random colors
        let hueA = Math.round(this.checkColorAngle(hueFixLimited + (Math.random() * 60 + 20), 180));
        hueA     = this.checkColorAngle(c_colors.startColor + hueA, c_hueRange);
        randomColorA = new THREE.Color("hsl("+ hueA +","+ saturation + "%," + lightness + "%)");

        let hueB = Math.round(this.checkColorAngle(hueFixLimited - (Math.random() * 60 + 20), 180));
        hueB     = this.checkColorAngle(c_colors.startColor + hueB, c_hueRange);
        randomColorB = new THREE.Color("hsl("+ hueB +","+ saturation + "%," + lightness + "%)");

        return {bColor, wColor, backgroundBW, backgroundColor, fixColor, randomColorA, randomColorB}
    }

    // checks if the given value is over the max or smaller 0
    checkColorAngle(val, maxRange){
        if(val > maxRange){
            val -= maxRange;
        }else if (val < 0){
            val += maxRange;
        }
        return val;
    }

    render() {
        return <div className={this.props.className} ref={ref => (this.el = ref)} />;
    }
}



