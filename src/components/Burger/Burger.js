import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
  const transformedIngredients = Object.keys(props.ingredients)
          .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => { // create an ingredient element for each type in props ingredient and for the right count
              return <BurgerIngredient key={igKey + i} type={igKey} />;
            })
          });

  return(
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top"/>
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom"/>
    </div>
  );
};

export default burger;