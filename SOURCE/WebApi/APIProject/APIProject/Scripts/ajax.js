//import { swal } from "./sweet-alert";

$(document).ready(function () {
    //tự động chọn option có cùng giá trị
    var typeNews = $("#cbbType").attr("value");
    $("#cbbType option").each(function () {
        if (typeNews == $(this).val()) {
            $(this).attr('selected', 'selected');
        }
    });

    var typeSendNews = $("#cbbTypeSend").attr("value");
    $("#cbbTypeSend option").each(function () {
        if (typeSendNews == $(this).val()) {
            $(this).attr('selected', 'selected');
        }
    });

    //clear text when close modal
    $('.modal').on('hidden.bs.modal', function () {
        $(this).find("input,textarea").val('');
    });

    //change option in Combobox
    $('#status').on("change", function () {
        searchWarrantyCard();
    });

    $('#type').on('change', function () {
        searchPoint();
    });

    $('#itemStatus').on('change', function () {
        SearchItem();
    });

    //auto trim input text
    $('input[type="text"]').change(function () {
        this.value = $.trim(this.value);
    });

    $('#place').on('change', function () {
        LoadPlaceCreateShop();
    });

    //auto format number input
    $('.number').keyup(function () {
        $val = cms_decode_currency_format($(this).val());
        $(this).val(cms_encode_currency_format($val));
    });
}); //end document.ready


const SUCCESS = 1;
const ERROR = 0;
const DUPLICATE_NAME = 2;
const CAN_NOT_DELETE = 2;
const WRONG_PASSWORD = 2;
const NOT_ADMIN = 3;
const EXISTING = 2;
const FAIL_LOGIN = 2;
const URL_ADD_IMG_DEFAULT = "/Uploads/files/add_img.png";


//đăng nhập
function Login() {
    //if (!navigator.onLine) {
    //    swal({
    //        title: "Kiểm tra kết nối internet!",
    //        text: "",
    //        icon: "warning"
    //    })
    //    return;
    //}
    var phone = $("#txtUsernameLogin").val();
    var password = $("#txtPasswordLogin").val();
    if (phone == "" || password == "") {
        swal({
            title: "Vui lòng nhập đầy đủ!",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: '/Home/UserLogin',
        data: { phone: phone, password: password },
        type: 'POST',
        success: function (response) {
            //window.location.assign("/Customer/Index");
            if (response == SUCCESS) {
                window.location.assign("/Home/Index");
            } else
                if (response == FAIL_LOGIN) {
                    swal({
                        title: "Sai thông tin đăng nhập!",
                        text: "",
                        icon: "warning"
                    })
                } else {
                    swal({
                        title: "Hệ thống đang bảo trì",
                        text: "",
                        icon: "warning"
                    })
                }
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}

function logout() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: '/Home/Logout',
        data: {},
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {
                location.reload();
            }
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}

//đổi mật khẩu
function changePassword() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var currentPassword = $.trim($("#txtCurrentPassword").val());
    var newPassword = $.trim($("#txtNewPassword").val());
    var confirmPassword = $.trim($("#txtConfirmPassword").val());

    if (currentPassword == "" || newPassword == "" || confirmPassword == "") {
        swal({
            title: "Vui lòng nhập đầy đủ!",
            text: "",
            icon: "warning"
        })
        return;
    }
    if (newPassword != confirmPassword) {
        $("#txtConfirmPassword").val("");
        swal({
            title: "Mật khẩu xác nhận không đúng",
            text: "",
            icon: "warning"
        })
        return;
    }

    $.ajax({
        url: '/User/ChangePassword',
        data: {
            CurrentPassword: currentPassword,
            NewPassword: newPassword
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {
                $("#changePassword").modal("hide");
                swal({
                    title: "Đổi mật khẩu thành công",
                    text: "",
                    icon: "success"
                })
            } else
                if (response == WRONG_PASSWORD) {
                    $("#txtCurrentPassword").val("");
                    swal({
                        title: "Mật khẩu cũ không đúng",
                        text: "",
                        icon: "warning"
                    })
                } else {
                    swal({
                        title: "Không thể đổi mật khẩu",
                        text: "",
                        icon: "warning"
                    })
                }
        },
        error: function (result) {
            console.log(result.responseText);
            swal({
                title: "Có lỗi",
                text: "",
                icon: "warning"
            })
        }
    });
}

// start xóa yêu cầu đổi quà
function deleteRequest(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/Request/DeleteRequest',
                    data: { RequestID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {

                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            })

                            $.ajax({
                                url: '/Request/Search',
                                data: {
                                    Page: $("#txtPageCurrent").val(),
                                    RequestCode: $("#txtRequestCodeSearch").val(),
                                    Status: $("#cbbStatus").val(),
                                    Type: $("#cbbType").val(),
                                    FromDate: $("#txtRequestFromDate").val(),
                                    ToDate: $("#txtRequestToDate").val()
                                },
                                type: 'POST',
                                success: function (response) {
                                    $("#tableRequest").html(response);
                                },
                                error: function (result) {
                                    console.log(result.responseText);
                                }
                            });

                        } else
                            if (response == CAN_NOT_DELETE) {
                                swal({
                                    title: "Không thể xóa!",
                                    text: "Yêu cầu này đã được xử lý.",
                                    icon: "warning"
                                })
                            } else {
                                swal({
                                    title: "Không thể xóa!",
                                    text: "Có lỗi xảy ra.",
                                    icon: "warning"
                                })
                            }
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });
            }
        })
}// end xóa yêu cầu đổi quà

// start chấp nhận yêu cầu đổi quà
function acceptRequest(id, customerID, statusRequest) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var note = $.trim($("#noteRequest").val());
    var requestGiftName = $("#requestGiftName").html();

    if (statusRequest == 2) {

        swal({
            title: "Bạn chắc chắn hủy yêu cầu chứ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url: '/Request/AcceptRequest',
                        data: {
                            //status request: gửi trạng thái xem thực hiện việc xác nhận hay hủy yêu cầu
                            StatusRequest: statusRequest,
                            RequestID: id,
                            CustomerID: customerID,
                            RequestGiftName: requestGiftName,
                            Note: note
                        },
                        type: 'POST',
                        success: function (response) {
                            if (response == SUCCESS) {
                                $('#questDetail').modal('hide');
                                swal({
                                    title: "Đã hủy yêu cầu!",
                                    text: "",
                                    icon: "success"
                                })

                                $.ajax({
                                    url: '/Request/Search',
                                    data: {
                                        Page: $("#txtPageCurrent").val(),
                                        RequestCode: $("#txtRequestCodeSearch").val(),
                                        Status: $("#cbbStatus").val(),
                                        Type: $("#cbbType").val(),
                                        FromDate: $("#txtRequestFromDate").val(),
                                        ToDate: $("#txtRequestToDate").val()
                                    },
                                    type: 'POST',
                                    success: function (response) {
                                        $("#tableRequest").html(response);
                                    },
                                    error: function (result) {
                                        console.log(result.responseText);
                                    }
                                });

                            } else
                                swal({
                                    title: "Có lỗi xảy ra!",
                                    text: "",
                                    icon: "warning"
                                })
                        },
                        error: function (result) {
                            console.log(result.responseText);
                        }
                    });
                }
            })
    } else
        $.ajax({
            url: '/Request/AcceptRequest',
            data: {
                //status request: gửi trạng thái xem thực hiện việc xác nhận hay hủy yêu cầu
                StatusRequest: statusRequest,
                RequestID: id,
                CustomerID: customerID,
                RequestGiftName: requestGiftName,
                Note: note
            },
            type: 'POST',
            success: function (response) {
                if (response == SUCCESS) {
                    $('#questDetail').modal('hide');
                    swal({
                        title: "Thành công!",
                        text: "Yêu cầu đã được xác nhận",
                        icon: "success"
                    })

                    $.ajax({
                        url: '/Request/Search',
                        data: {
                            Page: $("#txtPageCurrent").val(),
                            RequestCode: $("#txtRequestCodeSearch").val(),
                            Status: $("#cbbStatus").val(),
                            Type: $("#cbbType").val(),
                            FromDate: $("#txtRequestFromDate").val(),
                            ToDate: $("#txtRequestToDate").val()
                        },
                        type: 'POST',
                        success: function (response) {
                            $("#tableRequest").html(response);
                        },
                        error: function (result) {
                            console.log(result.responseText);
                        }
                    });

                } else
                    swal({
                        title: "Có lỗi xảy ra!",
                        text: "",
                        icon: "warning"
                    })
            },
            error: function (result) {
                console.log(result.responseText);
            }
        });
}// end chấp nhận yêu cầu đổi quà

