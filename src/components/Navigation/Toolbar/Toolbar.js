import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <div>MANU</div>
        <Logo/>
        <nav>
            ...
        </nav>
    </header>
);

export default toolbar;