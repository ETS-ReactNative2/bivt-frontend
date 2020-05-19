/**
 * Create circle actions
 *
 * @version 0.0.1
 * @author Arshdeep Singh (https://github.com/Singh-Arshdeep)
 */

import {bivtURL} from '../../apis/bivtApi';
import {
  CREATE_CIRCLE_REQUEST,
  CREATE_CIRCLE_SUCCESS,
  CREATE_CIRCLE_FAILURE,
} from './createCirlceTypes';

export const createCircleRequest = () => {
  return {
    type: CREATE_CIRCLE_REQUEST,
  };
};

export const createCircleSuccess = (circleRegistrationDetails) => {
  return {
    type: CREATE_CIRCLE_SUCCESS,
    payload: circleRegistrationDetails,
  };
};

export const createCircleFailure = (error) => {
  return {
    type: CREATE_CIRCLE_FAILURE,
    payload: error,
  };
};

/**
 * This function calls the REST api to create a circle
 * The tempAuthToken is only for testing, once the user logsin they must use that auth token
 * to create a group
 */
const tempAuthToken = '';

export const createCircle = (createCircleDetails) => {
  const circleInfo = {
    name: createCircleDetails.groupName,
  };
  const config = {
    headers: {Authorization: `Bearer ${tempAuthToken}`},
  };
  return async (dispatch) => {
    dispatch(createCircleRequest);
    try {
      const response = await bivtURL.post('/circle/create', circleInfo, config);
      const circleRegistrationDetails = response.data;
      console.log(circleRegistrationDetails);
      dispatch(createCircleSuccess('circle successfully created'));
    } catch (error) {
      const errorMsg = error.response.data.status.errors;
      dispatch(createCircleFailure(errorMsg));
    }
  };
};