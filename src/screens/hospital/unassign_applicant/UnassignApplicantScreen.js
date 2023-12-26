import React, {Fragment, useEffect, useState} from 'react';
import {FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ApiMethod from '../../../api/ApiMethod';
import FastImage from 'react-native-fast-image';
import CustomProgress from '../../../compenents/CustomProgress';
import { Dropdown } from 'react-native-element-dropdown';
import ToastUtility from '../../../utility/ToastUtility';

const UnassignApplicantScreen = ({navigation, route}) => {
  const [applicant, setApplicant] = useState(route.params.data);
  const [jobData, setJobData] = useState(route.params.job);

  const [desciplineArr, setDesciplineArr] = useState([]);
  const [reason, setReason] = useState(null);
  const [tempReason, setTempReason] = useState('');
  const [other, setOther] = useState('');

  const [showDPopup, setShowDPopup] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // console.log('applicant',applicant);
  // console.log('jobData', jobData);

  useEffect(() => {
    getApplicant();
  }, []);

  const getApplicant = () => {
    setShowProgress(true);

    var formData = new FormData();
    formData.append('user_id', applicant.user_id);

    ApiMethod.getUnAssignResson(
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        if (pass.status == 200) {
          setDesciplineArr(pass.message);
        }
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
      },
    );
  };

  const unAssignApplicant = () => {
    setShowProgress(true);

    var formData = new FormData();
    formData.append('job_id', jobData.job_id);
    formData.append('user_id', applicant.user_id);
    formData.append('reason_id', reason.id);
    formData.append('message', other);

    ApiMethod.unAssign(
      formData,
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        if (pass.status == 200) {
          ToastUtility.showToast('Unassigned');
          navigation.goBack();
        }
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
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
            Unassign Applicant
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
            backgroundColor: '#FFFFFF',
          }}>
          <View style={{flex: 1, width: '90%', paddingVertical: 1 * height}}>
            <View style={{width: '100%'}}>
              <Text style={Style.title}>Reason to unassign</Text>
              <TouchableOpacity
                onPress={() => {
                  // var t = [...selectedDesciplineArr];
                  setShowDPopup(true);
                }}
                style={Style.selectBox}>
                <Text style={reason ? Style.selectText1 : Style.selectText}>
                  {reason ? reason.name : 'Select Discipline'}
                </Text>
                <Feather name="chevron-down" size={5 * width} color="#A4A4A4" />
              </TouchableOpacity>
            </View>

            <View style={{width: '100%', marginTop: 2 * width}}>
              <Text style={Style.title}>Other</Text>
              <TextInput
                style={Style.inputLargeBox}
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
          </View>

          <CustomButton
            btnText="Unassign"
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
              unAssignApplicant();
            }}
          />
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
              maxHeight: 30 * height,
              backgroundColor: '#FAFAFA',
              paddingVertical: 1 * height,
              borderRadius: 2 * width,
            }}>
            <FlatList
              data={desciplineArr}
              style={{width: '100%'}}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setReason(item);
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
                      {item.name}
                    </Text>
                    <Ionicons
                      name={
                        reason && reason.id == item.id
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

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Style = StyleSheet.create({
  title: {
    fontFamily: Fonts.SemiBold,
    fontSize: 3 * width,
    color: '#000000',
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
  selectText: {
    // width: '100%',
    color: '#A4A4A4',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
  },
  // selectText: {
  //   // width: '100%',
  //   color: '#A4A4A4',
  //   fontFamily: Fonts.Regular,
  //   fontSize: 3.6 * width,
  // },
  selectText1: {
    // width: '100%',
    color: '#2F2F2F',
    fontFamily: Fonts.Regular,
    fontSize: 3.6 * width,
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

export default UnassignApplicantScreen;
