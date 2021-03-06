import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';
import {checkValidity} from '../../../shared/utility';
class ContactData extends Component{
    state={
        orderForm: {            
            name:{
                    elementType:'input',
                    elementConfig:{
                        type:'text',
                        placeholder:'Your Name'
                    },
                    value:'',
                    validation:{
                        required:true,
                        minLength:5,
                        maxLength:20
                    },
                    valid:false,
                    touched:false
                },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Street'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            zipCode:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'ZIP Code'
                },
                value:'',
                validation:{
                    required:true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                valid:false,
                touched:false
            },
            country:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Country'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            email:{
                elementType:'email',
                elementConfig:{
                    type:'text',
                    placeholder:'Your E-Mail'
                },
                value:'',
                validation:{
                    required:true,
                    isEmail: true
                },
                valid:false,
                touched:false
            },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[
                            {value:'fastest', displayValue:'Fastest'},
                            {value:'cheapest', displayValue:'Cheapest'}
                        ]
                },
                valid:true,
                value:'fastest'
            }
        },
        formIsValid:false


    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};

        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        
        const order ={
            ingredients: this.props.ings,
            price:this.props.price,
            orderData:formData,
            userId:this.props.userId

        }
        this.props.onPurchaseStart(order,this.props.token);
    }

    inputChangedHandler = (event, inputIdentifier) =>{
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let allValid = true;
        for(let item in updatedOrderForm)
        {
            if(updatedOrderForm[item].validation && !updatedOrderForm[item].valid){
                allValid = false;
                break;
            }
            
        }
        
        this.setState({orderForm:updatedOrderForm,formIsValid:allValid});
        
    }

    render(){

        const formElementsArray =[];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            })
        }




        let form = (
            <form onSubmit = {this.orderHandler}>
                {formElementsArray.map(formElement=>(
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event,formElement.id)}
                        invalid={!formElement.config.valid}
                        shouldValidate = {formElement.config.validation}
                        touched = {formElement.config.touched}
                    />
                ))}
                <Button btnType="Success" disabled = {!this.state.formIsValid}>Place Order</Button>
            </form>
        );

        if(this.props.loading){
            form = <Spinner/>;
        }

        return(
        <div className={classes.ContactData}>
            <h4>Enter your contact data</h4>
            {form}
        </div>
        )
    }

}

const mapStateToProps = state => {

    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch =>{
    return {
        onPurchaseStart: (orderData,token) => dispatch(orderActions.purchaseBurger(orderData,token))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData, axios));