// start thông tin chi tiết 1 người dùng
function updateRole(id) {
    var phone = $('#txtPhoneUserEdit').val().trim();
    var userName = $('#txtNameUserEdit').val().trim();

    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: '/User/UpdateRole',
        data: { ID: id, Phone: phone, UserName: userName },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {

                $('#modalRole').modal('hide');
                swal({
                    title: "Chỉnh sửa thành công!",
                    text: "",
                    icon: "success"
                })
                $.ajax({
                    url: '/User/Search',
                    data: {
                        Page: $("#txtPageCurrent").val(),
                        Phone: $("#txtPhoneUser").val(),
                        FromDate: $("#txtFromDateUser").val(),
                        ToDate: $("#txtToDateUser").val()
                    },
                    type: 'POST',
                    success: function (response) {
                        $("#tableUser").html(response);
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });

            } else {
                swal("Có lỗi", "", "warning");
            }
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end thông tin chi tiết 1 người dùng

// start thông tin chi tiết 1 người dùng
function getUserDetail(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: '/User/GetUserDetail',
        data: { ID: id },
        type: 'POST',
        success: function (response) {
            $("#divUserDetail").html(response);
            $('#modalRole').modal('show');
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end thông tin chi tiết 1 người dùng

// start thông tin chi tiết 1 yêu cầu đổi quà
function getRequestDetail(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: '/Request/GetRequestDetail',
        data: { RequestID: id },
        type: 'POST',
        success: function (response) {
            $("#divRequestDetail").html(response);
            $('#questDetail').modal('show');
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end thông tin chi tiết 1 yêu cầu đổi quà

// start tìm kiếm yêu cầu đổi quà
function searchRequest() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var requestCode = $.trim($("#txtRequestCodeSearch").val());
    var status = $("#cbbStatus").val();
    var type = $("#cbbType").val();
    var fromDate = $.trim($("#txtRequestFromDate").val());
    var toDate = $.trim($("#txtRequestToDate").val());

    $.ajax({
        url: '/Request/Search',
        data: {
            Page: 1,
            RequestCode: requestCode,
            Status: status,
            Type: type,
            FromDate: fromDate,
            ToDate: toDate
        },
        type: 'POST',
        success: function (response) {
            $("#tableRequest").html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end tìm kiếm yêu cầu đổi quà

// start tìm kiếm tin tức
function searchNews() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var title = $.trim($("#txtTitle").val());
    var createUser = $("#cbbCreateUser").val();
    var type = $("#cbbTypeNews").val();
    var status = $("#cbbStatusNews").val();
    var fromDate = $.trim($("#txtNewsFromDate").val());
    var toDate = $.trim($("#txtNewsToDate").val());
    $.ajax({
        url: '/News/Search',
        data: {
            Page: 1,
            Title: title,
            CreateUserID: createUser,
            Type: type,
            Status: status,
            FromDate: fromDate,
            ToDate: toDate
        },
        type: 'POST',
        success: function (response) {
            $("#tableNews").html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end tìm kiếm tin tức

// start danh sách thiết lập quà hoặc voucher
function searchConfigGift() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: '/Config/SearchConfigGift',
        data: {
            Page: 1
        },
        type: 'POST',
        success: function (response) {
            $("#tableConfigGift").html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end danh sách thiết lập quà hoặc voucher

// start tạo user
//function createUser() {
//    if (!navigator.onLine) {
//        swal({
//            title: "Kiểm tra kết nối internet!",
//            text: "",
//            icon: "warning"
//        })
//        return;
//    }
//    var phone = $.trim($("#txtPhoneCreateUser").val());
//    var userName = $.trim($("#txtNameCreateUser").val());
//    var password = $('#txtPasswordCreateUser').val().trim();
//    var passwordConfirm = $('#txtPasswordConfirmCreateUser').val().trim();

//    if (phone.length == "" || userName.length == "") {
//        swal({
//            title: "Thông báo",
//            text: "Vui lòng nhập đầy đủ thông tin!",
//            icon: "warning"
//        })
//        return;
//    } else if (password != passwordConfirm) {
//        swal({
//            title: "Thông báo",
//            text: "Password và Password nhập lại không trùng nhau",
//            icon: "warning"
//        })
//        return;
//    }
//    //} else
//    //    if (!isNumeric(phone)) {
//    //        swal({
//    //            title: "Thông báo",
//    //            text: "Số điện thoại chỉ được phép nhập số!",
//    //            icon: "warning"
//    //        })
//    //        return;
//    //    }
//    $.ajax({
//        url: '/User/CreateUser',
//        data: {
//            Phone: phone,
//            UserName: userName,
//            Password: password
//        },
//        type: 'POST',
//        success: function (response) {
//            if (response == SUCCESS) {
//                $('#createUser').modal('hide');
//                swal({
//                    title: "Tạo tài khoản thành công!",
//                    text: "Mật khẩu mặc định là Tài khoản.",
//                    icon: "success"
//                })

//                $.ajax({
//                    url: '/User/Search',
//                    data: {
//                        Page: $("#txtPageCurrent").val(),
//                        Phone: $("#txtPhoneUser").val(),
//                        FromDate: $("#txtFromDateUser").val(),
//                        ToDate: $("#txtToDateUser").val()
//                    },
//                    type: 'POST',
//                    success: function (response) {
//                        $("#tableUser").html(response);
//                    },
//                    error: function (result) {
//                        console.log(result.responseText);
//                    }
//                });

//            } else
//                if (response == EXISTING) {
//                    swal({
//                        title: "Không thể tạo tài khoản!",
//                        text: "Tài khoản đã tồn tại. Vui lòng sử dụng Tài khoản khác.",
//                        icon: "warning"
//                    })
//                    $("#createUser #txtPhoneCreateUser").val("");
//                } else
//                    if (response == NOT_ADMIN) {
//                        $('#createUser').modal('hide');
//                        swal({
//                            title: "Bạn không có quyền tạo tài khoản.",
//                            text: "",
//                            icon: "warning"
//                        })
//                    } else {
//                        swal({
//                            title: "Có lỗi xảy ra!",
//                            text: "",
//                            icon: "warning"
//                        })
//                    }
//        },
//        error: function (result) {
//            console.log(result.responseText);
//        }
//    });
//}// end tạo user

function createUser() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }

    var phone = $.trim($("#txtPhoneCreateUser").val());
    var userName = $.trim($("#txtNameCreateUser").val());
    var password = $('#txtPasswordCreateUser').val().trim();
    var passwordConfirm = $('#txtPasswordConfirmCreateUser').val().trim();

    if (phone.length == "" || userName.length == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    } else if (password != passwordConfirm) {
        swal({
            title: "Thông báo",
            text: "Password và Password nhập lại không trùng nhau",
            icon: "warning"
        })
        return;
    }

    $.ajax({
        url: '/User/CreateUser',
        data: {
            Phone: phone,
            UserName: userName,
            Password: password
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {
                $('#createUser').modal('hide');
                swal({
                    title: "Tạo tài khoản thành công!",
                    text: "",
                    icon: "success"
                })

                $.ajax({
                    url: '/User/Search',
                    data: {
                        Page: $("#txtPageCurrent").val(),
                        Phone: $("#txtPhoneUser").val(),
                        FromDate: $("#txtFromDateUser").val(),
                        ToDate: $("#txtToDateUser").val()
                    },
                    type: 'POST',
                    success: function (response) {
                        $("#tableUser").html(response);
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                })
            } else {
                if (response == EXISTING) {
                    swal({
                        title: "Không thể tạo tài khoản!",
                        text: "Tài khoản đã tồn tại. Vui lòng sử dụng Tài khoản khác.",
                        icon: "warning"
                    })
                    $("#createUser #txtPhoneCreateUser").val("");
                } else {
                    if (response == NOT_ADMIN) {
                        $('#createUser').modal('hide');
                        swal({
                            title: "Bạn không có quyền tạo tài khoản.",
                            text: "",
                            icon: "warning"
                        })
                    } else {
                        swal({
                            title: "Có lỗi xảy ra!",
                            text: "",
                            icon: "warning"
                        })
                    }
                }
            }
        },
        error: function (result) {
            console.log(result.responseText);
        }
    })
}

// start tìm kiếm user
function searchUser() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var phone = $.trim($("#txtPhoneUser").val());
    var fromDate = $.trim($("#txtFromDateUser").val());
    var toDate = $.trim($("#txtToDateUser").val());

    $.ajax({
        url: '/User/Search',
        data: {
            Page: 1,
            Phone: phone,
            FromDate: fromDate,
            ToDate: toDate
        },
        type: 'POST',
        success: function (response) {
            $("#tableUser").html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end tìm kiếm user

// start tìm kiếm lô hàng
function searchBatch() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }

    var batchCode = $.trim($("#txtBatchSearch").val());
    var fromDate = $.trim($("#txtBatchFromDate").val());
    var toDate = $.trim($("#txtBatchToDate").val());
    $.ajax({
        url: '/Batch/Search',
        data: {
            Page: 1,
            BatchCode: batchCode,
            FromDate: fromDate,
            ToDate: toDate
        },
        type: 'POST',
        success: function (response) {
            $("#tableBatch").html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end tìm kiếm lô hàng

function isSpace(string) {
    if (/\s/.test(string)) {
        return true;
    }
}

function isNumeric(s) {
    var re = new RegExp("^[0-9,]+$");
    return re.test(s);
}

// start tạo lô hàng mới
function createBatch() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var code = $.trim($("#createBatch #code").val());
    var name = $.trim($("#createBatch #name").val());
    var price = $.trim($("#createBatch #price").val());
    var qty = cms_decode_currency_format($.trim($("#createBatch #qty").val()));
    var point = $.trim($("#createBatch #point").val());
    var note = $.trim($("#createBatch #note").val());

    if (code.length == "" || name.length == "" || price.length == "" || qty.length == "" || point.length == "") {
        swal({
            title: "Thông báo",
            text: "Chỉ được phép bỏ trống phần ghi chú!",
            icon: "warning"
        })
        return;
    } else
        if (!isNumeric(price)) {
            swal({
                title: "Thông báo",
                text: "Giá tiền chỉ được phép nhập số!",
                icon: "warning"
            })
            return;
        } else
            if (!isNumeric(qty)) {
                swal({
                    title: "Thông báo",
                    text: "Số lượng chỉ được phép nhập số!",
                    icon: "warning"
                })
                return;
            } else
                if (!isNumeric(point)) {
                    swal({
                        title: "Thông báo",
                        text: "Số điểm chỉ được phép nhập số!",
                        icon: "warning"
                    })
                    return;
                } else
                    if (qty <= 0 || qty > 50) {
                        swal({
                            title: "Thông báo",
                            text: "Số lượng phải từ 1 đến 50",
                            icon: "warning"
                        })
                        return;
                    } else
                        if (isSpace(code)) {
                            swal({
                                title: "Thông báo",
                                text: "Mã lô không được có khoảng trắng!",
                                icon: "warning"
                            })
                            return;
                        } else

                            $.ajax({
                                url: '/Batch/CreateBatch',
                                data: $("#form_create_batch").serialize(),
                                type: 'POST',
                                success: function (response) {
                                    if (response == SUCCESS) {
                                        $('#createBatch').modal('hide');
                                        swal({
                                            title: "Thành công!",
                                            text: "",
                                            icon: "success"
                                        })

                                        //$.ajax({
                                        //    url: '/Batch/Search',
                                        //    data: {
                                        //        Page: $("#txtPageCurrent").val(),
                                        //        BatchCode: $("#txtBatchSearch").val(),
                                        //        FromDate: $("#txtBatchFromDate").val(),
                                        //        ToDate: $("#txtBatchToDate").val()
                                        //    },
                                        //    type: 'POST',
                                        //    success: function (response) {
                                        //        $("#tableBatch").html(response);
                                        //    },
                                        //    error: function (result, status, err) {
                                        //        console.log(result.responseText);
                                        //        console.log(status.responseText);
                                        //        console.log(err.Message);
                                        //    }
                                        //});
                                        searchBatch();

                                    } else
                                        if (response == DUPLICATE_NAME) {
                                            swal({
                                                title: "Không thể tạo lô hàng!",
                                                text: "Mã lô hàng đã tồn tại. Vui lòng sử dụng mã khác.",
                                                icon: "warning"
                                            })
                                            $("#createBatch #code").val("");
                                        } else {
                                            swal({
                                                title: "Có lỗi xảy ra!",
                                                text: "Không thể tạo lô hàng.",
                                                icon: "warning"
                                            })
                                        }
                                },
                                error: function (result) {
                                    console.log(result.responseText);
                                }
                            });
}// end tạo lô hàng mới


// start xóa user
function deleteUser(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/User/DeleteUser',
                data: { ID: id },
                type: "POST",
                success: function (response) {
                    if (response == SUCCESS) {
                        swal({
                            title: "Xóa thành công!",
                            text: "",
                            icon: "success"
                        })

                        $.ajax({
                            url: '/User/Search',
                            data: {
                                Page: $("#txtPageCurrent").val(),
                                Phone: $("#txtPhoneUser").val(),
                                FromDate: $("#txtFromDateUser").val(),
                                ToDate: $("#txtToDateUser").val()
                            },
                            type: 'POST',
                            success: function (response) {
                                $("#tableUser").html(response);
                            },
                            error: function (result) {
                                console.log(result.responseText);
                            }
                        });

                    } else {
                        swal({
                            title: "Có lỗi xảy ra!",
                            text: "",
                            icon: "warning"
                        })
                    }
                },
                error: function (result) {
                    console.log(result.responseText);
                }
            });
        }
    })
}// end xóa user

// start xóa lô hàng
function deleteBatch(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/Batch/DeleteBatch',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            })

                            $.ajax({
                                url: '/Batch/Search',
                                data: {
                                    Page: $("#txtPageCurrent").val(),
                                    BatchCode: $("#txtBatchSearch").val(),
                                    FromDate: $("#txtBatchFromDate").val(),
                                    ToDate: $("#txtBatchToDate").val()
                                },
                                type: 'POST',
                                success: function (response) {
                                    $("#tableBatch").html(response);
                                },
                                error: function (result) {
                                    console.log(result.responseText);
                                }
                            });

                        } else
                            if (response == CAN_NOT_DELETE) {
                                swal({
                                    title: "Không thể xóa!",
                                    text: "Trong lô hàng đã có sản phẩm được dùng.",
                                    icon: "warning"
                                })
                            }
                            else
                                if (response == 96) {
                                    swal({
                                        title: "Mất mạng!",
                                        text: "Kiểm tra kết nối internet.",
                                        icon: "warning"
                                    })
                                }
                                else {
                                    swal({
                                        title: "Có lỗi xảy ra!",
                                        text: "",
                                        icon: "warning"
                                    })
                                }
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });
            }
        })
}// end xóa lô hàng

// start xóa thiết lập đổi điểm với quà, voucher
function deleteConfigCard(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/Config/DeleteConfigCard',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            })

                            $.ajax({
                                url: '/Config/SearchConfigCard',
                                data: {
                                    Page: $("#txtPageCurrentCard").val()
                                },
                                success: function (response) {
                                    $("#tableConfigCard").html(response);
                                }
                            });

                            //searchConfigGift();

                        } else {
                            swal({
                                title: "Không thể xóa!",
                                text: "Có lỗi.",
                                icon: "warning"
                            })
                        }
                    }
                });
            }
        })
}// end xóa thiết lập đổi điểm với thẻ cào


