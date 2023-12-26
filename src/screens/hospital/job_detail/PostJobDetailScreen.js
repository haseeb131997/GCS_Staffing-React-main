import React, {Fragment, useEffect, useState} from 'react';
import {
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
import {Provider} from 'react-native-paper';
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
import ToastUtility from '../../../utility/ToastUtility';
import ConstData from '../../../utility/ConstData';
import moment from 'moment';
import CustomProgress from '../../../compenents/CustomProgress';

const PostJobDetailScreen = ({navigation, route}) => {
  const [job, setJob] = useState(route.params.data);
  const [jobData, setJobData] = useState(null);

  const [desciplineArr, setDesciplineArr] = useState([]);
  const [excerciseArr, setExcerciseArr] = useState([]);

  const [shift, setShift] = useState(1);

  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    console.log('++++++++++++++++++++++++++++***********', job);
    jobsDetail();
  }, []);

  const jobsDetail = () => {
    setShowProgress(true);

    var formData = new FormData();
    formData.append('job_id', job.job_id);

    ApiMethod.hJobDetail(
      formData,
      pass => {
        setShowProgress(false);
        console.log('pass', pass);
        if (pass.status) {
          setJobData(pass.job);
          setDesciplineArr(pass.discipline);
          setExcerciseArr(pass.experience);
          // console.log('job data ', jobData.price);
        } else {
          ToastUtility.showToast(ConstData.getErrorMsg(pass.response));
          navigation.goBack();
        }
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
        ToastUtility.showToast('Some Error Occurred.');
        navigation.goBack();
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
            Job Detail
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
          {jobData && (
            <KeyboardAwareScrollView
              style={{width: '100%'}}
              contentContainerStyle={{
                alignItems: 'center',
              }}>
              <View style={{width: '90%', marginTop: 2 * width}}>
                <Text style={Style.title}>Facility Name</Text>
                <Text style={Style.data}>{jobData.hospital_name}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Starting From</Text>
                <Text style={Style.data}>
                  {moment(jobData.start_date, 'DD').format('Do MMMM')}
                </Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Discipline</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {desciplineArr.map((item, index) => {
                    return (
                      <Text key={index} style={Style.data}>
                        {item.discipline_name},
                      </Text>
                    );
                  })}
                </View>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Experience</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {excerciseArr.map((item, index) => {
                    return (
                      <Text key={index} style={Style.data}>
                        {item.experience_name}
                        {index === excerciseArr.length - 1 ? '.' : ','}
                      </Text>
                    );
                  })}
                </View>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Shift Days</Text>
                <Text style={Style.data}>{jobData.working_day}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Shift</Text>
                <Text style={Style.data}>{jobData.shift}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Requirements</Text>
                <Text style={Style.data}>{jobData.requirement}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Location</Text>
                <Text style={Style.data}>{jobData.location}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>No. of Applicants</Text>
                <Text style={Style.data}>{jobData.total_applicants}</Text>
              </View>
              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Price Per Hour</Text>
                <Text style={Style.data}>
                  {'$ '}
                  {jobData.price}
                </Text>
              </View>

              {jobData.status == '1' ? (
                <TouchableOpacity
                  style={Style.selector}
                  onPress={() =>
                    navigation.navigate('JobApplicants', {
                      data: job,
                      Hospital_Name: jobData.hospital_name,
                    })
                  }>
                  <Text style={Style.day}>View Hired Applicants</Text>
                  <AntDesign
                    name="arrowright"
                    size={6 * width}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              ) : (
                <View style={Style.pending}>
                  <Text style={Style.title}>
                    Pending For Approval From Admin
                  </Text>
                </View>
              )}
            </KeyboardAwareScrollView>
          )}
        </View>
      </ImageView>

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Style = StyleSheet.create({
  title: {
    fontFamily: Fonts.SemiBold,
    fontSize: 3 * width,
    color: '#9B9B9B',
  },
  data: {
    fontFamily: Fonts.SemiBold,
    fontSize: 3.8 * width,
    color: '#000000',
    marginEnd: 1 * width,
  },
  day: {
    color: '#FFFFFF',
    fontFamily: Fonts.SemiBold,
    fontSize: 3.8 * width,
    paddingHorizontal: 4 * width,
  },
  selector: {
    width: '90%',
    height: 13 * width,
    marginTop: 1 * width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#116939',
    borderRadius: 2 * width,
    paddingHorizontal: 4 * width,
    marginTop: 4 * height,
    marginBottom: 2 * width,
  },
  pending: {
    width: '90%',
    height: 13 * width,
    marginTop: 1 * width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 2 * width,
    paddingHorizontal: 4 * width,
    marginTop: 4 * height,
    marginBottom: 2 * width,
  },
});

export default PostJobDetailScreen;
