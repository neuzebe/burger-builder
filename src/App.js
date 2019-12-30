import React , { Component } from 'react';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import { Route, withRouter } from 'react-router-dom';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends Component{
  componentDidMount(){
    this.props.onTryAutoAuth();
  }

  render(){
    return (
      <div>
        <Layout>
          <Route path="/" exact component={BurgerBuilder}/>
          <Route path="/orders" exact component={Orders}/>
          <Route path="/auth" exact component={Auth}/>
          <Route path="/checkout" component={Checkout}/>
          <Route path="/logout" component={Logout}/>
        </Layout>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoAuth: () => dispatch(actions.authCheckState()),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
