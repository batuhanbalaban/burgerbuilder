import React,{Component} from 'react';
import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

class Layout extends Component{

    state ={
        showSideDrawer:false
    }
    sideDrawarClosedHandler=()=>{
        this.setState({showSideDrawer:false});
    }
    sideDrawerToggleHandler=()=>{
        this.setState((prevState) =>{
            return {showSideDrawer:!prevState.showSideDrawer}
        });
    }
    render(){
        return(
            <Aux>
                <Toolbar 
                isAuth={this.props.isAuthenticated}
                drawerToggleClicked ={this.sideDrawerToggleHandler}/>
                <SideDrawer 
                isAuth={this.props.isAuthenticated}
                show={this.state.showSideDrawer} closed={this.sideDrawarClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}


const mapStateToProps = state => {

    return {
        isAuthenticated: state.auth.token !== null
    };
}

// const mapDispatchToProps = dispatch =>{
//     return {
//         onIngredientAdded: (ing) => dispatch(actions.addIngredient(ing)),
//         onIngredientRemoved: (ing) => dispatch(actions.removeIngredient(ing)),
//         onInitIngredients: () => dispatch(actions.initIngredients()),
//         onInitPurchase : () => dispatch(actions.purchaseInit())
//     };
// }

export default connect(mapStateToProps)(Layout);