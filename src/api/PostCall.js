import axios from 'axios';
import ConstData from '../utility/ConstData';
import StorageUtility from '../utility/StorageUtility';
import RefreshTokenCall from './RefreshTokenCall';

const instance = axios.create({
  baseURL: ConstData.Base_Path,
  timeout: 100000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

instance.interceptors.request.use(async request => {
  console.log('Api Method', '=========POST=========');
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
  Post: (endpoint, data, pass, fail) => {
    console.log('Api EndPoint', endpoint);
    console.log('Api Post Data', data);

    instance
      .post(endpoint, data)
      .then(function (response) {
        pass(response.data);
      })
      .catch(function (error) {
        console.log(endpoint, 'Error:->', error);
        console.log(endpoint, 'Error.response:->', error.response);
        if (error.response.data) {
          let err = error.response.data;
          console.log(endpoint, 'err:->', err);
          console.log(endpoint, 'err.message:->', err.message);
          if (
            error.response.status == 401 &&
            err.message.includes('Unauthenticated')
          ) {
            console.log(endpoint, 'err.message:-> refreshing Token');
            RefreshTokenCall.refreshPostToken(endpoint, data, pass, fail);
          } else {
            fail(error);
          }
        } else {
          fail(error);
        }
      });
  },
};
