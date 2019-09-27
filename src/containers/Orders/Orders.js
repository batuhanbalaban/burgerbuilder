import React, {Component} from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
class Orders extends Component {

    componentDidMount(){
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }

    render(){
        let orders = <Spinner/>;
        if(!this.props.loading){
            orders =this.props.orders.map(ord =>(
                        <Order 
                        key = {ord.id}
                        ingredients = {ord.ingredients}
                        price = {ord.price}/>
                    ));
        }
        return(
        <div>
            {orders}
        </div>
        );
    }
}


const mapStateToProps = state => {

    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token:state.auth.token,
        userId:state.auth.userId
    };
}

const mapDispatchToProps = dispatch =>{
    return {
        onFetchOrders: (token,userId) => dispatch(actions.fetchOrders(token,userId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders,axios));