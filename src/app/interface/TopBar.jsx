import React                                from 'react';
import                                           '../../css/TopBar.css';

import {ReactComponent as SvgLogo}          from '../../img/logo.svg';
import {ReactComponent as SvgSettings}      from '../../img/settings.svg';
import {ReactComponent as SvgShare}         from '../../img/share.svg';
import {ReactComponent as SvgFullScreen}    from '../../img/fullscreen.svg';

export class TopBar extends React.PureComponent{

    render() {
        return(
            <div className = "topBar">
                <div className="logo">
                    <SvgLogo/>
                </div>
                <div className="iconsTop">
                    <div onClick={this.props.openSettings}><SvgSettings/></div>
                    <div><SvgShare/></div>
                    <div><SvgFullScreen/></div>
                </div>
            </div>
        )
    }
}
