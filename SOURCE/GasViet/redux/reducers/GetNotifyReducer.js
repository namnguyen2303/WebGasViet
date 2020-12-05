import {
    GET_NOTIFICATION, GET_NOTIFICATION_SUCCESS, GET_NOTIFICATION_FAIL
} from '../actions/type';

const initialState = {
    data: [],
    isLoading: false,
    error: null,
    refreshing: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_NOTIFICATION: {
            return {
                ...state,
                isLoading: true,
                refreshing: true,
                error: null
            };
        }
        case GET_NOTIFICATION_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                refreshing: false,
                error: null,
                data: action.payload,
            }
        }
        case GET_NOTIFICATION_FAIL: {
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                refreshing: false,
                data: []
            };
        }
        default:
            return state;
    }
}
