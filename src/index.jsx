import React                                        from 'react';
import ReactDOM                                     from 'react-dom';
import { BrowserRouter as Router, Switch, Route }   from 'react-router-dom';

import {App}                                        from './app/App';
import {Impressum}                                  from './legal/Impressum';
import {Datenschutz}                                from './legal/Datenschutz';



ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path = "/" component = {App}/>
            <Route exact path = "/Impressum" component = {Impressum}/>
            <Route exact path = "/Datenschutz" component = {Datenschutz}/>
        </Switch>
    </Router>,
    document.getElementById('root')
);


