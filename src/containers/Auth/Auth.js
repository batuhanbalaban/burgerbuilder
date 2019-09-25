import React , {Component} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import { timingSafeEqual } from 'crypto';

class Auth extends Component {

    state = {
        controls: {
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Mail Address'
                },
                value:'',
                validation:{
                    required:true,
                    isEmail:true
                },
                valid:false,
                touched:false
            },
            password:{
                elementType:'input',
                elementConfig:{
                    type:'password',
                    placeholder:'Password'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:6
                },
                valid:false,
                touched:false
            }
        }
    }
    checkValidity = (value, rules) =>{
        let isValid = false;
        if(rules){
            if(rules.required){
                if(value.trim() === ''){
                    return false;
                }
            }
            if(rules.minLength){
                if(value.trim().length<rules.minLength){
                    return false;
                }
            }
    
            if(rules.maxLength){
                if(value.trim().length>rules.maxLength){
                    return false;
                }
            }

            if (rules.isEmail) {
                const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                if(!pattern.test(value))
                {
                    return false;
                }
            }
    
            if (rules.isNumeric) {
                const pattern = /^\d+$/;
                if(!pattern.test(value))
                {
                    return false;
                }
            }
        }


        return true;
    }

    inputChangedHandler = (event, controlName) =>{
        const updatedControls = {
            ...this.state.controls,
            [controlName]:{
                ...this.state.controls[controlName],
                value:event.target.value,
                valid:this.checkValidity(event.target.value,this.state.controls[controlName].validation),
                touched:true
            }
        };
        this.setState({controls:updatedControls});
    }
    submitHandler = (event) =>{
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value);
    }
    render(){

        const formElementsArray =[];
        for(let key in this.state.controls){
            formElementsArray.push({
                id:key,
                config:this.state.controls[key]
            })
        }

        const form = formElementsArray.map(formElement => (
            <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event,formElement.id)}
            invalid={!formElement.config.valid}
            shouldValidate = {formElement.config.validation}
            touched = {formElement.config.touched}/>
            
        ));
        return(
            <div className={classes.Auth}>
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
            </div>
        );
    }
}


// const mapStateToProps = state => {

//     return {
//         ings: state.burgerBuilder.ingredients,
//         price: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error
//     };
// }

const mapDispatchToProps = dispatch =>{
    return {
        onAuth: (email,pass) => dispatch(actions.auth(email,pass))
    };
}




export default connect(null, mapDispatchToProps)(Auth);