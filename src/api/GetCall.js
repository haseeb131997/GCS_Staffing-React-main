import axios from "axios";
import ConstData from "../utility/ConstData";
import StorageUtility from "../utility/StorageUtility";
import RefreshTokenCall from "./RefreshTokenCall";

// const axios = require('axios');
const instance = axios.create({
  baseURL: ConstData.Base_Path,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async request => {
  console.log('Api Method', '=========GET =========');
  console.log('Starting Request', JSON.stringify(request));

  var token = await StorageUtility.getJWTToken();

  if (token) {
    console.log('JWT TOKEN', token);
    request.headers.Authorization = `Bearer ${token}`;
  }
  // console.log('Headers', request.headers);
  return request;
});

instance.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response));
  return response;
});

export default {
  Get: (endpoint, pass, fail, params = null) => {
    console.log('Api EndPoint', endpoint);

    if (params != null) {
      endpoint = endpoint + params;
    }
    instance
      .get(endpoint)
      .then(function (response) {
        pass(response.data);
      })
      .catch(function (error) {
        console.log(endpoint, 'Error:->', error.response);
        console.log(endpoint, 'Error Status:->', error.response.status);
        if (error.response.data) {
          let err = error.response.data;
          console.log(endpoint, 'err:->', err);
          console.log(endpoint, 'err.message:->', err.message);
          if (
            error.response.status == 401 &&
            err.message.includes('Unauthenticated')
          ) {
            console.log(endpoint, 'err.message:-> refreshing Token');
            RefreshTokenCall.refreshGetToken(endpoint, pass, fail, params);
          } else {
            fail(error);
          }
        } else {
          fail(error);
        }
      });
  },
};
