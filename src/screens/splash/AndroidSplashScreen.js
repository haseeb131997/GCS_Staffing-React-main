import React, {Fragment, useEffect} from 'react';
import {Image, ImageBackground, StatusBar, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Provider} from 'react-native-paper';
import ImageView from '../../compenents/ImageView';
import width from '../../Units/width';
import ColorCode from '../../utility/ColorCode';

const AndroidSplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Waiting');
    }, 3000);

    // Get.Get();
  }, []);

  return (
    <Provider>
      <StatusBar
        animated={true}
        translucent={true}
        backgroundColor="#FFFFFF00"
        barStyle={'dark-content'} // : 'dark-content'
        showHideTransition={'fade'}
      />

      <ImageView>
        <Image
          source={require('../../assets/images/splash_logo.png')}
          style={{width: 60 * width, height: 60 * width, resizeMode: 'contain'}}
        />
      </ImageView>
    </Provider>
  );
};

export default AndroidSplashScreen;
