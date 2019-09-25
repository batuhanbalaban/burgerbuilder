 import React,{Component} from 'react';
 import {connect} from 'react-redux';
 import * as actions from '../../../store/actions/index';
 import {Redirect} from 'react-router-dom';

 class Logout extends Component {

    componentDidMount(){
        this.props.onLogout();
    }
    render(){

        return <Redirect to="/"/>;
    }
 }


//  const mapStateToProps = state => {

//     return {
//         ings: state.burgerBuilder.ingredients,
//         price: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error
//     };
// }

const mapDispatchToProps = dispatch =>{
    return {
        onLogout: (ng) => dispatch(actions.logout())
    };
}


 export default connect(null, mapDispatchToProps)(Logout);