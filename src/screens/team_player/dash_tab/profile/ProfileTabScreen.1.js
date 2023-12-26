import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Modal, Provider} from 'react-native-paper';
import ImageView from '../../../../compenents/ImageView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import height from '../../../../Units/height';
import width from '../../../../Units/width';
import Fonts from '../../../../utility/Fonts';
import StorageUtility from '../../../../utility/StorageUtility';
import ConstData from '../../../../utility/ConstData';
import FastImage from 'react-native-fast-image';
import CustomStatus from '../../../../compenents/CustomStatus';
import {CommonActions} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ApiMethod from '../../../../api/ApiMethod';
import CustomProgress from '../../../../compenents/CustomProgress';
import ToastUtility from '../../../../utility/ToastUtility';

// const gradientArr = [
//   ['#FFF4CBD9', '#FFC5C8D9'],
//   ['#FDCFFDD9', '#C0B3EBD9'],
//   // ['#FDCFFDD9', '#C0B3EBD9'],
// ];
export const ProfileTabScreen = ({navigation}) => {
  const [userData, setUser] = useState(null);
  const [userPath, setUserPath] = useState('');
  const [userTrofy, setUserTrofy] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [selectedReward, setSelectedReward] = useState(false);

  const [showProgress, setShowProgress] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      getUserDetail();
    });
  }, [getUserDetail, getProfile, navigation]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    console.log('uuuuuuuuuuuu', uu);
    setUser(uu);
    // var path = await StorageUtility.getProfilePath();
    // setUserPath(path);
    getProfile();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProfile = () => {
    ApiMethod.getTPProfile(
      async pass => {
        // console.log(pass);
        setShowProgress(false);
        if (pass.status == 200) {
          var data = pass.data;
          data.upload_profile = pass.profile_image_url + data.upload_profile;
          await StorageUtility.storeUser(data);
          setUserTrofy(pass.userTrophy);
          setUserPath(pass.trophy_image_url);
          console.log('user trophy', pass.userTrophy);
        }
      },
      fail => {
        console.log(fail);
        setShowProgress(false);
        ToastUtility.showToast('Some Error Occurred.');
      },
    );
  };

  const onLogoutPress = () => {
    Alert.alert('Warning!', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await StorageUtility.logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'AuthStack'}],
            }),
          );
        },
      },
    ]);
  };
  return (
    <Provider>
      <CustomStatus isDark={true} trans={true} color={'#FFFFFF'} />

      {userData && (
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

          <KeyboardAwareScrollView
            style={{
              width: '100%',
              marginTop: 1 * width,
              backgroundColor: '#FFFFFF',
            }}>
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
                <FastImage
                  source={
                    userData && userData.upload_profile
                      ? {uri: userData.upload_profile}
                      : require('../../../../assets/images/user_dummy.png')
                  }
                  style={{
                    width: 35 * width,
                    height: 35 * width,
                    borderRadius: 20 * width,
                    marginTop: 4 * height,
                  }}
                />
              </TouchableOpacity>

              {userTrofy.length > 0 && (
                <View
                  style={{
                    width: '100%',
                    marginTop: 2 * width,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                  }}>
                  <FlatList
                    data={userTrofy}
                    horizontal
                    style={{}}
                    renderItem={({item, index}) => {
                      // console.log(userPath + item.image);
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSelectedReward(item);
                            setShowReward(true);
                          }}>
                          <LinearGradient
                            colors={['#FFF4CBD9', '#FFC5C8D9']}
                            angle={135}
                            useAngle={true}
                            style={{
                              width: 18 * width,
                              height: 16 * width,
                              borderRadius: 3 * width,
                              marginHorizontal: 2 * width,
                              marginVertical: 2 * width,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            {/* {userPath && item.image && ( */}
                            <Image
                              source={{uri: userPath + item.image}}
                              style={{
                                // flex: 1,
                                width: '60%',
                                height: '60%',
                                resizeMode: 'contain',
                              }}
                            />
                            {/* )} */}
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              )}
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
                    Name
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 3.4 * width,
                      fontFamily: Fonts.Medium,
                    }}>
                    {userData.first_name}
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
                    }}>{`${userData.user_name}`}</Text>
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
                    }}>{`${userData.mobile_no}`}</Text>
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
                    }}>{`${userData.email}`}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => onLogoutPress()}
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
                <MaterialIcons
                  name="logout"
                  size={6 * width}
                  color={'#FF0000'}
                />

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
          </KeyboardAwareScrollView>
        </ImageView>
      )}

      <Modal
        visible={showReward}
        onDismiss={() => {
          setShowReward(false);
        }}
        onBackdropPress={() => {
          setShowReward(false);
        }}>
        <View
          style={{
            width: '90%',
            // height: '40%',
            borderRadius: 4 * width,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            alignSelf: 'center',
            paddingHorizontal: 4 * width,
            paddingBottom: 4 * width,
          }}>
          <FlatList
            data={userTrofy}
            horizontal
            renderItem={({item, index}) => {
              // console.log(userPath + item.image);
              return (
                <View>
                  <View
                    style={{
                      width: 18 * width,
                      height: 16 * width,
                      borderRadius: 3 * width,
                      marginHorizontal: 2 * width,
                      marginVertical: 2 * width,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* {userPath && item.image && ( */}
                    <Image
                      source={{uri: userPath + item.image}}
                      style={{
                        // flex: 1,
                        width: '60%',
                        height: '60%',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#000000',
                      fontWeight: '500',
                    }}>
                    {item.trophy_name}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </Modal>
      <CustomProgress show={showProgress} />
    </Provider>
  );
};
