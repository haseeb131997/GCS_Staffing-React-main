import React, { useEffect } from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Modal, Text} from 'react-native-paper';
import height from '../Units/height';
import width from '../Units/width';
import ColorCode from '../utility/ColorCode';
import Fonts from '../utility/Fonts';

const CustomPopup = props => {
  return (
    <Modal
      visible={props.show}
      dismissable={false}
      contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: 70 * width,
          //height: 20 * width,
          paddingVertical: 2 * height,
          backgroundColor: 'white',
          borderRadius: 2 * width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {props.title && (
          <Text
            style={{
              fontFamily: Fonts.Bold,
              fontSize: 5 * width,
              color: props.error ? ColorCode.red : ColorCode.black,
              borderBottomColor: '#000000',
              borderBottomWidth: 1,
            }}>
            {props.title}
          </Text>
        )}
        <Text
          style={{
            fontFamily: Fonts.SemiBold,
            fontSize: 4 * width,
            color: ColorCode.textBlack,
            padding: 4 * width,
          }}>
          {props.message}
        </Text>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 5 * height,
            borderWidth: 1,
            backgroundColor: ColorCode.selectorDot1,
            borderColor: ColorCode.selectorDot1,
            borderRadius: 2 * width,
          }}
          onPress={() => props.onDissmiss()}>
          <Text
            style={{
              fontFamily: Fonts.SemiBold,
              fontSize: 4.4 * width,
              color: ColorCode.white,
              paddingHorizontal: 6 * width,
              // paddingVertical: 2 * width,
              marginTop: 1 * width,
            }}>
            Ok
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomPopup;
