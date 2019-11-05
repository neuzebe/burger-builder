import axios from 'axios';

const instance = axios.create({
  baseURL:  'https://react-my-burger-e266b.firebaseio.com/',

});

export default instance;