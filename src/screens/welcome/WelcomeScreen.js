import React, {Fragment, useEffect} from 'react';
import {Image, ImageBackground, StatusBar, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Provider} from 'react-native-paper';
import CustomButton from '../../compenents/CustomButton';
import ImageView from '../../compenents/ImageView';
import height from '../../Units/height';
import width from '../../Units/width';
import Fonts from '../../utility/Fonts';
import StorageUtility from '../../utility/StorageUtility';

const WelcomeScreen = ({navigation}) => {
  useEffect(() => {
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
          source={require('../../assets/images/welcome_img.png')}
          style={{
            width: '100%',
            height: 64 * height,
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
          }}
        />

        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0.5}}
          colors={['#FFFFFF', '#FFFFFF', '#E7D7AE']}
          style={{
            width: '100%',
            height: 40 * height,
            position: 'absolute',
            bottom: 0,
            borderTopLeftRadius: 8 * width,
            borderTopRightRadius: 8 * width,
            alignItems: 'center',
          }}>
          <Text
            style={{
              width: '60%',
              fontSize: 6 * width,
              textAlign: 'center',
              fontFamily: Fonts.SemiBold,
              marginTop: 3 * height,
            }}>
            <Text style={{color: '#000000'}}>{`Welcome to `}</Text>
            <Text style={{color: '#116939'}}>{`Green Creek Solutions!`}</Text>
          </Text>

          <Text
            style={{
              width: '60%',
              fontSize: 3 * width,
              textAlign: 'center',
              fontFamily: Fonts.Regular,
              marginTop: 3 * height,
              color: '#000000',
            }}>
            The best platform to find the perfect job opportunities in
            caregiving for you. Post and find your desired job right here!
          </Text>

          <CustomButton
            btnText="Get Started"
            colors={['#116939', '#116939']}
            enable={true}
            btnStyle={{
              width: '86%',
              marginTop: 6 * height,
              marginBottom: 2 * height,
              elevation: 1 * width,
            }}
            btnTextStyle={{
              //fontWeight: '700',
              fontFamily: Fonts.Regular,
              fontSize: 4 * width,
            }}
            onPress={() => {
              navigation.replace('Login');
              StorageUtility.setShowIntro();
            }}
          />
        </LinearGradient>
      </ImageView>
    </Provider>
  );
};

export default WelcomeScreen;
