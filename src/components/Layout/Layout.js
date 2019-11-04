import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.module.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component{
  state = {
    showSidebar: true
  };

  sideDrawerClosedHandler = () => {
    this.setState({showSidebar: false})
  };

  render(){
    return (
        <Aux>
          <div>
            <Toolbar />
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