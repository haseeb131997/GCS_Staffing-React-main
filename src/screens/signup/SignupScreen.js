import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Modal, Provider} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiMethod from '../../api/ApiMethod';
import CustomButton from '../../compenents/CustomButton';
import CustomPopup from '../../compenents/CustomPopup';
import CustomProgress from '../../compenents/CustomProgress';
import ImageView from '../../compenents/ImageView';
import height from '../../Units/height';
import width from '../../Units/width';
import ConstData from '../../utility/ConstData';
import Fonts from '../../utility/Fonts';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ToastUtility from '../../utility/ToastUtility';
import moment from 'moment';
import {Platform} from 'react-native';

const SignupScreen = ({navigation}) => {
  const [loginType, setLoginType] = useState(3);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [totalExp, setTotalExp] = useState('');
  const [age, setAge] = useState('');
  const [shift, setShift] = useState('');
  const [availability, setAvailability] = useState('');

  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [desciplineArr, setDesciplineArr] = useState([]);
  const [excerciseArr, setExcerciseArr] = useState([]);
  const [interestedArr, setInterestedArr] = useState([]);

  const [selectedDescipline, setSelectedDescipline] = useState('');

  const [selectedExcerciseArr, setSelectedExcerciseArr] = useState([]);
  const [tempExcerciseArr, setTempExcerciseArr] = useState([]);

  const [selectedInterestedArr, setSelectedInterestedArr] = useState([]);

  const [showDPopup, setShowDPopup] = useState(false);
  const [showEPopup, setShowEPopup] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const [errorTitle, setErrorTitle] = useState('ss');
  const [errorMessage, setErrorMessage] = useState('ss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    getDecpline();
  }, []);

  const getDecpline = () => {
    setShowProgress(true);
    ApiMethod.signupData(
      pass => {
        setShowProgress(false);
        console.log('pass', JSON.stringify(pass));
        setDesciplineArr(pass.data.discipline);
        setExcerciseArr(pass.data.experience);
        setInterestedArr(pass.data.job_Interesteds);
        // getExcercise();
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
      },
    );
  };

  // const getExcercise = () => {
  //   setShowProgress(true);
  //   ApiMethod.getExperence(
  //     pass => {
  //       setShowProgress(false);
  //       console.log('pass', pass);
  //       setExcerciseArr(pass.experence);
  //     },
  //     fail => {
  //       setShowProgress(false);
  //       console.log('fail', fail);
  //     },
  //   );
  // }

  const signup = () => {
    if (name.trim() == '') {
      ToastUtility.showToast('Enter Name');
    } else if (userName.trim() == '') {
      ToastUtility.showToast('Enter Username');
    } else if (email.trim() == '') {
      ToastUtility.showToast('Enter Email');
    } else if (ConstData.Email_Regex.test(email.trim()) == false) {
      ToastUtility.showToast('Enter Valid Email');
    } else if (mobile.trim() == '' || mobile.trim().length != 10) {
      ToastUtility.showToast('Enter Valid Phone Number');
    } else if (totalExp.trim() == '') {
      ToastUtility.showToast('Enter Total Experience');
    } else if (age.trim() == '') {
      ToastUtility.showToast('Enter Age');
    } else if (shift.trim() == '') {
      ToastUtility.showToast('Select Shift');
    } else if (availability.trim() == '') {
      ToastUtility.showToast('Select Availability');
    } else if (selectedDescipline == '') {
      ToastUtility.showToast('Select Descipline');
    } else if (selectedExcerciseArr.length == 0) {
      ToastUtility.showToast('Select Experience');
    } else if (selectedInterestedArr.length == 0) {
      ToastUtility.showToast('Select Interests');
    } else if (password.trim() == '') {
      ToastUtility.showToast('Enter Password');
    } else if (password.trim().length < 6) {
      ToastUtility.showToast('Password must be 6 - 16 charecters');
    } else {
      var formData = new FormData();

      formData.append('first_name', name.trim());
      formData.append('mobile_no', mobile.trim());

      formData.append('username', userName.trim());
      formData.append('email', email.trim());
      formData.append('password', password.trim());

      formData.append('total_experience', totalExp.trim());
      formData.append('age', age.trim());
      formData.append('shift', shift.trim());
      formData.append('joining_date', availability.trim());
      formData.append('discipline', selectedDescipline.id);

      selectedExcerciseArr.map(item => {
        formData.append('current_experience[]', item.id);
      });

      selectedInterestedArr.map(item => {
        formData.append('interested_in[]', item.id);
      });

      // formData.append('update_profile', password.trim());

      // if (loginType == 1) {
      //   formData.append('phone_no', mobile.trim());
      //   formData.append('hospital_name', name.trim());
      //   hSignup(formData);
      // } else
      // if (loginType == 3) {

      tpSignup(formData);
      // }
    }
  };

  // const hSignup = formData => {
  //   setShowProgress(true);
  //   ApiMethod.hospitalSignup(
  //     formData,
  //     pass => {
  //       setShowProgress(false);
  //       console.log('h-signup-pass', pass);
  //       if (pass.status == 200) {
  //         setErrorTitle('Success!');
  //         setErrorMessage('Registration Successful.');
  //         setError(false);
  //       } else {
  //         setErrorTitle('Error!');
  //         setErrorMessage(ConstData.getErrorMsg(pass.response));
  //         setError(true);
  //       }
  //       setShowSuccess(true);
  //     },
  //     fail => {
  //       setShowProgress(false);
  //       console.log('h-signup-fail', fail);
  //       setErrorTitle('Error!');
  //       setErrorMessage('Registration Failed!');
  //       setError(true);
  //       setShowSuccess(true);
  //     },
  //   );
  // };

  const tpSignup = formData => {
    setShowProgress(true);
    ApiMethod.tpSignup(
      formData,
      pass => {
        setShowProgress(false);
        console.log('tp-signup-pass', pass);
        if (pass.status == 200) {
          setErrorTitle('Success!');
          setErrorMessage('Registration Successful!');
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
        console.log('tp-signup-fail', fail);
        setErrorTitle('Error!');
        setErrorMessage('Registration Failed!');
        setError(true);
        setShowSuccess(true);
      },
    );
  };

  const checkExcercise = given => {
    return tempExcerciseArr.some(item => item.id == given.id);
  };

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
        <KeyboardAwareScrollView
          style={{flex: 1, width: '100%', paddingBottom: keyboardHeight}}>
          <View
            style={{
              // flex: 1,
              width: '100%',
              // height: 100 * height,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#16763E',
                fontSize: 5 * width,
                textAlign: 'center',
                fontFamily: Fonts.SemiBold,
                marginTop: 10 * height,
              }}>{`Let's get started!`}</Text>

            <Text
              style={{
                width: '60%',
                fontSize: 3 * width,
                textAlign: 'center',
                fontFamily: Fonts.Regular,
                marginTop: 2 * height,
                color: '#4B4B4B',
              }}>
              {'Create an account today to post and find jobs your like!'}
            </Text>

            <Text
              style={{
                fontSize: 3.4 * width,
                textAlign: 'center',
                fontFamily: Fonts.SemiBold,
                marginTop: 2 * height,
              }}>
              {'Sign Up As'}
            </Text>

            <View
              style={{
                marginTop: 2 * height,
                width: '100%',
                height: 14 * width,
                backgroundColor: '#FFFFFF',
                // paddingHorizontal: 3 * width,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <TouchableOpacity
                onPress={() => setLoginType(1)}
                style={{
                  flex: 1,
                  height: 5 * height,
                  borderRadius: 2 * width,
                  backgroundColor: loginType == 1 ? '#116939' : '#FFFFFF',
                  marginHorizontal: 3 * width,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 3.4 * width,
                    textAlign: 'center',
                    fontFamily: Fonts.SemiBold,
                    color: loginType == 1 ? '#FFFFFF' : '#116939',
                  }}>
                  {'Facility'}
                </Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                onPress={() => setLoginType(2)}
                style={{
                  flex: 0.8,
                  height: 5 * height,
                  borderRadius: 2 * width,
                  backgroundColor: loginType == 2 ? '#116939' : '#FFFFFF',
                  marginHorizontal: 3 * width,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 3.4 * width,
                    textAlign: 'center',
                    fontFamily: Fonts.SemiBold,
                    color: loginType == 2 ? '#FFFFFF' : '#116939',
                  }}>
                  {'LTC'}
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => setLoginType(3)}
                style={{
                  flex: 1,
                  height: 14 * width,
                  // borderRadius: 2 * width,
                  backgroundColor: loginType == 3 ? '#116939' : '#FFFFFF',
                  // marginHorizontal: 3 * width,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 3.4 * width,
                    textAlign: 'center',
                    fontFamily: Fonts.SemiBold,
                    color: loginType == 3 ? '#FFFFFF' : '#116939',
                  }}>
                  {'Team Player'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 2 * height,
                width: '100%',
                paddingHorizontal: 6 * width,
              }}>
              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                }}>
                {'Name'}
              </Text>

              <TextInput
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                }}
                placeholderTextColor="#A4A4A4"
                placeholder="Enter Name"
                numberOfLines={1}
                keyboardType="default"
                autoCapitalize="words"
                value={name}
                onChangeText={y => setName(y)}
              />

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Username'}
              </Text>

              <TextInput
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                }}
                placeholderTextColor="#A4A4A4"
                placeholder="Enter Username"
                numberOfLines={1}
                keyboardType="default"
                autoCapitalize="none"
                value={userName}
                onChangeText={y => setUserName(y)}
              />

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Email'}
              </Text>

              <TextInput
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                }}
                placeholderTextColor="#A4A4A4"
                placeholder="Enter Email"
                numberOfLines={1}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={y => setEmail(y)}
              />

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Phone Number'}
              </Text>

              <TextInput
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                }}
                placeholderTextColor="#A4A4A4"
                placeholder="Enter Phone Number"
                numberOfLines={1}
                keyboardType="numeric"
                autoCapitalize="none"
                value={mobile}
                maxLength={10}
                onChangeText={y => {
                  if (y.includes('.') || y.includes(',')) {
                    console.log('dfsdfd');
                    y = y.replace(',', '').replace('.', '');
                  }
                  setMobile(y);
                }}
              />

              <View style={{width: '100%', flexDirection: 'row'}}>
                <View style={{flex: 1, marginEnd: 2 * width}}>
                  <Text
                    style={{
                      fontSize: 3 * width,
                      fontFamily: Fonts.Regular,
                      color: '#2F2F2F',
                      marginTop: 2 * height,
                    }}>
                    {'Total Experience'}
                  </Text>

                  <TextInput
                    style={{
                      width: '100%',
                      height: 14 * width,
                      color: '#000000',
                      paddingHorizontal: 4 * width,
                      marginTop: 1 * height,
                      fontSize: 3.4 * width,
                      fontFamily: Fonts.Regular,
                      borderRadius: 3 * width,
                      borderColor: '#9C9A9A',
                      borderWidth: 1,
                    }}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Experience"
                    numberOfLines={1}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    value={totalExp}
                    maxLength={2}
                    onChangeText={y => {
                      if (y.includes('.') || y.includes(',')) {
                        console.log('dfsdfd');
                        y = y.replace(',', '').replace('.', '');
                      }
                      setTotalExp(y);
                    }}
                  />
                </View>
                <View style={{flex: 1, marginStart: 2 * width}}>
                  <Text
                    style={{
                      fontSize: 3 * width,
                      fontFamily: Fonts.Regular,
                      color: '#2F2F2F',
                      marginTop: 2 * height,
                    }}>
                    {'Age'}
                  </Text>

                  <TextInput
                    style={{
                      width: '100%',
                      height: 14 * width,
                      color: '#000000',
                      paddingHorizontal: 4 * width,
                      marginTop: 1 * height,
                      fontSize: 3.4 * width,
                      fontFamily: Fonts.Regular,
                      borderRadius: 3 * width,
                      borderColor: '#9C9A9A',
                      borderWidth: 1,
                    }}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Age"
                    numberOfLines={1}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    value={age}
                    maxLength={2}
                    onChangeText={y => {
                      if (y.includes('.') || y.includes(',')) {
                        console.log('dfsdfd');
                        y = y.replace(',', '').replace('.', '');
                      }
                      setAge(y);
                    }}
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Shift'}
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                }}>
                <Dropdown
                  style={[
                    {
                      flex: 1,
                      width: '100%',
                      backgroundColor: '#F7F8F800',
                    },
                  ]}
                  // dropdownPosition="top"
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
                  data={ConstData.getShiftArr()}
                  // maxHeight={30 * height}
                  labelField="lable"
                  valueField="value"
                  placeholder={shift == '' ? 'Start Day' : '...'}
                  value={shift}
                  onChange={item => {
                    setShift(item.value);
                  }}
                  containerStyle={{
                    width: '110%',
                    alignSelf: 'center',
                    backgroundColor: '#FFFFFF',
                    marginTop: Platform.OS == 'android' ? -0 * width : 0,
                    borderRadius: 2 * width,
                  }}
                />
              </View>

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Availability / Joining Date'}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowDate(true);
                }}
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: availability ? '#000000' : '#A4A4A4',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Regular,
                  }}
                  value={password}
                  onChangeText={y => setPassword(y)}>
                  {availability ? availability : 'DD-MM-yyyy'}
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Discipline'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDPopup(true);
                }}
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: selectedDescipline ? '#000000' : '#A4A4A4',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Regular,
                  }}>
                  {selectedDescipline
                    ? selectedDescipline.discipline_name
                    : 'Select'}
                </Text>
                <Feather name="chevron-down" size={5 * width} color="#A4A4A4" />
              </TouchableOpacity>
              {/* <View
                style={{
                  width: '100%',
                  height: 14 * width,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Regular,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                }}>
                <Dropdown
                  style={[
                    {
                      flex: 1,
                      width: '100%',
                      backgroundColor: '#F7F8F800',
                    },
                  ]}
                  // dropdownPosition="top"
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
                  data={desciplineArr}
                  maxHeight={30 * height}
                  labelField="lable"
                  valueField="id"
                  placeholder={selectedDescipline == '' ? 'Select' : '...'}
                  value={selectedDescipline}
                  onChange={item => {
                    setSelectedDescipline(item.value);
                  }}
                  containerStyle={{
                    width: '110%',
                    alignSelf: 'center',
                    backgroundColor: '#FFFFFF',
                    marginTop: Platform.OS == 'android' ? -0 * width : 0,
                    borderRadius: 2 * width,
                  }}
                />
              </View> */}

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Experience'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  var t = [...selectedExcerciseArr];
                  setTempExcerciseArr(t);
                  setShowEPopup(true);
                }}
                style={{
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
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Regular,
                    fontSize: 3.6 * width,
                    color:
                      selectedExcerciseArr.length > 0 ? '#2F2F2F' : '#A4A4A4',
                    fontFamily: Fonts.Regular,
                    fontSize: 3.6 * width,
                  }}>
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

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Interested'}
              </Text>
              <View
                style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
                {interestedArr.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        var t = [...selectedInterestedArr];
                        if (selectedInterestedArr.some(d => d.id == item.id)) {
                          var p = t.indexOf(item);
                          t.splice(p, 1);
                        } else {
                          t.push(item);
                        }
                        setSelectedInterestedArr(t);
                      }}
                      style={{
                        // width: '100%',
                        height: 13 * width,
                        marginTop: 1 * width,
                        marginBottom: 1 * width,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginEnd: 3 * width,
                        borderColor: selectedInterestedArr.some(
                          d => d.id == item.id,
                        )
                          ? '#116939'
                          : '#A4A4A4',
                        backgroundColor: selectedInterestedArr.some(
                          d => d.id == item.id,
                        )
                          ? '#116939'
                          : '#FFFFFF00',
                        borderWidth: 1,
                        borderRadius: 2 * width,
                        paddingHorizontal: 4 * width,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          fontSize: 3.6 * width,
                          color: selectedInterestedArr.some(
                            d => d.id == item.id,
                          )
                            ? '#FFFFFF'
                            : '#2F2F2F',
                          fontFamily: Fonts.Regular,
                          fontSize: 3.6 * width,
                        }}>
                        {item.Interested}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* <TouchableOpacity
                // onPress={() => {
                //   var t = [...selectedExcerciseArr];
                //   setTempExcerciseArr(t);
                //   setShowEPopup(true);
                // }}
                style={{
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
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Regular,
                    fontSize: 3.6 * width,
                    color:
                      selectedExcerciseArr.length > 0 ? '#2F2F2F' : '#A4A4A4',
                    fontFamily: Fonts.Regular,
                    fontSize: 3.6 * width,
                  }}>
                  {selectedExcerciseArr.length > 0
                    ? selectedExcerciseArr.length == 1
                      ? selectedExcerciseArr[0].experience_name
                      : selectedExcerciseArr[0].experience_name +
                        ' + ' +
                        (selectedExcerciseArr.length - 1)
                    : 'Select Area'}
                </Text>
                <Feather name="chevron-down" size={5 * width} color="#A4A4A4" />
              </TouchableOpacity> */}

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#2F2F2F',
                  marginTop: 2 * height,
                }}>
                {'Password'}
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 14 * width,
                  marginTop: 1 * height,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    //width: '100%',
                    flex: 1,
                    height: 14 * width,
                    paddingHorizontal: 4 * width,
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Regular,
                  }}
                  placeholderTextColor="#A4A4A4"
                  placeholder=" Enter Password"
                  numberOfLines={1}
                  keyboardType="default"
                  autoCapitalize="none"
                  secureTextEntry={passwordVisible}
                  value={password}
                  onChangeText={y => setPassword(y)}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginEnd: 3 * width,
                    width: 8 * width,
                    height: 8 * width,
                  }}>
                  <Entypo
                    name={passwordVisible ? 'eye-with-line' : 'eye'}
                    size={4.2 * width}
                    color="#ADA4A5"
                  />
                </TouchableOpacity>
              </View>

              <CustomButton
                btnText="Sign Up"
                colors={['#116939', '#116939']}
                enable={true}
                btnStyle={{
                  width: '100%',
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
                  signup();
                  // navigation.replace('Login');
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 2 * height,
              }}>
              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Medium,
                  color: '#2F2F2F',
                }}>
                {'Already have an account?'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{margin: 1 * width}}>
                <Text
                  style={{
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                    color: '#116939',
                  }}>
                  {'Login here'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageView>

      <DateTimePickerModal
        isVisible={showDate}
        mode="date"
        minimumDate={new Date()}
        onConfirm={date => {
          var d1 = moment(date).format('DD-MM-YYYY');
          console.log(date);
          console.log(d1);

          setAvailability(d1);

          setShowDate(false);
          Keyboard.dismiss();
        }}
        onCancel={() => {
          setShowDate(false);
        }}
      />

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
        visible={showDPopup}
        dismissable={true}
        onDismiss={() => setShowDPopup(false)}>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 4 * width,
            paddingVertical: 1 * height,
          }}>
          <View
            style={{
              width: '100%',
              maxHeight: 30 * height,
              backgroundColor: '#FAFAFA',
              borderRadius: 2 * width,
            }}>
            <FlatList
              data={desciplineArr}
              style={{width: '100%'}}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDescipline(item);
                      setShowDPopup(false);
                    }}
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
                        fontSize: 3.4 * width,
                        fontFamily: Fonts.Regular,
                        color: '#000000',
                        paddingTop: Platform.OS == 'android' ? 1 * width : 0,
                      }}>
                      {item.discipline_name}
                    </Text>
                    <Ionicons
                      name={
                        selectedDescipline && selectedDescipline.id == item.id
                          ? 'md-checkbox'
                          : 'md-square-outline'
                      }
                      size={5 * width}
                      color="#116939"
                    />
                  </TouchableOpacity>
                );
              }}
            />
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
            navigation.goBack();
          }
        }}
      />

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

export default SignupScreen;
