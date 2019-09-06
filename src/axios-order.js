import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-my-burger-90b3c.firebaseio.com/'
});

export default instance;