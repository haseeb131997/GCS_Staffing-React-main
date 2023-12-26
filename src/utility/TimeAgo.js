import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import moment from 'moment';
import Fonts from './Fonts';
import width from '../Units/width';

const TimeAgo = ({timestamp}) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const calculateTimeDifference = () => {
      const currentTime = moment();
      const postTime = moment(timestamp);

      const diffInSeconds = currentTime.diff(postTime, 'seconds');
      const diffInMinutes = currentTime.diff(postTime, 'minutes');
      const diffInHours = currentTime.diff(postTime, 'hours');
      const diffInDays = currentTime.diff(postTime, 'days');

      if (diffInSeconds < 60) {
        setFormattedTime(`${diffInSeconds} sec ago`);
      } else if (diffInMinutes < 60) {
        setFormattedTime(`${diffInMinutes} min ago`);
      } else if (diffInHours < 24) {
        setFormattedTime(`${diffInHours} hr ago`);
      } else {
        setFormattedTime(`${diffInDays} day ago`);
      }
    };

    calculateTimeDifference();
  }, [timestamp]);

  return (
    <View>
      <Text
        style={{
          color: '#000000',
          fontFamily: Fonts.Light,
          fontSize: width * 3,
        }}>
        {formattedTime}
      </Text>
    </View>
  );
};

export default TimeAgo;
