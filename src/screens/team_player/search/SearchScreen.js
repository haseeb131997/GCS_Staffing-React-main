import React, {Fragment, useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import {Provider} from 'react-native-paper';
import CustomButton from '../../../compenents/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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

const SearchScreen = ({navigation, route}) => {
  const MyData = route.params.Data;
  console.log('Data from home screen', MyData);

  const [allJobs, setAllJobs] = useState(MyData);

  const [search, setSearch] = useState('');

  const [jobResultList, setJobResultList] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    // getApplicant()
  }, []);

  // const getApplicant = () => {
  //   setShowProgress(true);

  //   var formData = new FormData();
  //   formData.append('user_id', applicant.user_id);

  //   ApiMethod.applicantsDetail(
  //     formData,
  //     pass => {
  //       setShowProgress(false);
  //       console.log('pass', pass);
  //       if (pass.status == 200) {
  //         setImagePath(pass.profile_image_url);
  //         setApplicantData(pass.job);
  //       }
  //     },
  //     fail => {
  //       setShowProgress(false);
  //       console.log('fail', fail);
  //     },
  //   );
  // }

  const searchJobs = s => {
    // setTimeout(() => {
    //   setShowProgress(false);
    // }, 4000);
  };

  // Function to filter data based on job profile or location
  function filterData(searchTerm) {
    searchTerm = searchTerm.toLowerCase(); // Convert the search term to lowercase for case-insensitive matching

    const filteredData = MyData.filter(item => {
      const jobProfileLowerCase = item.job_profile.toLowerCase();
      const locationLowerCase = item.location.toLowerCase();
      // const priceLowerCase = item.price.toLowerCase();
      const shiftLowerCase = item.shift.toLowerCase();

      // Check if either job profile or location contains the search term
      return (
        jobProfileLowerCase.includes(searchTerm) ||
        locationLowerCase.includes(searchTerm) ||
        shiftLowerCase.includes(searchTerm)
      );
    });

    return filteredData;
  }

  // Example usage:
  // const searchTerm = 'Guard'; // Replace with the actual search term from your search bar
  const filteredResults = filterData(search);

  console.log('filtered resulet on search screen', filteredResults);

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
            {'Search Jobs'}
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
          <View
            style={{
              width: '100%',
              height: 8 * height,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 4 * width,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                height: 6 * height,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderRadius: 3 * width,
                borderColor: '#D4D4D4',
                paddingHorizontal: 2 * width,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  height: '100%',
                  color: '#A4A4A4',
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  // backgroundColor: '#ada',
                  paddingHorizontal: 2 * width,
                }}
                placeholder="Search Job..."
                value={search}
                onChangeText={t => {
                  setSearch(t);
                  searchJobs(t);
                }}
              />
              {search ? (
                showProgress ? (
                  <View
                    style={{
                      height: 5 * height,
                      width: 5 * height,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 2 * width,
                    }}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setSearch('');
                      setJobResultList([]);
                    }}
                    style={{
                      height: 5 * height,
                      width: 5 * height,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 2 * width,
                    }}>
                    <Ionicons name="close" size={5 * width} color="#116939" />
                  </TouchableOpacity>
                )
              ) : (
                <View
                  style={{
                    height: 5 * height,
                    width: 5 * height,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2 * width,
                  }}
                />
              )}
            </View>
          </View>

          <FlatList
            data={filteredResults}
            style={{flex: 1, width: '100%'}}
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
                        height: 10 * width,
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
                        {moment(item.start_date, 'DD').format('Do MMMM')}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 4 * width,
                      marginTop: 2 * width,
                      marginBottom: 1 * width,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <MaterialCommunityIcons
                        name="calendar-clock-outline"
                        size={4 * width}
                        color="#116939"
                      />
                      <Text
                        style={{
                          color: '#A4A4A4',
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                          marginStart: 2 * width,
                        }}
                        numberOfLines={1}>
                        <Text
                          style={{
                            color: '#116939',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {'Shift: '}
                        </Text>
                        <Text
                          style={{
                            color: '#116939',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {item.shift}
                        </Text>
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <MaterialCommunityIcons
                        name="clock-time-eight-outline"
                        size={4 * width}
                        color="#C59C27"
                      />
                      <Text
                        style={{
                          fontSize: 3 * width,
                          fontFamily: Fonts.Regular,
                          marginStart: 2 * width,
                        }}
                        numberOfLines={1}>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {'Time: '}
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 3 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {item.shift}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
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
                        flex: 0.7,
                        height: 6 * height,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 3 * width,
                        borderWidth: 1,
                        borderColor: '#116939',
                        marginHorizontal: 1 * width,
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          paddingHorizontal: 2.5 * width,
                        }}>
                        <Text
                          style={{
                            color: '#A4A4A4',
                            fontSize: 2.8 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {'Price'}
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 3.2 * width,
                            fontFamily: Fonts.SemiBold,
                          }}>
                          {`$ ${item.price}/hr`}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 0.9,
                        height: 6 * height,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 3 * width,
                        borderWidth: 1,
                        borderColor: '#116939',
                        marginHorizontal: 2 * width,
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          paddingHorizontal: 2.5 * width,
                        }}>
                        <Text
                          style={{
                            color: '#A4A4A4',
                            fontSize: 2.8 * width,
                            fontFamily: Fonts.Regular,
                          }}>
                          {'Shift Days '}
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 3.2 * width,
                            fontFamily: Fonts.SemiBold,
                          }}>
                          {`${item.working_day}`}
                        </Text>
                      </View>
                    </View>

                    {item.applyStatus == '1' ? (
                      <View
                        style={{
                          flex: 1,
                          height: 6 * height,
                          backgroundColor: '#116939',
                          borderRadius: 3 * width,
                          marginHorizontal: 1 * width,
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 4 * width,
                          }}>
                          <Feather
                            name="check"
                            size={4 * width}
                            color="#FFFFFF"
                          />
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                              marginStart: 1 * width,
                            }}>
                            {'Applied'}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          applyJob(item, index);

                          // item['applied_status'] = 1;
                          // var t1 = [...jobList];
                          // t1[index] = item;
                          // setJobList(t1);
                        }}
                        style={{
                          flex: 1,
                          height: 6 * height,
                          backgroundColor: '#C59C27',
                          borderRadius: 3 * width,
                          marginHorizontal: 1 * width,
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 4 * width,
                          }}>
                          {/* <Feather
                          name="check"
                          size={4 * width}
                          color="#FFFFFF"
                        /> */}
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: 3 * width,
                              fontFamily: Fonts.Regular,
                              marginStart: 1 * width,
                            }}>
                            {'Apply'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>
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
});

export default SearchScreen;