// start xóa thiết lập đổi điểm với quà, voucher
function deleteConfigGift(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/Config/DeleteConfigGift',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            })

                            //$.ajax({
                            //    url: '/Config/SearchConfigGift',
                            //    data: {
                            //        Page: $("#txtPageCurrent").val()
                            //    },
                            //    type: 'POST',
                            //    success: function (response) {
                            //        $("#tableConfigGift").html(response);
                            //    }
                            //});

                            searchConfigGift();

                        } else {
                            swal({
                                title: "Không thể xóa!",
                                text: "Có lỗi.",
                                icon: "warning"
                            })
                        }
                    }
                });
            }
        })
}// end xóa thiết lập đổi điểm với quà, voucher

// start xóa bài viết
function deleteNews(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/News/DeleteNews',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            })

                            $.ajax({
                                url: '/News/Search',
                                data: {
                                    Page: $("#txtPageCurrent").val(),
                                    Title: $("#txtTitle").val(),
                                    CreateUserID: $("#cbbCreateUser").val(),
                                    Type: $("#cbbTypeNews").val(),
                                    Status: $("#cbbStatusNews").val(),
                                    FromDate: $("#txtNewsFromDate").val(),
                                    ToDate: $("#txtNewsToDate").val()
                                },
                                type: 'POST',
                                success: function (response) {
                                    $("#tableNews").html(response);
                                }
                            });

                        } else {
                            swal({
                                title: "Không thể xóa!",
                                text: "Có lỗi.",
                                icon: "warning"
                            })
                        }
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });
            }
        })
}// end xóa bài iết



// start thông tin chi tiết bài viết
function getNewsDetail(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    window.location = "UpdateNews";
    //window.open('UpdateNews');
    $.ajax({
        url: '/News/GetNewsDetail',
        data: { ID: id },
        type: 'POST',
        success: function (response) {
            $("#divBatchDetail").html(response);
            window.location.href = "_UpdateNews.html";
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}// end thông tin chi tiết bài viết

// start thông tin chi tiết 1 lô hàng
function getBatchDetail(batchID) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    $('#modalLoad').modal("show");
    $.ajax({
        url: '/Batch/GetBatchDetail',
        data: { BatchID: batchID },
        type: 'POST',
        success: function (response) {
            $("#divBatchDetail").html(response);
            $('#mdBatchDetail').modal('show');
            $('#modalLoad').modal("hide");
        },
        error: function (result) {
            $('#modalLoad').modal("hide");
            console.log(result.responseText);
        }
    });
}// end thông tin chi tiết 1 lô hàng

// start in mã QR của lô hàng
function printQrBatch() {
    swal({
        title: "Thông báo",
        text: "Chức năng đang xây dựng!",
        icon: "warning"
    })
}// end in mã QR của lô hàng


//sửa thiết lập điểm vs thẻ cào
function updateConfigCard(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var point = cms_decode_currency_format($.trim($('#updateConfigCard #txtPoint').val()));
    var description = $.trim($('#updateConfigCard #txtDescription').val());

    if (point == "" || description == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }
    if (!isNumeric(point)) {
        swal({
            title: "Thông báo",
            text: "Số điểm chỉ được phép nhập số.",
            icon: "warning"
        })
        return;
    }
    if (point < 0) {
        swal({
            title: "Thông báo",
            text: "Số điểm không được nhỏ hơn 0.",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: "/Config/UpdateConfigCard",
        data: {
            ID: id,
            Point: point,
            Description: description
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {

                $('#updateConfigCard').modal('hide');
                swal({
                    title: "Thành công!",
                    text: "",
                    icon: "success"
                })

                $.ajax({
                    url: '/Config/SearchConfigCard',
                    data: {
                        Page: $("#txtPageCurrentCard").val()
                    },
                    success: function (response) {
                        $("#tableConfigCard").html(response);
                    }
                });

            } else {
                swal({
                    title: "Lỗi",
                    text: "Không thể chỉnh sửa thiết lập.",
                    icon: "warning"
                })
            }
        },
        error: function () {
            swal({
                title: "Lỗi hệ thống",
                text: "",
                icon: "warning"
            })
        }
    });

}
//sửa thiết lập điểm vs thẻ cào


//thiết lập điểm vs thẻ cào
function createConfigCard(type) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var price = $.trim($('#cbbPriceConfigCard').val());
    var point = cms_decode_currency_format($('#txtPointConfigCard').val().trim());
    var description = $.trim($('#txtDescriptionConfigCard').val());
    var telecomType = $.trim($('#cbbTelecomTypeConfigCard').val());

    if (price == "" || point == "" || description == "" || telecomType == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }
    if (!isNumeric(point)) {
        swal({
            title: "Số điểm chỉ được phép nhập số.",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: "/Config/CreateConfigCard",
        data: {
            Price: price,
            Point: point,
            Description: description,
            Type: type,
            TelecomType: telecomType
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {

                $('#createConfigCard').modal('hide');
                swal({
                    title: "Thành công!",
                    text: "",
                    icon: "success"
                })

                $.ajax({
                    url: '/Config/SearchConfigCard',
                    data: {
                        Page: $("#txtPageCurrentCard").val()
                    },
                    success: function (response) {
                        $("#tableConfigCard").html(response);
                    }
                });

            } else
                if (response == EXISTING) {
                    $('#createConfigCard').modal('hide');
                    swal({
                        title: "Thông báo",
                        text: "Thẻ cào đã được thiết lập trước đó.",
                        icon: "warning"
                    })
                } else {
                    swal({
                        title: "Lỗi",
                        text: "Không thể tạo thiết lập.",
                        icon: "warning"
                    })
                }
        },
        error: function () {
            swal({
                title: "Có lỗi xảy ra.",
                text: "",
                icon: "warning"
            })
        }
    });

}
//thiết lập điểm vs thẻ cào

//sửa thiết lập điểm vs quà, voucher
function updateConfigGift(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var test = id;
    var type = $("#configGiftDetail #cbbType").val();
    var name = $.trim($('#configGiftDetail #txtName').val());
    var price = cms_decode_currency_format($.trim($('#configGiftDetail #txtPrice').val()));
    var point = cms_decode_currency_format($.trim($('#configGiftDetail #txtPoint').val()));
    var fromDate = $.trim($('#configGiftDetail #txtFromDateEdit').val());
    var toDate = $.trim($('#configGiftDetail #txtToDateEdit').val());
    var description = $.trim($('#configGiftDetail #txtDescription').val());
    var url = $("#configGiftDetail #tagImg2").attr("src");
    var status = $('#configGiftDetail #slStatus').val();

    if (name == "" || price == "" || point == "" || fromDate == "" || toDate == "" || description == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }
    if (url == URL_ADD_IMG_DEFAULT) {
        swal({
            title: "Thông báo",
            text: "Vui lòng chọn ảnh cho thiết lập!",
            icon: "warning"
        })
        return;
    }
    if (!isNumeric(price)) {
        swal({
            title: "Giá tiền chỉ được phép nhập số.",
            text: "",
            icon: "warning"
        })
        return;
    }
    if (!isNumeric(point)) {
        swal({
            title: "Số điểm chỉ được phép nhập số.",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: "/Config/UpdateConfigGift",
        data: {
            ID: test,
            Name: name,
            Price: price,
            Point: point,
            UrlImage: url,
            Description: description,
            Type: type,
            FromDate: fromDate,
            ToDate: toDate,
            Status: status
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {

                $('#configGiftDetail').modal('hide');
                swal({
                    title: "Thành công!",
                    text: "",
                    icon: "success"
                })

                $.ajax({
                    url: '/Config/SearchConfigGift',
                    data: {
                        Page: $("#txtPageCurrent").val()
                    },
                    success: function (response) {
                        $("#tableConfigGift").html(response);
                    }
                });

            } else {
                swal({
                    title: "Không thể sửa thiết lập.",
                    text: "",
                    icon: "warning"
                })
            }
        },
        error: function () {
            swal({
                title: "Có lỗi xảy ra.",
                text: "",
                icon: "warning"
            })
        }

    });

}
//sửa thiết lập điểm vs quà, voucher


//thiết lập điểm vs quà, voucher
function createConfigGift() {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    var type = $("#cbbType").val();
    var name = $.trim($('#txtName').val());
    var price = cms_decode_currency_format($.trim($('#txtPrice').val()));
    var point = cms_decode_currency_format($.trim($('#txtPoint').val()));
    var fromDate = $.trim($('#txtFromDate').val());
    var toDate = $.trim($('#txtToDate').val());
    var description = $.trim($('#txtDescription').val());
    var url = $("#tagImg").attr("src");

    if (name == "" || price == "" || point == "" || fromDate == "" || toDate == "" || description == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }
    if (url == URL_ADD_IMG_DEFAULT) {
        swal({
            title: "Thông báo",
            text: "Vui lòng chọn ảnh cho thiết lập!",
            icon: "warning"
        })
        return;
    }
    if (!isNumeric(price)) {
        swal({
            title: "Giá tiền chỉ được phép nhập số.",
            text: "",
            icon: "warning"
        })
        return;
    }
    if (!isNumeric(point)) {
        swal({
            title: "Số điểm chỉ được phép nhập số.",
            text: "",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: "/Config/CreateConfigGift",
        data: {
            Name: name,
            Price: price,
            Point: point,
            UrlImage: url,
            Description: description,
            Type: type,
            FromDate: fromDate,
            ToDate: toDate
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {

                $('#createConfigGift').modal('hide');
                swal({
                    title: "Thành công!",
                    text: "",
                    icon: "success"
                })

                $.ajax({
                    url: '/Config/SearchConfigGift',
                    data: {
                        Page: $("#txtPageCurrent").val()
                    },
                    success: function (response) {
                        $("#tableConfigGift").html(response);
                    }
                });

            } else {
                swal({
                    title: "Không thể tạo thiết lập.",
                    text: "",
                    icon: "warning"
                })
            }
        },
        error: function (response) {
            console.log(response);
            swal({
                title: "Có lỗi xảy ra!",
                text: "",
                icon: "warning"
            })
        }
    });

}
//thiết lập điểm vs quà, voucher


//tạo bài viết mới
function createNews(status) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    //lấy nội dung html trong CKEDITOR
    var content = $.trim(CKEDITOR.instances['editor'].getData());
    var title = $.trim($('#txtTitle').val());
    var description = $.trim($('#txtDescription').val());
    var type = 3;
    var display = cms_decode_currency_format($('#txtDisplay').val());
    var typeSend = $('#cbbTypeSend').val();
    // var item = $('#cbbItemNews').val();
    var url = $('#AddImgLogoPlace').attr('src');

    if (display == 0) {
        swal('Thông báo', 'Thứ tự ưu tiên phải lớn hơn 0', 'warning');
        return;
    }

    if (content == "" || title == "" || description == "" || type == "" || display == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }

    if (url == URL_ADD_IMG_DEFAULT) {
        swal({
            title: "Thông báo",
            text: "Vui lòng chọn ảnh nổi bật cho bài viết!",
            icon: "warning"
        })
        return;
    }
    $('#modalLoad').modal("show");
    $.ajax({
        url: '/News/CreateNewsDekko',
        data: {
            Content: content,
            Title: title,
            Description: description,
            Type: type,
            TypeSend: typeSend,
            UrlImage: url,
            Status: status,
            // Item: item,
            Display: display
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {
                swal({
                    title: "Thành công",
                    text: "Thêm bài viết thành công",
                    icon: "success"
                })
                $('#modalLoad').modal("hide");
                setTimeout(
                    function () {
                        window.location.replace('/News/Index');
                    }, 1000);
            } else {
                swal({
                    title: "Lỗi",
                    text: "Không thể tạo bài viết mới.",
                    icon: "warning"
                })
                $('#modalLoad').modal("hide");
            }
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });

}
//tạo bài viết mới

//chỉnh sửa bài viết
function updateNews(id, status) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    //lấy nội dung html trong CKEDITOR
    var content = $.trim(CKEDITOR.instances['editor'].getData());
    var title = $.trim($('#txtTitle').val());
    var description = $.trim($('#txtDescription').val());
    var type = $('#cbbType').val();
    var display = cms_decode_currency_format($('#txtDisplay').val());
    var item = $('#cbbItemNews').val();
    var typeSend = $('#cbbTypeSend').val();
    var url = $('#AddImgLogoPlace').attr('src');

    if (display == 0) {
        swal('Thông báo', 'Thứ tự ưu tiên phải lớn hơn 0', 'warning');
        return;
    }

    if (content == "" || title == "" || description == "" || type == "" || typeSend == "" || url == "" || display == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }

    if (item == null && type == 4) {
        swal({
            title: "Thông báo",
            text: "Vui lòng chọn sản phẩm!",
            icon: "warning"
        })
        return;
    }

    if (item == null && type != 4) {
        item = 0;
    }

    $.ajax({
        url: '/News/UpdateNewsDekko',
        data: {
            ID: id,
            Content: content,
            Title: title,
            Description: description,
            Type: type,
            TypeSend: typeSend,
            UrlImage: url,
            Status: status,
            Item: item,
            Display: display
        },
        type: 'POST',
        success: function (response) {
            if (response == SUCCESS) {
                swal({
                    title: "Thành công",
                    text: "Chỉnh sửa bài viết thành công",
                    icon: "success"
                })
                setTimeout(
                    function () {
                        window.location.replace('/News/Index');
                    }, 1000);
            } else {
                swal({
                    title: "Lỗi",
                    text: "Không thể tạo bài viết mới.",
                    icon: "warning"
                })
            }
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });

}
//chỉnh sửa bài viết

//Tìm kiếm Card
function searchCard() {
    var seri = $('#txtSeri').val().trim();
    var fromDate = $('#txtFromDate').val().trim();
    var toDate = $('#txtToDate').val().trim();
    var status = $('#cmbStatus').val().trim();
    $.ajax({
        url: "/Card/Search",
        data: {
            Page: 1,
            Seri: seri,
            FromDate: fromDate,
            ToDate: toDate,
            Status: status
        },
        success: function (result) {
            $("#tableCard").html(result)
        },
        error: function (result) {
            console.log(result.responseText);
        }
    })
}
// thêm mới card 
function createCard() {

    $("#frmCreateCard").validate({
        ignore: ".date",
        rules: {
            CardCode: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 15
            },
            SeriNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 15
            }
        },
        messages: {
            CardCode: {
                required: "Vui lòng không để trống",
                digits: "Vui lòng nhập số nguyên dương",
                minlength: "Mã thẻ phải có ít nhất 10 chứ số",
                maxlength: "Mã thẻ tối đa 15 chữ số"
            },
            SeriNumber: {
                required: "Vui lòng không để trống",
                digits: "Vui lòng nhập số nguyên dương",
                minlength: "Seri phải có ít nhất 10 chứ số",
                maxlength: "Seri tối đa 15 chữ số"
            }
        },
        submitHandler: function () {
            if ($("#dtpStartDate").val() == '' || $("#dtpExprireDate").val() == '') {
                swal({
                    title: "thông báo",
                    text: "Vui lòng nhập đầy đủ thông tin",
                    icon: "warning"
                });
                return;
            }
            $.ajax({
                url: "/Card/addCard",
                data: $('#frmCreateCard').serialize(),
                type: 'POST',
                success: function (result) {
                    if (result == 1) {
                        swal({
                            title: "thông báo",
                            text: "Tạo mới thành công",
                            icon: "success"
                        });
                        $('#createCard').modal("hide");
                        searchCard();
                    }
                    else if (result == DUPLICATE_NAME) {
                        swal({
                            title: "thông báo",
                            text: "Mã thẻ hoặc seri đã tồn tại, vui lòng kiểm tra lại !",
                            icon: "warning"
                        });
                        $('#txtCardCode').val("");
                        $('#txtSeriNumber').val("");
                    }
                    else if (result == -9) {
                        swal({
                            title: "thông báo",
                            text: "mã thẻ và seri không được trùng nhau",
                            icon: "warning"
                        });
                        $('#txtCardCode').val("");
                        $('#txtSeriNumber').val("");
                    }
                    else if (result == 3) {
                        swal({
                            title: "Kiểm Tra Lại Ngày Hết Hạn",
                            text: "Ngày hết hạn phải lớn hơn ngày bắt đầu",
                            icon: "warning"
                        });
                    }
                    else {
                        swal({
                            title: "Có lỗi trong quá trình thêm mới",
                            text: "Vui lòng liên hệ với bộ phận hỗ trợ khách hàng",
                            icon: "warning"
                        });
                    }
                },
                error: function (result) {
                    console.log(result.responseText);
                }
            });
        }
    });
}

// chỉnh sửa Card
function editCard(ID, Status) {
    if (Status == 1) {
        swal({
            title: "Thông Báo",
            text: "Card đã đổi, bạn không thể sửa",
            icon: "warning"
        })
        return;
    }
    $.ajax({
        url: "/Card/showEditCard",
        data: { CardID: ID },
        success: function (result) {
            $('#frmEdit').html(result);
            $('#showEdit').modal("show");
        }
    })
}
// lưu thay đổi chỉnh sửa
function SaveEdit(id) {
    $("#frmShowEdit").validate({
        ignore: ".date",
        rules: {
            CardCode: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 15
            },
            SeriNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 15
            }
        },
        messages: {
            CardCode: {
                required: "Vui lòng không để trống",
                digits: "Vui lòng nhập số nguyên dương",
                minlength: "Mã thẻ phải có ít nhất 10 chứ số",
                maxlength: "Mã thẻ tối đa 15 chứ số"
            },
            SeriNumber: {
                required: "Vui lòng không để trống",
                digits: "Vui lòng nhập số nguyên dương",
                minlength: "Seri phải có ít nhất 10 chứ số",
                maxlength: "Seri tối đa 15 chữ số"
            }
        },
        submitHandler: function () {
            if ($("#dtpStartDateEdit").val() == '' || $("#dtpExprireDateEdit").val() == '') {
                swal({
                    title: "Thông báo",
                    text: "Vui lòng nhập đầy đủ thông tin",
                    icon: "warning"
                });
                return;
            }
            $.ajax({
                url: "/Card/addCard",
                data: $('#frmShowEdit').serialize(),
                success: function (result) {
                    if (result == SUCCESS) {
                        swal({
                            title: "thông báo",
                            text: "Cập nhật thành công",
                            icon: "success"
                        });
                        $('#showEdit').modal("hide");
                        searchCard();
                    }
                    else if (result == DUPLICATE_NAME) {
                        swal({
                            title: "thông báo",
                            text: "Mã thẻ hoặc seri đã tồn tại, vui lòng kiểm tra lại !",
                            icon: "warning"
                        });
                        $('#txtCardCode').val("");
                        $('#txtSeriNumber').val("");
                    }
                    else if (result == -9) {
                        swal({
                            title: "thông báo",
                            text: "mã thẻ và seri không được trùng nhau",
                            icon: "warning"
                        });
                        $('#txtCardCode').val("");
                        $('#txtSeriNumber').val("");
                    }
                    else if (result == 3) {
                        swal({
                            title: "Kiểm Tra Lại Ngày Hết Hạn",
                            text: "Ngày hết hạn phải lớn hơn ngày bắt đầu",
                            icon: "warning"
                        });
                    }
                    else {
                        swal({
                            title: "Lỗi rồi đại vương ơi",
                            text: "Vui lòng liên hệ với bộ phận chăm sóc khách hàng",
                            icon: "warning"
                        })
                    }
                }
            });
        }
    });
}
// xóa card
function deleteCard(id) {
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((isConFirm) => {
            if (isConFirm) {
                $.ajax({
                    url: '/Card/DeleteCard',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            })
                            searchCard();
                        } else {
                            swal({
                                title: "Không thể xóa!",
                                text: "Có lỗi.",
                                icon: "warning"
                            })
                        }
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });
            }
        })
}
// load District

