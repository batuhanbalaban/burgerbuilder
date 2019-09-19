import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component{


    constructor (props){
        super(props);
        this.state ={
            purchasing:false,
            loading:false,
            error:false
        }
    }

    componentDidMount(){
        //console.log(this.props);
        // if(!this.state.ingredients){
        //     axios.get('/ingredients.json')
        //     .then(response =>{
        //         this.setState({
        //             ingredients:response.data
        //         });
        //     })
        //     .catch(err=>{
        //         this.setState({error:true});
        //     });
        // }
    }
    isBurgerPurchasable(ingredients) {
        const sum = Object.keys(ingredients)
                        .map(igKey => {
                            return ingredients[igKey];
                        })
                        .reduce((sum,el)=>{
                            return sum + el;
                        },0);

        return sum>0;
    }


    purchaseHandler = () => {
        this.setState({purchasing:true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        //alert('You continue!');
        // this.setState({loading:true});
        // const order ={
        //     ingredients: this.state.ingredients,
        //     price:this.state.price,
        //     customer:{
        //         name:'Batuhan Balaban',
        //         address:{
        //             street:'blabla st',
        //             zipCode:'34000',
        //             country:'Germany'
        //         },
        //         email:'test@test.com'
        //     },
        //     deliveryMethod:'fastest'
        // }
        // axios.post('/orders.json',order)
        // .then(response=>{
        //     console.log(response);
        //     this.setState({loading:false, purchasing:false});
        // })
        // .catch(error=>{
        //     console.log(error);
        //     this.setState({loading:false, purchasing:false});
        // });
        const queryParams = [];
        for(let i  in this.state.ingredients){
            queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.props.price);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search:'?'+queryString
        });
    }

    render (){

        const disabledInfo ={
            ...this.props.ings
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0
        }
        let orderSummary = null;

        let burger = this.state.error?<p>Ingredients can't be loaded!</p>: <Spinner/>;
        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ings}/>
                    <BuildControls
                    ingredientAdded = {this.props.onIngredientAdded}
                    ingredientRemoved = {this.props.onIngredientRemoved}
                    disabled = {disabledInfo}
                    price = {this.props.price}
                    purchaseable = {this.isBurgerPurchasable(this.props.ings)}
                    ordered ={this.purchaseHandler}/>
                </Aux>
            );

            orderSummary = (
                <OrderSummary 
                ingredients = {this.props.ings}
                purchaseCancelled ={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price = {this.props.price}
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


const mapStateToProps = state => {

    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = dispatch =>{
    return {
        onIngredientAdded: (ing) => dispatch({type:actionTypes.ADD_INGREDIENT, ingredientName:ing}),
        onIngredientRemoved: (ing) => dispatch({type:actionTypes.REMOVE_INGREDIENT, ingredientName:ing})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));