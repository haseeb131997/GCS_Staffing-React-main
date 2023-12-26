/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DefaultTheme, Provider} from 'react-native-paper';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import ColorCode from './src/utility/ColorCode';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AndroidSplashScreen from './src/screens/splash/AndroidSplashScreen';
import WelcomeScreen from './src/screens/welcome/WelcomeScreen';
import LoginScreen from './src/screens/login/LoginScreen';
import SignupScreen from './src/screens/signup/SignupScreen';
import HospitalDashScreen from './src/screens/hospital/dashboard/HospitalDashScreen';
import PostJobScreen from './src/screens/hospital/post_job/PostJobScreen';
import PostJobDetailScreen from './src/screens/hospital/job_detail/PostJobDetailScreen';
import ApplicantListScreen from './src/screens/hospital/applicant_list/ApplicantListScreen';
import ApplicantDetailScreen from './src/screens/hospital/applicant_detail/ApplicantDetailScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTabScreen from './src/screens/team_player/dash_tab/home/HomeTabScreen';
import MyJobsTabScreen from './src/screens/team_player/dash_tab/my_jobs/MyJobsTabScreen';
import ProfileTabScreen from './src/screens/team_player/dash_tab/profile/ProfileTabScreen';
import Fonts from './src/utility/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import width from './src/Units/width';
import FastImage from 'react-native-fast-image';
import StorageUtility from './src/utility/StorageUtility';
import SearchScreen from './src/screens/team_player/search/SearchScreen';
import UnassignApplicantScreen from './src/screens/hospital/unassign_applicant/UnassignApplicantScreen';
import AssignTropheyScreen from './src/screens/hospital/assign_trophey/AssignTropheyScreen';
import EditProfileScreen from './src/screens/team_player/dash_tab/profile/EditProfile';
import messaging from '@react-native-firebase/messaging';

import NotificationListener, {
  costumNotificationListener,
  requestUserPermission,
} from './src/utility/NotificationListener';
import height from './src/Units/height';
import {Platform} from 'react-native';
import TpNotication from './src/screens/team_player/dash_tab/home/TpNotification';

export const getTheme = isDarkMode => ({
  ...DefaultTheme,
  dark: isDarkMode,
  colors: {
    ...DefaultTheme.colors,
    primary: ColorCode.primary, //'#0285FB',
    accent: ColorCode.accent, //'#0285FB',
    error: ColorCode.red, //'#ED1C24',
  },
});

const AuthNav = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <AuthNav.Navigator>
      {/* {Platform.OS == 'android' && ( */}
      <AuthNav.Screen
        name="Splash"
        component={AndroidSplashScreen}
        options={{headerShown: false}}
      />
      {/* )} */}
      <AuthNav.Screen
        name="Waiting"
        component={WaitingScreen}
        options={{headerShown: false}}
      />
      <AuthNav.Screen
        name="Intro"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <AuthNav.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthNav.Screen
        name="Signup"
        component={SignupScreen}
        options={{headerShown: false}}
      />
    </AuthNav.Navigator>
  );
};

const HospitalNav = createNativeStackNavigator();
const HospitalStack = () => {
  return (
    <HospitalNav.Navigator>
      <HospitalNav.Screen
        name="Dashboard"
        component={HospitalDashScreen}
        options={{headerShown: false}}
      />
      <HospitalNav.Screen
        name="PostJob"
        component={PostJobScreen}
        options={{headerShown: false}}
      />
      <HospitalNav.Screen
        name="JobDetail"
        component={PostJobDetailScreen}
        options={{headerShown: false}}
      />
      <HospitalNav.Screen
        name="JobApplicants"
        component={ApplicantListScreen}
        options={{headerShown: false}}
      />
      <HospitalNav.Screen
        name="ApplicantDetail"
        component={ApplicantDetailScreen}
        options={{headerShown: false}}
      />
      <HospitalNav.Screen
        name="UnAssign"
        component={UnassignApplicantScreen}
        options={{headerShown: false}}
      />
      <HospitalNav.Screen
        name="AssignTrophey"
        component={AssignTropheyScreen}
        options={{headerShown: false}}
      />
    </HospitalNav.Navigator>
  );
};