function loadListDistrictShop(prvID) {
    $.ajax({
        url: "/Shop/LoadDistrictShop",
        data: { ProvinceID: prvID },
        success: function (result) {
            $('#ListDistrictShop').html(result);
        }
    });
}

function loadListDistrictShopCreate(prvID) {
    $.ajax({
        url: "/Shop/LoadDistrictShopCreate",
        data: { ProvinceID: prvID },
        success: function (result) {
            $('#ListDistrictShopCreate').html(result);
        }
    });
}

function loadListDistrictShopUpdate(prvID, id) {
    $.ajax({
        url: "/Shop/LoadDistrictShopUpdate",
        data: {
            ProvinceID: prvID,
            ID: id
        },
        success: function (result) {
            $('#ListDistrictShopUpdate').html(result);
        }
    });
}

function loadListDistrict(prvID) {
    $.ajax({
        url: "/Customer/LoadDistrict",
        data: { ProvinceID: prvID },
        success: function (result) {
            $('#ListDistrict').html(result);
        }
    });
}

//Tìm kiếm khách hàng
function searchCustomer() {
    var fromDate = $('#dtFromdateIndex').val().trim();
    var toDate = $('#dtTodateIndex').val().trim();
    var phone = $('#txtPhone').val().trim();
    var province = $('#slProvince').val();
    var district = $('#slDistrict').val();
    var role = $('#cmbRoleCus').val();
    //var status = $('#cbbStatusCustomer').val();

    $.ajax({
        url: "/Customer/Search",
        data: {
            Page: 1,
            FromDate: fromDate,
            ToDate: toDate,
            City: province,
            District: district,
            Phone: phone,
            Role: role
        },
        success: function (result) {
            $('#ListCustomer').html(result);
        }
    });
}

function showAddPointWithChecked(inputCheck) {
    var row = $(inputCheck).parents('tr');
    var check = $(row).find('#txtchecked').prop('checked');
    var phone = $(row).find('#colPhone').html();
    if (check) {
        $('#mdAddPoint #txtPhoneNumber').val(phone);
    }
    else {
        $('#mdAddPoint #txtPhoneNumber').val('');
    }
}

function addPoint() {

    $("#frmAddPoint").validate({
        rules: {
            pointNum: {
                required: true,
            },
            phoneNum: {
                required: true,
                minlength: 10,
            }

        },
        messages: {
            pointNum: {
                required: "Vui lòng không để trống",
            },
            phoneNum: {
                required: "Vui lòng không để trống",
                minlength: "Số Điện thoại phải >= 10 ký tự",
            }
        },
        submitHandler: function () {
            var phone = $('#mdAddPoint #txtPhoneNumber').val();
            var point = $('#mdAddPoint #txtPoint').val();
            var note = $('#mdAddPoint #txtNote').val();
            $.ajax({
                url: "/Customer/AddPoint",
                data: {
                    Phone: phone,
                    Point: point,
                    Note: note
                },
                success: function (result) {
                    if (result == SUCCESS) {
                        swal({
                            title: "Thêm Điểm Thành Công",
                            text: "",
                            icon: "success"
                        })
                        searchCustomer();
                        $('#mdAddPoint').modal("hide");
                    }
                    else {
                        swal({
                            title: "Thông Báo",
                            text: "Có lỗi.",
                            icon: "warning"
                        })
                    }
                }
            });
        }
    });
}


function GetCustomerDetail(id,page) {
    $.ajax({
        url: "/Customer/CustomerDetail",
        data: {
            ID: id,
            Page: page
        },
        success: function (result) {
            $('#View').html(result);
        }
    });
}

