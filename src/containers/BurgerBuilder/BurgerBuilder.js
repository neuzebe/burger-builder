import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  const ings  = useSelector( state => { return state.burgerBuilder.ingredients });
  const price = useSelector( state => { return state.burgerBuilder.totalPrice });
  const error = useSelector( state  => { return state.burgerBuilder.error });
  const isAuthenticated = useSelector( state => { return state.auth.token !== null });

  const dispatch            = useDispatch();
  const onIngredientAdded   = (name)   => dispatch(burgerBuilderActions.addIngredient(name));
  const onIngredientRemoved = (name) => dispatch(burgerBuilderActions.removeIngredient(name));
  const onInitIngredients   =   useCallback( () => dispatch(burgerBuilderActions.initIngredients()), [dispatch] );
  const onInitPurchase      = ()          => dispatch(burgerBuilderActions.purchaseInit());
  const onSetAuthRedirectPath = (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients])

  const updatePurchaseState = () => {
    const sum = Object.keys(ings).map(igKey => {
      return ings[igKey];
    }).reduce((sum, el) =>{
      return sum + el;
    }, 0);

    return sum > 0;
  }

  const purchaseHandler = () => {
    if(isAuthenticated){
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth')
    }
  };

  const purchaseCanceledHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinuedHandler = () => {
    onInitPurchase();
    props.history.push('/checkout');
  };

  const disabledInfo = {
    ...ings
  };

  for(let key in disabledInfo){
    disabledInfo[key] = disabledInfo[key] < 1
  }

  let orderSummary = null;
  let burger       = error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

  if(ings){
    burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
                isAuth={isAuthenticated}
                disabled={disabledInfo}
                ingredientAdded={onIngredientAdded}
                ingredientRemoved={onIngredientRemoved}
                purchaseable={updatePurchaseState()}
                ordered={purchaseHandler}
                price={price}
        />
      </Aux>
    );

    orderSummary = <OrderSummary
                      ingredients={ings}
                      purchaseCanceled={purchaseCanceledHandler}
                      purchaseContinued={purchaseContinuedHandler}
                      price={price}
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

export default withErrorHandler(BurgerBuilder, axios);