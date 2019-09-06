import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component{


    constructor (props){
        super(props);
        this.state ={
            ingredients:null,
            totalPrice:4,
            purchaseable:false,
            purchasing:false,
            loading:false,
            error:false
        }
    }

    componentDidMount(){
        if(!this.state.ingredients){
            axios.get('/ingredients.json')
            .then(response =>{
                this.setState({
                    ingredients:response.data
                });
            })
            .catch(err=>{
                this.setState({error:true});
            });
        }
    }
    updatePurcaheState(ingredients) {
        const sum = Object.keys(ingredients)
                        .map(igKey => {
                            return ingredients[igKey];
                        })
                        .reduce((sum,el)=>{
                            return sum + el;
                        },0);

        this.setState({purchaseable: sum>0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice:updatedPrice,
            ingredients:updatedIngredients
        });
        this.updatePurcaheState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if(oldCount <= 0 ){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice - priceDeduction;

        this.setState({
            totalPrice:updatedPrice,
            ingredients:updatedIngredients
        });
        this.updatePurcaheState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        //alert('You continue!');
        this.setState({loading:true});
        const order ={
            ingredients: this.state.ingredients,
            price:this.state.price,
            customer:{
                name:'Batuhan Balaban',
                address:{
                    street:'blabla st',
                    zipCode:'34000',
                    country:'Germany'
                },
                email:'test@test.com'
            },
            deliveryMethod:'fastest'
        }
        axios.post('/orders.json',order)
        .then(response=>{
            console.log(response);
            this.setState({loading:false, purchasing:false});
        })
        .catch(error=>{
            console.log(error);
            this.setState({loading:false, purchasing:false});
        });
    }

    render (){

        const disabledInfo ={
            ...this.state.ingredients
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0
        }
        let orderSummary = null;

        let burger = this.state.error?<p>Ingredients can't be loaded!</p>: <Spinner/>;
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = {this.state.ingredients}/>
                    <BuildControls
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler}
                    disabled = {disabledInfo}
                    price = {this.state.totalPrice}
                    purchaseable = {this.state.purchaseable}
                    ordered ={this.purchaseHandler}/>
                </Aux>
            );

            orderSummary = (
                <OrderSummary 
                ingredients = {this.state.ingredients}
                purchaseCancelled ={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price = {this.state.totalPrice}
                />
            );
        }

        if(this.state.loading){
            orderSummary = <Spinner/>
        }
        
        return (
            <Aux>
                <Modal show ={this.state.purchasing} modalClosed ={this.purchaseCancelHandler}>
                {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);