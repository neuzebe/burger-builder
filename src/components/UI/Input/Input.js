import React from 'react';
import classes from './Input.module.css'

const input = (props) => {
  let inputElement = null;

  switch(props.elementType){
    case ('input'):
      inputElement = <input onChange={props.changed} className={classes.InputElement} {...props.elementConfig} value={props.value} />;
      break;
    case ('textarea'):
      inputElement = <textarea onChange={props.changed} className={classes.InputElement} {...props.elementConfig} value={props.value}/>;
      break;
    case ('select'):
      const options = [];
      props.elementConfig.options.map(option => {
          options.push(<option key={option.value} value={option.value}>{option.displayValue}</option>)
      });
      inputElement = (<select onChange={props.changed} className={classes.InputElement}
                             value={props.value}>
                        {options}
                     </select>);
      break;
    default:
      inputElement = <input onChange={props.changed} className={classes.InputElement} {...props.elementConfig} value={props.value} />;

  }

  return(<div  className={classes.Input}>
    <label  className={classes.Label}>{props.label}</label>
    {inputElement}
  </div>)
};

export default input;