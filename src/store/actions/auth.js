import * as actionTypes from './actionTypes';
import axios from 'axios';

const authStart = () =>{
    return{
        type:actionTypes.AUTH_START
    };
};

const authSuccess = (token,userId) =>{
    return{
        type:actionTypes.AUTH_SUCCESS,
        token:token,
        userId:userId
    };
};

const authFail = (err) =>{
    return{
        type:actionTypes.AUTH_FAIL,
        error:err
    };
};



export const logout = () =>{
    return{
        type:actionTypes.AUTH_LOGOUT
    };
};

const checkAuthTimeout = (expirationTime) => {
    return dispatch =>{
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime*1000);
    };
};
export const auth = (email,password,isSignup) =>{
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email:email,
            password:password,
            returnSecureToken:true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDJzznzF47IBDeBZTNaICf96qVwl5-3wtU';
        if(!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDJzznzF47IBDeBZTNaICf96qVwl5-3wtU';
        }
        console.log(isSignup,url);
        axios.post(url,authData)
        .then(response =>{
            console.log(response);
            dispatch(authSuccess(response.data.idToken,response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
        })
        .catch(err=>{
            console.log(err);
            dispatch(authFail(err.response.data.error));
        })
    };
};

export const setAuthRedirectPath = (path) =>{
    return{
        type:actionTypes.SET_AUTH_REDIRECT_PATH,
        path:path
    };
};