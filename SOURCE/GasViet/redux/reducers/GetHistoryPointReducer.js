import {
    GET_HISTORY_POINT,
    GET_HISTORY_POINT_FAIL,GET_HISTORY_POINT_SUCCESS
} from '../actions/type';

const initialState = {
    data: [],
    isLoading: false,
    error: null,
    refreshing: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_HISTORY_POINT: {
            return {
                ...state,
                isLoading: true,
                refreshing: true,
                error: null
            };
        }
        case GET_HISTORY_POINT_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                refreshing: false,
                error: null,
                data: action.payload,
            }
        }
        case GET_HISTORY_POINT_FAIL: {
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
