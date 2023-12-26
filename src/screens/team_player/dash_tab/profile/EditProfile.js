/* eslint-disable react-hooks/exhaustive-deps */
import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Provider} from 'react-native-paper';
import ImageView from '../../../../compenents/ImageView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {Platform} from 'react-native';
import ToastUtility from '../../../../utility/ToastUtility';
import CustomButton from '../../../../compenents/CustomButton';
import CustomPopup from '../../../../compenents/CustomPopup';

// const gradientArr = [
//   ['#FFF4CBD9', '#FFC5C8D9'],
//   ['#FDCFFDD9', '#C0B3EBD9'],
//   // ['#FDCFFDD9', '#C0B3EBD9'],
// ];

const EditProfileScreen = ({navigation, route}) => {
  const Data = route.params.userData;
  const userPicPath = route.params.userPicPath;
  console.log('============Name==============', userPicPath);
  const [userData, setUser] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(Data.first_name);
  const [number, setNumber] = useState(Data.mobile_no);
  const [email, setEmail] = useState(Data.email);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempProfile, setTempProfile] = useState(userPicPath);
  const [icon1, setIcon1] = useState(true);
  const [icon2, setIcon2] = useState(true);
  const [icon3, setIcon3] = useState(true);
  const [icon4, setIcon4] = useState(true);
  const [shift, setShift] = useState('');
  const [showDPopup, setShowDPopup] = useState(false);
  const [selectedDescipline, setSelectedDescipline] = useState('');
  const [desciplineArr, setDesciplineArr] = useState([]);
  const [experienceArr, setExperienceArr] = useState([]);
  const [tempExperienceArr, setTempExperienceArr] = useState([]);
  const [showEPopup, setShowEPopup] = useState(false);
  const [selectedExperienceArr, setSelectedExperienceArr] = useState([]);
  const [totalExp, setTotalExp] = useState(Data.experence);
  const imageExtensionsRegex =
    /\.(png|PNG|jpeg|JPEG|jpg|JPG|WebP|WEBP|raw|RAW)$/i;
  const validImage = imageExtensionsRegex.test(Data.upload_profile);

  const [errorTitle, setErrorTitle] = useState('ss');
  const [errorMessage, setErrorMessage] = useState('ss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setError] = useState(false);
  // console.log('============Name==============', name);
  // const transformedData = selectedExperienceArr.map(
  //   item => item.experience_name,
  // );

  const handleEditPress = () => {
    setIsEditing(true);
    setIcon1(false);
  };

  const handleEditUserNamePress = () => {
    setIsEditingUserName(true);
    setIcon2(false);
  };

  const handleEditNumberPress = () => {
    setIsEditingNumber(true);
    setIcon3(false);
  };

  const handleEditEmailPress = () => {
    setIsEditingEmail(true);
    setIcon4(false);
  };

  const handleSavePress = () => {
    // You can add any validation or save logic here
    setIsEditing(false);
    setIcon1(true);
  };
  const handleSavePressUserName = () => {
    // You can add any validation or save logic here
    setIsEditingUserName(false);
    setIcon2(true);
  };
  const handleSavePressNumber = () => {
    // You can add any validation or save logic here
    setIsEditingNumber(false);
    setIcon3(true);
  };
  const handleSavePressEmail = () => {
    // You can add any validation or save logic here
    setIsEditingEmail(false);
    setIcon4(true);
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
        await StorageUtility.storeProfilePath(imageUri);
        console.log('uri of image by************** camera', imageUri);
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
        await StorageUtility.storeProfilePath(imageUri);
        console.log('uri of image by****************** gallery', imageUri);
        updateProfilePic(imageUri);
      }
    });
  };

  const checkExperience = given => {
    return tempExperienceArr.some(item => item.id == given.id);
  };

  // get descipline and experiences //
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
        setExperienceArr(pass.data.experience);
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
      },
    );
  };

  // Profile update ///
  const Upadate = () => {
    if (name.trim() == '') {
      ToastUtility.showToast('Enter Name');
    } else if (email.trim() == '') {
      ToastUtility.showToast('Enter Email');
    } else if (ConstData.Email_Regex.test(email.trim()) == false) {
      ToastUtility.showToast('Enter Valid Email');
    } else if (number.trim() == '' || number.trim().length != 10) {
      ToastUtility.showToast('Enter Valid Phone Number');
    } else if (totalExp.trim() == '') {
      ToastUtility.showToast('Enter Total Experience');
    } else if (Data.shift == '') {
      ToastUtility.showToast('Select Shift');
    } else if (Data.discipline == '') {
      ToastUtility.showToast('Select Descipline');
    } else if (selectedExperienceArr.length == 0) {
      ToastUtility.showToast('Select Experience');
    } else {
      var formData = new FormData();
      formData.append('first_name', name);
      formData.append('phone_no', number.trim());

      formData.append('email', email.trim());

      formData.append('totalexp', totalExp.trim());
      formData.append('shift', shift ? shift.trim() : Data.shift);
      formData.append(
        'discipline',
        Data.discipline ? Data.discipline : selectedDescipline.id,
      );

      selectedExperienceArr.map(item => {
        formData.append('user_experiences[]', item.id);
      });
      // formData.append('user_experiences[]', item.experience_name);
      updateProfile(formData);
      // }
    }
  };
  const updateProfile = formData => {
    setShowProgress(true);
    ApiMethod.updateProfile(
      formData,
      pass => {
        setShowProgress(false);
        console.log('tp-update TP details-pass', pass);
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
        console.log('tp-Update-fail', fail);
        setErrorTitle('Error!');
        setErrorMessage('Updation Failed!');
        setError(true);
        setShowSuccess(true);
      },
    );
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
    formData.append('user_type', '1');
    updateImage(formData);
  };
  const updateImage = formData => {
    setShowProgress(true);
    ApiMethod.updateProfilePic(
      formData,
      pass => {
        setShowProgress(false);
        console.log('tp-Profile Pic update-pass', pass);
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
        console.log('tp-image UpdateUpdate-fail', fail);
        setErrorTitle('Error!');
        setErrorMessage('Updation Failed!');
        setError(true);
        setShowSuccess(true);
      },
    );
  };

  return (
    <Provider>
      <CustomStatus isDark={true} trans={true} color={'#FFFFFF'} />

      {Data && (
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
                fontSize: 5 * width,
                fontFamily: Fonts.Medium,
              }}>
              {'Edit Profile'}
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
              <Ionicons
                name="md-chevron-back"
                size={5 * width}
                color="#000000"
              />
            </TouchableOpacity>
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
              <TouchableOpacity>
                <FastImage
                  source={
                    validImage
                      ? {uri: tempProfile}
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
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: '#fcf9f9',
                  position: 'absolute',
                  top: height * 18,
                  right: width * 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    width: 16,
                    height: 16,
                    tintColor: '#008A3D',
                    resizeMode: 'center',
                  }}
                  source={require('../../../../assets/images/edit.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
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
                ]}
                onPress={handleEditPress}>
                <Feather name="user" size={6 * width} color={'#008A3D'} />
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4 * width,
                    paddingVertical: 1 * width,
                  }}>
                  {isEditing ? (
                    <TextInput
                      style={{
                        color: '#000000',
                        fontSize: 3.4 * width,
                        fontFamily: Fonts.Medium,
                      }}
                      value={name}
                      onChangeText={text => setName(text)}
                    />
                  ) : (
                    <>
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
                        {name}
                      </Text>
                    </>
                  )}
                </View>
                {icon1 && (
                  <View style={{}}>
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        tintColor: '#008A3D',
                        resizeMode: 'center',
                      }}
                      source={require('../../../../assets/images/edit.png')}
                    />
                  </View>
                )}
                {isEditing && (
                  <TouchableOpacity onPress={handleSavePress}>
                    <Text style={{color: '#008A3D'}}>Save</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Number */}
              <TouchableOpacity
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
                ]}
                onPress={handleEditNumberPress}>
                <Feather name="phone-call" size={6 * width} color={'#008A3D'} />
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4 * width,
                    paddingVertical: 1 * width,
                  }}>
                  {isEditingNumber ? (
                    <TextInput
                      style={{
                        color: '#000000',
                        fontSize: 3.4 * width,
                        fontFamily: Fonts.Medium,
                      }}
                      value={number}
                      onChangeText={text => setNumber(text)}
                    />
                  ) : (
                    <>
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
                        }}>
                        {number}
                      </Text>
                    </>
                  )}
                </View>
                {icon3 && (
                  <View style={{}}>
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        tintColor: '#008A3D',
                        resizeMode: 'center',
                      }}
                      source={require('../../../../assets/images/edit.png')}
                    />
                  </View>
                )}
                {isEditingNumber && (
                  <TouchableOpacity onPress={handleSavePressNumber}>
                    <Text style={{color: '#008A3D'}}>Save</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity
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
                    marginBottom: 2 * height,
                  },
                  ConstData.ELEVATION_STYLE,
                ]}
                onPress={handleEditEmailPress}>
                <Feather name="mail" size={6 * width} color={'#008A3D'} />
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4 * width,
                    paddingVertical: 1 * width,
                  }}>
                  {isEditingEmail ? (
                    <TextInput
                      style={{
                        color: '#000000',
                        fontSize: 3.4 * width,
                        fontFamily: Fonts.Medium,
                      }}
                      value={email}
                      onChangeText={text => setEmail(text)}
                    />
                  ) : (
                    <>
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
                        }}>
                        {email}
                      </Text>
                    </>
                  )}
                </View>
                {icon4 && (
                  <View style={{}}>
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        tintColor: '#008A3D',
                        resizeMode: 'center',
                      }}
                      source={require('../../../../assets/images/edit.png')}
                    />
                  </View>
                )}
                {isEditingEmail && (
                  <TouchableOpacity onPress={handleSavePressEmail}>
                    <Text style={{color: '#008A3D'}}>Save</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Experience */}
              <TouchableOpacity
                style={[
                  {
                    width: '90%',
                    paddingHorizontal: 4 * width,
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 1 * height,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 1 * width,
                    // marginTop: 2 * height,
                  },
                  ConstData.ELEVATION_STYLE,
                ]}
                onPress={handleEditUserNamePress}>
                <Feather name="briefcase" size={6 * width} color={'#008A3D'} />
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4 * width,
                    paddingVertical: 1 * width,
                  }}>
                  {isEditingUserName ? (
                    <TextInput
                      keyboardType="number-pad"
                      style={{
                        color: '#000000',
                        fontSize: 3.4 * width,
                        fontFamily: Fonts.Medium,
                      }}
                      value={totalExp}
                      onChangeText={text => setTotalExp(text)}
                    />
                  ) : (
                    <>
                      <Text
                        style={{
                          color: '#868686',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Medium,
                        }}>
                        Total Experence
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          fontSize: 3.4 * width,
                          fontFamily: Fonts.Medium,
                        }}>
                        {totalExp <= '1' ? `${totalExp} yr` : `${totalExp} yrs`}
                      </Text>
                    </>
                  )}
                </View>
                {icon2 && (
                  <View style={{}}>
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        tintColor: '#008A3D',
                        resizeMode: 'center',
                      }}
                      source={require('../../../../assets/images/edit.png')}
                    />
                  </View>
                )}
                {isEditingUserName && (
                  <TouchableOpacity onPress={handleSavePressUserName}>
                    <Text style={{color: '#008A3D'}}>Save</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Shift */}
              <View
                style={[
                  {
                    width: '90%',
                    paddingHorizontal: 4 * width,
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 0.5 * height,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 1 * width,
                    marginTop: 2 * height,
                    marginBottom: 2 * height,
                  },
                  ConstData.ELEVATION_STYLE,
                ]}>
                <Feather name="clock" size={6 * width} color={'#008A3D'} />
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
                      // marginTop: 2 * height,
                    }}>
                    {'Shift'}
                  </Text>
                  <Dropdown
                    style={[
                      {
                        flex: 1,
                        width: '106%',
                        backgroundColor: '#F7F8F800',
                      },
                    ]}
                    // dropdownPosition="top"
                    placeholderStyle={{
                      fontSize: 3.6 * width,
                      color: '#000000',
                      fontFamily: Fonts.Regular,
                    }}
                    selectedTextStyle={{
                      color: '#000000',
                      fontSize: 3.4 * width,
                      fontFamily: Fonts.Medium,
                    }}
                    itemTextStyle={{
                      color: '#000000',
                      fontSize: 3.4 * width,
                      fontFamily: Fonts.Medium,
                    }}
                    data={ConstData.getShiftArr()}
                    // maxHeight={30 * height}
                    labelField="lable"
                    valueField="value"
                    placeholder={shift == '' ? Data.shift : '...'}
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
              </View>

              {/*  Descipline */}

              <TouchableOpacity
                onPress={() => {
                  setShowDPopup(true);
                }}
                style={[
                  {
                    width: '90%',
                    paddingHoontal: 4 * width,
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 1 * height,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 1 * width,
                    // marginTop: 2 * height,
                    marginBottom: 2 * height,
                  },
                  ConstData.ELEVATION_STYLE,
                ]}>
                <Text>{'     '}</Text>
                <FontAwesome
                  name="graduation-cap"
                  size={5 * width}
                  color={'#008A3D'}
                />

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
                    {'Discipline'}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 3.4 * width,
                        fontFamily: Fonts.Medium,
                      }}>
                      {selectedDescipline
                        ? selectedDescipline.discipline_name
                        : Data.discipline == 1
                        ? 'C.N.A'
                        : Data.discipline == 2
                        ? 'LPN/LVN'
                        : Data.discipline == 3
                        ? 'CMT'
                        : Data.discipline == 4
                        ? 'RN'
                        : Data.discipline == 5
                        ? 'RT'
                        : 'Other'}
                    </Text>
                    <Feather
                      name="chevron-down"
                      size={5 * width}
                      color="#A4A4A4"
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {/*  Experience  */}

              <TouchableOpacity
                onPress={() => {
                  var t = [...selectedExperienceArr];
                  setTempExperienceArr(t);
                  setShowEPopup(true);
                }}
                style={[
                  {
                    width: '90%',
                    paddingHoontal: 4 * width,
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 1 * height,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 1 * width,
                    // marginTop: 2 * height,
                    marginBottom: 2 * height,
                  },
                  ConstData.ELEVATION_STYLE,
                ]}>
                <Text>{'     '}</Text>
                <AntDesign name="book" size={6 * width} color={'#008A3D'} />
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
                    {'Experience'}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Medium,
                        fontSize: 3.6 * width,
                        color:
                          selectedExperienceArr.length > 0
                            ? '#2F2F2F'
                            : '#000000',
                      }}>
                      {selectedExperienceArr.length > 0
                        ? selectedExperienceArr.length == 1
                          ? selectedExperienceArr[0].experience_name
                          : selectedExperienceArr[0].experience_name +
                            ' + ' +
                            (selectedExperienceArr.length - 1)
                        : 'Select Area'}
                    </Text>
                    <Feather
                      name="chevron-down"
                      size={5 * width}
                      color="#A4A4A4"
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <CustomButton
                btnText="Update"
                colors={['#116939', '#116939']}
                enable={true}
                btnStyle={{
                  width: '90%',
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
                  Upadate();
                }}
              />
            </View>
          </KeyboardAwareScrollView>
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
                  source={require('../../../../assets/images/cameraUpload.png')}
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
                  source={require('../../../../assets/images/Gallery.png')}
                />
                <Text style={{color: '#000000', fontSize: 12}}>Gallery</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                // updateProfilePic();
                setModalVisible(false);
              }}
              style={{
                alignSelf: 'center',
                marginTop: Platform.OS === 'ios' ? 5 : -10,
                backgroundColor: '#b25959',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#ffffff',
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

      <Modal
        visible={showEPopup}
        dismissable={true}
        onDismiss={() => setShowEPopup(false)}>
        <View
          style={{
            width: '90%',
            // height: height * 50,
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
              data={experienceArr}
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
                        var t = [...tempExperienceArr];
                        if (checkExperience(item)) {
                          var p = t.indexOf(item);
                          t.splice(p, 1);
                        } else {
                          t.push(item);
                        }
                        setTempExperienceArr(t);
                      }}
                      style={{paddingVertical: 2 * width}}>
                      <Ionicons
                        name={
                          checkExperience(item)
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
                var t = [...tempExperienceArr];
                setSelectedExperienceArr(t);
                setTempExperienceArr([]);
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
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.7)',
            // position: 'absolute',
          }}>
          <View
            style={{
              maxHeight: 30 * height,
              // backgroundColor: '#FAFAFA',
              borderRadius: 2 * width,
              width: width * 80,
              // margin: 20,
              backgroundColor: 'white',
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
            <FlatList
              data={desciplineArr}
              // style={{width: '100%'}}
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
          navigation.goBack();
          if (isError == false) {
            // navigation.goBack();
          }
        }}
      />
    </Provider>
  );
};
const styles = StyleSheet.create({
  btnCon: {
    width: width * 100,
    height: height * 7,
    marginTop: height * 1,
    alignItems: 'center',
    marginBottom: height * 2,
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
});
export default EditProfileScreen;