function saveEditCustomer(id) {
    $("#EditCustomer #frmEdit_Customer").validate({
        ignore: ".date",
        rules: {
            cusName: {
                required: true,
            },
            cusPhone: {
                minlength: 10,
            },
            cusEmail: {
                email: true
            }

        },
        messages: {
            cusName: {
                required: "Vui lòng không để trống",
            },
            cusPhone: {
                minlength: "Số Điện thoại phải >= 10 ký tự",
            },
            cusEmail: {
                email: "Vui lòng nhập đúng Email"
            }
        },
        submitHandler: function () {
            var name = $('#txtCusName').val().trim();
            var phone = $('#txtCusPhone').val().trim();
            var email = $('#txtCusEmail').val().trim();
            var sex = $('#cmbSex').val();
            //var status = $('#cbbStatusUpdate').val();
            var birthday = $('#dtpBirthDay').val().trim();
            var address = $('#txtAddress').val().trim();
            var lati = $('#lati3').val().trim();
            var long = $('#long3').val().trim();

            $.ajax({
                url: "/Customer/SaveEditCustomer",
                data: {
                    Name: name,
                    Phone: phone,
                    Email: email,
                    Sex: sex,
                    //Status: status,
                    BirthDay: birthday,
                    Address: address,
                    Lati: lati,
                    Long: long,
                    ID: id
                },
                success: function (result) {
                    if (result == SUCCESS) {
                        $('#EditCustomer').modal("hide");
                        $('.modal-backdrop').hide(); // xóa lớp mờ mờ đen khi đóng modal lỗi
                        swal({
                            title: "Cập nhật Thành Công",
                            text: "",
                            icon: "success"
                        });
                        //setTimeout(function () {
                        GetCustomerDetail(id);
                        //}, 1000);

                    }
                    else {
                        swal({
                            title: "Lỗi",
                            text: "",
                            icon: "warning"
                        });
                    }
                }
            });
        }
    });
}

function SearchHistoryPoint(id) {
    var fromdate = $('#addPoint #dtpFromDate').val();
    var todate = $('#addPoint #dtpTodate').val();

    $.ajax({
        url: "/Customer/SearchHistoryPoint",
        data: {
            Page: 1,
            cusID: id,
            FromDate: fromdate,
            ToDate: todate
        },
        success: function (result) {
            $('#ListHistoryPoint').html(result);
        }
    });
}

function SearchRequset(id) {
    var fromdate = $('#changePoint #dtpFromdateRQ').val();
    var todate = $('#changePoint #dtpToDateRQ').val();

    $.ajax({
        url: "/Customer/SearchReQuest",
        data: {
            Page: 1,
            cusID: id,
            FromDate: fromdate,
            ToDate: todate
        },
        success: function (result) {
            $('#ListRequest').html(result);
        }
    });
}

function searchOrderHistory(id) {
    $.ajax({
        url: "/Customer/searchOrderHistory",
        data: {
            Page: 1,
            cusID: id,
            fromDate: $("#dtpFromdateOH").val(),
            toDate: $("#dtpToDateOH").val()
        },
        success: function (result) {
            $("#ListOrderHistory").html(result);
        }
    });
}

// Xóa Cus
function DeleteCus(id) {
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((isConFirm) => {
            if (isConFirm) {
                $.ajax({
                    url: "/Customer/DeleteCustomer",
                    data: { ID: id },
                    success: function (result) {
                        if (result == SUCCESS) {
                            swal({
                                title: "Xóa thành công",
                                text: "",
                                icon: "success"
                            })
                            searchCustomer();
                        } else if (result == 2) {
                            swal({
                                title: "Không thể xóa khách hàng",
                                text: "Chỉ được xóa những khách hàng tạm dừng hoạt động.",
                                icon: "warning"
                            })
                            searchCustomer();
                        }
                        else {
                            swal({
                                title: "Có lỗi",
                                text: "",
                                icon: "warning"
                            })
                        }
                    }
                });
            }
        })
}

// Thêm Rank
function LoadRank() {
    $.ajax({
        url: "/Config/LoadRank",
        data: { Page: 1 },
        success: function (result) {
            $('#ListRank').html(result);
        }
    });
}

// ShowEdit RAnk
function showEditRank(id) {
    $('#editRank').remove();
    $.ajax({
        url: "/Config/ShowEditRank",
        data: { ID: id },
        success: function (result) {
            $('#editArea').html(result);
            $('#editRank').modal("show");
        }
    });
}

