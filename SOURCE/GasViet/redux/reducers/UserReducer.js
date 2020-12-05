import { GET_USER, GET_USER_SUCCESS, GET_USER_FAIL, CHANGE_AVATAR, CHANGE_AVATAR_SUCCESS, CHANGE_AVATAR_FAIL } from "../actions/type";

const initialState = {
  data: [],
  isLoading: true,
  error: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER: {
      return { ...state, isLoading: true };
    }
    case GET_USER_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: null,

      };
    }
    case GET_USER_FAIL: {

      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }
    case CHANGE_AVATAR: {
      return { ...state, isLoading: true };
    }
    case CHANGE_AVATAR_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          result: {
            ...state.data.result,
            urlAvatar: action.payload.result
          }
        },
        isLoading: false,
        error: null,

      };
    }
    case CHANGE_AVATAR_FAIL: {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
