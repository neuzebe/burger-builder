import React , { useEffect } from 'react';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
})

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
})

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
})

const App = props => {
  useEffect(() => {
    props.onTryAutoAuth();
  }, [])

  let routes = (
    <Switch>
      <Route path="/auth" exact component={asyncAuth}/>
      <Route path="/" exact component={BurgerBuilder}/>
      <Redirect to='/'/>
    </Switch>
  )
  
  if(props.isAuthenticated){
    routes = (
      <Switch>
        <Route path="/" exact component={BurgerBuilder}/>
        <Route path="/orders" exact component={asyncOrders}/>
        <Route path="/checkout" component={asyncCheckout}/>
        <Route path="/logout" component={Logout}/>
        <Route path="/auth" exact component={asyncAuth}/>
        <Redirect to='/'/>
      </Switch>
    )
  }
  
  return (
    <div>
      <Layout>
        {routes}
      </Layout>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoAuth: () => dispatch(actions.authCheckState()),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
