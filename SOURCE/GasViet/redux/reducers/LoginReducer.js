import {
    REQUEST_LOGIN_FB,
    REQUEST_LOGIN_FB_FAIL,
    REQUEST_LOGIN_FB_SUCCESS,
    REQUEST_LOGIN,
    REQUEST_LOGIN_SUCCESS,
    REQUEST_LOGIN_FAIL,
    REQUEST_LOGIN_GG,
    REQUEST_LOGIN_GG_SUCCESS,
    REQUEST_LOGIN_GG_FAIL,
} from "../actions/type";

const initialState = {
    data: [],
    isLoading: true,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
        case REQUEST_LOGIN_FB:
        case REQUEST_LOGIN_GG: {
            return { ...state, isLoading: true };
        }
        case REQUEST_LOGIN_SUCCESS:
        case REQUEST_LOGIN_FB_SUCCESS:
        case REQUEST_LOGIN_GG_SUCCESS:
            {
                return {
                    ...state,
                    data: action.payload,
                    isLoading: false,
                    error: null,

                };
            }
        case REQUEST_LOGIN_FAIL:
        case REQUEST_LOGIN_FB_FAIL:
        case REQUEST_LOGIN_GG_FAIL: {

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
