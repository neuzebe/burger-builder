import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat:  1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchaseable: false,
    purchasing:   false,
    loading:      false
  };

  updatePurchaseState(ingredients){
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey]
    }).reduce((sum, el) =>{
      return sum + el;
    }, 0);

    console.log(ingredients, sum);

    this.setState({purchaseable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount      = this.state.ingredients[type];
    const updateCounted = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };

    updatedIngredients[type] = updateCounted;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCanceledHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinuedHandler = () => {
    //alert('you continue');
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price:       this.state.totalPrice,
      customer:    {
        name: 'Noel Euzebe',
        address: {
          street: 'Test 123 Elm',
          zipCode: '131331',
          country: 'Canada'
        },
        email: 'test@gmail.com',
        deliveryMethod: 'fastest',

      }
    };

    axios.post('/orders.json', order)
          .then(response => {
            console.log(response);
            this.setState({loading: false, purchasing: false})
          })
          .catch(error => {
            console.log(error);
            this.setState({loading: false, purchasing: false})
          })
  };

  removeIngredientHandler = (type) => {
    const oldCount      = this.state.ingredients[type];
    if(oldCount < 1){
      return;
    }

    const updateCounted = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };

    updatedIngredients[type] = updateCounted;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({ingredients: updatedIngredients, totalPrice: newPrice.round(2)});
    this.updatePurchaseState(updatedIngredients);
  };

  render(){
    const disabledInfo = {
      ...this.state.ingredients
    };

    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] < 1
    }

    let orderSummary = <OrderSummary
                          ingredients={this.state.ingredients}
                          purchaseCanceled={this.purchaseCanceledHandler}
                          purchaseContinued={this.purchaseContinuedHandler}
                          price={this.state.totalPrice.toFixed(2)}
                  />;

    if(this.state.loading){
      orderSummary = <Spinner/>
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCanceledHandler}>
          {orderSummary}
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          disabled={disabledInfo}
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
          price={this.state.totalPrice}
        />
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);