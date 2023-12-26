/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {Provider} from 'react-native-paper';
import ImageView from '../../../../compenents/ImageView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import height from '../../../../Units/height';
import width from '../../../../Units/width';
import Fonts from '../../../../utility/Fonts';
import CustomStatus from '../../../../compenents/CustomStatus';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

const TpNotication = ({navigation}) => {
  const data = [
    {
      id: '1',
      greet: 'Congratulations!',
      msgBody: 'You have been shortlisted for CMT position in XYZ Hospital',
      time: '2023-11-30T05:35:20.703Z',
    },
    {
      id: '2',
      greet: 'Congratulations!',
      msgBody: 'You have been shortlisted for NVLT position in AIIMS Hospital',
      time: '2023-09-16T16:35:20.703Z',
    },
    {
      id: '3',
      greet: 'Congratulations!',
      msgBody: 'You have been shortlisted for CMT position in OXLYTOR Hospital',
      time: '2023-08-22T16:35:20.703Z',
    },
  ];

  const Data1 = [
    {
      greet: 'Congratulations!',
      id: '1',
      msgBody: 'You have been shortlisted for NVLT position in AIIMS Hospital',
      time: '2023-09-16T16:35:20.703Z',
    },
    {
      greet: 'Congratulations!',
      id: '2',
      msgBody: 'You have been shortlisted for CMT position in OXLYTOR Hospital',
      time: '2023-08-22T16:35:20.703Z',
    },
  ];

  const calculateTimeDifference = timestamp => {
    const currentTime = moment();
    const postTime = moment(timestamp);

    const diffInSeconds = currentTime.diff(postTime, 'seconds');
    const diffInMinutes = currentTime.diff(postTime, 'minutes');
    const diffInHours = currentTime.diff(postTime, 'hours');
    const diffInDays = currentTime.diff(postTime, 'days');

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    } else {
      return `${diffInDays} day ago`;
    }
  };

  let today = [];
  var week = [];

  useEffect(() => {
    const currentTime = moment();
    // console.log('Current Time:', currentTime.format());

    // Categorize data into todayData and thisWeekData
    data.forEach(item => {
      const itemTime = moment(item.time);
      //   console.log('Item Time:', itemTime.format());

      const diffInDays = Math.floor(currentTime.diff(itemTime, 'days'));
      //   console.log('Diff in Days:', diffInDays);

      if (diffInDays <= 1) {
        today.push(item);
      } else if (diffInDays > 1) {
        week.push(item);
      }
    });

    console.log('Today Data:', today);
    console.log('This Week Data:', week);
  }, [data]);
  console.log(data);
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
              fontSize: 4 * width,
              fontFamily: Fonts.Medium,
            }}>
            {'Notifications'}
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

        <KeyboardAwareScrollView
          style={{
            width: '100%',
            marginTop: 1 * width,
            backgroundColor: '#FFFFFF',
          }}>
          <View>
            <View style={{marginTop: height * 2, marginHorizontal: width * 4}}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Bold,
                }}>
                Today
              </Text>
            </View>
            <FlatList
              data={data}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                const formattedTime = calculateTimeDifference(item.time);
                return (
                  <View
                    style={{
                      width: width * 95,
                      height: height * 7,
                      backgroundColor: '#ffffff',
                      marginTop: height * 1.5,
                      alignSelf: 'center',
                      paddingLeft: width * 2,
                      paddingRight: width * 3,
                      padding: width * 1,
                      borderRadius: width * 1.5,
                      borderColor: '#f4f4f4',
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: width * 3,
                        height: width * 3,
                        borderRadius: width * 1.5,
                        backgroundColor: '#116939',
                      }}
                    />
                    <View style={{paddingHorizontal: width * 2.5}}>
                      <Text style={{color: '#000000', fontFamily: Fonts.Bold}}>
                        {item.greet}{' '}
                        <Text
                          style={{color: '#000000', fontFamily: Fonts.Medium}}>
                          {item.msgBody}{' '}
                          <Text
                            style={{
                              color: '#000000',
                              fontFamily: Fonts.Regular,
                              fontSize: width * 3,
                            }}>
                            {formattedTime}
                          </Text>
                        </Text>
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <View>
            <View style={{marginTop: height * 2, marginHorizontal: width * 4}}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Bold,
                }}>
                This Week
              </Text>
            </View>
            <FlatList
              data={data}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                const formattedTime = calculateTimeDifference(item.time);
                // console.log('Formatted Time:', formattedTime);
                return (
                  <View
                    style={{
                      width: width * 95,
                      height: height * 7,
                      backgroundColor: '#ffffff',
                      marginTop: height * 1.5,
                      alignSelf: 'center',
                      paddingLeft: width * 2,
                      paddingRight: width * 3,
                      padding: width * 1,
                      borderRadius: width * 1.5,
                      borderColor: '#f4f4f4',
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: width * 3,
                        height: width * 3,
                        borderRadius: width * 1.5,
                        backgroundColor: '#116939',
                      }}
                    />
                    <View style={{paddingHorizontal: width * 2.5}}>
                      <Text style={{color: '#000000', fontFamily: Fonts.Bold}}>
                        {item.greet}{' '}
                        <Text
                          style={{color: '#000000', fontFamily: Fonts.Medium}}>
                          {item.msgBody}{' '}
                          <Text
                            style={{
                              color: '#000000',
                              fontFamily: Fonts.Regular,
                              fontSize: width * 3,
                            }}>
                            {formattedTime}
                          </Text>
                        </Text>
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </ImageView>
    </Provider>
  );
};
export default TpNotication;
