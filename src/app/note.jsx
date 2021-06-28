
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

setupColors = (mode) =>{
    const c_colors      = this.config.colors;
    const c_hueRange    = c_colors.hueRange;
    let brightness      = this.props.visualsParameter.brightness;

    let saturation, lightness, backgroundColor, colorA, colorB, colorC;

    if(mode === "sw"){
        // Greyscale setup
        let lightnessA, lightnessB, lightnessC;
        saturation = 0;
        if(brightness >= 0.5){
            lightness = 100;
            lightnessA = Math.round(this.props.projectValToInterval(
                brightness,
                0.5,
                c_colors.dataMax,
                70,
                0
            ));
        }else{
            lightness = 0;
            lightnessA = Math.round(this.props.projectValToInterval(
                brightness,
                c_colors.dataMin,
                0.5,
                40,
                100
            ));
        }

        // Background
        backgroundColor = new THREE.Color("hsl(0,"+ saturation + "%," + lightness + "%)");

        // Color A
        colorA = new THREE.Color("hsl(0,"+ saturation + "%," + lightnessA + "%)");

        // Color B
        lightnessB =  lightnessA - 30;
        if(lightnessB < 0){
            lightnessB = 0;
        }
        colorB = new THREE.Color("hsl(0,"+ saturation + "%," + lightnessB + "%)");


        // Color C
        saturation = 100;
        lightnessC = Math.round(this.props.projectValToInterval(
            brightness,
            c_colors.dataMin,
            c_colors.dataMax,
            c_colors.colorLiMin,
            c_colors.colorLiMax
        ));

        let hueC = Math.round(Math.random()*180);
        hueC = this.checkColorAngle(240 + hueC, c_hueRange);
        colorC   = new THREE.Color("hsl("+hueC+","+ saturation + "%," + lightnessC + "%)");



    }else if(mode === "color"){
        // Colorful setup
        // Background color, selected color area, min = blue, max = yellow
        let hueBack = Math.round(this.props.projectValToInterval(
            brightness,
            c_colors.dataMin,
            c_colors.dataMax,
            0,
            180
        ));

        // Random staring hue for other colors, inside selected color area
        let hueRandom         = Math.round(Math.random()*180);
        // Check if new color is to close to background color
        if(hueRandom > this.checkColorAngle(hueBack+30, 180) && hueRandom < this.checkColorAngle(hueBack-30, 180)){
            hueRandom += 30;
        }
        hueRandom = this.checkColorAngle(hueRandom, 180);

        //Background
        if(brightness < c_colors.setBlackAt){
            saturation  = 0;
            lightness   = 0;
        }else{
            saturation  = c_colors.colorSatMax;

            // red tones less saturation
            if( brightness <= 0.7 && brightness > 0.3) {
                saturation = Math.round(this.props.projectValToInterval(
                    brightness,
                    c_colors.dataMin,
                    c_colors.dataMax,
                    80,
                    50
                ));
            }

            lightness   = Math.round(this.props.projectValToInterval(
                brightness,
                c_colors.dataMin,
                c_colors.dataMax,
                10,
                80
            ));
            // Map color from selected area to real color wheel
            hueBack = this.checkColorAngle(240 + hueBack, c_hueRange);
        }
        backgroundColor = new THREE.Color("hsl("+hueBack+","+ saturation + "%," + lightness + "%)");


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
        colorA  = new THREE.Color("hsl("+hueA+","+ saturation + "%," + lightness + "%)");

        // Color B
        let hueB    = hueRandom + 30;
        hueB        = this.checkColorAngle(hueB, 180);
        hueB        = this.checkColorAngle(240 + hueB, c_hueRange);
        colorB  = new THREE.Color("hsl("+hueB+","+ saturation + "%," + lightness + "%)");

        // Color C
        let hueC    = hueRandom + 60;
        hueC        = this.checkColorAngle(hueC, 180);
        hueC        = this.checkColorAngle(240 + hueC, c_hueRange);
        colorC  = new THREE.Color("hsl("+hueC+","+ saturation + "%," + lightness + "%)");
    }


    return {backgroundColor, colorA, colorB, colorC}
}


//////////////////////////////////////////////////////////////


