import {
    GET_LIST_ITEM,
    GET_LIST_ITEM_SUCCESS,
    GET_LIST_ITEM_FAIL,
} from "../actions/type";

const initialState = {
    data: [],
    isLoading: true,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LIST_ITEM: {
            return { ...state, isLoading: true };
        }
        case GET_LIST_ITEM_SUCCESS: {
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                error: null,

            };
        }
        case GET_LIST_ITEM_FAIL: {

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
