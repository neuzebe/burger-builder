import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {
  state = {
    purchasing:   false,
  };

  componentDidMount(){
    this.props.onInitIngredients();
  }

  updatePurchaseState(){
    const sum = Object.keys(this.props.ings).map(igKey => {
      return this.props.ings[igKey];
    }).reduce((sum, el) =>{
      return sum + el;
    }, 0);

    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCanceledHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinuedHandler = () => {
    this.props.history.push('/checkout');
  };

  render(){
    const disabledInfo = {
      ...this.props.ings
    };

    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] < 1
    }

    let orderSummary = null;
    let burger       = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

    if(this.props.ings){
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
                  disabled={disabledInfo}
                  ingredientAdded={this.props.onIngredientAdded}
                  ingredientRemoved={this.props.onIngredientRemoved}
                  purchaseable={this.updatePurchaseState()}
                  ordered={this.purchaseHandler}
                  price={this.props.price}
          />
        </Aux>
      );

      orderSummary = <OrderSummary
                        ingredients={this.props.ings}
                        purchaseCanceled={this.purchaseCanceledHandler}
                        purchaseContinued={this.purchaseContinuedHandler}
                        price={this.props.price.toFixed(2)}
      />;
    }

    if(this.state.loading){
      orderSummary = <Spinner/>
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCanceledHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings:  state.ingredients,
    price: state.totalPrice,
    error: state.error,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (name)   => dispatch(burgerBuilderActions.addIngredient(name)),
    onIngredientRemoved: (name) => dispatch(burgerBuilderActions.removeIngredient(name)),
    onInitIngredients: ()       => dispatch(burgerBuilderActions.initIngredients()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));