const TMBottomNav = createBottomTabNavigator();
function TMTabStack() {
  return (
    <TMBottomNav.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#008A3D',
        tabBarInactiveTintColor: '#4D4D4D',
        backgroundColor: '#dad',
        // tabBarBackground:{()=> {return backgroundColor:'#dad'}},
        tabBarStyle: {
          backgroundColor: ColorCode.white,
          height: 8 * height,
          display: 'flex',
          paddingTop: 1 * width,
          paddingBottom: 2 * width,
        },
        tabBarLabel: ({focused, color, size}) => {
          return (
            <Text
              style={{
                // color: focused ? ColorCode.textBlack : ColorCode.grey888,
                color: color,
                fontSize: focused ? 3 * width : 3 * width,
                fontWeight: focused ? '500' : '500',
                fontFamily: Fonts.Medium,
              }}>
              {route.name}
            </Text>
          );
        },
        tabBarIcon: ({focused, color, size}) => {
          let icon;
          if (route.name === 'Home') {
            icon = require('./src/assets/images/home_tabs.png');
          } else if (route.name === 'MyJobs') {
            icon = require('./src/assets/images/jobs_tabs.png');
          } else if (route.name === 'Profile') {
            icon = require('./src/assets/images/profile_tab.png');
          }
          return (
            <Image
              source={icon}
              style={{
                tintColor: color,
                width: 5 * width,
                height: 5 * width,
                resizeMode: 'contain',
                marginTop: 2,
              }}
            />
          );
        },
        tabBarBackground: () => (
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#F0FFF7', '#F0FFF7', '#FFFFFF']}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
          />
        ),
      })}>
      <TMBottomNav.Screen
        name="Home"
        component={HomeTabScreen}
        options={{headerShown: false}}
      />
      <TMBottomNav.Screen
        name="MyJobs"
        component={MyJobsTabScreen}
        options={{headerShown: false}}
      />
      <TMBottomNav.Screen
        name="Profile"
        component={ProfileTabScreen}
        options={{headerShown: false}}
      />
    </TMBottomNav.Navigator>
  );
}

const TmNav = createNativeStackNavigator();
const TmStack = () => {
  return (
    <TmNav.Navigator>
      <TmNav.Screen
        name="TMHome"
        component={TMTabStack}
        options={{headerShown: false}}
      />
      <TmNav.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <TmNav.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{headerShown: false}}
      />
      <TmNav.Screen
        name="TpNotification"
        component={TpNotication}
        options={{headerShown: false}}
      />
    </TmNav.Navigator>
  );
};

const MainNav = createNativeStackNavigator();
const MainStack = () => {
  return (
    <MainNav.Navigator>
      <MainNav.Screen
        name="AuthStack"
        component={AuthStack}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="HospitalStack"
        component={HospitalStack}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="TMStack"
        component={TmStack}
        options={{headerShown: false}}
      />
    </MainNav.Navigator>
  );
};

export const WaitingScreen = ({navigation}) => {
  useEffect(() => {
    console.log(Platform.OS);

    updateScreen();

    return () => {};
  }, []);

  const updateScreen = async () => {
    const uu = await StorageUtility.getUser();
    const ut = await StorageUtility.getUserType();
    // const uu = await StorageUtility.getSession();
    if (uu && ut) {
      if (ut == '1') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HospitalStack'}],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'TMStack'}], //params: {from: 1}
          }),
        );
      }
    } else {
      const intro = await StorageUtility.getShowIntro();
      if (intro == '1') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Intro'}],
          }),
        );
      }
    }
  };

  return <View></View>;
};

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    getDeviceToken();
  }, []);

  // Handle incoming notifications when app is in foreground
  messaging().onMessage(async remoteMessage => {
    console.log('Received foreground notification: ', remoteMessage);
  });

  // Handle incoming notifications when app is in background
  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log('Received background notification: ', remoteMessage);
  });

  // Handle incoming notifications when app is closed
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      console.log('Received closed app notification: ', remoteMessage);
    });
  const getDeviceToken = async () => {
    const token = await messaging().getToken();
    console.log(
      '************************Device tocken************************',
      token,
    );
  };
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider style={backgroundStyle} theme={getTheme(isDarkMode)}>
      {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
