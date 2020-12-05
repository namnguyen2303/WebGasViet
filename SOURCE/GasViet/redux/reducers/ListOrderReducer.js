import {
    GET_LIST_ORDER,
    GET_LIST_ORDER_SUCCESS,
    GET_LIST_ORDER_FAIL,
} from '../actions/type';

import { ORDER_TYPE } from "../../constants/Constant";

const initialState = {
    pending: {
        data: [],
        isLoading: false,
        error: null,
        refreshing: false,
        lastPage: 1,
        page: 1
    },
    
    completed: {
        data: [],
        isLoading: false,
        error: null,
        refreshing: false,
        lastPage: 1,
        page: 1
    },
    processing: {
        data: [],
        isLoading: false,
        error: null,
        refreshing: false,
        lastPage: 1,
        page: 1
    }


};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LIST_ORDER: {
            switch (action.payload.status) {
                // case ORDER_TYPE.CANCELLED: {
                //     return {
                //         ...state,
                //         cancel: {
                //             ...state.cancel,
                //             data: [],
                //             isLoading: action.payload.page == 1 ? true : false,
                //             data: action.payload.page == 1 ? [] : state.pending.data,
                //             error: null,
                //             refreshing: true,
                //         }
                //     }
                // }
                case ORDER_TYPE.processing: {
                    return {
                        ...state,
                        processing: {
                            ...state.processing,
                            data: [],
                            isLoading: action.payload.page == 1 ? true : false,
                            data: action.payload.page == 1 ? [] : state.processing.data,
                            error: null,
                            refreshing: true,
                        }
                    }
                }
                case ORDER_TYPE.completed: {
                    return {
                        ...state,
                        completed: {
                            ...state.completed,
                            data: [],
                            isLoading: action.payload.page == 1 ? true : false,
                            data: action.payload.page == 1 ? [] : state.completed.data,
                            error: null,
                            refreshing: true,
                        }
                    }
                }

                default:
                    return {
                        ...state,
                        pending: {
                            ...state.pending,
                            data: [],
                            isLoading: action.payload.page == 1 ? true : false,
                            data: action.payload.page == 1 ? [] : state.pending.data,
                            error: null,
                            refreshing: true,
                        }
                    }
            }
        }
        case GET_LIST_ORDER_SUCCESS: {
            switch (action.payload.status) {
                // case ORDER_TYPE.CANCELLED: {
                //     if (action.payload.data.page == 1) {
                //         return {
                //             ...state,
                //             cancel: {
                //                 ...state.cancel,
                //                 data: action.payload.data.listOrder,
                //                 lastPage: action.payload.data.lastPage,
                //                 page: 1,
                //                 isLoading: false,
                //                 error: null,
                //             }
                //         }
                //     }
                //     else {
                //         return {
                //             ...state,
                //             cancel: {
                //                 ...state.cancel,
                //                 data: state.cancel.data.concat(action.payload.data.listOrder),
                //                 page: action.payload.data.page,
                //                 isLoading: false,
                //                 error: null,
                //             }
                //         }
                //     }
                // }
                case ORDER_TYPE.processing: {
                    if (action.payload.data.page == 1) {
                        return {
                            ...state,
                            processing: {
                                ...state.processing,
                                data: action.payload.data.listOrder,
                                lastPage: action.payload.data.lastPage,
                                page: 1,
                                isLoading: false,
                                error: null,
                            }
                        }
                    }
                    else {
                        return {
                            ...state,
                            processing: {
                                ...state.processing,
                                data: state.pending.data.concat(action.payload.data.listOrder),
                                page: action.payload.data.page,
                                isLoading: false,
                                error: null,
                            }
                        }
                    }


                }
                case ORDER_TYPE.completed: {
                    if (action.payload.data.page == 1) {
                        return {
                            ...state,
                            completed: {
                                ...state.completed,
                                data: action.payload.data.listOrder,
                                lastPage: action.payload.data.lastPage,
                                page: 1,
                                isLoading: false,
                                error: null,
                            }
                        }
                    }
                    else {
                        return {
                            ...state,
                            completed: {
                                ...state.paid,
                                data: state.completed.data.concat(action.payload.data.listOrder),
                                page: action.payload.data.page,
                                isLoading: false,
                                error: null,
                            }
                        }
                    }
                }

                default:
                    if (action.payload.data.page == 1) {
                        return {
                            ...state,
                            pending: {
                                ...state.pending,
                                data: action.payload.data.listOrder,
                                lastPage: action.payload.data.lastPage,
                                page: 1,
                                isLoading: false,
                                error: null,
                            }
                        }
                    }
                    else {
                        return {
                            ...state,
                            pending: {
                                ...state.pending,
                                data: state.pending.data.concat(action.payload.data.listOrder),
                                page: action.payload.data.page,
                                isLoading: false,
                                error: null,
                            }
                        }
                    }
            }
        }
        case GET_LIST_ORDER_FAIL: {
            switch (action.payload.status) {
                // case ORDER_TYPE.CANCELLED: {
                //     return {
                //         ...state,
                //         cancel: {
                //             ...state.cancel,
                //             data: [],
                //             isLoading: false,
                //             error: action.payload.err,
                //         }
                //     }
                // }
                case ORDER_TYPE.processing: {
                    return {
                        ...state,
                        processing: {
                            ...state.processing,
                            data: [],
                            isLoading: false,
                            error: action.payload.err,
                        }
                    }
                }
                case ORDER_TYPE.completed: {
                    return {
                        ...state,
                        completed: {
                            ...state.completed,
                            data: [],
                            isLoading: false,
                            error: action.payload.err,
                        }
                    }
                }

                default:
                    return {
                        ...state,
                        pending: {
                            ...state.pending,
                            data: [],
                            isLoading: false,
                            error: action.payload.err,
                        }
                    }
            }
        }
        default:
            return state;
    }
}