// Edit Rank
function saveEditRank(id) {
    var min = $('#txtMinPointEdit').val().trim();
    var max = $('#txtMaxPointEdit').val().trim();
    var des = $('#txtDesEdit').val().trim();

    swal({
        title: "Cảnh Báo !!",
        text: "Nếu bạn thay vùng giá trị điểm của mục này sẽ làm vùng giá trị khác thay đổi theo",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((isConFirm) => {
            if (isConFirm) {
                if (min == "" || max == "" || des == "") {
                    swal({
                        title: "Thông báo!",
                        text: "Vui lòng nhập đầy đủ thông tin",
                        icon: "warning"
                    })
                    return;
                }
                if (min >= max) {
                    swal({
                        title: "Cảnh Báo !!",
                        text: "Giá Trị Bắt Đầu Phải Nhỏ Hơn Giá Trị Kết Thúc",
                        icon: "warning"
                    })
                    return;
                }
                $.ajax({
                    url: "/Config/EditRank",
                    data: {
                        ID: id,
                        Descripton: des,
                        MaxPoint: max,
                        MinPoint: min
                    },
                    success: function (result) {
                        if (result == SUCCESS) {
                            swal({
                                title: "Cập nhật thành công",
                                text: "",
                                icon: "success"
                            });

                            setTimeout(function () {
                                $(".swal-button--confirm").click();
                            }, 1000);
                            setTimeout(function () {
                                LoadRank();
                            }, 1500);
                            $("#editRank").modal("hide");

                        }
                        else {
                            swal({
                                title: "Có lỗi",
                                text: "",
                                icon: "warning"
                            })
                        }
                    }
                });
            }
        })

}

function getConfigGiftDetail(id) {
    //swal({
    //    title: "Thông báo",
    //    text: "Chức năng đang xây dựng",
    //    icon: "warning"
    //})
    $.ajax({
        url: '/Config/GetConfigGiftDetail',
        data: { ID: id },
        type: 'POST',
        success: function (response) {
            $("#divConfigGiftDetail").html(response);
            $('#configGiftDetail').modal('show');
        }
    });
}

function getConfigCardDetail(id) {
    $.ajax({
        url: '/Config/GetConfigCardDetail',
        data: { ID: id },
        type: 'POST',
        success: function (response) {
            $("#divConfigCardDetail").html(response);
            $('#updateConfigCard').modal('show');
        }
    });
}


function searchPoint(id) {
    fromDate = $.trim($('#fromDate').val());
    toDate = $.trim($('#toDate').val());
    name = $.trim($('#agentName').val());
    $.ajax({
        url: "/Point/Search",
        data: {
            Page: 1,
            Name: name,
            FromDate: fromDate,
            ToDate: toDate,
            CusID: id
        },
        success: function (response) {
            $('#tablePoint').html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}

function getPointDetail($id) {
    $.ajax({
        url: "/Point/GetPointDetail",
        data: { ID: $id },
        type: 'POST',
        success: function (response) {
            $('#modalDetailPoint').html(response);
            $('#detailPoint').modal('show');
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}

function searchWarrantyCard() {
    $fromDate = $('#fromDate').val();
    $toDate = $('#toDate').val();
    $status = $('#status').val();
    $code = $.trim($('#warrantyCardCode').val());

    if ($code.length == 16) {
        var count = $code.length - 1;
        $warrantyCardCode = $code.substring(0, count);
    } else {
        $warrantyCardCode = $code;
    }

    $.ajax({
        url: "/Warranty/Search",
        data: { Page: 1, fromdate: $fromDate, ToDate: $toDate, Status: $status, WarrantyCardCode: $warrantyCardCode },
        success: function (response) {
            $('#TableWarranty').html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}

function CreateWarranty() {
    var quantity = $.trim($('#quantity').val());
    var point = $.trim($('#point').val());
    var expireDate = $('#expireDate').val();
    if (quantity == "" || point == "" || expireDate == "") {
        swal({
            title: "Thông báo",
            text: "Mời nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }
    else {
        if (!isNumeric(quantity)) {
            swal({
                title: "Thông báo",
                text: "Số lượng chỉ được phép nhập số!",
                icon: "warning"
            })
            return;
        }
        else {
            if (!isNumeric(point)) {
                swal({
                    title: "Thông báo",
                    text: "Số điểm chỉ được phép nhập số!",
                    icon: "warning"
                })
                return;
            }
            else {
                $.ajax({
                    url: "/Warranty/CreateWarranty",
                    data: $('#form_create_warranty').serialize(),
                    type: "POST",
                    success: function (response) {
                        if (response != null) {
                            $('#QrCodeWarrantyCard').html(response);
                            $('#createWarranty').modal('hide');
                            swal({
                                title: "Thông báo",
                                text: "Thành công!",
                                icon: "success"
                            });

                            $('#printWarranty').modal('show');
                            searchWarrantyCard();
                            //resetInputCreteWrtCard();
                        } else {
                            //resetInputCreteWrtCard();
                            swal({
                                title: "Thông báo",
                                text: "Lỗi",
                                icon: "warning"
                            })
                            return;
                        }
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });
            }
        }
    }
}

function searchRequestForGift() {
    var name = $('#txtCusName').val().trim();
    var type = $('#slGiftType').val();
    var fromdate = $('#txtFromDate').val().trim();
    var todate = $('#txtToDate').val().trim();

    $.ajax({
        url: "/StatisticGift/SearchRequestForGift",
        data: {
            Page: 1,
            CusName: name,
            GiftType: type,
            FromDate: fromdate,
            ToDate: todate
        },
        success: function (result) {
            $('#TableRQ').html(result);
        }
    });
}

function resetInputCreteWrtCard() {
    $('#quantity').val('');
    $('#point').val('');
}

function DeleteWarrantyCard($id) {
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((isConFirm) => {
            if (isConFirm) {
                $.ajax({
                    url: '/Warranty/DeleteWarrantyCard',
                    data: { ID: $id },
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Thông báo",
                                text: "Xóa thành công!",
                                icon: "success"
                            });
                            searchWarrantyCard();
                        }
                        else {
                            swal({
                                title: "Thông báo",
                                text: "Lỗi!",
                                icon: "warning"
                            });
                        }
                    }
                });
            }
        })
}

function getWarrantyDetail($ID, $WarrantyCardCode) {
    $.ajax({
        url: '/Warranty/getWarrantyDetail/',
        data: { ID: $ID, WarrantyCodeCard: $WarrantyCardCode },
        success: function (response) {
            $('#DetailWarrantyQRCode').html(response);
            $('#QrcodeDetail').modal('show');
        }
    });
}


// thống kê  doanh thu
function statisticRevenue() {
    var obj = $('#slObj').val();
    var fd = $('#txtFromDate').val();
    var td = $('#txtToDate').val();
    $.ajax({
        url: "/StatisticRevenue/Search",
        data: {
            Page: 1,
            AgentID: obj,
            FromDate: fd,
            ToDate: td
        },
        success: function (result) {
            $('#list').html(result);
        }
    });
}

// Tìm Kiếm Đơn Hàng
function searchOrder() {
    var agent = $('#slAgent').val();
    var customer = $('#slCustomer').val();
    var status = $('#slStatus').val();
    var fd = $('#txtFromDate').val().trim();
    var td = $('#txtToDate').val().trim();
    var code = $('#orderCode').val().trim();

    $.ajax({
        url: "/Order/Search",
        data: {
            Page: 1,
            Agent: agent,
            Customer: customer,
            Status: status,
            FromDate: fd,
            ToDate: td,
            Code: code
        },
        success: function (result) {
            $('#list').html(result);
        }
    });
}

//Tìm kiếm sản phẩm
function searchItem() {
    var itemName = $('#txtItemName').val().trim()
    var itemCode = $('#txtItemCode').val().trim()
    var frmDate = $('#frmDate').val().trim()
    var toDate = $('#toDate').val().trim()

    $.ajax({
        url: '/Item/Search',
        data: {
            Page: 1,
            FromDate: frmDate,
            ToDate: toDate,
            ItemName: itemName,
            ItemCode: itemCode
        },
        success: function (response) {
            $('#tableItem').html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}

function CreateItem() {
    var Code = $('#CodeCreate').val().trim();
    var Name = $('#NameCreate').val().trim();
    var Price = $('#PriceCreate').val().trim();
    var AgentPrice = $('#AgentPriceCreate').val().trim()
    var DiscountPrice = $('#DiscountPriceCreate').val().trim()
    var Image = $('#txt-url-img').val().trim();
    var Description = $('#DescriptionCreate').val().trim();
    var Brand = $('#Brand').val().trim();
    var MadeIn = $('#MadeIn').val().trim();
    var Warranty = $('#Warranty').val().trim();

    if (Code.length < 6) {
        swal({
            title: "Thông báo",
            text: "Mã sản phẩm phải dài tối thiểu 6 ký tự!",
            icon: "warning"
        })
        return;
    }
    if (isSpace(Code)) {
        swal({
            title: "Thông báo",
            text: "Mã sản phẩm không được có khoảng trắng!",
            icon: "warning"
        })
        return;
    }
    if (Code == "" || Name == "" || Price == "" || Image == "" || Description == "" || Brand == "" || MadeIn == "" || Warranty == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng điền đầy đủ thông tin",
            icon: "warning"
        })
        return;
    } else {
        if (!isNumeric(Price)) {
            swal({
                title: "Thông báo",
                text: "Giá tiền chỉ được phép nhập số!",
                icon: "warning"
            })
            return;
        }
        else {
            $.ajax({
                url: '/Item/CreateItem',
                data: $('#form_create_item').serialize(),
                success: function (response) {
                    if (response == SUCCESS) {
                        swal({
                            title: "Thành công!",
                            text: "",
                            icon: "success"
                        });
                        $('#createItem').modal('hide');
                        searchItem();
                    }
                    else if (response == EXISTING) {
                        swal({
                            title: "Không thể tạo sản phẩm",
                            text: "Mã sản phẩm đã tồn tại. Vui lòng sử dụng mã khác.",
                            icon: "warning"
                        });
                    }
                    else {
                        swal({
                            title: "Có lỗi xảy ra!",
                            text: "Không thể tạo sản phẩm",
                            icon: "warning"
                        });
                    }
                },
                error: function (result) {
                    console.log(result.responseText);
                }
            });
        }
    }
}

//Load data to Popup UpdateItem
function LoadItem(id) {
    $.ajax({
        url: '/Item/LoadItem',
        data: { ID: id },
        success: function (response) {
            $('#UpdateItem').html(response);
            $('#EditItem').modal('show');
        }
    });
}

function DeleteItem($id) {
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((isconfirm) => {
        if (isconfirm) {
            $.ajax({
                url: '/Item/DeleteItem',
                data: { ID: $id },
                success: function (response) {
                    if (response == SUCCESS) {
                        swal({
                            title: "Thông báo",
                            text: "Xóa thành công!",
                            icon: "success"
                        });
                        searchItem();
                    }
                    else {
                        swal({
                            title: "Thông báo",
                            text: "Lỗi!",
                            icon: "warning"
                        });
                    }
                }
            });
        }
    })
}

//Lưu lại cập nhập
function SaveEditItem() {
    var Code = $('#CodeEdit').val().trim();
    var Name = $('#NameEdit').val().trim();
    var Price = $('#PriceEdit').val().trim();
    var AgentPrice = $('#AgentPriceEdit').val().trim()
    var DiscountPrice = $('#DiscountPriceEdit').val().trim()
    var Image = $('#tagImage').attr('src');
    var Description = $('#NoteEdit').val().trim();
    if (Code == "" || Name == "" || Price == "" || Image == "" || Description == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning"
        })
        return;
    }
    else {
        if (!isNumeric(Price) || !isNumeric(AgentPrice) || !isNumeric(DiscountPrice)) {
            swal({
                title: "Thông báo",
                text: "Giá tiền chỉ được phép nhập số!",
                icon: "warning"
            })
            return;
        }
        else {
            swal({
                title: "Bạn chắc chắn muốn lưu thay đổi?",
                text: "",
                icon: "warning",
                buttons: true,
                dangerMode: true
            }).then((reponse) => {
                if (reponse) {
                    $.ajax({
                        url: '/Item/SaveEditItem',
                        data: $('#form_update_item').serialize(),
                        success: function (response) {
                            if (response == SUCCESS) {
                                swal({
                                    title: "Thành công!",
                                    text: "",
                                    icon: "success"
                                });
                                $('#EditItem').modal('hide');
                                searchItem();
                            }
                            else {
                                swal({
                                    title: "Có lỗi xảy ra!",
                                    text: "Không thể sửa sản phẩm.",
                                    icon: "warning"
                                });
                            }
                        },
                        error: function (result) {
                            console.log(result.responseText);
                        }
                    });
                }
            })
        }
    }
}
// Show Edit Order
function showEditOrder(id) {
    $.ajax({
        url: "/Order/ShowEditOrder",
        data: { ID: id },
        success: function (result) {
            $('#fillModal').html(result);
            $('#mdEdit').modal("show");
        }
    });
}
// Save Edit Status Order
function SaveEditOrder(id) {

    $("#frmEditOrder").validate({
        rules: {
            CusName: {
                required: true
            },
            CusPhone: {
                //required: true,
                number: true,
                minlength: 10
            },
            CusAddress: {
                required: true
            },
            AddPoint: {
                required: true,
                number: true,
                min: 0
            },
            Discount: {
                required: true,
                number: true
            }
        },
        messages: {
            CusName: {
                required: "Vui lòng không để trống"
            },
            CusPhone: {
                //required: "Vui lòng không để trống",
                number: "Vui lòng nhập số",
                minlength: "Số ĐT phải có ít nhất 10 chứ số"
            },
            CusAddress: {
                required: "Vui lòng không để trống"
            },
            AddPoint: {
                required: "Vui lòng không để trống",
                number: "Vui lòng nhập số",
                min: "Không chấp nhận số âm"
            },
            Discount: {
                required: "Vui lòng không để trống",
                number: "Vui lòng nhập số"
            }
        },
        submitHandler: function () {

            var status = $('#mdEdit #slStatus').val();
            var addPoint = $("#mdEdit #txtAddPoint").val().trim();
            var buyerName = $("#mdEdit #txtCusName").val().trim();
            var buyerPhone = $("#mdEdit #txtPhone").val().trim();
            var buyerAddress = $("#mdEdit #txtAddress").val().trim();
            //var disCount = $("#mdEdit #txtDiscount").val().replace(/,/g, '');
            var totalPrice = cms_decode_currency_format($("#mdEdit #Pay").html());
            var discount = cms_decode_currency_format($("#mdEdit #textMoneyDiscount").html());
            $('#mdEdit').modal('hide');
            $("#modalLoad").modal("show");
            $.ajax({
                url: "/Order/SaveEditOrder",
                data: {
                    ID: id,
                    Status: status,
                    AddPoint: addPoint,
                    BuyerName: buyerName,
                    BuyerPhone: buyerPhone,
                    BuyerAddress: buyerAddress,
                    TotalPrice: totalPrice,
                    Discount: discount
                },
                success: function (result) {
                    if (result == SUCCESS) {
                        //$('#mdEdit').modal('hide');
                        $("#modalLoad").modal("hide");
                        swal({
                            title: "Thông báo",
                            text: "Cập nhật thành công",
                            icon: "success"
                        });
                        setTimeout(function () {
                            searchOrder();
                        }, 1000);

                    }
                    else {
                        //$('#mdEdit').modal('hide');
                        swal({
                            title: "Thông báo",
                            text: "Có Lỗi !!",
                            icon: "warning"
                        });
                    }
                }
            });
        }
    });
}


// delete order
function deleteOrder(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    } else {
        swal({
            title: "Bạn chắc chắn xóa chứ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((isConFirm) => {
            if (isConFirm) {
                $.ajax({
                    url: '/Order/DeleteOrder',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            });
                            searchOrder();
                        } else {
                            swal({
                                title: "Không thể xóa!",
                                text: "Có lỗi.",
                                icon: "warning"
                            })
                        }
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });
            }

        })
    }
}


// Search Agent
function searchAgent() {
    var phone = $('#txtPhone').val().trim();
    var name = $('#txtName').val().trim();
    var fd = $('#txtFromDate').val();
    var td = $('#txtToDate').val();

    $.ajax({
        url: "/Agent/Search",
        data: {
            Page: 1,
            Phone: phone,
            Name: name,
            FromDate: fd,
            ToDate: td
        },
        success: function (result) {
            $('#list').html(result);
        }
    });
}

//function createAgent() {
//    $("#frmCreate").validate({
//        rules: {
//            Name: { required: true },
//            Phone: { required: true },
//            Email: { required: true },
//            Password: { required: true },
//            ConfirmPassword: { required: true },
//            Address: { required: true }
//        },
//        messages: {
//            Name: { required: "Vui lòng không để trống" },
//            Phone: { required: "Vui lòng không để trống" },
//            Email: { required: "Vui lòng không để trống" },
//            Password: { required: "Vui lòng không để trống" },
//            ConfirmPassword: { required: "Vui lòng không để trống" },
//            Address: { required: "Vui lòng không để trống" }
//        },
//        submitHandler: function () {
//            $.ajax({
//                url: "/Agent/CreateAgent",
//                data: $('#frmCreate').serialize(),
//                success: function (result) {
//                    if (result == SUCCESS) {
//                        swal({
//                            title: "Thêm Thành Công ",
//                            text: "",
//                            icon: "success"
//                        });
//                        $('#createAgent').modal("hide");
//                        setTimeout(function () {
//                            searchAgent();
//                        }, 1000);
//                    }
//                    else
//                        if (result == EXISTING) {
//                            swal({
//                                title: "Không thể tạo đại lý.",
//                                text: "Mã đại lý đã tồn tại. Vui lòng dùng mã khác.",
//                                icon: "warning"
//                            })
//                        }
//                        else {
//                            swal({
//                                title: "Thất Bại, Có Lỗi ! ",
//                                text: "",
//                                icon: "warning"
//                            });
//                        }
//                }
//            })
//        }
//    });
//}

//function createAgent() {
//    var Phone = $.trim($('#PhoneCreate').val())
//    var Name = $.trim($('#NameCreate').val())
//    var Email = $.trim($('#EmailCreate').val())
//    var Password = $.trim($('#PasswordCreate').val())
//    var PasswordConfirm = $.trim($('#PasswordConfirmCreate').val())
//    var Address = $.trim($('#AddressCreate').val())

//    if (Phone == "" || Name == "" || Email == "" || Password == "" || PasswordConfirm == "" || Address == "") {
//        swal({
//            title: "Thông báo",
//            text: "Vui lòng nhập đầy đủ thông tin",
//            icon: "warning"
//        })
//        return
//    } else if (PasswordConfirm != Password) {
//        swal({
//            title: "Thông báo",
//            text: "Mật khẩu không khớp, vui lòng nhập lại",
//            icon: "warning"
//        })
//        return
//    } else {
//        $.ajax({
//            url: "Agent/CreateAgent",
//            data: $('#frmCreate').serialize(),
//            success: function (response) {
//                if (response == SUCCESS) {
//                    swal({
//                        title: "Thành công",
//                        text: "",
//                        icon: "success"
//                    })
//                    $('#createAgent').modal(hide)
//                    searchAgent()
//                } else if (reponse == EXISTING) {
//                    swal({
//                        title: "Không thể tạo sản phẩm",
//                        text: "Email hoặc số điện thoại đã được đăng ký.",
//                        icon: "warning"
//                    })
//                } else {
//                    swal({
//                        title: "Có lỗi xảy ra",
//                        text: "Không thể tạo Agent",
//                        icon: "warning"
//                    })
//                }
//            },
//            errorr: function (response) {
//                console.log(response.reponseText)
//            }
//        })
//    }
//}

function createAgent() {
    var Phone = $.trim($('#PhoneCreate').val())
    var Name = $.trim($('#NameCreate').val())
    var Email = $.trim($('#EmailCreate').val())
    var Password = $.trim($('#PasswordCreate').val())
    var PasswordConfirm = $.trim($('#PasswordConfirmCreate').val())
    var Address = $.trim($('#AddressCreate').val())
    //var Lati = $('#lati').val().trim();
    //var Long = $('#long').val().trim();
    //var PlusCode = $('#plusCode').val().trim();

    var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var rePhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/

    if (Phone == "" || Name == "" || Email == "" || Password == "" || PasswordConfirm == "" || Address == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng nhập đầy đủ thông tin",
            icon: "warning"
        })
        return
    } else if (Password != PasswordConfirm) {
        swal({
            title: "Thông báo",
            text: "Mật khẩu xác nhận không khớp",
            icon: "warning"
        })
        return
    } else if (reEmail.test(Email) == false) {
        swal({
            title: "Thông báo",
            text: "Email không đúng định dạng",
            icon: "warning"
        })
    } else if (rePhone.test(Phone) == false) {
        swal({
            title: "Thông báo",
            text: "Số điện thoại không đúng định dạng",
            icon: "warning"
        })
    } else {
        $.ajax({
            url: "/Agent/CreateAgent",
            data: $('#frmCreate').serialize(),
            success: function (response) {
                if (response == EXISTING) {
                    swal("Không thể tạo đại lý", "Số điện thoại hoặc Email đã được sử dụng", "warning");
                } else if (response == SUCCESS) {
                    swal("Thành công!", "", "success");
                    $('#createAgent').modal('hide');
                    searchAgent();
                } else {
                    swal("Có lỗi xảy ra!", "Không thể tạo đại lý.", "warning");
                }
            }
        });
    }
}



// Show Edit Agent
function showEditAgent(id) {
    $.ajax({
        url: "/Agent/ShowEditForm",
        data: { ID: id },
        success: function (result) {
            $('#fill').html(result);
            $('#mdEdit').modal("show");
        }
    });
}

// Save Edit Agent

function saveEditAgent(id) {
    $("#frmUpdate").validate({
        rules: {
            Name: { required: true },
            Address: { required: true }
        },
        messages: {
            Name: { required: "Vui lòng không để trống" },
            Address: { required: "Vui lòng không để trống" }
        },
        submitHandler: function () {
            $.ajax({
                url: "/Agent/SaveEdit",
                data: {
                    ID: id,
                    Name: $('#txtNameEdit').val().trim(),
                    Address: $('#txtAddressEdit').val().trim()
                },
                success: function (result) {
                    if (result == SUCCESS) {
                        swal({
                            title: "Cập Nhật Thành Công ",
                            text: "",
                            icon: "success"
                        });
                        $('#mdEdit').modal("hide");
                        setTimeout(function () {
                            searchAgent();
                        }, 1500);
                    }
                    else if (result = -1) {
                        swal({
                            title: "Thất Bại, Không tìm thấy SĐT  !! ",
                            text: "",
                            icon: "warning"
                        });
                    }
                    else {
                        swal({
                            title: "Thất Bại, Có lỗi !! ",
                            text: "",
                            icon: "warning"
                        });
                    }
                }
            })
        }
    });
}

// Delete Agent
function deleteAgent(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    else {
        swal({
            title: "Bạn chắc chắn xóa chứ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((isConFirm) => {
            if (isConFirm) {
                $.ajax({
                    url: '/Agent/DeleteAgent',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Xóa thành công!",
                                text: "",
                                icon: "success"
                            })
                            searchAgent();
                        } else {
                            swal({
                                title: "Không thể xóa!",
                                text: "Có lỗi.",
                                icon: "warning"
                            })
                        }
                    },
                    error: function (result) {
                        console.log(result.responseText);
                    }
                });
            }
        })
    }
}

