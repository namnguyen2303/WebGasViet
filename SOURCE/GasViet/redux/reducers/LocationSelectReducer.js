import { SEND_LOCATION_SELECT, CLEAR_LOCATION_SELECT } from "../actions/type";

const INITIAL_STATE = {
  lat: 0,
  lng: 0,
  name: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEND_LOCATION_SELECT:
      return {
        ...state,
        lat: action.payload.location.latitude,
        lng: action.payload.location.longitude,
        name: action.payload.name
      };
    case CLEAR_LOCATION_SELECT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
