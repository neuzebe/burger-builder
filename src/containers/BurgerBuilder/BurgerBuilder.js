import React, { useState, useEffect } from 'react';
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

const BurgerBuilder = props =>  {
  const [ purchasing, setPurchasing ] = useState(false);
  //const [ loading, setLoading] = useState();

  useEffect(() => {
    props.onInitIngredients();
  }, [])

  const updatePurchaseState = () => {
    const sum = Object.keys(props.ings).map(igKey => {
      return props.ings[igKey];
    }).reduce((sum, el) =>{
      return sum + el;
    }, 0);

    return sum > 0;
  }

  const purchaseHandler = () => {
    if(props.isAuthenticated){
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath('/checkout');
      props.history.push('/auth')
    }
  };

  const purchaseCanceledHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinuedHandler = () => {
    props.onInitPurchase();
    props.history.push('/checkout');
  };

  const disabledInfo = {
    ...props.ings
  };

  for(let key in disabledInfo){
    disabledInfo[key] = disabledInfo[key] < 1
  }

  let orderSummary = null;
  let burger       = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

  if(props.ings){
    burger = (
      <Aux>
        <Burger ingredients={props.ings} />
        <BuildControls
                isAuth={props.isAuthenticated}
                disabled={disabledInfo}
                ingredientAdded={props.onIngredientAdded}
                ingredientRemoved={props.onIngredientRemoved}
                purchaseable={updatePurchaseState()}
                ordered={purchaseHandler}
                price={props.price}
        />
      </Aux>
    );

    orderSummary = <OrderSummary
                      ingredients={props.ings}
                      purchaseCanceled={purchaseCanceledHandler}
                      purchaseContinued={purchaseContinuedHandler}
                      price={props.price}
    />;
  }

  // if(loading){
  //   orderSummary = <Spinner/>
  // }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCanceledHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
}

const mapStateToProps = state => {
  return {
    ings:  state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (name)   => dispatch(burgerBuilderActions.addIngredient(name)),
    onIngredientRemoved: (name) => dispatch(burgerBuilderActions.removeIngredient(name)),
    onInitIngredients: ()       => dispatch(burgerBuilderActions.initIngredients()),
    onInitPurchase: ()          => dispatch(burgerBuilderActions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));