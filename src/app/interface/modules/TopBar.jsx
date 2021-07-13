// Holds logo and settings button
// Executes the fullscreen function
// The Fscreen - Fullscreen API is used for that - https://www.npmjs.com/package/fscreen

import React                                from 'react';
import                                           '../../../css/module/TopBar.css';
import fscreen                              from 'fscreen';

import {ReactComponent as SvgLogo}          from '../../../img/logo.svg';
import {ReactComponent as SvgSettings}      from '../../../img/settings.svg';
import {ReactComponent as SvgFullScreen}    from '../../../img/fullscreen.svg';
import {ReactComponent as SvgMinimize}    from '../../../img/minimize.svg';

export class TopBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false
        }
    }

    openFullscreen(){
        let element = document.documentElement;
        if (fscreen.fullscreenEnabled) {
            fscreen.requestFullscreen(element);

            this.setState({
                fullscreen: true
            });
        }
    }

    closeFullscreen(){
        if (fscreen.fullscreenEnabled) {
            fscreen.exitFullscreen();

            this.setState({
                fullscreen: false
            });
        }
    }

    changeView(){
        if(this.state.fullscreen){
            this.closeFullscreen();
        }else{
            this.openFullscreen();
        }
    }

    render() {
        return(
            <div className = "topBar" id={this.props.showInterfaceCom? null: 'hideComponents'}>
                <a href="/">
                    <div className="logo">
                        <SvgLogo/>
                    </div>
                </a>
                <div className="iconsTop">
                    <div onClick={this.props.openSettings}>
                        <SvgSettings/>
                    </div>
                    <div onClick={() => this.changeView()} id = "fullscreenSVG">
                        {this.state.fullscreen? <SvgMinimize/>: <SvgFullScreen/>}
                    </div>
                </div>
            </div>
        )
    }
}
