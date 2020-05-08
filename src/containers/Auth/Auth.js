import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

const  Auth = props => {
  const [ isSignUp, setIsSignUp ] = useState(true);
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Email Address'
      },
      value: '',
      valid: false,
      touched: false,
      validation: {
        required: true,
        isEmail: true
      }
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      valid: false,
      touched: false,
      validation: {
        required: true,
        minLength: 6,
      }
    }      
  })

  useEffect( () => {
    if(!props.buildingBurger && props.authRedirectPath !== '/'){
      props.onSetAuthRedirectPath();
    }
  }, []);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm,  {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, authForm[controlName].validation),
        touched: true,
      })
    });

    setAuthForm(updatedControls);
  }

  const submitHandler = (event) => {
    event.preventDefault();

    props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
  }

  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp);
  }

  const formElementsArray = [];
  for(let key in authForm){
    formElementsArray.push({
      id: key,
      config: authForm[key]
    })
  }

  let form = formElementsArray.map(formElement => (
    <Input 
      key={formElement.id} 
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(event) => inputChangedHandler(event, formElement.id)}        
    />
  ))

  if(props.loading){
    form = <Spinner/>
  }

  let errorMessage = null;

  if(props.error){
    errorMessage = <p>{props.error.message}</p>
  }

  let authRedirect = null;
  if(props.isAuthenticated){
    authRedirect = <Redirect to={props.authRedirectPath} />
  }
      
  return(
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button 
        clicked={switchAuthModeHandler} 
        btnType='Danger'>SWITCH TO {isSignUp ? 'SIGN-IN' : 'SIGN-UP'}</Button>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup ) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);