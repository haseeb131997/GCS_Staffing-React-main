/* eslint-disable react-hooks/exhaustive-deps */
import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
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
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ApiMethod from '../../../../api/ApiMethod';
import CustomProgress from '../../../../compenents/CustomProgress';
import {StyleSheet} from 'react-native';
import {TouchableHighlight} from 'react-native';
import {Dimensions} from 'react-native';
import ToastUtility from '../../../../utility/ToastUtility';
import moment from 'moment';

// const gradientArr = [
//   ['#FFF4CBD9', '#FFC5C8D9'],
//   ['#FDCFFDD9', '#C0B3EBD9'],
//   // ['#FDCFFDD9', '#C0B3EBD9'],
// ];

const ProfileTabScreen = ({navigation}) => {
  const [userData, setUser] = useState(null);
  const [userPath, setUserPath] = useState('');
  const [userTrofy, setUserTrofy] = useState([]);
  const [trophyUrl, setTrophyUrl] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [totalBonus, setTotalBonus] = useState('');
  const [selectedReward, setSelectedReward] = useState(false);
  const [bonusModal, setBonusModal] = useState(false);

  const [showProgress, setShowProgress] = useState(false);
  const [showDPopup, setShowDPopup] = useState(false);

  // physical backButton  //
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        console.log('Navigating to Dashboard');
        navigation.navigate('Home');
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
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      getUserDetail();
    });
  }, [navigation]);

  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    console.log('uuuuuuuuuuuu', uu);
    setUser(uu);
    // var path = await StorageUtility.getProfilePath();
    // setUserPath(path);

    getProfile();
  };
  const getProfile = () => {
    ApiMethod.getTPProfile(
      async pass => {
        setShowProgress(false);
        if (pass.status == 200) {
          var data = pass.data;
          var pp = await StorageUtility.getProfilePath();
          await StorageUtility.storeUser(data);
          setUserTrofy(pass.userTrophy);
          console.log(
            'uuuuuufsiohffi;dlgdfgdfklgjdfhgdfjkghdfgjkhgkdjgdhfuuuuuu',
            pass.bonusData,
          );
          setTotalBonus(pass.bonusData);

          // setTotalBonus(
          //   pass.userTrophy.bonusData.reduce(
          //     (total, bonus) => total + parseInt(bonus.amount),
          //     0,
          //   ),
          // );
          setTrophyUrl(pass.trophy_image_url);
          setUserPath(pp);
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

  const handleBonusModal = () => {
    if (userData.addBonus) {
      setBonusModal(true);
    } else {
      setBonusModal(true);
      Alert.alert('Sorry !', 'You dont have any Bonus Amount right now');
    }
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditProfile', {
                    userData: userData,
                    userPicPath: userPath,
                  })
                }
                style={{
                  position: 'absolute',
                  top: width * 4,
                  right: width * 4,
                }}>
                <Image
                  style={{width: 24, height: 24, tintColor: '#008A3D'}}
                  source={require('../../../../assets/images/user-pen.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDPopup(true)}>
                <FastImage
                  source={
                    userPath.toLowerCase().includes('png') ||
                    userPath.toLowerCase().includes('jpg')
                      ? {uri: userPath}
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
                    width: '90%',
                    marginTop: 2 * width,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                  }}>
                  <FlatList
                    data={userTrofy}
                    horizontal
                    style={{}}
                    renderItem={({item, index}) => {
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
                              source={{uri: trophyUrl + item.image}}
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
                onPress={() => handleBonusModal()}
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
                <Feather
                  name="dollar-sign"
                  size={6 * width}
                  color={'#008A3D'}
                />
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4 * width,
                    paddingVertical: 1 * width,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 3 * width,
                      fontFamily: Fonts.Medium,
                    }}>
                    Bonus
                  </Text>
                  <Feather
                    name="chevron-down"
                    size={5 * width}
                    color="#000000"
                  />
                </View>
              </TouchableOpacity>

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
            alignSelf: 'center',
            paddingHorizontal: 2 * width,
            width: width * 82,
            height: height * 27,
            margin: 8,
            backgroundColor: 'white',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <Image
            source={{uri: trophyUrl + selectedReward.image}}
            style={{
              // flex: 1,
              width: width * 13,
              height: width * 13,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              // alignItems: 'center',
              marginLeft: width * 4,
            }}>
            <Text
              style={{
                // textAlign: 'center',
                color: '#b0b0b0',
                fontWeight: '500',
              }}>
              {'Name:  '}
            </Text>
            <Text
              style={{
                // textAlign: 'center',
                color: '#000000',
                fontWeight: '500',
              }}>
              {selectedReward.trophy_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: width * 4,
            }}>
            <Text
              style={{
                // textAlign: 'center',
                color: '#b0b0b0',
                fontWeight: '500',
              }}>
              {'Assigened On:  '}
            </Text>
            <Text
              style={{
                // textAlign: 'center',
                color: '#000000',
                fontWeight: '500',
              }}>
              {moment(selectedReward.created_at).format('Do MMM YYYY')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: width * 4,
            }}>
            <Text
              style={{
                // textAlign: 'center',
                color: '#b0b0b0',
                fontWeight: '500',
              }}>
              {'Assigened By:  '}
            </Text>
            <Text
              style={{
                // textAlign: 'center',
                color: '#000000',
                fontWeight: '500',
              }}>
              {selectedReward.hospital_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: width * 4,
              width: width * 65,
            }}>
            <Text
              style={{
                // textAlign: 'center',
                color: '#b0b0b0',
                fontWeight: '500',
              }}>
              {'Reason:  '}
              <Text
                numberOfLines={2}
                style={{
                  // textAlign: 'center',
                  color: '#000000',
                  fontWeight: '500',
                }}>
                {selectedReward && selectedReward.reason
                  ? selectedReward.reason.length > 130
                    ? selectedReward.reason.substring(0, 130) + '...'
                    : selectedReward.reason
                  : 'No description available'}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowReward(false)}
            style={{
              backgroundColor: '#C5FADD',
              width: width * 12,
              borderRadius: width * 1.5,
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: width * 3,
              left: width * 36,
            }}>
            <Text style={{padding: 5, color: '#000000'}}>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        visible={bonusModal}
        onDismiss={() => {
          setBonusModal(false);
        }}
        onBackdropPress={() => {
          setBonusModal(false);
        }}>
        <View
          style={{
            alignSelf: 'center',
            paddingHorizontal: 2 * width,
            width: width * 82,
            height: height * 50,
            margin: 8,
            backgroundColor: 'white',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 20, marginTop: 20}}>
            {totalBonus &&
              totalBonus.map(bonus => (
                <View
                  key={bonus.created_at}
                  style={{
                    height: height * 10,
                    margin: 8,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    paddingTop: width * 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: width * 4,
                    }}>
                    <Text
                      style={{
                        // textAlign: 'center',
                        color: '#b0b0b0',
                        fontWeight: '500',
                      }}>
                      {'Bonus: '}
                    </Text>
                    <Text
                      style={{
                        // textAlign: 'center',
                        color: '#000000',
                        fontWeight: '500',
                      }}>
                      {`${bonus.amount}$`}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: width * 4,
                    }}>
                    <Text
                      style={{
                        // textAlign: 'center',
                        color: '#b0b0b0',
                        fontWeight: '500',
                      }}>
                      {'Credited On:  '}
                    </Text>
                    <Text
                      style={{
                        // textAlign: 'center',
                        color: '#000000',
                        fontWeight: '500',
                      }}>
                      {moment(bonus.created_at).format('Do MMM YYYY')}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => setBonusModal(false)}
            style={{
              backgroundColor: '#C5FADD',
              width: width * 12,
              borderRadius: width * 1.5,
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: width * 3,
              left: width * 36,
            }}>
            <Text style={{padding: 5, color: '#000000'}}>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <CustomProgress show={showProgress} />
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
              userPath.toLowerCase().includes('png') ||
              userPath.toLowerCase().includes('jpg')
                ? {uri: userPath}
                : require('../../../../assets/images/user_dummy.png')
            }
            style={styles.enlargedImage}
          />
        </View>
      </Modal>
    </Provider>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: width * 100,
    height: height * 100,
  },
  closeButton: {
    marginTop: width * 15,
    marginBottom: 10,
    marginRight: width * 3,
  },
  closeButtonText: {
    textAlign: 'right',
    color: 'white',
    fontSize: 16,
  },
  enlargedImage: {
    resizeMode: 'stretch',
    width: width * 100,
    height: height * 80,
  },
});
export default ProfileTabScreen;
