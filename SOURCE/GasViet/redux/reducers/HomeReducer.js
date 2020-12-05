import {
    GET_HOME_SUCCESS,
    GET_HOME_FAIL,
    GET_HOME,
} from "../actions/type";

const initialState = {
    data: [],
    isLoading: true,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_HOME: {
            return { ...state, isLoading: true };
        }
        case GET_HOME_SUCCESS: {
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                error: null,

            };
        }
        case GET_HOME_FAIL: {

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
