import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ToastAndroid,
  Alert,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Provider} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import CustomButton from '../../../../compenents/CustomButton';
import CustomStatus from '../../../../compenents/CustomStatus';
import ImageView from '../../../../compenents/ImageView';
import height from '../../../../Units/height';
import width from '../../../../Units/width';
import Fonts from '../../../../utility/Fonts';
import moment from 'moment';
import ApiMethod from '../../../../api/ApiMethod';
import CustomProgress from '../../../../compenents/CustomProgress';
import CustomPopup from '../../../../compenents/CustomPopup';
import ConstData from '../../../../utility/ConstData';
import ToastUtility from '../../../../utility/ToastUtility';
import StorageUtility from '../../../../utility/StorageUtility';
import {useFocusEffect} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';

const HomeTabScreen = ({navigation}) => {
  const [jobList, setJobList] = useState([]);
  const [user, setUser] = useState(null);
  const [userPath, setUserPath] = useState('');

  const [showProgress, setShowProgress] = useState(false);
  const [showRefreshing, setShowRefreshing] = useState(false);

  const [errorTitle, setErrorTitle] = useState('ss');
  const [errorMessage, setErrorMessage] = useState('ss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [isErrorr, setErrorr] = useState(null);

  // exit app on pressong phy sical backbotton twice

  const [backButtonPressCount, setBackButtonPressCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => {
        backHandler.remove();
      };
    }, [backButtonPressCount]),
  );

  const handleBackPress = () => {
    if (backButtonPressCount === 0) {
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      setBackButtonPressCount(1);

      // Reset the press count after a certain time (e.g., 2 seconds)
      setTimeout(() => {
        setBackButtonPressCount(0);
      }, 2000);

      return true; // Prevent default back button behavior
    } else {
      // Perform any cleanup or additional actions before exiting the app
      // For now, simply exit the app
      BackHandler.exitApp();
      return true;
    }
  };

  useEffect(() => {
    getUserDetail();

    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      setShowProgress(true);
      getAllJobs();
    });
  }, [navigation]);

  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    var up = await StorageUtility.getProfilePath();
    setUserPath(up);
    console.log('===================================user', up);
    setUser(uu);
    // var path = await StorageUtility.getProfilePath();
    // setUserPath(path);
  };

  const getAllJobs = () => {
    ApiMethod.getAllJobs(
      pass => {
        setShowProgress(false);
        setShowRefreshing(false);
        console.log('pass data', pass);
        console.log('list of all jobs', pass.jobs);
        if (pass.status == 200) {
          setJobList(pass.jobs);
        } else {
          setJobList([]);
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
        setJobList([]);
      },
    );
  };

  const applyJob = (item, index) => {
    setShowProgress(true);

    var formData = new FormData();
    formData.append('job_id', item.id);

    ApiMethod.applyJob(
      formData,
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        if (pass.status == 200) {
          setErrorTitle('Success!');
          setErrorMessage('Job Applied Successfully.');
          setError(false);

          item['applyStatus'] = '1';
          var t1 = [...jobList];
          t1[index] = item;
          setJobList(t1);
          console.log('****************JOB****************', t1);
        } else {
          setErrorTitle('Error!');
          if (pass.response) {
            setErrorMessage(ConstData.getErrorMsg(pass.response));
          } else {
            setErrorMessage(pass.message);
          }

          setError(true);
        }
        setShowSuccess(true);
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
        ToastUtility.showToast('Some Error Occurred.');
      },
    );
  };

  const sortedJobData = jobList.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
  console.log('===================################', jobList);
  return (
    <Provider>
      <CustomStatus isDark={true} trans={true} color={'#FFFFFF'} />
      <ImageView>
        <View
          style={{
            width: '100%',
            height: 10 * height,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 6 * width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#000000',
              fontSize: 4 * width,
              fontFamily: Fonts.SemiBold,
            }}>
            {'Find the perfect\njob here!'}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TpNotification')}
              style={{padding: 2 * width, margin: 2 * width}}>
              <MaterialCommunityIcons
                name="bell-badge-outline"
                size={8 * width}
                color="#000000"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={
                  userPath.toLowerCase().includes('png') ||
                  userPath.toLowerCase().includes('jpg')
                    ? {uri: userPath}
                    : require('../../../../assets/images/user_dummy.png')
                }
                style={{
                  height: 6 * height,
                  width: 6 * height,
                  borderRadius: 4 * height,
                  backgroundColor: '#DADADA',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 10 * height,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 6 * width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Search', {Data: jobList});
            }}
            style={{
              width: '100%',
              height: 6 * height,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderRadius: 3 * width,
              borderColor: '#D4D4D4',
              paddingHorizontal: 5 * width,
            }}>
            <Text
              style={{
                color: '#A4A4A4',
                fontSize: 3 * width,
                fontFamily: Fonts.Regular,
              }}>
              {'Search Job...'}
            </Text>
            <Feather name="search" size={5 * width} color="#116939" />
          </TouchableOpacity>
        </View>
        {jobList.length != 0 && sortedJobData ? (
          <View
            style={{
              flex: 1,
              width: '100%',
              marginTop: 1 * width,
              paddingVertical: 1 * width,
              backgroundColor: '#FFFFFF',
            }}>
            <FlatList
              style={{flex: 1, width: '100%'}}
              data={sortedJobData}
              refreshControl={
                <RefreshControl
                  colors={['#116939', '#C59C27']}
                  refreshing={showRefreshing}
                  onRefresh={() => {
                    setShowRefreshing(true);
                    getAllJobs();
                  }}
                />
              }
              renderItem={({item, index}) => {
                const match = item.shiftType
                  ? item.shiftType.match(/\b(Day|Night|Evening)\b/)
                  : false;
                const Shift = match ? match[0] : null;
                const Time = item.shiftType
                  ? item.shiftType.replace(/\s*(Day|Night|Evening)\s*/, '')
                  : null;
                return (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 4 * width,
                      marginVertical: 2 * width,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 4 * width,
                      borderWidth: 1,
                      borderColor: '#F0F0F0',
                      paddingVertical: 5 * width,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        // alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 2,
                          height: 10 * width,
                          backgroundColor: '#116939',
                        }}
                      />
                      <Image
                        source={require('../../../../assets/images/baby-carriage1.png')}
                        style={{
                          width: 3 * height,
                          height: 3 * height,
                          marginTop: 1 * width,
                          marginHorizontal: 3 * width,
                        }}
                      />

                      <View style={{flex: 1, marginHorizontal: 1 * width}}>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 4 * width,
                            fontFamily: Fonts.Medium,
                          }}
                          numberOfLines={1}>
                          {item.job_profile}
                        </Text>

                        <View style={{flexDirection: 'row'}}>
                          <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={4 * width}
                            color="#A4A4A4"
                          />
                          <Text
                            style={{
                              color: '#A4A4A4',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                            }}
                            numberOfLines={1}>
                            {item.location}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <MaterialCommunityIcons
                            name="greenhouse"
                            size={4 * width}
                            color="#A4A4A4"
                          />
                          <Text
                            style={{
                              color: '#A4A4A4',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                            }}
                            numberOfLines={1}>
                            {item?.getHospitalName?.hospital_ltc_name || 'N/A'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginHorizontal: 1 * width,
                          marginEnd: 4 * width,
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{
                            color: '#A4A4A4',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          Starts From
                        </Text>
                        <Text
                          style={{
                            color: '#116939',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {item.start_date}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 4 * width,
                        marginTop: 2 * width,
                        marginBottom: 1 * width,
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons
                          name="calendar-clock-outline"
                          size={4 * width}
                          color="#116939"
                        />
                        <Text
                          style={{
                            color: '#A4A4A4',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                            marginStart: 2 * width,
                          }}
                          numberOfLines={1}>
                          <Text
                            style={{
                              color: '#116939',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                            }}>
                            {'Shift: '}
                          </Text>
                          <Text
                            style={{
                              color: '#116939',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                            }}>
                            {Shift ? Shift : item.shift ? item.shift : 'N/A'}
                          </Text>
                        </Text>
                      </View>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons
                          name="clock-time-eight-outline"
                          size={4 * width}
                          color="#C59C27"
                        />
                        <Text
                          style={{
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                            marginStart: 2 * width,
                          }}
                          numberOfLines={1}>
                          <Text
                            style={{
                              color: '#000000',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                            }}>
                            {'Time: '}
                          </Text>
                          <Text
                            style={{
                              color: '#000000',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                            }}>
                            {Time ? Time : 'N/A'}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        marginHorizontal: 5 * width,
                        backgroundColor: '#E8E8E8',
                        marginVertical: 2 * width,
                      }}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 2 * width,
                        marginTop: 2 * width,
                      }}>
                      <View
                        style={{
                          flex: 0.7,
                          height: 6 * height,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 3 * width,
                          borderWidth: 1,
                          borderColor: '#116939',
                          marginHorizontal: 1 * width,
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: 2.5 * width,
                          }}>
                          <Text
                            style={{
                              color: '#A4A4A4',
                              fontSize: 2.8 * width,
                              fontFamily: Fonts.Regular,
                            }}>
                            {'Price'}
                          </Text>
                          <Text
                            style={{
                              color: '#000000',
                              fontSize: 3 * width,
                              fontFamily: Fonts.SemiBold,
                            }}>
                            {item.price ? `$ ${item.price}/hr` : '$ 00.00'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flex: 0.9,
                          height: 6 * height,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 3 * width,
                          borderWidth: 1,
                          borderColor: '#116939',
                          marginHorizontal: 2 * width,
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: 3 * width,
                          }}>
                          <Text
                            style={{
                              color: '#A4A4A4',
                              fontSize: 2.8 * width,
                              fontFamily: Fonts.Regular,
                            }}>
                            {'Shift Days'}
                          </Text>
                          <Text
                            style={{
                              color: '#000000',
                              fontSize: 3.6 * width,
                              fontFamily: Fonts.SemiBold,
                            }}>
                            {`${item.working_day}`}
                          </Text>
                        </View>
                      </View>

                      {item.applyStatus == '1' ? (
                        <View
                          style={{
                            flex: 1,
                            height: 6 * height,
                            backgroundColor: '#116939',
                            borderRadius: 3 * width,
                            marginHorizontal: 1 * width,
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 4 * width,
                            }}>
                            <Feather
                              name="check"
                              size={4 * width}
                              color="#FFFFFF"
                            />
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontSize: 3 * width,
                                fontFamily: Fonts.Regular,
                                marginStart: 1 * width,
                              }}>
                              {'Applied'}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            applyJob(item, index);

                            // item['applied_status'] = 1;
                            // var t1 = [...jobList];
                            // t1[index] = item;
                            // setJobList(t1);
                          }}
                          style={{
                            flex: 1,
                            height: 6 * height,
                            backgroundColor: '#C59C27',
                            borderRadius: 3 * width,
                            marginHorizontal: 1 * width,
                          }}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 4 * width,
                            }}>
                            {/* <Feather
                          name="check"
                          size={4 * width}
                          color="#FFFFFF"
                        /> */}
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontSize: 3 * width,
                                fontFamily: Fonts.Regular,
                                marginStart: 1 * width,
                              }}>
                              {'Apply'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
              marginTop: 1 * width,
              paddingVertical: 1 * width,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#000000', fontWeight: '600', fontSize: 18}}>
              Sorry !
            </Text>
            <Text style={{color: '#000000', fontWeight: '600'}}>
              Right now there is no job matching with your profile
            </Text>
          </View>
        )}
      </ImageView>

      <CustomPopup
        show={showSuccess}
        error={isError}
        title={errorTitle}
        message={errorMessage}
        onDissmiss={() => {
          setShowSuccess(false);
        }}
      />

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

export default HomeTabScreen;
