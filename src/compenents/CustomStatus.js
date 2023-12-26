import React from 'react';
import {Platform, StatusBar, View} from 'react-native';

const CustomStatus = props => {
  return (
    <View
      style={{
        width: '100%',
        height: Platform.OS == 'ios' ? 38 : StatusBar.currentHeight,
        backgroundColor: props.color ? props.color : '#FFFFFF',
      }}>
      <StatusBar
        animated={true}
        translucent={props.trans ? props.trans : false}
        backgroundColor={props.color ? props.color : '#FFFFFF00'}
        barStyle={props.isDark ? 'dark-content' : 'light-content'} // : 'dark-content'
        showHideTransition={'slide'}
      />
    </View>
  );
};

export default CustomStatus;
