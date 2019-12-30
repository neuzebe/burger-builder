import React from 'react';
import classes from './Input.module.css'

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.inputElement];

  if(props.invalid && props.shouldValidate && props.touched){
    inputClasses.push(classes.Invalid);
  }

  switch(props.elementType){
    case ('input'):
      inputElement = <input onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} />;
      break;
    case ('textarea'):
      inputElement = <textarea onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} value={props.value}/>;
      break;
    case ('select'):
      const options = [];
      props.elementConfig.options.forEach(option => {
          options.push(<option key={option.value} value={option.value}>{option.displayValue}</option>)
      });
      inputElement = (<select onChange={props.changed} className={inputClasses.join(' ')}
                             value={props.value}>
                        {options}
                     </select>);
      break;
    default:
      inputElement = <input onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} />;

  }

  return(<div  className={classes.Input}>
    <label  className={classes.Label}>{props.label}</label>
    {inputElement}
  </div>)
};

export default input;