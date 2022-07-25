import axios from 'axios'

const baseUrl = "http://127.0.0.1:5000";

class HttpRequest{
  get(url){
    return axios.get(baseUrl + url);
  }
}

export default HttpRequest;