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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Menu, Provider} from 'react-native-paper';
import CustomButton from '../../../compenents/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageView from '../../../compenents/ImageView';
import height from '../../../Units/height';
import width from '../../../Units/width';
import Fonts from '../../../utility/Fonts';
import ToastUtility from '../../../utility/ToastUtility';
import moment from 'moment';
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import StorageUtility from '../../../utility/StorageUtility';

const countries = ['Unassign'];

const TabHomeScreen = props => {
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState('');
  console.log('***********************************/////////////', props.jobs);

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

  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getUserProfilePic);

    return () => {
      // Cleanup function to unsubscribe when the component unmounts
      unsubscribe();
    };
  }, [navigation, getUserProfilePic]);
  const [userPicPath, setUserPicPath] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserProfilePic = async () => {
    let path = await StorageUtility.getProfilePath();
    setUserPicPath(path);
    console.log('#######################', path);
  };
  getUserProfilePic();
  return (
    <Provider>
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
          <Image
            source={require('../../../assets/images/splash_logo.png')}
            style={{
              width: 7 * height,
              height: 8 * height,
              resizeMode: 'contain',
            }}
          />

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{padding: 2 * width, margin: 2 * width}}>
              <MaterialCommunityIcons
                name="bell-badge-outline"
                size={8 * width}
                color="#000000"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.profile();
              }}>
              <Image
                source={
                  userPicPath
                    ? {uri: userPicPath}
                    : require('../../../assets/images/user_dummy.png')
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
            flex: 1,
            width: '100%',
            marginTop: 1 * width,
            backgroundColor: '#FFFFFF',
          }}>
          <FlatList
            style={{flex: 1, width: '100%'}}
            data={props.jobs}
            refreshControl={
              <RefreshControl
                colors={['#116939', '#C59C27']}
                refreshing={props.refreshing}
                onRefresh={() => props.refreshList()}
              />
            }
            renderItem={({item, index}) => {
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
                        height: 5 * height,
                        backgroundColor: '#116939',
                      }}
                    />
                    <Image
                      source={require('../../../assets/images/baby-carriage1.png')}
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
                        {moment(item.start_date).format('Do MMM YY')}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: '#A4A4A4',
                      fontSize: 3 * width,
                      fontFamily: Fonts.Regular,
                      marginHorizontal: 4 * width,
                      marginVertical: 1 * width,
                    }}
                    numberOfLines={1}>
                    <Text
                      style={{
                        color: '#A4A4A4',
                        fontSize: 3 * width,
                        fontFamily: Fonts.Regular,
                      }}>
                      {'Requirements : '}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 3 * width,
                        fontFamily: Fonts.Regular,
                      }}>
                      {item.requirement}
                    </Text>
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      // width: '100%',
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
                        flex: 1,
                        height: 6 * height,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 3 * width,
                        borderWidth: 1,
                        marginHorizontal: 2 * width,
                        borderColor: '#116939',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#909090',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                        }}
                        numberOfLines={1}>
                        <Text
                          style={{
                            color: '#A4A4A4',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {'Shift Days  '}
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 3 * width,
                            fontFamily: Fonts.SemiBold,
                          }}>
                          {item.working_day}
                        </Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        props.viewDetail(item);
                      }}
                      style={{
                        flex: 1,
                        height: 6 * height,
                        backgroundColor: '#116939',
                        borderRadius: 3 * width,
                        borderWidth: 1,
                        marginHorizontal: 2 * width,
                        borderColor: '#116939',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#909090',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                        }}
                        numberOfLines={1}>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {'View Details'}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {item.status == '1' ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 2 * width,
                      }}>
                      <Text
                        style={{
                          color: '#116939',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                        }}
                        numberOfLines={1}>
                        {'Live and visible to Team Players'}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 2 * width,
                      }}>
                      <Text
                        style={{
                          color: '#909090',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                        }}
                        numberOfLines={1}>
                        {'Pending For Approval From Admin'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      </ImageView>
    </Provider>
  );
};

export default TabHomeScreen;
