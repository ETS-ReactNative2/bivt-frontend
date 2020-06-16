/**
 * Actions for tracking family
 *
 * @version 0.0.1
 * @author Yalcin Tatar (https://github.com/yalcinos)
 */
import {Platform} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import JwtKeyChain from '../../../utils/jwtKeyChain';
import {bivtURL} from '../../apis/bivtApi';
//Purpose of Action: Describe some changes that we want to make to the data inside of our application.
export const mapLoadRequest = () => {
  return {
    type: 'MAP_REQUEST',
  };
};
export const mapLoadFail = (errorMessage) => {
  return {
    type: 'MAP_INTIAL_FAIL',
    payload: errorMessage,
  };
};
export const circleMemberFetchFail = (errorMessage) => {
  return {
    type: 'MEMBER_OF_CIRCLE_FAIL',
    payload: errorMessage,
  };
};

export const userWatchLocation = (userLocationDetails) => {
  return {
    type: 'USER_LOCATION_TRACK',
    payload: userLocationDetails,
  };
};
export const mapLoadSuccess = (userLocationDetails) => {
  return {
    type: 'MAP_INTIAL_SUCCESS',
    payload: userLocationDetails,
  };
};
export const fetchMemberInCircleSuccess = (circleMembers) => {
  return {
    type: 'GET_USER_INFORMATIONS_IN_SAME_GROUP',
    payload: circleMembers,
  };
};
export const trackLocationInBackGround = async () => {
  if (Platform.OS === 'android') {
    await Location.startLocationUpdatesAsync('watchLocation', {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
    });
  }
  await Location.startLocationUpdatesAsync('watchLocation', {
    accuracy: Location.Accuracy.High,
    distanceInterval: 1000,
  });
};

export const getLocation = async (dispatch) => {
  let {status} = await Location.requestPermissionsAsync();
  if (status !== 'granted') {
    dispatch(mapLoadFail('Please give permission for accessing your location'));
  }
  let location = await Location.getCurrentPositionAsync({});
  if (location !== null) {
    console.log('aa');

    dispatch(
      mapLoadSuccess({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }),
    );
  }
};
TaskManager.defineTask('watchLocation', ({data, error}) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const {locations} = data;
    console.log(locations);
    return async (dispatch) => {
      dispatch(
        mapLoadSuccess({
          latitude: locations[0].coords.latitude,
          longitude: locations[0].coords.longitude,
        }),
      );
      console.log(locations[0].coords.latitude);
    };

    // do something with the locations captured in the background
  }
});
export const getMembersInformationsInCircle = (token, _circleId) => {
  const localToken = 'bearer ' + token;

  const headersInfo = {
    'content-type': 'application/json',
    authorization: localToken,
  };
  const config = {
    headers: headersInfo,
    params: {
      circleId: _circleId,
    },
  };
  return async (dispatch) => {
    try {
      // dispatch(mapLoadRequest);
      const response = await bivtURL.get('/circle/getMemberOfACircle', config);

      if (response.status === 200) {
        dispatch(fetchMemberInCircleSuccess(response.data.data));
      } else {
        dispatch(
          circleMemberFetchFail(
            'Members could not fetched or you have no member in the circle.',
          ),
        );
      }
    } catch (error) {
      const errorMsg = error.message;
      console.log(errorMsg);
      dispatch(
        circleMemberFetchFail(
          'Members could not fetched or you have no member in the circle.',
        ),
      );
    }
  };
};