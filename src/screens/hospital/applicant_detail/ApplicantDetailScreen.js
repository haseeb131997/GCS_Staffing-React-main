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
  Modal,
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
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const ApplicantDetailScreen = ({navigation, route}) => {
  const [jobData, setJobData] = useState(route.params.job);
  const [applicant, setApplicant] = useState(route.params.data);
  const [hname, setHname] = useState(route.params.facility);
  const [applicantData, setApplicantData] = useState(null);
  // console.log('+++++++++++==================++++++++++++++', route.params.data);

  const Data1 = [
    {
      id: '7',
      experience_name: 'Other',
    },
    {
      id: '6',
      experience_name: 'Assisted Living',
    },
    {
      id: '5',
      experience_name: 'Independent Living',
    },
    {
      id: '4',
      experience_name: 'LTAC',
    },
    {
      id: '3',
      experience_name: 'Acute Care Hospital',
    },
    {
      id: '2',
      experience_name: 'Skilled Nursing Facility',
    },
    {
      id: '1',
      experience_name: 'LTC',
    },
  ];

  const [imagePath, setImagePath] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [userTrofy, setUserTrofy] = useState([]);
  const [userTrofyImageUrl, setUserTrofyImageUrl] = useState([]);
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [matchingExperienceNames, setMatchingExperienceNames] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      getApplicant();
    });
  }, [navigation, getApplicant]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getApplicant = () => {
    setShowProgress(true);

    var formData = new FormData();
    formData.append('user_id', applicant.user_id);

    ApiMethod.applicantsDetail(
      formData,
      pass => {
        setShowProgress(false);
        console.log('pass///////ewfgdggdg', pass);
        if (pass.status == 200) {
          //   to filter user experience name ///
          const getMatchingExperienceName = () => {
            const matchingIds = Data1.filter(item => {
              const matchingData = pass.experience_name.find(
                data2Item => data2Item.experience_name === item.id,
              );
              return matchingData !== undefined;
            });
            return matchingIds.map(item => item.experience_name);
          };
          const matchingNames = getMatchingExperienceName();
          setMatchingExperienceNames(matchingNames);

          setUserTrofy(pass.assign_trophy);
          console.log(
            'Trophy +++++++++++++++=============++++++++++++++++details',
            pass.job.discipline,
          );
          setUserTrofyImageUrl(pass.trophy_url);
          setImagePath(pass.profile_image_url);
          setApplicantData(pass.job);
        }
      },
      fail => {
        setShowProgress(false);
        console.log('fail', fail);
      },
    );
  };

  // modal functions///
  const handleTrophyPress = trophy => {
    setSelectedTrophy(trophy);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrophy(null);
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
            Applicant Detail
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

        {applicantData ? (
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              paddingVertical: 2 * width,
              marginTop: 1 * width,
              backgroundColor: '#FFFFFF',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                marginVertical: 1 * height,
                alignItems: 'center',
              }}>
              {applicantData.upload_profile ? (
                <FastImage
                  source={{uri: imagePath + applicantData.upload_profile}}
                  style={{
                    width: 12 * height,
                    height: 12 * height,
                    borderRadius: 4 * width,
                    resizeMode: 'cover',
                  }}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/splash_logo.png')}
                  style={{
                    width: 12 * height,
                    height: 12 * height,
                    borderRadius: 4 * width,
                    resizeMode: 'contain',
                    backgroundColor: '#EFFFF6',
                  }}
                />
              )}

              <View
                style={{
                  flex: 1,
                  height: 10 * height,
                  marginStart: 4 * width,
                  // paddingVertical: 1 * width,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    height: 6 * width,
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={Style.title} numberOfLines={1}>
                      Applicant Name
                    </Text>
                    <Text
                      style={[Style.day, {marginTop: 1 * width}]}
                      numberOfLines={1}>
                      {applicantData.first_name}
                    </Text>
                  </View>

                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={Style.title} numberOfLines={1}>
                      Age
                    </Text>
                    <Text
                      style={[Style.day, {marginTop: 1 * width}]}
                      numberOfLines={1}>
                      {applicantData.myAge}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={Style.title} numberOfLines={1}>
                      Experience
                    </Text>
                    <Text style={Style.day} numberOfLines={1}>
                      {applicantData.experence
                        ? applicantData.experence
                        : 'N/A'}
                    </Text>
                  </View>
                  {applicant.assign_status !== '2' && (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('AssignTrophey', {
                          data: applicantData,
                          job: jobData,
                        });
                      }}
                      style={{alignSelf: 'flex-end'}}>
                      <Text style={Style.assigned}>Reward Trophy</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View style={{flex: 1, width: '90%', paddingVertical: 2 * height}}>
              <View style={{width: '90%', marginTop: 2 * width}}>
                <Text style={Style.title}>Mobile</Text>
                <Text style={Style.data}>{applicantData.mobile_no}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Email</Text>
                <Text style={Style.data}>{applicantData.email}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Availability to Start work</Text>
                <Text
                  style={
                    Style.data
                  }>{`By ${applicantData.availability_Joining_date}`}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Facility Name</Text>
                <Text style={Style.data}>{hname}</Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Discipline</Text>
                <Text style={Style.data}>
                  {applicantData.discipline == 1
                    ? 'C.N.A'
                    : applicantData.discipline == 2
                    ? 'LPN/LVN'
                    : applicantData.discipline == 3
                    ? 'CMT'
                    : applicantData.discipline == 4
                    ? 'RN'
                    : applicantData.discipline == 5
                    ? 'RT'
                    : applicantData.discipline == 6
                    ? 'Other'
                    : 'N/A'}
                </Text>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Current Experience In</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {matchingExperienceNames.map((experienceName, index) => (
                    <Text style={Style.data} key={index}>
                      {index > 0 ? ',  ' : ''}
                      {experienceName}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={{width: '90%', marginTop: 3 * width}}>
                <Text style={Style.title}>Interested In</Text>
                <Text style={Style.data}>
                  {applicantData.userInterested.Interested
                    ? applicantData.userInterested.Interested
                    : 'N/A'}
                </Text>
              </View>
              <View style={{width: '100%', marginTop: 1 * width}}>
                <Text style={Style.title}>Assigned Trophy</Text>
                <FlatList
                  data={userTrofy}
                  horizontal={true}
                  keyExtractor={item => item.created_at}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleTrophyPress(item)}
                        style={{
                          height: height * 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginHorizontal: width * 3,
                        }}>
                        <Image
                          style={{width: width * 10, height: width * 10}}
                          source={{uri: `${userTrofyImageUrl}/${item.image}`}}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
              marginTop: 1 * width,
              backgroundColor: '#FFFFFF',
            }}
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
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
                  marginBottom: 10,
                }}>
                Trophy Details
              </Text>
              <View>
                <View style={Style.trophyHead}>
                  <Text style={Style.title}>Trophy Name:</Text>
                  <Text style={Style.trophyTitle}>
                    {selectedTrophy ? selectedTrophy.trophy_name : 'N/A'}
                  </Text>
                </View>
                <View style={Style.trophyHead}>
                  <Text style={Style.title}>Assigned At:</Text>
                  <Text style={Style.trophyTitle}>
                    {selectedTrophy ? selectedTrophy.created_at : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={Style.trophyHead}>
                <Text style={Style.title}>Reason:</Text>
                <Text
                  style={[
                    Style.trophyTitle,
                    {fontSize: 13, textAlign: 'justify'},
                  ]}>
                  {selectedTrophy?.reason || 'N/A'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: height * 1.5,
                }}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageView>
    </Provider>
  );
};

const Style = StyleSheet.create({
  title: {
    fontFamily: Fonts.Regular,
    fontSize: 3 * width,
    color: '#9B9B9B',
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
  trophyHead: {
    flexDirection: 'row',
  },
  trophyTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginLeft: width * 1.5,
  },
});

export default ApplicantDetailScreen;
