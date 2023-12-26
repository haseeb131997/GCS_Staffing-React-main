import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import ApiMethod from '../../../api/ApiMethod';
import CustomProgress from '../../../compenents/CustomProgress';
import FastImage from 'react-native-fast-image';
import ConstData from '../../../utility/ConstData';
import {MenuView} from '@react-native-menu/menu';
import ToastUtility from '../../../utility/ToastUtility';

const ApplicantListScreen = ({navigation, route}) => {
  const [jobData, setJobData] = useState(route.params.data);
  const [hname, setHname] = useState(route.params.Hospital_Name);
  const [applicantsList, setApplicantsList] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [showRefreshing, setShowRefreshing] = useState(false);
  // const [showMenu, setShowMenu] = useState(false);
  // const [showMenuPos, setShowMenuPos] = useState(-1);

  // const [errorTitle, setErrorTitle] = useState('ss');
  // const [errorMessage, setErrorMessage] = useState('ss');
  // const [showSuccess, setShowSuccess] = useState(false);
  // const [isError, setError] = useState(false);

  // console.log(jobData);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      setShowProgress(true);
      getApplicantsList();
    });
  }, []);

  const getApplicantsList = () => {
    var formData = new FormData();
    formData.append('job_id', jobData.job_id);

    ApiMethod.applicantsList(
      formData,
      pass => {
        console.log('pass', pass);
        setShowProgress(false);
        setShowRefreshing(false);
        if (pass.status == 200) {
          setImagePath(pass.profile_image_url);
          setApplicantsList(pass.viewApplicant);
        } else {
          setApplicantsList([]);
        }
      },
      fail => {
        console.log('fail', fail);
        setShowProgress(false);
        setShowRefreshing(false);
        setApplicantsList([]);
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
            Hired Applicants
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
          {applicantsList.length > 0 ? (
            <FlatList
              data={applicantsList}
              style={{width: '100%', flex: 1}}
              refreshControl={
                <RefreshControl
                  colors={['#116939', '#C59C27']}
                  refreshing={showRefreshing}
                  onRefresh={() => {
                    setShowRefreshing(true);
                    getApplicantsList();
                  }}
                />
              }
              renderItem={({item, index}) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      paddingVertical: 2 * height,
                      borderBottomColor: '#CECECE',
                    }}>
                    {item.profile_image ? (
                      <FastImage
                        source={{uri: imagePath + item.profile_image}}
                        style={{
                          width: 11 * height,
                          height: 11 * height,
                          borderRadius: 4 * width,
                          resizeMode: 'cover',
                          backgroundColor: '#EFFFF6',
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/images/splash_logo.png')}
                        style={{
                          width: 11 * height,
                          height: 11 * height,
                          borderRadius: 4 * width,
                          resizeMode: 'contain',
                          backgroundColor: '#EFFFF6',
                        }}
                      />
                    )}

                    <View
                      style={{
                        flex: 1,
                        height: 9 * height,
                        marginStart: 4 * width,
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          flexDirection: 'row',
                          height: 6 * width,
                        }}>
                        <Text style={Style.day} numberOfLines={1}>
                          {item.first_name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ApplicantDetail', {
                              data: item,
                              job: jobData,
                              facility: hname,
                            });
                          }}>
                          <Text style={Style.view}>View Detail</Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Text style={Style.title} numberOfLines={1}>
                            Experience
                          </Text>
                          <Text style={Style.day} numberOfLines={1}>
                            {item.experence ? item.experence : 'N/A'}
                          </Text>
                        </View>

                        {/* <SelectDropdown
                          defaultButtonText={'Assigned'}
                          data={ConstData.getUnAssignArr()}
                          onSelect={(selectedItem, index1) => {
                            console.log('0ws0s', selectedItem, index);
                          }}
                          dropdownStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 2 * width,
                            marginTop: -10 * width,
                          }}
                          buttonStyle={Style.selector}
                          buttonTextStyle={{
                            color: '#FFFFFF',
                            fontFamily: Fonts.SemiBold,
                            fontSize: 3 * width,
                          }}
                          rowStyle={{
                            color: '#FFFFFF',
                            fontFamily: Fonts.SemiBold,
                            fontSize: 3 * width,
                            height: 10 * width,
                          }}
                          rowTextStyle={{
                            color: '#000000',
                            fontFamily: Fonts.SemiBold,
                            fontSize: 3 * width,
                          }}
                          // selectedRowStyle={{
                          //   color: '#FFFFFF',
                          //   fontFamily: Fonts.SemiBold,
                          //   fontSize: 3 * width,
                          // }}
                          dropdownIconPosition="left"
                          renderDropdownIcon={(selectedItem, index) => {
                            return (
                              <Feather
                                name="chevron-down"
                                size={5 * width}
                                color="#FFFFFF"
                              />
                            );
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item;
                          }}
                        /> */}

                        {item.assign_status == 1 ? (
                          <MenuView
                            onPressAction={({nativeEvent}) => {
                              console.log(JSON.stringify(nativeEvent));
                              switch (nativeEvent.event) {
                                case 'unassign': {
                                  ToastUtility.showToast('Unassign');
                                  navigation.navigate('UnAssign', {
                                    data: item,
                                    job: jobData,
                                  });
                                }
                              }
                            }}
                            actions={[
                              {
                                id: 'unassign',
                                title: 'Unassign',
                                titleColor: '#000000',
                              },
                            ]}
                            // isAnchoredToRight={true}
                            // style={Style.selector}
                            style={{
                              width: 30 * width,
                              height: 10 * width,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexDirection: 'row',
                              backgroundColor: '#116939',
                              borderRadius: 2 * width,
                              paddingHorizontal: 2 * width,
                            }}>
                            <View
                              style={{
                                width: '100%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row',
                                paddingHorizontal: 2 * width,
                              }}>
                              <Text style={Style.assigned}>Assigned</Text>
                              <Feather
                                name="chevron-down"
                                size={5 * width}
                                color="#FFFFFF"
                              />
                            </View>
                          </MenuView>
                        ) : item.assign_status == 2 ? (
                          <View style={Style.selectorRed}>
                            <Text style={Style.assigned}>Unassigned</Text>
                          </View>
                        ) : (
                          // <View />
                          <View style={Style.selectorYellow}>
                            <Text style={Style.assignedYellow}>Applied</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View
              style={{
                // flex: 1,
                width: '100%',
                height: '70%',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: '#ada',
                // marginTop: 10 * height,
              }}>
              {/* <Image
                source={require('../../../assets/images/nodata-founds.png')}
                style={{
                  height: 20 * height,
                  resizeMode: 'contain',
                  marginTop: 10 * height,
                }}
              /> */}
              <Text style={Style.NoData} numberOfLines={1}>
                {'No Applicants Applied'}
              </Text>
            </View>
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
  view: {
    color: '#C59C27',
    fontFamily: Fonts.SemiBold,
    fontSize: 3 * width,
  },
  day: {
    flex: 1,
    color: '#000000',
    fontFamily: Fonts.SemiBold,
    fontSize: 3.8 * width,
  },
  NoData: {
    color: '#000000',
    fontFamily: Fonts.SemiBold,
    fontSize: 3.8 * width,
  },
  assigned: {
    color: '#FFFFFF',
    fontFamily: Fonts.SemiBold,
    fontSize: 3 * width,
  },
  selector: {
    width: '45%',
    height: 10 * width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#116939',
    borderRadius: 2 * width,
    paddingHorizontal: 2 * width,
  },
  selectorRed: {
    width: '45%',
    height: 10 * width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    borderRadius: 2 * width,
    paddingHorizontal: 2 * width,
  },
  selectorYellow: {
    width: '45%',
    height: 10 * width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#C59C27',
    borderRadius: 2 * width,
    paddingHorizontal: 2 * width,
  },
  assignedYellow: {
    color: '#FFFFFF',
    fontFamily: Fonts.SemiBold,
    fontSize: 3 * width,
  },
});

export default ApplicantListScreen;
