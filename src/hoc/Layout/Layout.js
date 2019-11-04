import React, {Component} from 'react';
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
            <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
            <SideDrawer open={this.state.showSidebar} closed={this.sideDrawerClosedHandler} />
          </div>
          <main className={classes.Content}>
            {this.props.children}
          </main>
        </Aux>
    )
  }
}

export default Layout;