import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Button,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Modal, Provider} from 'react-native-paper';
import CustomButton from '../../../compenents/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import ImageView from '../../../compenents/ImageView';
import height from '../../../Units/height';
import width from '../../../Units/width';
import Fonts from '../../../utility/Fonts';
import {Dropdown} from 'react-native-element-dropdown';
import CustomStatus from '../../../compenents/CustomStatus';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomProgress from '../../../compenents/CustomProgress';
import ApiMethod from '../../../api/ApiMethod';
import moment from 'moment';
import ToastUtility from '../../../utility/ToastUtility';
import CustomPopup from '../../../compenents/CustomPopup';
import ConstData from '../../../utility/ConstData';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const PostJobScreen = ({navigation}) => {
  const [shift, setShift] = useState('');
  const [shiftTime, setShiftTime] = useState('');
  const [worikingDayArr, setWorikingDayArr] = useState([
    {lable: 'Monday', value: 'Mon'},
    {lable: 'Tuesday', value: 'Tue'},
    {lable: 'Wednesday', value: 'Wed'},
    {lable: 'Thursday', value: 'Thu'},
    {lable: 'Friday', value: 'Fri'},
    {lable: 'Saturday', value: 'Sat'},
    {lable: 'Sunday', value: 'Sun'},
  ]);
  const [desciplineArr, setDesciplineArr] = useState([]);
  const [excerciseArr, setExcerciseArr] = useState([]);

  const [selectedDesciplineArr, setSelectedDesciplineArr] = useState([]);
  const [tempDesciplineArr, setTempDesciplineArr] = useState([]);

  const [selectedExcerciseArr, setSelectedExcerciseArr] = useState([]);
  const [tempExcerciseArr, setTempExcerciseArr] = useState([]);

  const [jobProfile, setJobProfile] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeType, setTimeType] = useState(1);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateType, setDateType] = useState(1);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [showDPopup, setShowDPopup] = useState(false);
  const [showEPopup, setShowEPopup] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const [errorTitle, setErrorTitle] = useState('ss');
  const [errorMessage, setErrorMessage] = useState('ss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setError] = useState(false);

  // const navigation = useNavigation();

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
    getDecpline();
  }, []);

  const getDecpline = () => {
    setShowProgress(true);
    ApiMethod.getDiscipline(
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        setDesciplineArr(pass.discipline);
        getExcercise();
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
      },
    );
  };

  const getExcercise = () => {
    setShowProgress(true);
    ApiMethod.getExperence(
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        setExcerciseArr(pass.experence);
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
      },
    );
  };

  const checkDescpline = given => {
    return tempDesciplineArr.some(item => item.id == given.id);
  };

  const checkExcercise = given => {
    return tempExcerciseArr.some(item => item.id == given.id);
  };

  const create = () => {
    if (jobProfile.trim() == '') {
      ToastUtility.showToast('Enter Job Profile');
    } else if (selectedDesciplineArr.length == 0) {
      ToastUtility.showToast('Select Descipline');
    } else if (selectedExcerciseArr.length == 0) {
      ToastUtility.showToast('Select Experience Area');
    } else if (requirements.trim().length == 0) {
      ToastUtility.showToast('Enter Requirements');
    } else if (startDate.length == 0) {
      ToastUtility.showToast('Select Start Date');
    } else if (endDate.length == 0) {
      ToastUtility.showToast('Select End Date');
    } else if (location.trim().length == 0) {
      ToastUtility.showToast('Enter Location');
    } else if (startDay.length == 0 || endDay.length == 0) {
      ToastUtility.showToast('Select Working Days');
    } else {
      setShowProgress(true);
      var formData = new FormData();

      // formData.append("job_profile")
      formData.append('job_profile', jobProfile);
      formData.append('requirement', requirements);

      const match = selectedShift.match(/\b(Day|Night|Evening)\b/);
      const shifT = match ? match[0] : null;
      const TimE = selectedShift.replace(/\s*(Day|Night|Evening)\s*/, '');

      formData.append('shift', shift);
      // formData.append('shift_time', shift);
      console.log(
        '************shift****',
        shifT,
        '**********Shift Time**********',
        TimE,
      );
      formData.append('shift_time', selectedShift);
      formData.append('job_location', location);

      selectedDesciplineArr.map(d => {
        formData.append('discipline[]', d.id);
      });
      selectedExcerciseArr.map(e => {
        formData.append('experience[]', e.id);
      });

      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('working_day', startDay + ' - ' + endDay);

      ApiMethod.createJob(
        formData,
        pass => {
          setShowProgress(false);
          console.log('pass', pass);
          if (pass.status == 200) {
            setErrorTitle('Success!');
            setErrorMessage('Job Created Successfully.');
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
          console.log('fail', fail);
          setErrorTitle('Error!');
          setErrorMessage('Some Error Occurred.');
          setError(true);
          setShowSuccess(true);
        },
      );
    }
  };

  // to choose the shift time //
  // const [storeShift, setStoreShift] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [isShiftPickerVisible, setShiftPickerVisible] = useState(false);
  const [shift8, setShift8] = useState(true);
  const [shift12, setShift12] = useState(false);
  const shifts8hrs = [
    '6 a.m - 2 p.m (day)',
    '7 a.m - 3 p.m (day)',
    '2 p.m - 10 p.m (evening)',
    '3 p.m - 11 p.m (evening)',
    '10 p.m - 6 a.m (night)',
    '11 p.m - 7 a.m (night)',
  ];
  const shifts12hrs = [
    '6 a.m - 6 p.m (day)',
    '7 a.m - 7 p.m (day)',
    '6 p.m to 6 a.m (night)',
    '7 p.m to 7 a.m (night)',
  ];
  const saveSelectedShift = () => {
    if (shift8) {
      setShift('8 Hr');
      setShiftTime('8 Hr');
    } else {
      setShiftTime('12 Hr');
      setShift('12 Hr');
    }
    setShiftPickerVisible(!isShiftPickerVisible);
  };
  const handleShiftSelection = shft => {
    setSelectedShift(shft);
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
            Request Team Player
          </Text>

          <TouchableOpacity
            onPress={navigation.goBack}
            style={{
              width: 9 * width,
              height: 9 * width,
              margin: 2 * width,
              borderRadius: 2 * width,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EFFFF6',
            }}>
            <Ionicons name="md-chevron-back" size={5 * width} color="#000000" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            width: '100%',
            marginTop: 1 * width,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            paddingVertical: 2 * width,
          }}>
          <KeyboardAwareScrollView
            style={{width: '100%'}}
            contentContainerStyle={{alignItems: 'center'}}>
            <View style={{width: '90%', marginTop: 2 * width}}>
              <Text style={Style.title}>Job Profile</Text>
              <TextInput
                style={Style.inputBox}
                placeholder="Enter Job Profile"
                placeholderTextColor="#A4A4A4"
                keyboardType="default"
                autoCapitalize="words"
                value={jobProfile}
                onChangeText={t => {
                  setJobProfile(t);
                }}
              />
            </View>

            <View style={{width: '90%', marginTop: 3 * width}}>
              <Text style={Style.title}>Discipline</Text>
              <TouchableOpacity
                onPress={() => {
                  var t = [...selectedDesciplineArr];
                  setTempDesciplineArr(t);
                  setShowDPopup(true);
                }}
                style={Style.selectBox}>
                <Text
                  style={
                    selectedDesciplineArr.length > 0
                      ? Style.selectText1
                      : Style.selectText
                  }>
                  {selectedDesciplineArr.length > 0
                    ? selectedDesciplineArr.length == 1
                      ? selectedDesciplineArr[0].discipline_name
                      : selectedDesciplineArr[0].discipline_name +
                        ' + ' +
                        (selectedDesciplineArr.length - 1)
                    : 'Select Discipline'}
                </Text>
                <Feather name="chevron-down" size={5 * width} color="#A4A4A4" />
              </TouchableOpacity>
            </View>

            <View style={{width: '90%', marginTop: 3 * width}}>
              <Text style={Style.title}>With current experience in</Text>
              <TouchableOpacity
                onPress={() => {
                  var t = [...selectedExcerciseArr];
                  setTempExcerciseArr(t);
                  setShowEPopup(true);
                }}
                style={Style.selectBox}>
                <Text
                  style={
                    selectedExcerciseArr.length > 0
                      ? Style.selectText1
                      : Style.selectText
                  }>
                  {selectedExcerciseArr.length > 0
                    ? selectedExcerciseArr.length == 1
                      ? selectedExcerciseArr[0].experience_name
                      : selectedExcerciseArr[0].experience_name +
                        ' + ' +
                        (selectedExcerciseArr.length - 1)
                    : 'Select Area'}
                </Text>
                <Feather name="chevron-down" size={5 * width} color="#A4A4A4" />
              </TouchableOpacity>
            </View>

            <View style={{width: '90%', marginTop: 3 * width}}>
              <Text style={Style.title}>Requirements</Text>
              <TextInput
                style={Style.inputLargeBox}
                keyboardType="default"
                autoCapitalize="words"
                multiline={true}
                placeholder="Enter Job Profile"
                placeholderTextColor="#A4A4A4"
                value={requirements}
                onChangeText={t => {
                  setRequirements(t);
                }}
              />
            </View>

            <View style={{width: '90%', marginTop: 3 * width}}>
              <Text style={Style.title}>Shift</Text>
              <TouchableOpacity
                onPress={() => {
                  setShiftPickerVisible(true);
                  setShift8(true);
                  setShift12(false);
                }}
                style={Style.dateSelect}>
                <Text style={Style.date}>
                  {shift ? `${shift}  ${selectedShift}` : 'Choose Shift'}
                </Text>
                <AntDesign name="down" size={5 * width} color="#116939" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '90%',
                marginTop: 3 * width,
                flexDirection: 'row',
              }}>
              <View style={{flex: 1, marginEnd: 2 * width}}>
                <Text style={Style.title}>Start Date</Text>
                <TouchableOpacity
                  onPress={() => {
                    setDateType(1);
                    setDatePickerVisibility(true);
                  }}
                  style={Style.dateSelect}>
                  <Text style={Style.date}>
                    {startDate ? startDate : 'MM-DD-YYYY'}
                  </Text>
                  <AntDesign name="calendar" size={5 * width} color="#116939" />
                </TouchableOpacity>
              </View>

              <View style={{flex: 1, marginStart: 2 * width}}>
                <Text style={Style.title}>End Date</Text>
                <TouchableOpacity
                  onPress={() => {
                    setDateType(2);
                    setDatePickerVisibility(true);
                  }}
                  style={Style.dateSelect}>
                  <Text style={Style.date}>
                    {endDate ? endDate : 'MM-DD-YYYY'}
                  </Text>
                  <AntDesign name="calendar" size={5 * width} color="#116939" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{width: '90%', marginTop: 3 * width}}>
              <Text style={Style.title}>Location</Text>
              <TextInput
                style={Style.inputLargeBox}
                keyboardType="default"
                autoCapitalize="words"
                multiline={true}
                placeholder="Enter Location"
                placeholderTextColor="#A4A4A4"
                value={location}
                onChangeText={t => {
                  setLocation(t);
                }}
              />
            </View>

            <View style={{width: '90%', marginTop: 3 * width}}>
              <Text style={Style.title}>Shift Days</Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '48%'}}>
                  <View style={Style.selectBox}>
                    <Dropdown
                      style={[
                        {
                          // flex: 1,
                          width: '100%',
                          backgroundColor: '#F7F8F800',
                        },
                      ]}
                      dropdownPosition="top"
                      placeholderStyle={{
                        fontSize: 3.6 * width,
                        color: '#D8D8D8',
                        fontFamily: Fonts.Regular,
                      }}
                      selectedTextStyle={{
                        color: '#2F2F2F',
                        fontSize: 3.6 * width,
                        fontFamily: Fonts.Regular,
                      }}
                      itemTextStyle={{
                        color: '#2F2F2F',
                        fontSize: 3.6 * width,
                        fontFamily: Fonts.Regular,
                      }}
                      data={worikingDayArr}
                      maxHeight={30 * height}
                      labelField="lable"
                      valueField="value"
                      placeholder={startDay == '' ? 'Start Day' : '...'}
                      value={startDay}
                      onChange={item => {
                        setStartDay(item.value);
                      }}
                      containerStyle={{
                        backgroundColor: '#FFFFFF',
                        marginTop: Platform.OS == 'android' ? -0 * width : 0,
                        borderRadius: 2 * width,
                      }}
                    />
                  </View>
                </View>
                <View style={{width: '48%'}}>
                  <View style={Style.selectBox}>
                    <Dropdown
                      style={[
                        {
                          width: '100%',
                          backgroundColor: '#F7F8F800',
                        },
                      ]}
                      dropdownPosition="top"
                      placeholderStyle={{
                        fontSize: 3.6 * width,
                        color: '#D8D8D8',
                        fontFamily: Fonts.Regular,
                      }}
                      selectedTextStyle={{
                        color: '#2F2F2F',
                        fontSize: 3.6 * width,
                        fontFamily: Fonts.Regular,
                      }}
                      itemTextStyle={{
                        color: '#2F2F2F',
                        fontSize: 3.6 * width,
                        fontFamily: Fonts.Regular,
                      }}
                      data={worikingDayArr}
                      maxHeight={30 * height}
                      labelField="lable"
                      valueField="value"
                      placeholder={endDay == '' ? 'End Day' : '...'}
                      value={endDay}
                      onChange={item => {
                        setEndDay(item.value);
                      }}
                      containerStyle={{
                        backgroundColor: '#FFFFFF',
                        marginTop: Platform.OS == 'android' ? -0 * width : 0,
                        borderRadius: 2 * width,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            <CustomButton
              btnText="Post Job"
              colors={['#116939', '#116939']}
              enable={true}
              btnStyle={{
                width: '90%',
                marginTop: 4 * height,
                marginBottom: 2 * height,
                elevation: 1 * width,
              }}
              btnTextStyle={{
                //fontWeight: '700',
                fontFamily: Fonts.Regular,
                fontSize: 4 * width,
              }}
              onPress={() => {
                create();
                // if (loginType == 1) {
                //   navigation.navigate('HospitalStack');
                // }
                // navigation.goBack();
              }}
            />
          </KeyboardAwareScrollView>
        </View>
      </ImageView>

      <Modal
        visible={showDPopup}
        dismissable={true}
        onDismiss={() => setShowDPopup(false)}>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 4 * width,
          }}>
          <View
            style={{
              width: '100%',
              height: 7 * height,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 4 * width,
              backgroundColor: '#116939',
              borderTopEndRadius: 4 * width,
              borderTopStartRadius: 4 * width,
            }}>
            <Text
              style={{
                fontSize: 4 * width,
                fontFamily: Fonts.Medium,
                color: '#FFF',
              }}>
              Select
            </Text>

            <TouchableOpacity onPress={() => setShowDPopup(false)}>
              <Ionicons name="close" size={5 * width} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              maxHeight: 30 * height,
              backgroundColor: '#FAFAFA',
              paddingVertical: 1 * height,
            }}>
            <FlatList
              data={desciplineArr}
              style={{width: '100%'}}
              renderItem={({item, index}) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '92%',
                      alignSelf: 'center',
                      height: 6 * height,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      paddingHorizontal: 2 * width,
                      // borderBottomWidth:
                      //   index == desciplineArr.length - 1 ? 0 : 1,
                      // borderColor: '#D8D8D8',
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 4 * width,
                        fontFamily: Fonts.Medium,
                        color: '#000000',
                        paddingTop: Platform.OS == 'android' ? 1 * width : 0,
                      }}>
                      {item.discipline_name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        var t = [...tempDesciplineArr];
                        if (checkDescpline(item)) {
                          var p = t.indexOf(item);
                          t.splice(p, 1);
                        } else {
                          t.push(item);
                        }
                        setTempDesciplineArr(t);
                      }}
                      style={{paddingVertical: 2 * width}}>
                      <Ionicons
                        name={
                          checkDescpline(item)
                            ? 'md-checkbox'
                            : 'md-square-outline'
                        }
                        size={5 * width}
                        color="#116939"
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              // height: 8 * height,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 4 * width,
              paddingVertical: 2 * height,
              backgroundColor: '#FFFFFF',
              borderBottomEndRadius: 4 * width,
              borderBottomStartRadius: 4 * width,
            }}>
            <TouchableOpacity
              onPress={() => {
                var t = [...tempDesciplineArr];
                setSelectedDesciplineArr(t);
                setTempDesciplineArr([]);
                setShowDPopup(false);
              }}
              style={{
                borderRadius: 3 * width,
                width: '100%',
                height: 6 * height,
                backgroundColor: '#116939',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 4.4 * width,
                  fontFamily: Fonts.Medium,
                  color: '#FFFFFF',
                  // paddingTop: Platform.OS == 'android' ? 1 * width : 0,
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEPopup}
        dismissable={true}
        onDismiss={() => setShowEPopup(false)}>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 4 * width,
          }}>
          <View
            style={{
              width: '100%',
              height: 7 * height,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 4 * width,
              backgroundColor: '#116939',
              borderTopEndRadius: 4 * width,
              borderTopStartRadius: 4 * width,
            }}>
            <Text
              style={{
                fontSize: 4 * width,
                fontFamily: Fonts.Medium,
                color: '#FFF',
              }}>
              Select
            </Text>

            <TouchableOpacity onPress={() => setShowEPopup(false)}>
              <Ionicons name="close" size={5 * width} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              maxHeight: 30 * height,
              backgroundColor: '#FAFAFA',
              paddingVertical: 1 * height,
            }}>
            <FlatList
              data={excerciseArr}
              style={{width: '100%'}}
              renderItem={({item, index}) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '92%',
                      alignSelf: 'center',
                      height: 6 * height,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      paddingHorizontal: 2 * width,
                      // borderBottomWidth:
                      //   index == desciplineArr.length - 1 ? 0 : 1,
                      // borderColor: '#D8D8D8',
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 4 * width,
                        fontFamily: Fonts.Medium,
                        color: '#000000',
                        paddingTop: Platform.OS == 'android' ? 1 * width : 0,
                      }}>
                      {item.experience_name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        var t = [...tempExcerciseArr];
                        if (checkExcercise(item)) {
                          var p = t.indexOf(item);
                          t.splice(p, 1);
                        } else {
                          t.push(item);
                        }
                        setTempExcerciseArr(t);
                      }}
                      style={{paddingVertical: 2 * width}}>
                      <Ionicons
                        name={
                          checkExcercise(item)
                            ? 'md-checkbox'
                            : 'md-square-outline'
                        }
                        size={5 * width}
                        color="#116939"
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              // height: 8 * height,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 4 * width,
              paddingVertical: 2 * height,
              backgroundColor: '#FFFFFF',
              borderBottomEndRadius: 4 * width,
              borderBottomStartRadius: 4 * width,
            }}>
            <TouchableOpacity
              onPress={() => {
                var t = [...tempExcerciseArr];
                setSelectedExcerciseArr(t);
                setTempExcerciseArr([]);
                setShowEPopup(false);
              }}
              style={{
                borderRadius: 3 * width,
                width: '100%',
                height: 6 * height,
                backgroundColor: '#116939',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 4.4 * width,
                  fontFamily: Fonts.Medium,
                  color: '#FFFFFF',
                  // paddingTop: Platform.OS == 'android' ? 1 * width : 0,
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShiftPickerVisible}
        onRequestClose={() => {
          setShiftPickerVisible(!isShiftPickerVisible);
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
              height: height * 55,
              margin: 20,
              backgroundColor: '#fcfcfc',
              borderRadius: 20,
              padding: 10,
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
                color: '#000000',
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: 10,
                marginTop: width * 3.5,
              }}>
              Choose Shift
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                width: width * 65,
                height: height * 5,
                backgroundColor: '#ffffff',
                borderRadius: width * 2,
                // padding: 10,
                // alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 2,
                justifyContent: 'center',
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setShift12(false);
                    setShift8(true);
                  }}
                  style={{
                    width: width * 27,
                    height: height * 4,
                    backgroundColor: shift8 ? '#116939' : '#F5F5F5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: width * 2,
                  }}>
                  <Text
                    style={{
                      color: shift8 ? '#ffffff' : '#116939',
                      fontSize: 12,
                    }}>
                    8 Hrs Shift
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setShift12(true);
                    setShift8(false);
                  }}
                  style={{
                    width: width * 27,
                    height: height * 4,
                    backgroundColor: shift12 ? '#116939' : '#F5F5F5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: width * 2,
                    marginLeft: width * 5,
                  }}>
                  <Text
                    style={{
                      color: shift12 ? '#ffffff' : '#116939',
                      fontSize: 12,
                    }}>
                    12 Hrs Shift
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {shift8 && (
              <View style={{marginTop: width * 2}}>
                {shifts8hrs.map((shft, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.shiftItem,
                      selectedShift === shft && styles.selectedItem,
                    ]}
                    onPress={() => handleShiftSelection(shft)}>
                    <Text style={{color: 'grey', fontSize: 13}}>{shft}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {shift12 && (
              <View style={{marginTop: width * 2}}>
                {shifts12hrs.map((shft, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.shiftItem,
                      selectedShift === shft && styles.selectedItem,
                    ]}
                    onPress={() => handleShiftSelection(shft)}>
                    <Text style={{color: 'grey', fontSize: 13}}>{shft}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                width: width * 65,
                height: height * 5,
                backgroundColor: '#ffffff',
                borderRadius: width * 2,
                // padding: 10,
                // alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 2,
                justifyContent: 'center',
                position: 'absolute',
                bottom: width * 4,
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setShiftPickerVisible(!isShiftPickerVisible);
                  }}
                  style={{
                    width: width * 27,
                    height: height * 4,
                    backgroundColor: '#C5FADD',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: width * 2,
                  }}>
                  <Text
                    style={{
                      color: '#116939',
                      fontSize: 12,
                      fontWeight: '600',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    saveSelectedShift();
                    setShiftPickerVisible(!isShiftPickerVisible);
                  }}
                  style={{
                    width: width * 27,
                    height: height * 4,
                    backgroundColor: '#116939',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: width * 2,
                    marginLeft: width * 5,
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: '600',
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        // dismissable={true}
        // onDismiss={() => setDatePickerVisibility(false)}
        mode="date"
        minimumDate={new Date()}
        onConfirm={date => {
          var d1 = moment(date).format('MM/DD/YYYY');
          console.log(date);
          console.log(d1);

          if (dateType == 1) {
            setStartDate(d1);
          } else {
            setEndDate(d1);
          }

          setDatePickerVisibility(false);
          Keyboard.dismiss();
        }}
        onCancel={() => {
          setDatePickerVisibility(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        // dismissable={true}
        // onDismiss={() => setDatePickerVisibility(false)}
        mode="time"
        // minimumDate={new Date()}
        onConfirm={time => {
          var t1 = moment(time).format('hh:mm A');
          console.log(time);
          console.log(t1);

          if (timeType == 1) {
            setStartTime(t1);
          } else {
            setEndTime(t1);
          }

          setTimePickerVisibility(false);
          Keyboard.dismiss();
        }}
        onCancel={() => {
          setTimePickerVisibility(false);
        }}
      />

      <CustomPopup
        show={showSuccess}
        error={isError}
        title={errorTitle}
        message={errorMessage}
        onDissmiss={() => {
          setShowSuccess(false);
          if (isError == false) {
            navigation.goBack();
          }
        }}
      />

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Style = StyleSheet.create({
  title: {
    fontFamily: Fonts.SemiBold,
    fontSize: 3 * width,
    color: '#2F2F2F',
  },
  day: {
    color: '#2F2F2F',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
    paddingHorizontal: 4 * width,
  },
  selector: {
    height: 13 * width,
    marginTop: 1 * width,
    justifyContent: 'center',
    borderColor: '#A4A4A4',
    borderWidth: 1,
    borderRadius: 2 * width,
    paddingHorizontal: 2 * width,
  },
  day1: {
    color: '#116939',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
    paddingHorizontal: 4 * width,
  },
  selector1: {
    height: 13 * width,
    marginTop: 1 * width,
    justifyContent: 'center',
    borderColor: '#116939',
    borderWidth: 1,
    borderRadius: 2 * width,
    paddingHorizontal: 2 * width,
  },
  inputBox: {
    width: '100%',
    height: 13 * width,
    marginTop: 1 * width,
    color: '#2F2F2F',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
    borderColor: '#A4A4A4',
    borderWidth: 1,
    borderRadius: 2 * width,
    paddingHorizontal: 4 * width,
  },
  inputLargeBox: {
    width: '100%',
    height: 30 * width,
    marginTop: 1 * width,
    color: '#2F2F2F',
    textAlign: 'left',
    textAlignVertical: 'top',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
    borderColor: '#A4A4A4',
    borderWidth: 1,
    borderRadius: 2 * width,
    paddingHorizontal: 4 * width,
  },
  selectBox: {
    width: '100%',
    height: 13 * width,
    marginTop: 1 * width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#A4A4A4',
    borderWidth: 1,
    borderRadius: 2 * width,
    paddingHorizontal: 4 * width,
  },
  selectText: {
    // width: '100%',
    color: '#A4A4A4',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
  },
  selectText1: {
    // width: '100%',
    color: '#2F2F2F',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
  },
  dateSelect: {
    height: 13 * width,
    marginTop: 1 * width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#A4A4A4',
    borderWidth: 1,
    borderRadius: 2 * width,
    paddingHorizontal: 4 * width,
  },
  date: {
    color: '#2F2F2F',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
    // paddingHorizontal: 4 * width,
  },
});
const styles = StyleSheet.create({
  shiftItem: {
    width: width * 65,
    height: height * 4.5,
    margin: width * 1,
    padding: width * 1,
    paddingLeft: width * 4,
    marginLeft: 20,
    borderWidth: 1.5,
    borderColor: '#F5F5F5',
    borderRadius: width * 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  selectedItem: {
    borderColor: '#116939',
  },
});

export default PostJobScreen;
