import axios from 'axios';
import ConstData from '../utility/ConstData';
import StorageUtility from '../utility/StorageUtility';
import GetCall from './GetCall';
import PostCall from './PostCall';

// const axios = require('axios');
const instance = axios.create({
  baseURL: ConstData.Base_Path,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async request => {
  console.log('Api Method', '=========POST =========');
  console.log('Starting Request', JSON.stringify(request));

  var token = await StorageUtility.getJWTToken();
  console.log('JWT TOKEN=>', token);

  request.headers.Authorization = `Bearer ${token}`;

  console.log('Headers', request.headers);
  return request;
});

instance.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response));
  return response;
});

const RefreshEndPoint = 'refresh-token';

export default {
  refreshPostToken: (endpoint, data, pass, fail) => {
    console.log('Api EndPoint', RefreshEndPoint);

    // if (params != null) {
    //   endpoint = endpoint + params;
    // }
    instance
      .post(RefreshEndPoint, {})
      .then(async function (response) {
        // pass(response.data);
        if (response.data.status) {
          await StorageUtility.storeJWTToken(response.data.access_token);
          PostCall.Post(endpoint, data, pass, fail, params);
        }
      })
      .catch(function (error) {
        console.log(RefreshEndPoint, 'Error:->', error.response);
        // fail(error);
      });
  },

  refreshGetToken: (endpoint, pass, fail, params = null) => {
    console.log('Api EndPoint', RefreshEndPoint);

    instance
      .post(RefreshEndPoint, {})
      .then(async function (response) {
        if (response.data.status) {
          await StorageUtility.storeJWTToken(response.data.access_token);
          GetCall.Get(endpoint, pass, fail, params);
        }
      })
      .catch(function (error) {
        console.log(RefreshEndPoint, 'Error:->', error.response);
        // fail(error);
      });
  },
};
