import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Modal,
  BackHandler,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Provider} from 'react-native-paper';
import CustomButton from '../../../compenents/CustomButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ImageView from '../../../compenents/ImageView';
import height from '../../../Units/height';
import width from '../../../Units/width';
import Fonts from '../../../utility/Fonts';
import FastImage from 'react-native-fast-image';
import ConstData from '../../../utility/ConstData';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomPopup from '../../../compenents/CustomPopup';
import ApiMethod from '../../../api/ApiMethod';
import CustomProgress from '../../../compenents/CustomProgress';
import StorageUtility from '../../../utility/StorageUtility';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ToastUtility from '../../../utility/ToastUtility';

const TabProfileScreen = props => {
  const [tempProfile, setTempProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [errorTitle, setErrorTitle] = useState('ss');
  const [errorMessage, setErrorMessage] = useState('ss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [userPicPath, setUserPicPath] = useState(null);
  const [showDPopup, setShowDPopup] = useState(false);
  console.log('user', props.userData);

  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        console.log('Navigating to Dashboard');
        navigation.replace('Dashboard');
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => {
        console.log('Removing back button listener');
        backHandler.remove(); // Remove the listener on screen blur
      };
    }, [navigation]),
  );

  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = () => {
    setShowProgress(true);
    ApiMethod.getHProfile(
      async pass => {
        console.log(pass);
        setShowProgress(false);
        if (pass.status == 200) {
          let data = pass.image_url + pass.data.upload_profile;
          console.log(
            '*************************/////////grated/////////*************************',
            data,
          );
          await StorageUtility.storeProfilePath(data);
          setUserPicPath(data);
          // getUserProfilePic();
        }
      },
      fail => {
        console.log(fail);
        setShowProgress(false);
        ToastUtility.showToast('Some Error Occurred.');
      },
    );
  };

  const handleUploadBtn = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
    };
    launchCamera(options, async response => {
      if (response.didCancel) {
        // console.log('User cancelled camera');
      } else if (response.error) {
        // console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setTempProfile(imageUri);
        // console.log('uri of image', imageUri);
        updateProfilePic(imageUri);
      }
    });
  };
  const handleGalleryBtn = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setTempProfile(imageUri);
        // console.log('uri of image', imageUri);
        updateProfilePic(imageUri);
      }
    });
  };
  const updateProfilePic = imageUri => {
    let image = {
      uri:
        Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
      type: 'image/png',
      name: 'profile_image.png',
    };
    var formData = new FormData();
    formData.append('profile_image', image);
    updateImage(formData);
  };
  const updateImage = formData => {
    setShowProgress(true);
    ApiMethod.HpProfilePicUpdate(
      formData,
      pass => {
        setShowProgress(false);
        console.log('Hospital-Profile Pic update-pass', pass);
        if (pass.status == 200) {
          setErrorTitle('Success!');
          setErrorMessage('Updated Successfully!');
          setError(false);
        } else {
          setErrorTitle('Error!');
          setErrorMessage(ConstData.getErrorMsg(pass.response));
          setError(true);
        }
        setShowSuccess(true);
      },
      fail => {
        setShowProgress(false);
        console.log('Hospital-image UpdateUpdate-fail', fail);
        setErrorTitle('Error!');
        setErrorMessage('Updation Failed!');
        setError(true);
        setShowSuccess(true);
      },
    );
  };

  return (
    <Provider>
      {props.userData && (
        <ImageView>
          <View
            style={{
              width: '100%',
              height: 10 * height,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 6 * width,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 5 * width,
                fontFamily: Fonts.Medium,
              }}
              numberOfLines={1}>
              Profile
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              width: '100%',
              marginTop: 1 * width,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => setShowDPopup(true)}>
              <FastImage
                source={
                  tempProfile
                    ? {uri: tempProfile}
                    : userPicPath
                    ? {uri: userPicPath}
                    : require('../../../assets/images/user_dummy.png')
                }
                style={{
                  width: 35 * width,
                  height: 35 * width,
                  borderRadius: 20 * width,
                  marginTop: 4 * height,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                position: 'absolute',
                top: height * 16,
                right: width * 33,
                backgroundColor: '#c0c0c0',
                width: width * 7,
                height: width * 7,
                borderRadius: 3.5 * width,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  tintColor: '#008A3D',
                  marginLeft: 5,
                }}
                source={require('../../../assets/images/user-pen.png')}
              />
            </TouchableOpacity>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 3 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="user" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Name
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  {props.userData.hospital_ltc_name}
                </Text>
              </View>
            </View>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="user" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Username
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>{`${props.userData.username}`}</Text>
              </View>
            </View>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="phone-call" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Number
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>{`${props.userData.phone_no}`}</Text>
              </View>
            </View>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="mail" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Email
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>{`${props.userData.email}`}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => props.onLogoutPress()}
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
              ]}>
              <MaterialIcons name="logout" size={6 * width} color={'#FF0000'} />

              <Text
                style={{
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                  color: '#FF0000',
                  fontSize: 3 * width,
                  fontFamily: Fonts.Medium,
                }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ImageView>
      )}
      <CustomProgress show={showProgress} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <View
            style={{
              width: width * 80,
              height: height * 25,
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              // alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: '#000000',
                fontWeight: '700',
              }}>
              Upload Profile Image
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                margin: 30,
                // alignSelf: 'center',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  // padding: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                onPress={() => {
                  handleUploadBtn();
                  setModalVisible(false);
                }}>
                <Image
                  style={{width: 55, height: 55}}
                  source={require('../../../assets/images/cameraUpload.png')}
                />
                <Text style={{color: '#000000', fontSize: 12}}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  // padding: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                onPress={() => {
                  handleGalleryBtn();
                  setModalVisible(false);
                }}>
                <Image
                  style={{width: 43, height: 43}}
                  source={require('../../../assets/images/Gallery.png')}
                />
                <Text style={{color: '#000000', fontSize: 12}}>Gallery</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                alignSelf: 'center',
                marginTop: Platform.OS === 'ios' ? 5 : -10,
                backgroundColor: '#C5FADD',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#000000',
                  padding: 3,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CustomPopup
        show={showSuccess}
        error={isError}
        title={errorTitle}
        message={errorMessage}
        onDissmiss={() => {
          setShowSuccess(false);
          if (isError == false) {
            // navigation.goBack();
          }
        }}
      />
      <Modal
        visible={showDPopup}
        dismissable={true}
        onDismiss={() => setShowDPopup(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDPopup(false)}>
            {/* You can use a close button or any other UI element to close the modal */}
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={
              tempProfile
                ? {uri: tempProfile}
                : userPicPath
                ? {uri: userPicPath}
                : require('../../../assets/images/user_dummy.png')
            }
            style={styles.enlargedImage}
          />
        </View>
      </Modal>
    </Provider>
  );
};
const styles = StyleSheet.create({
  btnCon: {
    width: width * 100,
    height: height * 7,
    marginTop: height * 1,
    alignItems: 'center',
  },
  viewButton: {
    height: height * 6,
    width: width * 90,
    alignItems: 'center',
    backgroundColor: '#008A3D',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textButton: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 13,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: width * 100,
    height: height * 70,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  enlargedImage: {
    resizeMode: 'stretch',
    width: width * 100,
    height: width * 100,
  },
});
export default TabProfileScreen;
