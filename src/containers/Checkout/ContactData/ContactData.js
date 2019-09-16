import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component{
    state={
        name:'',
        email:'',
        address:{
            street:'',
            postalcode:''
        },
        loading:false


    }

    orderHandler = (event) => {
        event.preventDefault();
        
        this.setState({loading:true});
        const order ={
            ingredients: this.props.ingredients,
            price:this.props.price,
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
            this.setState({loading:false});
            this.props.history.push('/');
        })
        .catch(error=>{
            console.log(error);
            this.setState({loading:false});
        });
    }


    render(){

        let form = (
            <form>
                <Input inputtype="input" type="text" name="name" placeholder="Your Name"/>
                <Input inputtype="input" type="text" name="email" placeholder="Your Mail"/>
                <Input inputtype="input" type="text" name="street" placeholder="Street"/>
                <Input inputtype="input" type="text" name="postalcode" placeholder="Postal Code"/>
                <Button btnType="Success" clicked={this.orderHandler} >Place Order</Button>
            </form>
        );

        if(this.state.loading){
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

export default ContactData;