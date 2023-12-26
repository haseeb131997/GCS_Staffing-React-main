/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
// import type {Node} from 'react';
import {useState, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Dimensions,
  Platform,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider, Button} from 'react-native-paper';
import ApiMethod from './ApiMethod';

const GAUGE_WIDTH = Math.floor(Dimensions.get('window').width);
const INTERVAL_WIDTH = 18;

const optionsPerPage = [2, 3, 4];

const NewScreen = () => {
  const [value, setValue] = useState(10);
  const [amount, setAmount] = useState(10);
  const [error, setError] = useState(false);
  const [text, setText] = useState('');

  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(false);
  const login = () => {
    console.log('dfsdfdsfsdfsdfsdfsdfsddfd');
    ApiMethod.login(
      {
        mobile_no: '4342342',
        password: '2432423423',
        device_token: '23423424',
        device_type: Platform.OS,
        device_id: '24234234',
      },
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const sendOtp = () => {
    console.log('sendOtp');
    ApiMethod.sendOtp(
      {
        mobile_no: '9911353399',
        otp_type: '5',
      },
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const verifyOtp = () => {
    console.log('sendOtp');
    ApiMethod.verifyOtp(
      {
        mobile_no: '9911353399',
        otp_type: '5',
        otp: '431479',
        device_token: '23423424',
        device_type: Platform.OS,
        device_id: '24234234',
      },
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const signUp = () => {
    console.log('dfsdfdsfsdfsdfsdfsdfsddfd');
    ApiMethod.signup(
      {
        name: 'Test 1',
        phone: '4342342',
        email: 'test1@yopmail.com',
        password: '2432423423',
        c_password: '2432423423',
      },
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const personalDetail = () => {
    console.log('personalDetail');
    ApiMethod.personalDetail(
      {
        userId: '6',
        full_name: 'Test 1',
        dob: '12-08-2022',
        gender: 'Test 1',
        marital_status: 'Test 1',
        address_line_1: 'Test 1',
        address_line_2: 'Test 1',
        city: 'Test 1',
        district: 'Test 1',
        state: 'Test 1',
        pincode: '202020',
        nature_of_employment: 'Test 1',
        employer_name: 'Test 1',
        if_other: 'Test 1',
      },
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const employmentDetail = () => {
    console.log('employmentDetail');
    ApiMethod.employmentDetail(
      {
        userId: '6',
        employer_name: 'Test',
        joining_date: '12-08-2021',
        employee_id: 'Test',
        type: 'Test',
        designation: 'Test',
        department: 'Test',
        gross_salary: 'Test',
        email_id: 'asdadd@sfsfsf.ddd',
        phone_no: '3333333333',
        address: 'Test',
        district: 'Test',
        state: 'Test',
        pincode: '222222',
        experience_in_current_company: 'Test',
      },
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const bankDetail = () => {
    console.log('bankDetail');
    ApiMethod.bankDetail(
      {
        userId: '6',
        bank_name: 'Test',
        ifsc_code: 'aasas555545',
        account_type: 'saving',
        account_number: '111111111111',
        c_account_no: '111111111111',
        address: 'Test',
        state: 'Test',
        pincode: '222222',
      },
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const upload = () => {
    console.log('bankDetail');
    //{
    //   userId: '6',
    //   d_proof_front: '',
    //   id_proof_back: '',
    //   pan_card_front: '',
    //   address_proof_front: '',
    //   address_proof_back: '',
    //   salary_slip_1: '',
    //   salary_slip_2: '',
    //   salary_slip_3: '',
    //   bank_attachment: '',
    // }

    var data = new FormData();
    data.append(
      'd_proof_front',
      tileImage
        ? {
            name: `Img${Date.now()}.jpg`,
            type: 'image/jpg', //imageData.type
            uri:
              Platform.OS == 'android'
                ? tileImage.uri
                : tileImage.uri.replace('file://', ''),
          }
        : '',
    );

    ApiMethod.uploadDoc(
      data,
      pass => {
        console.log('pass', pass);
      },
      fail => {
        console.log('fail', fail);
      },
    );
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <Provider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          style={{backgroundColor: '#000000'}}
        />

        <Button onPress={login}>{'L1'}</Button>
        <Button onPress={sendOtp}>{'sotp'}</Button>
        <Button onPress={verifyOtp}>{'votp'}</Button>
        <Button onPress={signUp}>{'s1'}</Button>
        <Button onPress={personalDetail}>{'pd1'}</Button>
        <Button onPress={employmentDetail}>{'ed1'}</Button>
        <Button onPress={bankDetail}>{'bd1'}</Button>
        <Button onPress={upload}>{'ulod'}</Button>
      </SafeAreaView>
    </Provider>
  );
};

export default NewScreen;
