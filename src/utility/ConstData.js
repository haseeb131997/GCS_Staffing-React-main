import {Platform} from 'react-native';

export default {
  // Base_Path: 'https://techmavesoftwaredev.com/gcs/api/',
  Base_Path: 'https://gcsstaffingapp.com/api/',
  Email_Regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/,
  Phone_Regex:
    /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/,

  ELEVATION_STYLE:
    Platform.OS == 'android'
      ? {
          elevation: 2,
        }
      : {
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowColor: '#DDDDDD',
          shadowOpacity: 1,
          zIndex: 999,
        },

  ELEVATION_STYLE2:
    Platform.OS == 'android'
      ? {
          elevation: 2,
        }
      : {
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowColor: '#DDDDDD',
          shadowOpacity: 1,
          zIndex: 999,
        },

  getErrorMsg: obj => {
    console.log('obj', obj);
    var arr = [];
    var error = '';

    Object.keys(obj).map(key => {
      console.log(key, obj[key]);

      obj[key].map(er => {
        // arr.push(er);
        if (error == '') {
          error = er;
        } else {
          error += ' ' + er;
        }
      });
    });
    console.log('final error=>  ', error);
    return error;
  },

  getUnAssignArr: () => {
    let arr = ['Unassign'];
    return arr;
  },

  getShiftArr: () => {
    let arr = [
      {lable: 'Day', value: 'day'},
      {lable: 'Evening', value: 'evening'},
      {lable: 'Night', value: 'night'},
    ];
    return arr;
  },
};
