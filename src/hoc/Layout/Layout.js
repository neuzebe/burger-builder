import React, { useState } from 'react';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
  const [showSidebar, setShowSidebar] = useState(false);

  const sideDrawerClosedHandler = () => {
    setShowSidebar(false);
  };

  const sideDrawerToggleHandler = () => {
    setShowSidebar(!showSidebar);
  };

  return (
      <Aux>
        <div>
          <Toolbar 
            isAuth={props.isAuthenticated}
            drawerToggleClicked={sideDrawerToggleHandler} />
          <SideDrawer 
            isAuth={props.isAuthenticated}
            open={showSidebar} 
            closed={sideDrawerClosedHandler} />
        </div>
        <main className={classes.Content}>
          {props.children}
        </main>
      </Aux>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

export default connect(mapStateToProps)(Layout);