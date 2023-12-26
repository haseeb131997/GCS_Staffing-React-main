import Toast from 'react-native-simple-toast';

export default {
  showToast: msg => {
    Toast.show(msg);
  },
  // showCenterToast: msg => {
  //   Toast.showWithGravity(msg, Toast.LONG, Toast.CENTER);
  // },
};
