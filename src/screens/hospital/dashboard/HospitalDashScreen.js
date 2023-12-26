import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Provider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ImageView from '../../../compenents/ImageView';
import height from '../../../Units/height';
import width from '../../../Units/width';
import Fonts from '../../../utility/Fonts';
import ConstData from '../../../utility/ConstData';
import TabHomeScreen from '../tab_home/TabHomeScreen';
import CustomStatus from '../../../compenents/CustomStatus';
import TabProfileScreen from '../tab_profile/TabProfileScreen';
import CustomProgress from '../../../compenents/CustomProgress';
import ApiMethod from '../../../api/ApiMethod';
import ToastUtility from '../../../utility/ToastUtility';
import StorageUtility from '../../../utility/StorageUtility';
import {CommonActions} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';

const HospitalDashScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const [myJobs, setMyJobs] = useState([]);

  const [showProgress, setShowProgress] = useState(false);
  const [showRefreshing, setShowRefreshing] = useState(false);

  useEffect(() => {
    getUserDetail();
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      if (selectedTab == 1) {
        setShowProgress(true);
        getMyJobs();
        // } else {
        // getMyJobs();
      }
    });
  }, []);

  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    console.log(uu);
    setUser(uu);
  };

  const getMyJobs = () => {
    ApiMethod.getMyJobs(
      pass => {
        setShowProgress(false);
        setShowRefreshing(false);
        console.log('pass', pass);
        if (pass.status == 200) {
          setMyJobs(pass.jobs);
        } else {
          setMyJobs([]);
        }

        setTimeout(() => {
          VersionCheck.needUpdate().then(async res => {
            console.log(res); // true
            if (res.isNeeded) {
              Alert.alert(
                'Update Avalable',
                'A new version is available. Please update your app to use latest features',
                [
                  {
                    text: 'Update',
                    onPress: () => {
                      Linking.openURL(res.storeUrl); // open store if update is needed.
                    },
                  },
                ],
              );
            }
          });
        }, 1500);

      },
      fail => {
        setShowProgress(false);
        setShowRefreshing(false);
        console.log('fail', fail);
      },
    );
  };

  return (
    <Provider>
      {/* <StatusBar
        animated={true}
        translucent={false}
        backgroundColor="#FFFF00"
        barStyle={'dark-content'} // : 'dark-content'
        // showHideTransition={'fade'}
      /> */}
      <CustomStatus isDark={true} trans={true} color={'#FFFFFF'} />
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={{flex: 1, width: '100%'}}>
          {selectedTab == 1 ? (
            <TabHomeScreen
              jobs={myJobs}
              profile={() => setSelectedTab(2)}
              refreshList={() => {
                setShowRefreshing(true);
                getMyJobs();
              }}
              refreshing={showRefreshing}
              viewDetail={item =>
                navigation.navigate('JobDetail', {data: item})
              }
            />
          ) : (
            <TabProfileScreen
              userData={user}
              onLogoutPress={() => {
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
              }}
            />
          )}
        </View>

        <View
          style={{
            width: '100%',
            height: 15 * height,
            justifyContent: 'flex-end',
            alignItems: 'center',
            // backgroundColor:'#ada'
          }}>
          <ImageBackground
            source={require('../../../assets/images/bottom_tab_bar.png')}
            resizeMode={'stretch'}
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: 12 * height,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 2 * height,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (selectedTab != 1) {
                    setSelectedTab(1);
                    // getUserDetail(0);
                  }
                }}
                style={{
                  // flex: 1,
                  width: '100%',
                  height: '100%',
                  // backgroundColor: '#ada',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="home-outline"
                  size={7 * width}
                  color={selectedTab == 1 ? '#008A3D' : '#4D4D4D'}
                />
                <Text
                  style={{
                    fontSize: 3 * width,
                    color: selectedTab == 1 ? '#008A3D' : '#4D4D4D',
                    fontWeight: '500',
                    marginTop: 1 * width,
                    fontFamily: Fonts.SemiBold,
                  }}>
                  Home
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 2 * height,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (selectedTab != 2) {
                    setSelectedTab(2);
                    // getUserDetail(2);
                  }
                }}
                style={{
                  // flex: 1,
                  width: '100%',
                  height: '100%',
                  // backgroundColor: '#ada',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Feather
                  name="user"
                  size={7 * width}
                  color={selectedTab == 2 ? '#008A3D' : '#4D4D4D'}
                />
                <Text
                  style={{
                    fontSize: 3 * width,
                    color: selectedTab == 2 ? '#008A3D' : '#4D4D4D',
                    fontWeight: '500',
                    marginTop: 1 * width,
                    fontFamily: Fonts.SemiBold,
                  }}>
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PostJob');
            }}
            // style={{position: 'absolute', top: 0}}
            style={[
              {
                position: 'absolute',
                top: 0,
                width: 8.4 * height,
                height: 8.4 * height,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 6 * height,
              },
              ConstData.ELEVATION_STYLE,
            ]}>
            <View>
              <Image
                source={require('../../../assets/images/add.png')}
                resizeMode={'contain'}
                style={{
                  // flex: 1,
                  width: 5 * width,
                  height: 5 * width,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

export default HospitalDashScreen;
