import {
    GET_PROVINCE,
    GET_PROVINCE_SUCCESS,
    GET_PROVINCE_FAIL,
} from '../actions/type';

const initialState = {
    data: {
        province: [],
        listDistrict: []
    },
    isLoading: false,
    error: null,
    refreshing: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROVINCE: {
            return {
                ...state,
                isLoading: true,
                refreshing: true,
                error: null
            };
        }
        case GET_PROVINCE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                refreshing: false,
                error: null,
                data: action.payload,
            }
        }
        case GET_PROVINCE_FAIL: {
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
