import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

export const addIngredient = (ingName) => {
    return{
        type:actionTypes.ADD_INGREDIENT,
        ingredientName:ingName

    };
};

export const removeIngredient = (ingName) => {
    return{
        type:actionTypes.REMOVE_INGREDIENT,
        ingredientName:ingName

    };
};

const setIngredients = (ingredients) =>{
    return{
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};
const fetchIngredientsFailed = () =>{
    return{
        type: actionTypes.FETCH_INGREDINTS_FAILED
    };
};
export const initIngredients = () => {
    return dispatch => {
        axios.get('/ingredients.json')
            .then(response =>{
                dispatch(setIngredients(response.data));
            })
            .catch(err=>{
                dispatch(fetchIngredientsFailed());
            });
    };
};