import React from 'react';
import classes from './Module.module.css';

const modal = (props) => (
  <div className={classes.Modal}>
    {props.children}
  </div>
);

export default modal;