// hủy kích hoạt đại lý

function cancelActiveAgent(id) {
    if (!navigator.onLine) {
        swal({
            title: "Kiểm tra kết nối internet!",
            text: "",
            icon: "warning"
        })
        return;
    }
    else {
        swal({
            title: "Bạn chắc chắn muốn hủy kích hoạt đại lý này chứ!",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((isConFirm) => {
            if (isConFirm) {
                $.ajax({
                    url: '/Agent/cancelActive',
                    data: { ID: id },
                    type: "POST",
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Hủy Kích Hoạt Thành Công",
                                text: "",
                                icon: "success"
                            });
                            $("#mdEdit").modal("hide");
                            setTimeout(function () {
                                searchAgent();
                            }, 1000);
                        } else {
                            swal({
                                title: "Có lỗi!",
                                text: "Vui lòng phản hồi với bộ phận hỗ trợ.",
                                icon: "warning"
                            })
                        }
                    },
                    error: function (result, status, err) {
                        console.log(result.responseText);
                        console.log(status.responseText);
                        console.log(err.Message);
                    }
                });
            }
        })
    }
}

function SearchShop() {
    var NameShop = $('#NameShop').val().trim();
    var Province = $('#ProvinceID').val().trim();
    var district = $('#slDistrictShop').val();
    $.ajax({
        url: '/Shop/Search',
        data: {
            Page: 1,
            ShopName: NameShop,
            ProvinceID: Province,
            DistrictID: district,
        },
        success: function (response) {
            $('#TableShop').html(response);
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}


function saveCreateShop() {
    var name = $.trim($('#Name').val());
    var contactName = $.trim($('#ContactName').val());
    var contactPhone = $.trim($('#ContactPhone').val());
    var province = $('#createShop #ProvinceID').val();
    var district = $('#slDistrictShopCreate').val();
    var place = $('#place').val();
    var long = $('#Long').val();
    var lat = $('#Lati').val();
    var address = $.trim($('#Address').val());
    var url = $(".imgCreateShop").attr("src");

    //if (name == "") {
    //    swal({
    //        title: "Thông báo",
    //        text: "Mời nhập tên cửa hàng!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //else if (contactName == "") {
    //    swal({
    //        title: "Thông báo",
    //        text: "Mời nhập tên người liên hệ!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //else if (province < 1 || district < 1) {
    //    swal({
    //        title: "Thông báo",
    //        text: "Vui lòng chọn Tỉnh/Thành Quận/Huyện!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //else if (address == "") {
    //    swal({
    //        title: "Thông báo",
    //        text: "Mời nhập tên địa chỉ!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //else if (!isNumeric(contactPhone)) {
    //    swal({
    //        title: "Thông báo",
    //        text: "Số điện thoại chỉ được nhập số!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //else if (url == null) {
    //    swal({
    //        title: "Thông báo",
    //        text: "Vui lòng chọn ít nhất 1 ảnh!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //else if (place == "") {
    //    swal({
    //        title: "Thông báo",
    //        text: "Mời nhập vào địa chỉ URL!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //if (long == "" || lat == "") {
    //    swal({
    //        title: "Thông báo",
    //        text: "Vui lòng chọn đúng và xác nhận Url maps!",
    //        icon: "warning"
    //    })
    //    return;
    //}
    //else {
    $.ajax({
        url: "/Shop/CreateShop",
        data: $('#form_create_shops').serialize(),
        success: function (response) {
            if (response == EXISTING) {
                swal("Không thể tạo cửa hàng", "Vị trí bạn chọn đã được sử dụng cho 1 cửa hàng khác.", "warning");
            }
            else if (response == SUCCESS) {
                swal("Thành công!", "", "success");
                $('#createShop').modal('hide');
                SearchShop();
                resetInputShop();
            }
            else {
                swal("Có lỗi xảy ra!", "Không thể tạo cửa hàng.", "warning");
            }
        }
    });
    //}
}

//Sửa cửa hàng
function saveEditShop() {
    var name = $.trim($('#_Name').val());
    var contactName = $.trim($('#_ContactName').val());
    var contactPhone = $.trim($('#_ContactPhone').val());
    var address = $.trim($('#_Address').val());
    var url = $("._lstImage").attr("src");
    var province = $('#_ProvinceID').val();
    var district = $('#slDistrictShopUpdate').val();
    var place = $('#_Place').val();
    var long = $('#_Long').val();
    var lat = $('#_Lati').val();

    if (name == "") {
        swal({
            title: "Thông báo",
            text: "Mời nhập tên cửa hàng!",
            icon: "warning"
        })
        return;
    }
    else if (contactName == "") {
        swal({
            title: "Thông báo",
            text: "Mời nhập tên người liên hệ!",
            icon: "warning"
        })
        return;
    }
    else if (province < 1 || district < 1) {
        swal({
            title: "Thông báo",
            text: "Vui lòng chọn Tỉnh/Thành Quận/Huyện!",
            icon: "warning"
        })
        return;
    }
    else if (address == "") {
        swal({
            title: "Thông báo",
            text: "Mời nhập tên địa chỉ!",
            icon: "warning"
        })
        return;
    }
    else if (!isNumeric(contactPhone)) {
        swal({
            title: "Thông báo",
            text: "Số điện thoại chỉ được nhập số!",
            icon: "warning"
        })
        return;
    }
    else if (url == null) {
        swal({
            title: "Thông báo",
            text: "Vui lòng chọn ít nhất 1 ảnh!",
            icon: "warning"
        })
        return;
    }
    else if (place == "") {
        swal({
            title: "Thông báo",
            text: "Mời nhập vào địa chỉ URL!",
            icon: "warning"
        })
        return;
    }
    if (long == "" || lat == "") {
        swal({
            title: "Thông báo",
            text: "Vui lòng xác nhận Url maps!",
            icon: "warning"
        })
        return;
    }
    else {
        $.ajax({
            url: '/Shop/EditShop',
            type: 'POST',
            data: $('#form_edit_shop').serialize(),
            success: function (response) {
                if (response == SUCCESS) {
                    swal("Sửa thành công!", "", "success");
                    $('#EditShop').modal('hide');
                    SearchShop();
                    resetInputShop();
                } else
                    if (response == EXISTING) {
                        swal("Không thể sửa cửa hàng", "Vị trí bạn chọn đã được sử dụng cho 1 cửa hàng khác.", "warning");
                    }
                    else {
                        swal("Có lỗi xảy ra!", "Không thể sửa cửa hàng.", "warning");
                    }
            }
        });
    }
}



//Load Place to input
function LoadPlaceEditShop() {
    if ($('#_Place').val() != "") {
        var longlat = /\/\@(.*),(.*),/.exec($('#_Place').val());
        lat = longlat[1];
        lng = longlat[2];
        $('#_Lati').val(lat);
        $('#_Long').val(lng);
    }
    else {
        swal("Thông báo!", "Mời nhập vào địa chỉ UrL", "warning");
    }
}

//Load Place to input
function LoadPlaceCreateShop() {
    if ($('#place').val() != "") {
        var longlat = /\/\@(.*),(.*),/.exec($('#place').val());
        if (longlat == null) {
            swal("Thông báo", "Vui lòng chọn đúng đường dẫn google map", "warning");
        }
        lat = longlat[1];
        lng = longlat[2];
        if (lat == "" || lng == "") {
            swal("Thông báo", "Vui lòng chọn đúng đường dẫn google map", "warning");
        }
        $('#Lati').val(lat);
        $('#Long').val(lng);
    }
    else {
        swal("Thông báo!", "Mời nhập vào địa chỉ UrL", "warning");
    }
}

//reset text to default
function resetInputShop() {
    $('#Name').val('');
    $('#ContactName').val('');
    $('#ContactPhone').val('');
    $('#Address').val();
    $('#place').val('');
    $('#Lati').val('');
    $('#Long').val('');
    $('.Imgs').remove();
}

//reser text 
function resetInputItem() {
    $('#CodeCreate').val("");
    $('#NameCreate').val("");
    $('#PriceCreate').val();
    $('#DivtagImg').remove();
}

//Lấy ra list url của shop cần sửa
function listUrlImage() {
    var url = "";
    $('._lstImage').each(function () {
        if (url == "") {
            url = $(this).attr('src');
        }
        else {
            url = url + "," + $(this).attr('src');
        }
    });
    $('#_txturlImage').val(url);
}

//Load modal edit shop
function loadModalEditShop($id) {
    var id = $id;
    $.ajax({
        url: '/Shop/loadModalEditShop',
        data: { ID: $id },
        success: function (response) {
            $('#modalEditShop').html(response);
            $('#EditShop').modal('show');
            listUrlImage();
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });
}

//Delete Shop
function DeleteShop($id) {
    var id = $id
    swal({
        title: "Bạn chắc chắn xóa chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((isConFirm) => {
            if (isConFirm) {
                $.ajax({
                    url: '/Shop/DeleteShop',
                    data: { ID: id },
                    success: function (response) {
                        if (response == SUCCESS) {
                            swal({
                                title: "Thông báo",
                                text: "Xóa thành công!",
                                icon: "success"
                            });
                            SearchShop();
                        }
                        else {
                            swal({
                                title: "Thông báo",
                                text: "Lỗi!",
                                icon: "warning"
                            });
                        }
                    }
                });
            }
        })
}

// Import Data Agent
function ImportAgent() {
    var fileUpload = $('#txtFile').get(0);
    var files = fileUpload.files;
    var formData = new FormData();
    formData.append('ExcelFile', files[0]);

    $.ajax({
        type: 'POST',
        url: '/Agent/ImportData',
        contentType: false,
        processData: false,
        data: formData,
        success: function (result) {
            if (result == 1) {
                swal({
                    title: "Import Thành Công",
                    text: "",
                    icon: "success"
                });
                searchAgent();
            }
            else if (result == -1) {
                swal({
                    title: "Hãy Chọn Một File Excel !",
                    text: "Có lỗi.",
                    icon: "warning"
                });
            }
            else if (result == 0) {
                swal({
                    title: "Mã Đại Lý Đã Tồn Tại !",
                    text: "Có lỗi.",
                    icon: "warning"
                });
            }
            else if (result == 3) {
                swal({
                    title: "File import không có dữ liệu",
                    text: "vui lòng kiểm tra lại !",
                    icon: "warning"
                });
            }
            else {
                swal({
                    title: "Sai Định Dạng File !",
                    text: "Có lỗi.",
                    icon: "warning"
                });
            }
            setTimeout(function () {
                $('#mdImport').modal('hide');
            }, 1000);
        }
    })
}


// Import Data Card
function importCard() {
    var fileUpload = $('#inputExcelFile').get(0);
    var files = fileUpload.files;
    var formData = new FormData();
    formData.append('ExcelFile', files[0]);

    $.ajax({
        type: 'POST',
        url: '/Card/Import',
        contentType: false,
        processData: false,
        data: formData,

        success: function (result) {
            if (result == 1) {
                swal({
                    title: "Import Thành Công",
                    text: "",
                    icon: "success"
                });
                searchCard();
            }
            else if (result == -1) {
                swal({
                    title: "Hãy Chọn Một File Excel !",
                    text: "Có lỗi.",
                    icon: "warning"
                });
            }
            else if (result == 0) {
                swal({
                    title: "Seri hoặc Mã thẻ Đã Tồn Tại !",
                    text: "Vui lòng kiểm tra lại",
                    icon: "warning"
                });
            }
            else if (result == -3) {
                swal({
                    title: "File Import Chưa Có Dữ Liệu !",
                    text: "Vui lòng kiểm tra lại",
                    icon: "warning"
                });
            }
            else if (result == -4) {
                swal({
                    title: "Lỗi !",
                    text: "Vui lòng liên vệ với bộ phận hỗ trợ",
                    icon: "warning"
                });
            }
            else if (result == -5) {
                swal({
                    title: "Mã thẻ hoặc seri phải hơn 10 kí tự",
                    text: "Vui lòng kiểm tra lại dữ liệu",
                    icon: "warning"
                });
            }
            else if (result > 20000 && result < 25000) {
                swal({
                    title: "Vui Lòng Điền Đầy Đủ Thông Tin",
                    text: "kiểm tra lại dòng " + (result - 20000),
                    icon: "warning"
                });
            }
            else if (result > 25000 && result < 30000) {
                swal({
                    title: "Seri hoặc mã thẻ được tối đa 15 ký tự",
                    text: "kiểm tra lại dòng " + (result - 25000),
                    icon: "warning"
                });
            }
            else if (result > 30000) {
                swal({
                    title: "Seri trùng với mã thẻ",
                    text: "kiểm tra lại dòng " + (result - 30000),
                    icon: "warning"
                });
            }
            else if (result > 1 && result <= 10000) {
                swal({
                    title: "Seri hoặc Mã thẻ Đã Tồn Tại !",
                    text: "vui lòng kiểm tra lại dòng " + result,
                    icon: "warning"
                });
            }
            else if (result > 10000 && result <= 20000) {
                swal({
                    title: "Dữ Liệu Không Hợp Lệ",
                    text: "vui lòng kiểm tra dòng " + (result - 10000),
                    icon: "warning"
                });
            }
            else {
                swal({
                    title: "Sai Định Dạng File !",
                    text: "Có lỗi.",
                    icon: "warning"
                });
            }
            setTimeout(function () {
                $('#mdImport').modal('hide');
            }, 1000);
        }
    });

}

// Back customer
function backToIndexCustomer(page) {
    $.ajax({
        type: "POST",
        url: "/Customer/GoHome",
        dataType: 'json',
        crossDomain: true,
        success: function (data) {
            window.location.href = data;
        }
    });
    //$.ajax({
    //    type: "POST",
    //    url: '/Customer/Search',
    //    data: { Page: page },
    //    success: function (result) {
    //        $(' #ListCustomer').html(result);
    //    }
    //})
}


//function hideModelBatchDetail() {
//    $('.modal').hide();
//    $('#mdBatchDetail').hide();
//    $('.modal-backdrop').hide();
//}


//Format money in textbox
function cms_encode_currency_format(num) {
    if (!isNumeric(num)) {
        return '';
    }
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function cms_decode_currency_format(obs) {
    if (obs == '')
        return '';
    else
        return parseInt(obs.replace(/,/g, ''));
}

//function checkAllBox(source) {
//    //var status = $(source).is(":checked")

//    //$("input[name=boxChecked]").each(function () {
//    //    $(this).attr("checked", status)
//    //})
//}

function saveAddPoint() {
    var listChecked = ""
    var boxes = $('input[name=boxChecked]:checked')
    // var point = $('#point').val().trim();
    var point = parseInt($("#point").val().replace(/,/g, ''));
    var description = $.trim($("#description").val());
    if (point == 0 || isNaN(point)) {
        swal("Số điểm phải lớn hơn 0", "", "warning");
        return;
    }
    boxes.each(function () {
        var id = $(this).attr('data-id')
        listChecked += id + ","
    })
    if (listChecked == "") {
        swal("Chưa có đại lý nào được chọn", "", "warning");
        return;
    }
    $.ajax({
        url: '/Agent/AddPoint',
        type: 'POST',
        data: {
            ListChecked: listChecked,
            Point: point,
            Description: description
        },
        success: function (responsive) {
            if (responsive == 1) {
                swal("Thêm điểm thành công", "", "success")
                searchAgent()
                $('#addPoint').modal('hide')
            } else {
                swal("Có lỗi", "", "warning")
                searchAgent()
                $('#addPoint').modal('hide')
            }
        }
    })
}

function saveConfig() {
    //var distance = $('#txtDistance').val().trim();
    //var timewaiting = $('#txtTimeWaiting').val().trim();
    //var pointaddfirst = $('#txtPointAddFirst').val().trim();
    var distance = parseInt($("#txtDistance").val().replace(/,/g, ''));
    var timewaiting = parseInt($("#txtTimeWaiting").val().replace(/,/g, ''));
    var pointaddfirst = parseInt($("#txtPointAddFirst").val().replace(/,/g, ''));
    if (distance == 0 || isNaN(distance) || timewaiting == 0 || isNaN(timewaiting) || pointaddfirst == 0 || isNaN(pointaddfirst)) {
        swal("Các giá trị phải lớn hơn 0 và không được bỏ trống", "", "warning");
        return;
    }

    swal({
        title: "Bạn chắc chắn muốn lưu thiết lập chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then((response) => {
        if (response) {
            $.ajax({
                url: '/Config/SaveConfig',
                data: {
                    Distance: distance,
                    TimeWaiting: timewaiting,
                    PointAddFirst: pointaddfirst
                },
                success: function (responsive) {
                    if (responsive == 1) {
                        swal("Lưu thiết lập thành công", "", "success")
                    } else {
                        swal("Có lỗi", "", "warning")
                    }
                }
            })
        }
    })
}

function GetAgentDetail(id) {

    $.ajax({
        url: '/Agent/GetAgentDetail',
        data: { ID: id },
        success: function (result) {
            $('#View').html(result);
        }
    });
}

function resetPassword(id) {
    swal({
        title: "Bạn chắc chắn muốn reset mật khẩu chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((reponse) => {
        if (reponse) {
            $.ajax({
                url: '/User/ResetPassword',
                data: { ID: id },
                success: function (reponsive) {
                    if (reponsive == 1) {
                        swal("Đặt lại mật khẩu thành công", "", "success")
                    } else {
                        swal("Có lỗi", "", "warning")
                    }
                }
            })
        }
    })
}

function resetPasswordAgent(id) {
    swal({
        title: "Bạn chắc chắn muốn reset mật khẩu chứ?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((reponse) => {
        if (reponse) {
            $.ajax({
                url: '/Agent/ResetPassword',
                data: { ID: id },
                success: function (reponsive) {
                    if (reponsive == 1) {
                        swal("Đặt lại mật khẩu thành công", "", "success")
                    } else {
                        swal("Có lỗi", "", "warning")
                    }
                }
            })
        }
    })
}

function showAddPonitAgent(id) {
    $('#addPointAgent').modal('show')
}

//Sửa thông tin đại lý GasViett
function saveEditInforAgent(id) {
    var name = $("#txtNameEdit").val().trim();
    var phone = $("#phoneEdit").val().trim();
    var birthday = $("#bdEdit").val().trim();
    var email = $("#txtEmailEdit").val().trim();
    var address = $("#AddressCreate2").val().trim();
    var sex = ($('input[name=inlineRadioOptions]:checked', '#gender').val());
    var lati = $('#lati2').val().trim();
    var long = $('#long2').val().trim();


    var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var rePhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/

    if (name == null || phone == null || birthday == null || email == null || address == null) {
        swal({
            title: "Vui lòng điền đầy đủ thông tin!",
            text: "",
            icon: "warning",
        });
        return;
    } else if (reEmail.test(email) == false) {
        swal({
            title: "Thông báo",
            text: "Email không đúng định dạng",
            icon: "warning"
        })
    } else if (rePhone.test(phone) == false) {
        swal({
            title: "Thông báo",
            text: "Số điện thoại không đúng định dạng",
            icon: "warning"
        })
    } else {
        $.ajax({
            url: '/Agent/SaveEditInforAgent',
            data: {
                ID: id,
                Name: name,
                Phone: phone,
                DOB: birthday,
                Address: address,
                Email: email,
                Sex: sex,
                Lati: lati,
                Long: long
            },
            type: 'POST',
            success: function (reponsive) {
                if (reponsive == 1) {
                    swal({
                        title: "Thành công!",
                        text: "",
                        icon: "success",
                    });
                    window.location = "/Agent/Index";
                } else {
                    if (reponsive == EXISTING) {
                        swal({
                            title: "Có lỗi!",
                            text: "Số điện thoại này đã được sử dụng",
                            icon: "warning",
                        });
                    } else {
                        swal({
                            title: "Có lỗi!",
                            text: "",
                            icon: "warning",
                        });
                        console.log("enterrd")
                    }

                }
            }
        });
    }
}

function intilize() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('AddressCreate'));

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();

        var lati = place.geometry.location.lat();
        var long = place.geometry.location.lng();
        var plusCode = "https://www.google.com/maps/@" + lati + "," + long + ",17z";

        document.getElementById('lati').value = lati;
        document.getElementById('long').value = long;
        document.getElementById('plusCode').value = plusCode;
    })
}

function intilize2() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('AddressCreate2'));

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();

        var lati = place.geometry.location.lat();
        var long = place.geometry.location.lng();
        var plusCode = "https://www.google.com/maps/@" + lati + "," + long + ",17z";

        document.getElementById('lati2').value = lati;
        document.getElementById('long2').value = long;
        document.getElementById('plusCode2').value = plusCode;
    })
}