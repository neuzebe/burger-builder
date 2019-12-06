import React, {Component} from 'react';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component{
  state = {
    showSidebar: false
  };

  sideDrawerClosedHandler = () => {
    this.setState({showSidebar: false})
  };

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSidebar: !prevState.showSidebar };
    });
  };

  render(){
    return (
        <Aux>
          <div>
            <Toolbar 
             isAuth={this.props.isAuthenticated}
             drawerToggleClicked={this.sideDrawerToggleHandler} />
            <SideDrawer 
              isAuth={this.props.isAuthenticated}
              open={this.state.showSidebar} 
              closed={this.sideDrawerClosedHandler} />
          </div>
          <main className={classes.Content}>
            {this.props.children}
          </main>
        </Aux>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

export default connect(mapStateToProps)(Layout);