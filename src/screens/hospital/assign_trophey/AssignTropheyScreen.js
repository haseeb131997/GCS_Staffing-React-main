import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
import CustomStatus from '../../../compenents/CustomStatus';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ApiMethod from '../../../api/ApiMethod';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import StorageUtility from '../../../utility/StorageUtility';
import CustomPopup from '../../../compenents/CustomPopup';
import ToastUtility from '../../../utility/ToastUtility';
import CustomProgress from '../../../compenents/CustomProgress';
import ConstData from '../../../utility/ConstData';
import {Platform} from 'react-native';

const AssignTropheyScreen = ({navigation, route}) => {
  const [jobData, setJobData] = useState(route.params.job);
  const [applicant, setApplicant] = useState(route.params.data);
  const [user, setUser] = useState(null);

  const [tropheyList, setTropheyList] = useState([]);
  const [selectedDummy, setSelectedDummy] = useState(null);

  const [other, setOther] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  const [showDPopup, setShowDPopup] = useState(false);

  const [errorTitle, setErrorTitle] = useState('ss');
  const [errorMessage, setErrorMessage] = useState('ss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    getApplicant();
  }, []);

  const getApplicant = async () => {
    var uu = await StorageUtility.getUser();
    console.log('uu', uu);
    setUser(uu);

    setShowProgress(true);
    var formData = new FormData();
    formData.append('hospital_id', uu.id);

    ApiMethod.troplyList(
      formData,
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        if (pass.status == 200) {
          setImagePath(pass.image_url);
          setTropheyList(pass.trophy);
        }
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
      },
    );
  };

  const submitTrophey = async () => {
    setShowProgress(true);

    var formData = new FormData();
    formData.append('hospital_id', user.id);
    formData.append('user_id', applicant.id);
    formData.append('assignTrophy_id', selectedDummy.id);
    formData.append('reasonMessage', other);

    ApiMethod.assignTrophy(
      formData,
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        if (pass.status == 200) {
          setErrorMessage('Trofy assigned successfully.');
          setShowSuccess(true);
          setShowDPopup(false);
          setTimeout(() => {
            setShowSuccess(false);
            navigation.goBack();
          }, 2000);
        } else {
          ToastUtility.showToast(ConstData.getErrorMsg(pass.response));
        }
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
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
            backgroundColor: '#FFFFFF66',
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
            Trophy
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
            alignItems: 'center',
            paddingVertical: 2 * width,
            marginTop: 1 * width,
            backgroundColor: '#FFFFFF66',
          }}>
          <FlatList
            data={tropheyList}
            numColumns={2}
            style={{flex: 1, width: '94%'}}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedDummy(item);
                  }}
                  style={{
                    // width: '50%',
                    flex: 1,
                    height: 25 * height,
                    margin: 2 * width,
                    alignSelf: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 3 * width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOffset: {
                      width: 1,
                      height: 1,
                    },
                    shadowColor:
                      Platform.OS == 'android' ? '#666666' : '#D8D8D8',
                    shadowOpacity: 1,
                    zIndex: 999,
                    elevation: 2,
                  }}>
                  <Image
                    source={{uri: imagePath + item.image}}
                    style={{
                      width: '50%',
                      height: '46%',
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.SemiBold,
                      fontSize: 4.5 * width,
                      color: '#116939',
                      marginTop: 2 * width,
                    }}>
                    {item.trophy_name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: 3 * width,
                      color: '#116939',
                      width: '80%',
                      textAlign: 'center',
                    }}
                    numberOfLines={2}>
                    {item.description.trim()}
                  </Text>

                  <View
                    style={{
                      position: 'absolute',
                      right: 2 * width,
                      top: 2 * width,
                    }}>
                    {selectedDummy && selectedDummy.id == item.id ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={6 * width}
                        color={'#116939'}
                      />
                    ) : (
                      <View
                        style={{
                          width: 5 * width,
                          height: 5 * width,
                          borderRadius: 4 * width,
                          borderWidth: 1,
                          borderColor: '#116939',
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          <View
            style={{
              width: '100%',
              height: 25 * height,
            }}>
            <Text
              style={{
                paddingHorizontal: 5 * width,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SemiBold,
                  fontSize: 3 * width,
                  color: '#000000',
                }}>
                {'Note: '}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: 3 * width,
                  color: '#000000',
                }}>
                {'You can select more than one options'}
              </Text>
            </Text>

            <CustomButton
              btnText="Submit"
              colors={['#116939', '#116939']}
              enable={true}
              btnStyle={{
                width: '90%',
                marginTop: 5 * height,
                elevation: 1 * width,
              }}
              btnTextStyle={{
                //fontWeight: '700',
                fontFamily: Fonts.Regular,
                fontSize: 4 * width,
              }}
              onPress={() => {
                if (selectedDummy) {
                  setShowDPopup(true);
                } else {
                  ToastUtility.showToast('Select Trofy');
                }
              }}
            />
          </View>
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
            padding: 2 * width,
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 3 * width,
          }}>
          <View style={{width: '96%', marginTop: 2 * width}}>
            <Text style={Style.title}>Reason</Text>
            <TextInput
              style={{
                width: '100%',
                height: 30 * width,
                marginTop: 1 * width,
                color: '#2F2F2F',
                textAlign: 'left',
                textAlignVertical: 'top',
                fontFamily: Fonts.Regular,
                fontSize: 3.2 * width,
                borderColor: '#A4A4A4',
                borderWidth: 1,
                borderRadius: 2 * width,
                paddingHorizontal: 4 * width,
              }}
              placeholder="Add Reason"
              placeholderTextColor="#A4A4A4"
              keyboardType="default"
              autoCapitalize="words"
              multiline={true}
              value={other}
              onChangeText={t => {
                setOther(t);
              }}
            />
          </View>

          <CustomButton
            btnText="Submit"
            colors={['#116939', '#116939']}
            enable={true}
            btnStyle={{
              width: '96%',
              marginTop: 2 * height,
              marginBottom: 2 * width,
              elevation: 1 * width,
            }}
            btnTextStyle={{
              //fontWeight: '700',
              fontFamily: Fonts.Regular,
              fontSize: 4 * width,
            }}
            onPress={() => {
              submitTrophey();
            }}
          />
        </View>
      </Modal>

      <Modal
        visible={showSuccess}
        dismissable={true}
        onDismiss={() => setShowSuccess(false)}>
        <View
          style={{
            width: '55%',
            alignSelf: 'center',
            padding: 2 * width,
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 3 * width,
            paddingBottom: 3 * width,
          }}>
          <Image
            source={require('../../../assets/images/trophy_success.png')}
            style={{
              width: 40 * width,
              height: 40 * width,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              fontFamily: Fonts.SemiBold,
              fontSize: 3.4 * width,
              color: '#116939',
            }}>
            {'Trophy Rewarded!'}
          </Text>
        </View>
      </Modal>

      {/* <CustomPopup
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
      /> */}

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Style = StyleSheet.create({
  title: {
    fontFamily: Fonts.Medium,
    fontSize: 3 * width,
    color: '#000000',
  },
  day: {
    color: '#000000',
    fontFamily: Fonts.SemiBold,
    fontSize: 3.8 * width,
  },
  assigned: {
    color: '#116939',
    fontFamily: Fonts.SemiBold,
    fontSize: 3.8 * width,
  },
  data: {
    fontFamily: Fonts.SemiBold,
    fontSize: 3.8 * width,
    color: '#000000',
    marginTop: 1 * width,
  },
});

export default AssignTropheyScreen;
