import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import {Provider} from 'react-native-paper';
import ApiMethod from '../../../../api/ApiMethod';
import CustomButton from '../../../../compenents/CustomButton';
import CustomPopup from '../../../../compenents/CustomPopup';
import CustomProgress from '../../../../compenents/CustomProgress';
import CustomStatus from '../../../../compenents/CustomStatus';
import ImageView from '../../../../compenents/ImageView';
import height from '../../../../Units/height';
import width from '../../../../Units/width';
import ConstData from '../../../../utility/ConstData';
import Fonts from '../../../../utility/Fonts';
import ToastUtility from '../../../../utility/ToastUtility';
import {useFocusEffect} from '@react-navigation/native';

const MyJobsTabScreen = ({navigation}) => {
  const [jobList, setJobList] = useState([]);
  const [filterJobType, setFilterJobType] = useState('All');
  const [filterJobList, setFilterJobList] = useState([]);

  const [showProgress, setShowProgress] = useState(false);
  const [showRefreshing, setShowRefreshing] = useState(false);

  const [errorTitle, setErrorTitle] = useState('ss');
  const [errorMessage, setErrorMessage] = useState('ss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setError] = useState(false);

  console.log('mail List=> ', jobList);
  console.log('filtered List=> ', filterJobList);

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
      setShowProgress(true);
      getAppliedJobs();
    });
  }, []);

  const handleRefresh = () => {
    setShowRefreshing(true);
    getAppliedJobs();
  };

  const handleButtonPress = () => {
    // Trigger refresh when the button is pressed
    handleRefresh();
  };

  useEffect(() => {
    // Trigger refresh when the component mounts
    handleRefresh();
  }, []);

  const getAppliedJobs = () => {
    ApiMethod.myjob(
      pass => {
        setShowProgress(false);
        setShowRefreshing(false);
        console.log('pass', pass);
        if (pass.status == 200) {
          setJobList(pass.data);
          filterJob(pass.data, filterJobType);
        } else {
          setJobList([]);
          setFilterJobList([]);
        }
      },
      fail => {
        setShowProgress(false);
        setShowRefreshing(false);
        console.log('fail', fail);
        setJobList([]);
        setFilterJobList([]);
      },
    );
  };

  const filterJob = (list, filtr) => {
    console.log('11111');
    if (filtr == 'All') {
      setFilterJobList(list);
    } else {
      var t1 = [];
      list.map(item => {
        if (filtr == 'Applied') {
          if (item.assign_job == 0) {
            t1.push(item);
          }
        } else if (filtr == 'Hired') {
          if (item.assign_job == 1) {
            t1.push(item);
          }
        }
      });
      setFilterJobList(t1);
    }
  };

  const removeApplication = job => {
    setShowProgress(true);
    var formData = new FormData();
    formData.append('job_id', job.job_id);

    ApiMethod.removeJob(
      formData,
      pass => {
        setShowProgress(false);
        if (pass.status == 200) {
          setErrorTitle('Success!');
          setErrorMessage('Job Applied Successfully.');
          setError(false);
          handleButtonPress();
        } else {
          setErrorTitle('Error!');
          if (pass.response) {
            setErrorMessage(ConstData.getErrorMsg(pass.response));
          } else {
            setErrorMessage(pass.message);
          }
          setError(true);
        }
      },
      fail => {
        setShowProgress(false);
        ToastUtility.showToast('Some Error Occurred.');
      },
    );
  };

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
              fontFamily: Fonts.Bold,
              fontSize: 4 * width,
            }}>
            My Jobs
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            width: '100%',
            marginTop: 1 * width,
            paddingVertical: 1 * width,
            backgroundColor: '#FFFFFF',
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 3 * width,
              width: '100%',
              paddingVertical: 1 * width,
            }}>
            {['All', 'Applied', 'Hired'].map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setFilterJobType(item);
                    filterJob(jobList, item);
                  }}
                  style={{
                    // width: 30 * width,
                    height: 4 * height,
                    backgroundColor:
                      filterJobType == item ? '#116939' : '#E4FFF1',
                    borderRadius: 4 * height,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 1 * width,
                    paddingHorizontal: 4 * width,
                  }}>
                  <Text
                    style={{
                      color: filterJobType == item ? '#E4FFF1' : '#116939',
                      fontSize: 3 * width,
                      fontFamily: Fonts.Regular,
                    }}
                    numberOfLines={1}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <FlatList
            style={{flex: 1}}
            data={filterJobList}
            refreshControl={
              <RefreshControl
                colors={['#116939', '#C59C27']}
                refreshing={showRefreshing}
                onRefresh={handleRefresh}
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
                    borderColor: '#EAEAEA',
                    paddingVertical: 4 * width,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 4 * width,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 4 * width,
                        fontFamily: Fonts.Medium,
                        flex: 1,
                      }}
                      numberOfLines={1}>
                      {item.job_profile_name}
                    </Text>

                    <TouchableOpacity
                      style={{
                        width: 30 * width,
                        height: 4 * height,
                        backgroundColor:
                          item.assign_job == '0'
                            ? '#E4FFF1'
                            : item.assign_job == '1'
                            ? '#CFFFE5'
                            : '#FF0000',
                        borderRadius: 4 * height,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color:
                            item.assign_job == '0'
                              ? '#116939'
                              : item.assign_job == '1'
                              ? '#01A54B'
                              : '#FFFFFF',
                          fontSize: 3.4 * width,
                          fontFamily: Fonts.SemiBold,
                        }}
                        numberOfLines={1}>
                        {item.assign_job == '0'
                          ? 'Applied'
                          : item.assign_job == '1'
                          ? 'Shortlisted'
                          : 'Unassigned'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 4 * width,
                      alignItems: 'center',
                      marginTop: 1 * width,
                    }}>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: '#A4A4A4',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                          flex: 1,
                        }}
                        numberOfLines={1}>
                        {item.hospitals_name}
                      </Text>
                      <Text
                        style={{
                          color: '#A4A4A4',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                          flex: 1,
                        }}
                        numberOfLines={1}>
                        {`Applied On ${moment(item.created_at).format(
                          'Do MMM YY',
                        )}`}
                      </Text>
                    </View>
                    {item.assign_job == '0' && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Warning!',
                            'Are you sure you want to remove job application?',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                              },
                              {
                                text: 'Yes',
                                onPress: () => {
                                  removeApplication(item);
                                },
                              },
                            ],
                          );
                        }}
                        style={{
                          // width: 40 * width,
                          paddingVertical: 1 * width,
                          // backgroundColor: '#E4FFF1',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#FC5353',
                            fontSize: 3.4 * width,
                            fontFamily: Fonts.SemiBold,
                          }}
                          numberOfLines={1}>
                          {'Remove Application'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ImageView>

      <CustomPopup
        show={showSuccess}
        error={isError}
        title={errorTitle}
        message={errorMessage}
        onDissmiss={() => {
          setShowSuccess(false);
          setShowProgress(true);
          getAppliedJobs();
        }}
      />

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

export default MyJobsTabScreen;
