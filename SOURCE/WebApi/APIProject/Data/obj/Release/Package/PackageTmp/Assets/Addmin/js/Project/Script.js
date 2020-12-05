

function CloesEidtUser() {
    $("#Modal_Edit_User").hide();
}
function CloseDeleteUser() {
    $("#Modal_Del_User").hide();
}

function CloseEditPassUser() {
    $("#Modal_Edit_Pass_User").hide();
}

function CloseEidtTeacher() {
    $("#Modal_Edit_Teacher").hide();
}


// Phan Đình Kiên : Hiển thị thông tin người dùng 
function SeachUser() {
    $.ajax({
        url: "/User/Seach",
        data: {
            Page: 1,
            UserName: $("#txtSeachUserByUserName").val(),
        },
        success: function (result) {
            $("#Table_User").html(result);
        }
    });
}

// Phan Đình Kiên : thêm mới thông tin người dùng
function AddUser() {
    $.ajax({
        url: "/User/Add",
        data: $("#FormAdd_User").serialize(),
        success: function (result) {
            if (result == 1) {
                $("#Modal_Add_User").hide();
                $(".modal-backdrop").hide();
                swal("Thông Báo!", "Thêm mới thành công", "success");
                $("#txtAddUserNameUser").val("");
                $("#txtAddMailUser").val("");
                $("#txtAddPassUser").val("");
                $("#txtAddRoleUser").val(0);
            }
            else if (result == -3) {
                swal("Thông báo", "(Tài khoản đã tồn tại)", "error");
            }
            else if (result == 0) {
                swal("Thông báo", "(Thêm mới không thành công)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền thêm mới thông tin tài khoản)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(Bạn không có quyền truy cập vào hệ thống)", "error");
            }
            SeachUser();
        }
    });
}

// Phan Đình Kiên : cập nhập thông tin của người dùng
function EditUser() {

    $.ajax({
        url: "/User/Edit",
        data: $("#Form_EditUser").serialize(),
        success: function (result) {
            if (result == 1) {
                $("#Modal_EditUser").hide();
                swal("Thông Báo!", "Cập nhập thành công tài khoản", "success");
            }
            else if (result == 0) {
                swal("Thông báo", "(Cập nhập tài khoản không thành công)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không  có quyền cập nhập thông tin tài khoản)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(Bạn không có quyền truy cập vào hệ thống)", "error");
            }
            SeachUser();
        }
    });
}

// Phan Đình Kiên : Lấy thông tin của người dùng theo id
function GetUserById(ID) {
    $.ajax({
        url: "/User/GetById",
        data: { ID: ID },
        success: function (result) {
            $("#txtEditUserNameUser").val(result.USER_NAME);
            $("#txtEditMailUser").val(result.EMAIL);
            $("#txtEditPassUser").val(result.PASSWORD);
            $("#txtEditRoleUser").val(result.ROLE);
            $("#txtEditIdUser").val(result.ID);
            $("#Modal_Edit_User").show();
        }
    });
}

// Phan Đình Kiên : đăng nhập thông tin của tài khoản  
function LoginAdmin() {
    var userName = $("#login-username").val();
    var passWord = $("#login-password").val();
    $.ajax({
        url: "/User/LoginUser",
        data: { UserName: userName, Password: passWord },
        success: function (result) {
            if (result == 1) {
                window.location = "/User/Index";
            }
            else if (result == 0) {
                swal("Thông báo", "(Sai tài khoản hoặc mật khẩu)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(Bạn không có quyền truy cập vào hệ thống)", "error");
            }
            SeachUser
        },
        error: function (errr) {

        }
    });
}

// Phan Đình Kiên : Lây thông tin tài khoản cần xóa 
var IDDeleteUser = 0;
function ShowFromDeleteUser(Id) {
    IDDeleteUser = Id;
    $("#Modal_Del_User").show();
}

// phan đình kiên :Xóa thông tin của tài khoản 
function DelUser() {
    $.ajax({
        url: "/User/Delete",
        data: { Id: IDDeleteUser },
        success: function (result) {
            if (result == 1) {
                $("#Modal_Del_User").hide();
                swal("Thông Báo!", "Xóa thành công tài khoản", "success");
            }
            else if (result == 0) {
                swal("Thông báo", "(Xóa không thành công tài khoản)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền xóa thông tin tài khoản)", "error");
            }
            SeachUser();
        }
    });
}

// Phan Đình Kiên : reset Lại thông tin mật khẩu của tài khoản 
function ResetPassword() {
    $.ajax({
        url: "/User/ResetPass",
        data: { ID: $("#txtEditIdUser").val() },
        success: function (result) {
            if (result == "0") {
                $("#Modal_EditUser").hide();
                swal("Thông báo", "(reset mật khẩu không thành công)", "error");
            }
            else if (result == '-1') {
                swal("Thông báo", "(Bạn không có quyền reset lại tài khoản)", "error");
            }
            else {
                swal("Thông Báo!", "Reset Thành công mật khẩu của tài khoản là : " + result, "success");
            }
            SeachUser();
        }
    });
}

// Phan Đình Kiên : cập nhập lại thông tin mật khẩu của tài khoản 
function EditPassword() {

    var pass = $('#txtEditPasswordUser').val();
    var checkpass = $('#txtEditPassCheck').val();

    if (pass != checkpass) {
        swal("Thông báo", "(Mật khẩu không trùng khớp)", "error");
    } else {
        $.ajax({
            url: "/User/EditPass",
            data: { Password: pass },
            success: function (result) {
                if (result == 0) {
                    $("#Modal_Edit_Pass_User").hide();

                    swal("Thông báo", "(Cập nhập mật khẩu không thành công)", "error");
                }
                else if (result == 1) {
                    $("#Modal_Edit_Pass_User").hide();
                    swal("Thông Báo!", "Cập nhập mật khẩu thành công", "success");
                }
                SeachUser();
            }
        });
    }
}

// phan Đình Kiên : load thông tin thời gian 
$(function () {
    $('#datetimepicker1').datepicker({
        language: 'pt-BR'
    });
});


$(document).ready(function () {

    // Phan Đình Kiên : hiển thị khung đăng nhập tài khoản 
    $("#EditPass").off('click').on('click', function (e) {
        e.preventDefault();
        $("#Modal_Edit_Pass_User").show();
    });
});

//-------------------------------------------------------------------------- Thông tin học viên ---------------------------------------------------

// phan đình kiên : tìm kiếm thông tin của học sinh  
function SeachParent() {
    $.ajax({
        url: "/Parent/Seach",
        data: {
            Page: 1,
            NAME: $("#txt_seach_name_paren").val(),
            STUDENT_NAME: $("#txt_seach_name_student_parent").val(),
            STUDENT_PHONE: $("#txt_seach_phone_paren").val(),
            STATUS: $("#txt_seach_sattus_parent").val(),
            CREATED_DATE: $("#txt_seach_create_parent").val(),
        },
        success: function (result) {
            $("#Table_Parent").html(result);
        }
    });
}

// Phan Đình kiên : xóa nhiều học viên cùng một lúc 
function DeleteListParent() {

    var myArray = "";
    $('#ListStudent input[type=checkbox]').each(function () {
        if (this.checked) {
            myArray = myArray + $(this).val() + ":";
        }
    });


    $.ajax({
        url: "/Parent/DeleteList",
        data: {
            ListID: myArray
        },
        success: function (result) {
            if (result == 1) {
                SeachParent();
                swal("Thông Báo!", "Xóa thành công danh sách học viên ", "success");
            }
            if (result == 0) {

                swal("Thông báo", "(Xóa không thành công danh sách học viên)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền xóa danh sách học viên)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(Bạn cần phải chọn học viên cần xóa)", "error");
            }
        }
    });
}

// Phan Đình Kiên : Thêm mới thông tin của học viên 
function AddParent() {
    $.ajax({
        url: "/Parent/Add",
        data: $("#Form_Add_Parent").serialize(),
        success: function (result) {
            if (result == 1) {
                $("#Modal_Add_Parent").hide();
                swal("Thông Báo!", "Thêm mới thành công", "success");
                setTimeout(function () {
                    window.location = "/parent/index";
                }, 1000);

            }
            else if (result == 0) {
                swal("Thông báo", "(Thêm mới không thành công)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền thêm mới thông tin học viên)", "error");
            }

            else if (result == -3) {
                swal("Thông báo", "(Số điện thoại của phụ huynh đã tồn tại trong hệ thống)", "error");
            }
            else if (result == -4) {
                swal("Thông báo", "(tên của học sinh đã tồn tại trong hệ thống )", "error");
            }
        }
    });
}

// Phan Đình Kiên : lấy thông tin của học sinh theo id 
function GetParentById(ID) {
    $.ajax({
        url: "/Parent/GetById",
        data: { ID: ID },
        success: function (result) {
            window.location = '/parent/update'
            $("#txtEditUserNameUser").val(result.ID);
            $("#txtEditUserNameUser").val(result.NAME);
            $("#txtEditUserNameUser").val(result.PHONE);
            $("#txtEditUserNameUser").val(result.STUDENT_NAME);
            $("#txtEditUserNameUser").val(result.STUDENT_SCHOOL_NAME);
            $("#txtEditUserNameUser").val(result.STUDENT_BIRTHDAY);
            $("#txtEditUserNameUser").val(result.STUDENT_PHONE);
            $("#txtEditUserNameUser").val(result.PASSWORD);
            $("#txtEditUserNameUser").val(result.ADDRESS);
            $("#txtEditUserNameUser").val(result.EMAIL);
            $("#txtEditUserNameUser").val(result.STUDENT_SEX);
            $("#txtEditUserNameUser").val(result.CREATED_DATE);
            $("#txtEditUserNameUser").val(result.NOTE);
            $("#txtEditUserNameUser").val(result.MARK1);
            $("#txtEditUserNameUser").val(result.MARK2);
            $("#txtEditUserNameUser").val(result.STATUS);
            $("#txtEditUserNameUser").val(result.NOTE_SUBJECT);
            $("#txtEditUserNameUser").val(result.URL_AVATAR);
        }
    });
}

// Phan Đình Kiên : Tạo báo cáo cho danh sách học viên 
function ExprotParent() {

    var myArray = "";
    $('#ListStudent input[type=checkbox]').each(function () {
        if (this.checked) {
            myArray = myArray + $(this).val() + ":";
        }
    });

    setTimeout(function () {
        $.ajax({
            url: "/Parent/ExportBill",
            data: {
                ListID: myArray
            },
            type: "GET",
            //beforeSend: function () {
            //    $('#loader').show();
            //},
            //complete: function () {
            //    $('#loader').hide();
            //},
            success: function (result) {

            }
        });
    }, 500);


}

// Phan Đình Kiên : cập nhập thông tin của học viên 
function EditParent() {

    var parent_name = $("#txt_Edit_name_parent").val();
    var parent_phone = $("#txt_Edit_phone_parent").val();
    var parent_adress = $("#txt_Edit_address_parent").val();
    var parent_email = $("#txt_Edit_email_parent").val();
    var parent_student_name = $("#txt_Edit_name_student_parent").val();
    var parent_student_shool = $("#txt_Edit_school_student_parent").val();
    var parent_student_birthday = $("#datetimepicker1").val();
    var parent_student_phone = $("#txt_Edit_phone_student_parent").val();
    var parent_student_subject = $("#txt_Edit_node_subject_student_parent").val();
    var parent_student_max1 = $("#txt_Edit_max1_student_parent").val();
    var parent_student_max2 = $("#txt_Edit_max2_student_parent").val();

    if (parent_name == "") {
        swal("Thông báo", "(Bạn cần nhập tên phụ huynh)", "error");
        return;
    }
    else if (parent_phone == "") {
        swal("Thông báo", "(Bạn cần nhập số điện thoại phụ huynh)", "error");
        return;
    }
    else if (parent_adress == "") {
        swal("Thông báo", "(Bạn cần nhập đia chỉ của phụ huynh)", "error");
        return;
    }
    else if (parent_email == "") {
        swal("Thông báo", "(Bạn cần nhập email của phụ huynh)", "error");
        return;
    }
    else if (!validateEmail(parent_email)) {
        swal("Thông báo", "(Địa chỉ mail không hợp lệ)", "error");
        return
    }
    else if (parent_student_name == "") {
        swal("Thông báo", "(Bạn cần nhập tên của học sinh)", "error");
        return;
    }
    else if (parent_student_shool == "") {
        swal("Thông báo", "(Bạn cần nhập trường học của học sinh)", "error");
        return;
    }
    else if (parent_student_birthday == "") {
        swal("Thông báo", "(Bạn cần nhập ngày sinh của học sinh)", "error");
        return;
    }
    else if (parent_student_phone == "") {
        swal("Thông báo", "(Bạn cần nhập số điện thoại của học sinh)", "error");
        return;
    }
    else if (parent_student_subject == "") {
        swal("Thông báo", "(Bạn cần nhập môn học mà học sinh đã đăng ký)", "error");
        return;
    }
    else {
        $.ajax({
            url: "/Parent/Edit",
            data: $("#Form_Edit_Parent").serialize(),
            success: function (result) {


                if (result == 1) {
                    $("#Modal_Add_Parent").hide();
                    swal("Thông Báo!", "Cập nhập thành công", "success");
                    setTimeout(function () {
                        window.location = "/parent/index";
                    }, 1000);

                }
                else if (result == 0) {
                    swal("Thông báo", "(TCập nhập không thành công)", "error");
                    return;
                }
                else if (result == -1) {
                    swal("Thông báo", "(Bạn không có quyền cập nhập thông tin học viên)", "error");
                    return;
                }

                else if (result == -3) {
                    swal("Thông báo", "(Số điện thoại của phụ huynh đã tồn tại trong hệ thống)", "error");
                    return;
                }
                else if (result == -4) {
                    swal("Thông báo", "(tên của học sinh đã tồn tại trong hệ thống )", "error");
                    return;
                }
            }
        });
    }




}

// phan đình kiên : check validate mail 
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Phan đình kiên : reset pass cho học viên 
function ResetPassword_parent() {
    $.ajax({
        url: "/parent/ResetPass",
        data: { ID: $("#txtEditIidParent").val() },
        success: function (result) {
            if (result == "0") {
                $("#Modal_EditPassParent").hide();
                swal("Thông báo", "(reset mật khẩu không thành công)", "error");
            }
            else if (result == '-1') {
                swal("Thông báo", "(Bạn không có quyền reset lại tài khoản)", "error");
            }
            else {
                swal("Thông Báo!", "Reset Thành công mật khẩu của tài khoản là : " + result, "success");
            }
            SeachUser();
        }
    });
}

// phan đình kiên : lấy thông tin học viên cần xóa
var IDDeleteParent = 0;
function ShowFromDeleteParent(Id) {
    IDDeleteParent = Id;
    $("#Modal_Del_Parent").show();
}

// Phan đình Kiên : Tiến hành xóa thông tin của học viên 
function DelParent() {
    $.ajax({
        url: "/Parent/Delete",
        data: { ID: IDDeleteParent },
        success: function (result) {
            if (result == 1) {
                $("#Modal_Del_Parent").hide();
                swal("Thông Báo!", "Xóa thành công tài khoản", "success");
            }
            else if (result == 0) {
                swal("Thông báo", "(Xóa không thành công tài khoản)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền xóa thông tin tài khoản)", "error");
            }
            SeachParent();
        }
    });
}

$(document).ready(function () {

    // Phan Đình Kiên : hiển thị khung đăng nhập tài khoản 
    $("#EditPass").off('click').on('click', function (e) {
        e.preventDefault();
        $("#Modal_Edit_Pass_User").show();
    });

    // Phan đình kiên : điểu hướng sang tran khỏi tạo học sinh 
    $('#btn_add_parent').click(function () {
        window.location = '/parent/create';
    });

    // Phan đình Kiên : add date Parent 
    $("#txt_seach_create_parent").datepicker();

    // Phan Đình Kiên : load Checbox Parent 
    $("#CheckBookAll").click(function () {
        if ($(this).is(":checked")) {
            $(".ParentCheckbox").prop('checked', true);
        }
        else {
            $(".ParentCheckbox").prop('checked', false);
        }
    });



});
//-------------------------------------------------------------------------- Thông tin lớp học -------------------------------------------------------

$(document).ready(function () {
    $('#txt_add_start_date_class').datepicker();
    $('#txt_add_end_date_class').datepicker();
    $('#txt_edit_start_date_class').datepicker();
    $('#txt_edit_end_date_class').datepicker();
    $('#txt_seach_create_class').datepicker();
    UpdateSttEditStudentClass();
    UpdateSttAddStudentClass();

    /// phan đình kiên : auto học sinh để đưa vào clss
    $("#txt_seach_add_student_in_class").autocomplete({

        source: function (s, r) {
            $.ajax({
                url: "/parent/GetComAutoComplete",
                data: { NAME: $("#txt_seach_add_student_in_class").val() },
                success: function (result) {
                    r($.parseJSON(result));
                }
            });
        },

        select: function (a, b) {

            $.ajax({
                url: "/parent/ParentAuto",
                data: { ID: b.item.value },
                success: function (dt) {
                    var Student_ID = dt.ID;
                    var Student_Name = dt.STUDENT_NAME;
                    var parent_Name = dt.PARENT_NAME;
                    var phone = dt.PHONE;
                    $.ajax({
                        url: "/Class/AddSesstionstudentInClass",
                        data: { ID: dt.ID },
                        success: function (data) {

                            if (data == 1) {
                                // tiến hành add thêm một dòng vào cột 
                                $('#data_table_class_student').append('<tr id="data_row_class_student_' + Student_ID + '">  <td></td>  <td> <input type="hidden" value="' + Student_ID + '"/> ' + Student_Name + '</td> <td>' + parent_Name + '</td> <td>' + phone + '</td> <td><input type="text" class="form-control form-control-sm datetimepicker" /></td> <td><input type="text" class="form-control form-control-sm datetimepicker" /></td> <td><input type="number" class="form-control form-control-sm" /></td> <td><input type="text" class="form-control form-control-sm" /></td>  <td><button class="btn btn-danger"> <i class="fa fa-trash-o"></i></button></td></tr>');
                                $('.datetimepicker').datepicker();
                                $('#txt_seach_add_student_in_class').val((dt.STUDENT_NAME + "/" + dt.PHONE).trim());
                                UpdateSttAddStudentClass();
                            }
                            else if (data == -1) {
                                swal("Thông báo", "(học viên đã tồn tại trong lớp học)", "error");
                            }
                            else {
                                swal("Thông báo", "(Thêm mới không thành công)", "error");
                            }
                        }
                    });


                }
            });
        }
    });

    /// phan đình kiên : auto học sinh để đưa vào class
    $("#txt_seach_edit_student_in_class").autocomplete({

        source: function (s, r) {
            $.ajax({
                url: "/parent/GetComAutoComplete",
                data: { NAME: $("#txt_seach_edit_student_in_class").val() },
                success: function (result) {
                    r($.parseJSON(result));
                }
            });
        },

        select: function (a, b) {

            $.ajax({
                url: "/parent/ParentAuto",
                data: { ID: b.item.value },
                success: function (dt) {
                    var Student_ID = dt.ID;
                    var Student_Name = dt.STUDENT_NAME;
                    var parent_Name = dt.PARENT_NAME;
                    var phone = dt.PHONE;
                    $.ajax({
                        url: "/Class/UpdateSesstionstudentInClass",
                        data: { ID: dt.ID },
                        success: function (data) {

                            if (data == 1) {

                                $('#edit_data_table_class_student').append('<tr id="data_row_class_student_' + Student_ID + ' " class="data_row_class_student_edit"><td><input type="hidden" value=""></td><td><input type="hidden" value="' + Student_ID + '" /> ' + Student_Name + ' </td><td>' + parent_Name + '</td><td>' + phone + '</td><td><input type="text" class="form-control form-control-sm datetimepicker" /></td><td><input type="text" class="form-control form-control-sm datetimepicker" /></td> <td><input type="number" class="form-control form-control-sm" /></td><td> <select  class="form-control form-control-sm STUDENT_CLASS_STATUS" id="Edit_option_status_student_in_class_' + Student_ID + '" name="STUDENT_CLASS_STATUS"><option>--lựa chọn--</option><option value="1">Đang học</option><option value="0">Thôi học</option></select></td><td><input type="text" class="form-control form-control-sm" /></td> <td><button class="btn btn-danger"> <i class="fa fa-trash-o"></i></button></td></tr>')
                                $('.datetimepicker').datepicker();
                                $('#txt_seach_edit_student_in_class').val((dt.STUDENT_NAME + "/" + dt.PHONE).trim());
                                UpdateSttEditStudentClass();
                            }
                            else if (data == -1) {
                                swal("Thông báo", "(học viên đã tồn tại trong lớp học)", "error");
                            }
                            else {
                                swal("Thông báo", "(Thêm mới không thành công)", "error");
                            }
                        }
                    });


                }
            });
        }
    });

    //Phan Đình Kiên : xóa dòng trong bảng học viên trong lớp học 
    $('#table_add_student_class tbody').on('click', '.btn', function () {
        $(this).closest('tr').remove();
        UpdateSttAddStudentClass();
    });

    //Phan Đình Kiên : xóa thông tin lịch học 
    $('#table_add_class_schedule tbody').on('click', '.btn', function () {
        var Day = $(this).closest('.data_table_row_class_schedule').find('td:nth-child(1) input').val();
        var RoomID = $(this).closest('.data_table_row_class_schedule').find('td:nth-child(4) input').val();
        var StartTime = $(this).closest('.data_table_row_class_schedule').find('td:nth-child(2)').text();
        var EndTime = $(this).closest('.data_table_row_class_schedule').find('td:nth-child(3)').text();

        $.ajax({
            url: "/Class/DeleteSesstionScheduleinClass",
            data: { Day: Day, RoomID: RoomID, StartTime: StartTime, EndTime: EndTime },
            success: function (result) {
                if (result == 1) {
                    $(this).closest('tr').remove();
                }
                else {
                    swal("Thông báo", "(xóa thông tin không thành công)", "error");
                }
            }
        })

        $(this).closest('tr').remove();
    });

    //Phan Đình Kiên : xóa dòng trong bảng thêm thông tin giáo viên 
    $('#txt_add_table_teacher_class tbody').on('click', '.btn', function () {
        var teacher_id = $(this).closest('.data_row_class_teacher_add').find('td:nth-child(1) input').val();
        var salary_leve = $(this).closest('.data_row_class_teacher_add').find('td:nth-child(2) input').val();
        var start_date = $(this).closest('.data_row_class_teacher_add').find('td:nth-child(3)').text();
        var end_date = $(this).closest('.data_row_class_teacher_add').find('td:nth-child(4)').text();

        $.ajax({
            url: "/Class/DeleteSesstionTeacherInClass",
            data: { TeacherID: teacher_id, SalaryID: salary_leve, StartDate: start_date, EndDate: end_date },
            success: function (result) {
                if (result == 1) {
                    $(this).closest('tr').remove();
                }
                else {
                    swal("Thông báo", "(xóa giáo viên không thành công)", "error");
                }
            }
        })
        $(this).closest('tr').remove();
    });

    // phan đình kiên : xóa dòng trong bảng học sinh 
    $('#table_edit_student_class tbody').on('click', '.btn', function () {
        var student_id = $(this).closest('.data_row_class_student_edit').find('td:nth-child(2) input').val();
        var class_id = $("#txt_edit_Id_class").val();

        $.ajax({
            url: "/Class/DeleteSesstionStudentInClass",
            data: { STUDENT_ID: student_id, CLASS_ID: class_id },
            success: function (result) {
                if (result == 1) {
                    $("#table_edit_student_class tbody").closest('tr').remove();
                    UpdateSttEditStudentClass();
                }
                else {
                    swal("Thông báo", "(xóa học viên không thành công)", "error");
                }
            }
        })
        $(this).closest('tr').remove();

    });

    // phan đình kiên : thêm mới một giáo viên trong class 
    $("#btn_add_teacher_class").click(function () {
        var start_date = $('#txt_add_start_date_class_teacher').val();
        var salary_leve = $("#txt_add_salary_level_in_add_class").val();
        var salary_name = $("#txt_add_salary_level_in_add_class option:selected").text();
        var teacher_id = $("#txt_add_teacher_in_add_class").val();
        var teacher_Name = $("#txt_add_teacher_in_add_class option:selected").text();

        if (teacher_Name.trim() == "--lựa chọn--") {
            // thông báo phải chọn tên giáo viên 
            swal("Thông báo", "(Bạn phải chọn giáo viên giảng dạy)", "error");
        }
        else if (salary_name.trim() == "--lựa chọn--") {
            // thông báo phải chọn bậc lương cho giáo viên 
            swal("Thông báo", "(Bạn phải chọn bậc lương cho giáo viên)", "error");
        }
        else if (start_date == "") {
            // thông báo ngày dạy học không hợp lệ 
            swal("Thông báo", "(Thời gian bắt đầu dạy học của giáo viên không hợp lệ)", "error");
        }
        else {
            $.ajax({
                url: "/Class/AddSesstionTeacherInClass",
                data: { TeacherID: teacher_id, SalaryID: salary_leve, StartDate: start_date, NameTeacher: teacher_Name, SalaryName: salary_name },
                success: function (result) {
                    if (result == 1) {
                        GetAddTeacherInClass();
                    }
                    else {
                        swal("Thông báo", "(Thêm mới giáo viên không thành công)", "error");
                    }
                }
            })

        }

    });

    // phan đình kiên : thêm mới thông tin lịch học 
    $("#btn_add_schedule_class").click(function () {
        var start_time = $('#txt_add_time_start_schedule').val();
        var end_time = $('#txt_add_time_end_schedule').val();
        var day_id = $("#txt_add_day_in_add_class_schedule").val();
        var day_name = $("#txt_add_day_in_add_class_schedule option:selected").text();
        var room_id = $("#txt_add_room_in_add_class_schedule").val();
        var room_Name = $("#txt_add_room_in_add_class_schedule option:selected").text();

        if (day_name.trim() == "--lựa chọn--") {
            // thông báo phải chọn tên giáo viên 
            swal("Thông báo", "(bạn phải chọn ngày học của lớp học )", "error");
        }
        else if (room_Name.trim() == "--lựa chọn--") {
            // thông báo phải chọn bậc lương cho giáo viên 
            swal("Thông báo", "(Bạn phải chọn phòng học của lớp học)", "error");
        }
        else if (start_time >= end_time) {
            // thông báo ngày dạy học không hợp lệ 
            swal("Thông báo", "(Thời gian học không hợp lệ)", "error");
        }
        else {
            $.ajax({
                url: "/Class/AddSesstionScheduleinClass",
                data: { Day: day_id, StartTime: start_time, EndTime: end_time, RoomID: room_id },
                success: function (result) {
                    if (result == 1) {
                        $("#data_table_tbody_class_schedule").append('  <tr class="data_table_row_class_schedule"> <td> <input type="hidden" value="' + day_id + '"/> ' + day_name + ' </td><td> ' + start_time + ' </td><td> ' + end_time + '  </td><td> <input type="hidden" value="' + room_id + '"/> ' + room_Name + ' </td><td> <button class="btn btn-danger"> <i class="fa fa-trash-o"></i></button></td></tr>');
                    }
                    else if (result == -1) {
                        swal("Thông báo", "(thời gian học bị trùng lặp)", "error");
                    }
                    else if (result == -2) {
                        swal("Thông báo", "(Phòng học đã có lớp khác sử dụng)", "error");
                    }
                    else {
                        swal("Thông báo", "(thêm mới lịch học không thành công)", "error");
                    }
                }
            })

        }

    });
});

// Phan Đình Kiên : cập nhập lại danh sách giáo viên trong lớp
function GetAddTeacherInClass() {
    $.ajax({
        url: "/Class/GetAddSesstionTeacherClass",
        success: function (result) {
            $("#data_tbody_class_teacher_add").html(result);
        }
    })
}

// Phan đình kiên : lấy về danh sách học sinh cần thêm 
var checkAddLoadStudent = 0;
function AddListStudentClass() {
    var ListStudentClass = [];
    checkAddLoadStudent = 0;
    $("#data_table_class_student tr").each(function () {


        var Parent_name = $(this).find('td:nth-child(3)').text();
        var Phone = $(this).find('td:nth-child(4)').text();
        var Student_name = $(this).find('td:nth-child(2)').text();
        var Student_Id = $(this).find('td:nth-child(2) input').val();
        var StartDate = $(this).find('td:nth-child(5) input').val();
        var EndDate = $(this).find('td:nth-child(6) input').val();
        var Fee = $(this).find('td:nth-child(7) input').val();
        var Node = $(this).find('td:nth-child(8) input').val();

        if (StartDate.trim() == "") {
            swal("Thông báo", "(bạn phải nhập ngày bắt đầu học của (" + Student_name + "))", "error");
            k = 1;
            return;
        }
        else if (Fee.trim() == "") {
            swal("Thông báo", "(Bạn phải nhập học phí cho học sinh (" + Student_name + "))", "error");
            checkAddLoadStudent = 1;
            return;
        }
        else if (StartDate.trim() != "" && EndDate.trim() != "" && StartDate >= EndDate) {

            swal("Thông báo", "(Ngày kết thúc học của (" + Student_name + ") không hợp lệ)", "error");
            checkAddLoadStudent = 1;
            return;
        }
        else {
            ListStudentClass.push({ STUDENT_ID: Student_Id, START_DATE: StartDate, END_DATE: EndDate, FEE: Fee, NOTE: Node, STUDENT_NAME: Student_name, PARENT_NAME: Parent_name, PHONE: Phone });
        }
    });
    //return JSON.stringify(ListStudentClass); 
    if (checkAddLoadStudent == 0) {
        $.ajax({
            url: "/Class/UpdateListStudentClass",
            data: { ListStudentClass: JSON.stringify(ListStudentClass) },
            success: function (result) {

            }
        })
    }

}

// Phan Đình kiên : thêm mới thông tin lớp học 
function AddClass() {
    AddListStudentClass();
    setTimeout(() => {
        var Add_class_name = $("#txt_add_name_class").val();
        var Add_day_per_week = $("#txt_add_day_per_week_class").val();
        var Add_start_date = $("#txt_add_start_date_class").val();
        var Add_end_date = $("#txt_add_end_date_class").val();
        var Add_branch_id = $("#txt_add_branch_class").val();
        var Add_teacher_id = $("#txt_add_teacher_main_parent").val();

        if (Add_class_name.trim() == "") {
            swal("Thông báo", "bạn cần phải nhập tên của lớp học", "error");
            return;
        }
        else if (Add_class_name.length == 200) {
            swal("Thông báo", "Tên của lớp học có chiều dài vượt quá kích thước quy định", "error");
            return;

        }
        else if (Add_day_per_week == "" || Add_day_per_week == 0) {
            swal("Thông báo", "Bạn cần nhập số lượng buổi học trên tuần", "error");
            return;
        }

        else if (Add_start_date == "") {
            swal("Thông báo", "bạn cần phải nhập ngày bắt đầu của lớp học", "error");
            return;
        }

        else if (Add_end_date == "") {
            swal("Thông báo", "bạn cần phải nhập ngày kết thúc lớp học", "error");
            return;
        }

        else if (Add_start_date != "" && Add_end_date != "" && Add_start_date >= Add_end_date) {

            swal("Thông báo", "ngày bắt đầu và ngày kết thúc lớp học không hợp lệ", "error");
            return;

        }

        else if (Add_branch_id == 0) {
            swal("Thông báo", "bạn cần chọn cơ sở cho lớp học", "error");
            return;
        }

        else if (Add_teacher_id == 0) {
            swal("Thông báo", "Bạn cần chọn giáo viên chủ nhiệm cho lớp học", "error");
            return;
        }
        else {
            $.ajax({
                url: "/Class/Add",
                data: $("#Form_Add_Class").serialize(),
                success: function (result) {
                    if (result == 1) {
                        swal("Thông Báo!", "Thêm mới thành công", "success");
                        setTimeout(function () {
                            window.location = "/Class/index";
                        }, 1000);

                    }
                    else if (result == -1) {
                        swal("Thông báo", "Tên của lớp học đã tồn tại", "error");
                    }
                    else if (result == 0) {
                        swal("Thông báo", "Thêm mới không thành công", "error");
                    }

                }
            })
        }




    }, 0);


}

//phan đình kiên : lấy danh sách học viên 
var CheckListStudent = 0;
function UpdateListStudentClass() {
    CheckListStudent = 0;
    var ListStudentClass = [];

    $("#edit_data_table_class_student tr").each(function () {

        var class_id = $("#txt_edit_Id_class").val();
        var Parent_name = $(this).find('td:nth-child(3)').text();
        var Phone = $(this).find('td:nth-child(4)').text();
        var Student_name = $(this).find('td:nth-child(2)').text();
        var Student_Id = $(this).find('td:nth-child(2) input').val();
        var StartDate = $(this).find('td:nth-child(5) input').val();
        var EndDate = $(this).find('td:nth-child(6) input').val();
        var Fee = $(this).find('td:nth-child(7) input').val();
        var Node = $(this).find('td:nth-child(9) input').val();

        var IdSelectStatus = "#Edit_option_status_student_in_class_" + Student_Id + " option:selected";
        var Status = $(IdSelectStatus).val();
        var status_name = $(IdSelectStatus).text();


        if (StartDate.trim() == "") {
            swal("Thông báo", "(bạn phải nhập ngày bắt đầu học của (" + Student_name + "))", "error");
            CheckListStudent = 1;
            return;
        }
        else if (Fee.trim() == "") {
            swal("Thông báo", "(Bạn phải nhập học phí cho học sinh (" + Student_name + "))", "error");
            CheckListStudent = 1;
            return;
        }

        else if (StartDate.trim() != "" && EndDate.trim() != "") {

            if (StartDate >= EndDate) {
                swal("Thông báo", "(Ngày kết thúc học của (" + Student_name + ") không hợp lệ)", "error");
                CheckListStudent = 1;
                return;
            }
        }

        else if (status_name.trim() == "--lựa chọn--") {
            swal("Thông báo", "(bạn phải chọn trạng thái của học sinh (" + Student_name + "))", "error");
            CheckListStudent = 1;
            return;
        }


        ListStudentClass.push({ STUDENT_ID: Student_Id, START_DATE: StartDate, END_DATE: EndDate, FEE: Fee, NOTE: Node, STUDENT_NAME: Student_name, PARENT_NAME: Parent_name, PHONE: Phone, STATUS: Status });
        return;

    });
    //return JSON.stringify(ListStudentClass); 
    if (CheckListStudent == 0) {
        $.ajax({
            url: "/Class/LoadUpdateListStudentClass",
            data: { ListStudentClass: JSON.stringify(ListStudentClass) },
            success: function (result) {
                checkLoadStudent = result;
            }
        })
    }

}

// Phan Đình kiên : cập nhập danh lại lớp học 
function EditClass(ID) {
    UpdateListStudentClass();
    if (CheckListStudent == 0) {
        setTimeout(() => {

            var edit_class_name = $("#txt_edit_name_class").val();
            var edit_day_per_week = $("#txt_edit_day_per_week_class").val();
            var edit_start_date = $("#txt_edit_start_date_class").val();
            var edit_end_date = $("#txt_edit_end_date_class").val();
            var edit_branch_id = $("#txt_edit_branch_class").val();
            var edit_teacher_id = $("#txt_edit_teacher_main_parent").val();

            if (edit_class_name.trim() == "") {
                swal("Thông báo", "bạn cần phải nhập tên của lớp học", "error");
                return;
            }
            else if (edit_class_name.trim() != "" && edit_class_name.length == 200) {

                swal("Thông báo", "Tên của lớp học có chiều dài vượt quá kích thước quy định", "error");
                return;

            }
            else if (edit_day_per_week == "" || edit_day_per_week == 0) {
                swal("Thông báo", "Bạn cần nhập số lượng buổi học trên tuần", "error");
                return;
            }

            else if (edit_start_date == "") {
                swal("Thông báo", "bạn cần phải nhập ngày bắt đầu của lớp học", "error");
                return;
            }

            else if (edit_end_date == "") {
                swal("Thông báo", "bạn cần phải nhập ngày kết thúc lớp học", "error");
                return;
            }

            else if (edit_start_date != "" && edit_end_date != "" && (edit_start_date >= edit_end_date)) {

                swal("Thông báo", "ngày bắt đầu và ngày kết thúc lớp học không hợp lệ", "error");
                return;

            }

            else if (edit_branch_id == 0) {
                swal("Thông báo", "bạn cần chọn cơ sở cho lớp học", "error");
                return;
            }

            else if (edit_teacher_id == 0) {
                swal("Thông báo", "Bạn cần chọn giáo viên chủ nhiệm cho lớp học", "error");
                return;
            }
            else {
                $.ajax({
                    url: "/Class/Edit",
                    data: $("#Form_edit_Class").serialize(),
                    success: function (result) {
                        if (result == 1) {
                            swal("Thông Báo!", "Cập nhập thành công", "success");
                            setTimeout(function () {
                                window.location = "/Class/index";
                            }, 1000);
                        }
                        else if (result == -1) {
                            swal("Thông báo", "Tên của lớp học đã tồn tại", "error");
                        }
                        else if (result == 0) {
                            swal("Thông báo", "Thêm mới không thành công", "error");
                        }
                    }
                });
            }

        }, 0);

    }


}

// Phan Đình Kiên : Điều hướng sang trang cập nhập thông tin 
function UpdateClass(Id) {
    window.location = '/class/update?id=' + Id;
    GetClassUpdate(Id)
}

// Phan Đình Kiên : Xóa thông tin của lớp học 
var idDeleteClass = null;
function ShowDeleteClass(Id) {
    idDeleteClass = Id;
    $("#Modal_Del_Class").show();
}

// Phan Đình Kiên : Xóa thông tin lớp học 
function DelClass() {
    $.ajax({
        url: "/Class/Delete",
        data: { ID: idDeleteClass },
        success: function (result) {
            if (result == 1) {
                swal("Thông Báo!", "Xóa thành công lớp học", "success");
                $("#Modal_Del_Class").hide();
            }
            else {
                swal("Thông báo", "Xóa không thành công lớp học", "error");
            }
        }
    });
}

// Phan Đình Kiên : Tìm Kiếm thông tin lớp học 
function SeachClass() {
    $.ajax({
        url: "/Class/Seach",
        data: {
            Page: 1,
            NAME: $("#txt_seach_name_class").val(),
            BRANCH_ID: $("#cb_seach_branch_class").val(),
            STATUS: $("#cb_seach_sattus_class").val(),
            START_DATE: $("#txt_seach_create_teacher").val(),
            TUTOR_CLASS: $("#cb_seach_tutor_class").val(),
            TEACHER_NAME: $("#txt_seach_name_Teacher_class").val()
        },
        success: function (result) {
            $("#Table_Class").html(result);
        }
    });
}

// Phan Đình Kiên : Cập nhập lại số thứ tự trong bảng học viên của lớp học (Edit)
function UpdateSttEditStudentClass() {
    var i = 0;
    $("#edit_data_table_class_student tr").each(function () {
        i++;
        $(this).find('td:nth-child(1)').text(i);
    });
}

// phan đình kiên : Cập nhập lại số thứ tự trong bảng học viên của lớp học (Add)
function UpdateSttAddStudentClass() {
    var i = 0;
    $("#data_table_class_student tr").each(function () {
        i++;
        $(this).find('td:nth-child(1)').text(i);
    });
}
//-------------------------------------------------------------------------- Thông tin cơ sở ----------------------------------------------------
// Phan Đình Kiên : get Select Thông tin cơ sở
function GetSelectBranch() {
    $.ajax({
        url: "/Branch/GetAll",
        success: function (result) {
            $.each(result, function (i, result) {
                $('#cmb_seach_Name_Branch').append($('<option>', {
                    value: result.ID,
                    text: result.NAME
                }));

            });
        }
    });
}

// Phan Đình Kiên : Tìm kiếm thông tin cơ sở
function SeachBranch() {
    $.ajax({
        url: "/Branch/Seach",
        data: {
            Page: 1,
            ID: $("#cmb_seach_Name_Branch").val(),
        },
        success: function (result) {
            $("#Table_Branch").html(result);
        }
    });
}

//Phan Đinh Kiên : thêm mới thông tin cơ sở
function AddBranch() {
    $.ajax({
        url: "/Branch/Add",
        data: $("#FormAdd_Branch").serialize(),
        success: function (result) {
            if (result == 1) {
                $("#Modal_Add_Branch").hide();
                $(".modal-backdrop").hide();
                swal("Thông Báo!", "Thêm mới thành công", "success");
                $("#txtAddName").val("");
                $("#txtAddADDRESS").val("");
                $("#txtAddPhone").val("");
            }
            else if (result == -3) {
                swal("Thông báo", "(Cơ sở đã tồn tại)", "error");
            }
            else if (result == 0) {
                swal("Thông báo", "(Thêm mới không thành công)", "error");
            }
            SeachBranch();
        }
    });
}

//Phan Đình Kiên : lấy thông tin cơ sở
function GetBranchById(ID) {
    $.ajax({
        url: "/Branch/GetById",
        data: { ID: ID },
        success: function (result) {
            $("#txtEditIdBranch").val(result.ID);
            $("#txtEditName").val(result.NAME);
            $("#txtEditAddress").val(result.ADDRESS);
            $("#txtEditPhone").val(result.PHONE);
            $("#Modal_Edit_Branch").show();
        }
    });
}

// Phan Đình Kiên : Cập nhập thông tin cơ sở
function EditBranch() {

    $.ajax({
        url: "/Branch/Edit",
        data: $("#Form_EditBranch").serialize(),
        success: function (result) {
            if (result == 1) {
                $("#Modal_Edit_Branch").hide();
                $(".modal-backdrop").hide();
                swal("Thông Báo!", "Cập nhập cơ sở thành công", "success");
            }
            else if (result == 0) {
                swal("Thông báo", "(Cập nhập cơ sở không thành công)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không  có quyền cập nhập cơ sở)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(Bạn không có quyền truy cập vào hệ thống)", "error");
            }
            SeachBranch();
        }
    });
}

// Phan Đình Kiên : Xóa thông tin cơ sở 
var IDDeleteBranch = 0;
function ShowFormDeleteBranch(ID) {
    IDDeleteBranch = ID;
    $("#Modal_Del_Branch").show();
}

// Phan Đình Kiên : xóa thông tin của cơ sở 
function DelBranch() {
    $.ajax({
        url: "/Branch/Delete",
        data: { ID: IDDeleteBranch },
        success: function (result) {
            if (result == 1) {
                $("#Modal_Del_Branch").hide();
                swal("Thông Báo!", "Xóa thành công cơ sở", "success");
            }
            else if (result == 0) {
                swal("Thông báo", "(Xóa không thành công cớ sở)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(bạn không có quyền xóa cơ sở)", "error");
            }
            SeachBranch();
        }
    });
}

// phan đình kiên : cập nhập thông tin của cơ sở
function CloesEditBranch() {
    $("#Modal_Edit_Branch").hide();
}

// phan đình kiên : xóa thông tin của cơ sở
function CloseDeleteBranch() {
    $("#Modal_Del_Branch").hide();
}

//Phan Đinh Kiên : lấy danh sách cơ sở hiển thị lên select 
function LoadSelectBranch() {

    $.ajax({
        url: "/Branch/GetAll",
        success: function (result) {
            $.each(result, function (i, result) {
                $('.Select_branch').append($('<option>', {
                    value: result.ID,
                    text: result.NAME
                }));

            });
        }
    });
}

function LoadSelectClass() {

    $.ajax({
        url: "/Class/GetSelect",
        success: function (result) {
            $.each(result, function (i, result) {
                $('.Select_Class').append($('<option>', {
                    value: result.ID,
                    text: result.NAME
                }));

            });
        }
    });
}

// Phan Đình Kiên : load Thông tin của cở sở
$(document).ready(function () {
    LoadSelectTeacher();
    LoadSelectBranch();
    GetSelectBranch();
    LoadSelectClass();
});


//-------------------------------------------------------------------------- Thoogn tin tin nhắn của phụ huynh ----------------------------------
function OpenReplyMesssenger() {
    window.location = "/Messenger/SentMessenger";
}

//-------------------------------------------------------------------------- Thông tin giáo viên -------------------------------------------------


// phan đình kiên : thêm mới thông tin giáo viên
function AddTeacher() {
    var txt_add_name_teacher = $("#txt_add_name_teacher").val();
    var txt_add_bitthdaty_teacher = $("#txt_add_birthday_teacher").val();
    var txt_add_mail_teacher = $("#txt_add_email_teacher").val();
    var txt_add_address_teaher = $("#txt_add_address_teacher").val();
    var txt_add_personid_teacher = $("#txt_add_personid_teacher").val();
    var txt_add_home_address_teacher = $("#txt_add_home_address_teacher").val();
    var txt_add_phone_teacher = $("#txt_add_phone_teacher").val();
    var txt_add_password_teacher = $("#txt_add_password_teacher").val();
    var txt_seach_subject_id_teacher = $("#txt_add_subject_id_teacher").val();
    var txt_seach_subject_name_teacher = $("#txt_add_subject_id_teacher option:selected").text();
    var txt_seach_sattus_name_teacher = $("#txt_add_sattus_teacher option:selected").text();
    var txt_add_exp_node_teacher = $("#txt_add_exp_node_teacher").val();
    var txt_add_date_contact_teacher = $("#txt_add_date_contact_teacher").val();
    var txt_add_date_trial_teacher = $("#txt_add_date_trial_teacher").val();
    var txt_add_node_teacher_teacher = $("#txt_add_node_teacher_teacher").val();

    setTimeout(function () {
        if (txt_add_name_teacher == "") {
            swal("Thông báo", "(Tên giáo viên không được để trống)", "error");
        }
        else if (txt_add_bitthdaty_teacher == "") {
            swal("Thông báo", "(Ngày sinh cùa giáo viên không được để trống)", "error");
            return;
        }
        else if (!validateEmail(txt_add_mail_teacher)) {
            swal("Thông báo", "(Địa chỉ mail của giáo viên không hợp lệ)", "error");
            return;
        }
        else if (txt_add_address_teaher == "") {
            swal("Thông báo", "(Địa chỉ của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_add_address_teaher == "") {
            swal("Thông báo", "(Địa chỉ của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_add_personid_teacher == "") {
            swal("Thông báo", "(Số chứng minh thư của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_add_phone_teacher == "") {
            swal("Thông báo", "(Số điên thoại của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_add_password_teacher == "" || txt_add_password_teacher < 8) {
            swal("Thông báo", "(độ dài của mật khẩu phải trên 8 ký tự)", "error");
            return;
        }
        else if (txt_seach_subject_name_teacher == "----lựa chọn----") {
            swal("Thông báo", "(Bạn phải chọn môn học cho giáo viên)", "error");
            return;
        }

        else if (txt_seach_sattus_name_teacher == "----lựa chọn----") {
            swal("Thông báo", "(bạn phải chọn trạng thái cho giáo viên)", "error");
            return;
        }

        else if (txt_add_exp_node_teacher == "") {
            swal("Thông báo", "(kinh nghiệm làm việc của giáo viên không được để trống)", "error");
            return;
        }

        else if (txt_add_date_trial_teacher != "" && txt_add_node_teacher_teacher != "" && txt_add_date_trial_teacher > txt_add_node_teacher_teacher) {
            swal("Thông báo", "(ngày thử việc của giáo viên không hợp lệ)", "error");
            return;
        }
        else {
            $.ajax({
                url: "/Teacher/Add",
                data: $("#Form_Add_Teacher").serialize(),
                success: function (result) {
                    if (result == 1) {
                        $("#Modal_Add_Teacher").hide();
                        swal("Thông Báo!", "Thêm mới thành công", "success");
                        setTimeout(function () {
                            window.location = "/teacher/index";
                        }, 1000);
                    }
                    else if (result == 0) {
                        swal("Thông báo", "(Thêm mới không thành công)", "error");
                    }
                    else if (result == -1) {
                        swal("Thông báo", "(Bạn không có quyền thêm mới thông tin ", "error");
                    }
                    else if (result == -3) {
                        swal("Thông báo", "(Số điện thoại của giáo viên đã tồn tại trong hệ thống)", "error");
                    }
                    else if (result == -4) {
                        swal("Thông báo", "(Thời gian thử việc không hợp lệ)", "error");
                    }


                    SeachTeacher();
                }
            });
        }

    }, 0);

}

// Phan Đình Kiên : cập nhập thông tin của giáo viên 
function EditTeacher(page, count) {
    var txt_edit_name_teacher = $("#txt_edit_name_teacher").val();
    var txt_edit_bitthdaty_teacher = $("#txt_edit_birthday_teacher").val();
    var txt_edit_mail_teacher = $("#txt_edit_email_teacher").val();
    var txt_edit_address_teaher = $("#txt_edit_address_teacher").val();
    var txt_edit_personid_teacher = $("#txt_edit_personid_teacher").val();
    var txt_edit_home_address_teacher = $("#txt_edit_home_address_teacher").val();
    var txt_edit_phone_teacher = $("#txt_edit_phone_teacher").val();
    var txt_edit_password_teacher = $("#txt_edit_password_teacher").val();
    var txt_seach_subject_id_teacher = $("#txt_edit_subject_id_teacher").val();
    var txt_seach_subject_name_teacher = $("#txt_edit_subject_id_teacher option:selected").text();
    var txt_seach_sattus_name_teacher = $("#txt_edit_sattus_teacher option:selected").text();
    var txt_edit_exp_node_teacher = $("#txt_edit_exp_node_teacher").val();
    var txt_edit_date_contact_teacher = $("#txt_edit_date_contact_teacher").val();
    var txt_edit_date_trial_teacher = $("#txt_edit_date_trial_teacher").val();
    var txt_edit_node_teacher_teacher = $("#txt_edit_node_teacher_teacher").val();

    setTimeout(function () {
        if (txt_edit_name_teacher == "") {
            swal("Thông báo", "(Tên giáo viên không được để trống)", "error");
        }
        else if (txt_edit_bitthdaty_teacher == "") {
            swal("Thông báo", "(Ngày sinh cùa giáo viên không được để trống)", "error");
            return;
        }
        else if (!validateEmail(txt_edit_mail_teacher)) {
            swal("Thông báo", "(Địa chỉ mail của giáo viên không hợp lệ)", "error");
            return;
        }
        else if (txt_edit_address_teaher == "") {
            swal("Thông báo", "(Địa chỉ của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_edit_address_teaher == "") {
            swal("Thông báo", "(Địa chỉ của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_edit_personid_teacher == "") {
            swal("Thông báo", "(Số chứng minh thư của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_edit_phone_teacher == "") {
            swal("Thông báo", "(Số điên thoại của giáo viên không được để trống)", "error");
            return;
        }
        else if (txt_edit_password_teacher == "" || txt_edit_password_teacher < 8) {
            swal("Thông báo", "(độ dài của mật khẩu phải trên 8 ký tự)", "error");
            return;
        }
        else if (txt_seach_subject_name_teacher == "----lựa chọn----") {
            swal("Thông báo", "(Bạn phải chọn môn học cho giáo viên)", "error");
            return;
        }

        else if (txt_seach_sattus_name_teacher == "----lựa chọn----") {
            swal("Thông báo", "(bạn phải chọn trạng thái cho giáo viên)", "error");
            return;
        }

        else if (txt_edit_exp_node_teacher == "") {
            swal("Thông báo", "(kinh nghiệm làm việc của giáo viên không được để trống)", "error");
            return;
        }

        else if (txt_edit_date_trial_teacher != "" && txt_edit_node_teacher_teacher != "" && txt_edit_date_trial_teacher > txt_edit_node_teacher_teacher) {
            swal("Thông báo", "(ngày thử việc của giáo viên không hợp lệ)", "error");
            return;
        }
        else {
            $.ajax({
                url: "/Teacher/Edit",
                data: $("#Form_Edit_Teacher").serialize(),
                success: function (result) {
                    if (result == 1) {
                        swal("Thông Báo!", "Cập nhập thành công", "success");
                        setTimeout(function () {
                            window.location = "/teacher/ReturnView?page=" + page + "&&count=" + count;
                        }, 1000);
                    }
                    else if (result == 0) {
                        swal("Thông báo", "(Cập nhập không  thành công)", "error");
                    }
                    else if (result == -1) {
                        swal("Thông báo", "(Bạn không có quyền cập nhập thông tin ", "error");
                    }
                    else if (result == -3) {
                        swal("Thông báo", "(Số điện thoại của giáo viên đã tồn tại trong hệ thống)", "error");
                    }
                    else if (result == -4) {
                        swal("Thông báo", "(Thời gian thử việc không hợp lệ)", "error");
                    }
                    SeachTeacher();
                }
            });
        }

    }, 0);

}

//Phan đình kiên : lấy thông tin giáo viên theo id
function GetTeacherById(ID) {
    $.ajax({
        url: "/Teacher/GetById",
        data: { ID: ID },
        success: function (result) {
            $("#txteditNameteacher").val(result.NAME);
            $("#datetimepicker1").val(result.BIRTHDAY);
            $("#txteditteachersexmale").val(result.SEX);
            $("#txteditteachersexfemale").val(result.SEX);
            $("#txteditemailteacher").val(result.EMAIL);
            $("#txteditaddressteacher").val(result.ADDRESS);
            $("#txtedithomeaddressteacher").val(result.HOME_ADDRESS);
            $("#txteditphoneteacher").val(result.PHONE);
            $("#txteditpersonidteacher").val(result.PERSONID_CODE);
            $("#cbeditsubjectteacher").val(result.SUBJECT_ID);
            $("#cbeditsattusteacher").val(result.STATUS);
            $("#datetimepicker2").val(result.DATE_CONTRACT);
            $("#datetimepicker2").val(result.DATE_TRIAL);
            $("#txteditEXPNOTEteacher").val(result.EXP_NOTE);
            $("#Modal_Edit_Teacher").show();
        }
    });
}

// Phan Đình Kiên : Sự kiện chọn giáo viên chính cho lớp học 
function TeacherChangedAddClass(obj) {
    $("#Add_teacher_Class option").removeAttr('selected');
    $("#Add_teacher_Class option[value='" + obj.value + "']").attr('selected', 'selected');
}

//Phan Đinh Kiên : lấy danh sách giáo viên hiển thị lên select
function LoadSelectTeacher() {
    $.ajax({
        url: "/Teacher/GetSelect",
        success: function (result) {
            $.each(result, function (i, result) {
                $('.Select_Teacher').append($('<option>', {
                    value: result.ID,
                    text: result.NAME
                }));
            });
        }
    });
}

// Phan Đình kiên : xóa nhiều giáo viên cùng một lúc 
function DeleteListTeacher() {

    var myArray = "";
    $('#ListTeacher input[type=checkbox]').each(function () {
        if (this.checked) {
            myArray = myArray + $(this).val() + ":";
        }
    });


    $.ajax({
        url: "/Teacher/DeleteList",
        data: {
            ListID: myArray
        },
        success: function (result) {
            if (result == 1) {
                SeachTeacher();
                swal("Thông Báo!", "Xóa thành công danh sách giáo viên", "success");
            }
            if (result == 0) {

                swal("Thông báo", "(Xóa không thành công danh sách giáo viên)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền xóa danh sách giáo viên)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(Bạn cần phải chọn học viên cần xóa)", "error");
            }
        }
    });
}

// Phan Đình Kiên : Tìm kiếm thông tin giáo viên 
function SeachTeacher() {
    var txt_count_list_teacher = $("#txt_count_list_teacher").val();
    var txt_page_list_teacher = $("#txt_count_list_teacher").val();

    if (txt_count_list_teacher == "") {
        txt_count_list_teacher = 10;
    }
    if (txt_page_list_teacher == "") {
        txt_page_list_teacher = 1;
    }

    if (txt_count_list_teacher != "" && txt_page_list_teacher != "") {
        $.ajax({
            url: "/Teacher/Seach",
            data: {
                Page: 1,
                Count: $("#txt_count_list_teacher").val(),
                NAME: $("#txt_seach_name_teacher").val(),
                PHONE: $("#txt_seach_phone_teacher").val(),
                STATUS: $("#cb_seach_sattus_teacher").val(),
                SUBJECT_ID: $("#cb_seach_subject_teacher").val(),
                DATE_CONTRACT: $("#txt_seach_create_teacher").val(),
                DATE_TRIAL: $("#txt_seach_create_end_teacher").val(),
            },
            success: function (result) {
                $("#Table_Teacher").html(result);
                LoadCheckBoxTeacher();
            }
        });
    }
}

// Phan Đình Kiên : Load danh sách check box 
function LoadCheckBoxTeacher() {
    // Phan Đình Kiên : load Checbox Teacher 
    $("#CheckBooTeacherkAll").click(function () {
        if ($(this).is(":checked")) {
            $(".TeacherCheckbox").prop('checked', true);
        }
        else {
            $(".TeacherCheckbox").prop('checked', false);
        }
    });
}

var IDDeleteTeacher;
function ShowFromDeleteTeacher(Id) {
    IDDeleteTeacher = Id;
    $("#Modal_Del_Teacher").show();
}

// Phan đình Kiên : Tiến hành xóa thông tin của học viên 
function DelTeacher() {
    $.ajax({
        url: "/Teacher/Delete",
        data: { ID: IDDeleteTeacher },
        success: function (result) {




            if (result == 1) {

                $("#Modal_Del_Teacher").hide();
                swal("Thông Báo!", "Xóa thành công giáo viên", "success");

                var txt_count_list_teacher = $("#txt_count_list_teacher").val();
                var txt_page_list_teacher = $("#txt_page_list_teacher").val();
                // Tiến hành load lại trang 
                if (txt_count_list_teacher != "" && txt_page_list_teacher != "") {
                    $.ajax({
                        url: "/Teacher/Seach",
                        data: {
                            Page: txt_page_list_teacher,
                            Count: txt_count_list_teacher,
                            NAME: $("#txt_seach_name_teacher").val(),
                            PHONE: $("#txt_seach_phone_teacher").val(),
                            STATUS: $("#cb_seach_sattus_teacher").val(),
                            SUBJECT_ID: $("#cb_seach_subject_teacher").val(),
                            DATE_CONTRACT: $("#txt_seach_create_teacher").val(),
                            DATE_TRIAL: $("#txt_seach_create_end_teacher").val(),
                        },
                        success: function (result) {
                            $("#Table_Teacher").html(result);
                            LoadCheckBoxTeacher();
                        }
                    });
                }

            }
            else if (result == 0) {
                swal("Thông báo", "(Xóa không thành công giáo viên)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền xóa giáo viên)", "error");
            }
            SeachParent();
        }
    });
}

// Phan Đình Kiên : onload thông tin giáo viên 
$(document).ready(function () {

    // Phan Đình Kiên : bắt sự kiện chọn giáo viên 
    $("#txt_count_list_teacher").change(function () {

        $.ajax({
            url: "/Teacher/Seach",
            data: {
                Page: 1,
                Count: $("#txt_count_list_teacher").val(),
                NAME: $("#txt_seach_name_teacher").val(),
                PHONE: $("#txt_seach_phone_teacher").val(),
                STATUS: $("#cb_seach_sattus_teacher").val(),
                SUBJECT_ID: $("#cb_seach_subject_teacher").val(),
                DATE_CONTRACT: $("#txt_seach_create_teacher").val(),
                DATE_TRIAL: $("#txt_seach_create_end_teacher").val(),
            },
            success: function (result) {
                $("#Table_Teacher").html(result);
                LoadCheckBoxTeacher();
            }
        });

    });
    LoadCheckBoxTeacher();
    LoadSelectTeacher();
    LoadSelectSalaryLevel();
    $("#txt_add_start_date_class_teacher").datepicker();
    $("#txt_add_end_date_class_teacher").datepicker();
    $(".datepicker_teacher").datepicker();



});

//-------------------------------------------------------------------------- Thông tin phòng học ------------------------------------------------

// Phan Đình Kiên : lấy thông tin phong học 
function LoadSelectRoomByBranch(obj) {
    if (obj.value == '--lựa chọn--') {
        $('.Select_room').empty();
        $('.Select_room').append('<option>--lựa chọn--</option>');
    }
    else {
        $.ajax({
            url: "/Room/GetSelectByBranch",
            data: { BranchId: obj.value },
            success: function (result) {

                $('.Select_room').empty();


                $.each(result, function (i, result) {
                    //$(".option_room").remove(); 

                    $('.Select_room').append($('<option>', {
                        value: result.ID,
                        text: result.NAME
                    }));
                });

            }

        });
    }

}

// Phan Đình Kiên : load Thông tin phòng học 
$(document).ready(function () {

    $(".time-picker").hunterTimePicker();
    $(".datetimepicker").datepicker();
});

//-------------------------------------------------------------------------- Thông tin giáo viên trong lớp học -----------------------------------
// Phan Đình Kiên : Thêm mới thông tin của giáo viên 
function GetTeacherClass(ID) {
    $.ajax({
        url: "/Class/GetTeacherClass",
        data: { ID: ID },
        success: function (result) {
            $("#data_tbody_class_teacher_edit").html(result);
        }
    })
}

// Phan Đình Kiên : Thêm mới thông tin của giáo viên trong lớp học 
function AddTeacherClass() {
    var class_id = $("#txt_edit_Id_class").val();
    var teacher_id = $("#txt_edit_teacher_in_edit_class").val();
    var teacher_Name = $("#txt_edit_teacher_in_edit_class option:selected").text();
    var start_date = $("#txt_edit_start_date_class_teacher").val();
    var salary_level = $("#txt_edit_salary_level_in_edit_class").val();
    var salary_name = $("#txt_edit_salary_level_in_edit_class option:selected").text();

    if (teacher_Name.trim() == "--lựa chọn--") {
        // thông báo phải chọn tên giáo viên 
        swal("Thông báo", "(Bạn phải chọn giáo viên giảng dạy)", "error");
    }
    else if (salary_name.trim() == "--lựa chọn--") {
        // thông báo phải chọn bậc lương cho giáo viên 
        swal("Thông báo", "(Bạn phải chọn bậc lương cho giáo viên)", "error");
    }
    else if (start_date == "") {
        // thông báo ngày dạy học không hợp lệ 
        swal("Thông báo", "(Thời gian dạy học của giáo viên không hợp lệ)", "error");
    }
    else {
        $.ajax({
            url: "/TeacherClass/Add",
            data: { TEACHER_ID: teacher_id, SALARY_LEVEL_ID: salary_level, START_DATE: start_date, CLASS_ID: class_id },
            success: function (result) {
                if (result == 1) {
                    GetTeacherClass(class_id);
                } else if (result == -1) {
                    swal("Thông báo", "(Hiện tại đang có giáo viên khác đứng lớp)", "error");
                }
                else {
                    swal("Thông báo", "(Thêm mới giáo viên không thành công)", "error");
                }
            }
        })
    }



}

// Phan Đinh Kiên : xóa thông tin giáo viên trong lớp học 
function DeleteTeacherClass(ID) {
    $.ajax({
        url: "/TeacherClass/Delete",
        data: { ID: ID },
        success: function (result) {
            if (result == 1) {
                var class_id = $("#txt_edit_Id_class").val();
                GetTeacherClass(class_id);
            }
            else {
                swal("Thông báo", "(xóa thông tin không thành công)", "error");
            }
        }
    })
}




//-------------------------------------------------------------------------- Thông tin lịch học --------------------------------------------------

// Phan Đình Kiên : Hiển thị danh sách lịch học 
function GetScheduleClass(ID) {
    $.ajax({
        url: "/Class/GetScheduleClass",
        data: { ID: ID },
        success: function (result) {
            $("#edit_data_table_tbody_class_schedule").html(result);
        }
    })
}

// Phan Đình kiên : Thêm mới danh sách Lịch học 
function AddScheduleClass() {
    var class_id = $("#txt_edit_Id_class").val();
    var start_time = $('#txt_edit_time_start_schedule').val();
    var end_time = $('#txt_edit_time_end_schedule').val();
    var day_id = $("#txt_edit_day_in_edit_class_schedule").val();
    var day_name = $("#txt_edit_day_in_edit_class_schedule option:selected").text();
    var room_id = $("#txt_edit_room_in_edit_class_schedule").val();
    var room_Name = $("#txt_edit_room_in_edit_class_schedule option:selected").text();
    if (day_name.trim() == "--lựa chọn--") {
        // thông báo phải chọn tên giáo viên 
        swal("Thông báo", "(bạn phải chọn ngày học của lớp học )", "error");
    }
    else if (room_Name.trim() == "--lựa chọn--") {
        // thông báo phải chọn bậc lương cho giáo viên 
        swal("Thông báo", "(Bạn phải chọn phòng học của lớp học)", "error");
    }
    else if (start_time >= end_time) {
        // thông báo ngày dạy học không hợp lệ 
        swal("Thông báo", "(Thời gian học không hợp lệ)", "error");
    }
    else {
        $.ajax({
            url: "/ScheduleClass/Add",
            data: { ROOM_ID: room_id, DAY: day_id, START_TIME: start_time, END_TIME: end_time, CLASS_ID: class_id },
            success: function (result) {
                if (result == 1) {
                    GetScheduleClass(class_id);
                }
                else if (result == -1) {
                    swal("Thông báo", "(thời gian học bị trùng lặp)", "error");
                }
                else if (result == -2) {
                    swal("Thông báo", "(Phòng học đã có lớp khác sử dụng)", "error");
                }
                else {
                    swal("Thông báo", "(Thêm mới giáo viên không thành công)", "error");
                }
            }
        });
    }
}

// Phan Đình Kiên : Xóa thông tin lịch học 
function DeleteScheduleClass(ID) {
    $.ajax({
        url: "/ScheduleClass/Delete",
        data: { ID: ID },
        success: function (result) {
            if (result == 1) {
                var class_id = $("#txt_edit_Id_class").val();
                GetScheduleClass(class_id);
            }
            else {
                swal("Thông báo", "(xóa thông tin không thành công)", "error");
            }
        }
    })
}


//-------------------------------------------------------------------------- Thông tin bậc lương giáo viên ----------------------------------------

//Phan Đinh Kiên : lấy danh sách bực lương đưa vào select 
function LoadSelectSalaryLevel() {
    $.ajax({
        url: "/SalaryLevel/GetSelect",
        success: function (result) {
            $.each(result, function (i, result) {
                $('.Select_SalaryLevel').append($('<option>', {
                    value: result.ID,
                    text: "Bậc " + result.LEVEL
                }));
            });
        }
    });
}

// Nguyên Sang : Thêm thông tin bậc lương 
function AddSalaryLevel() {
    $.ajax({
        url: "/SalaryLevel/Add",
        data: $("#FormAdd_SalaryLevel").serialize(),
        success: function (result) {
            if (result == 1) {
                $("#Modal_Add_SalaryLevel").hide();
                $(".modal-backdrop").hide();
                swal("Thông Báo!", "Thêm mới thành công", "success");
                $("#txtAddMembersCount").val("");
                $("#txtAddLever").val("");
                $("#txtAddSalary").val("");
            }

            else if (result == 0) {
                swal("Thông báo", "(Thêm mới không thành công)", "error");

            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền thêm mới thông tin bậc lương của giáo viên)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(Thêm không thành công  trùng bậc lương)", "error");
            }
            SeachSalaryLevel();

        }
    });
}

// Sang : Cập nhập thông tin bậc lương 
function EditSalaryLevel() {
    $.ajax({
        url: "/SalaryLevel/Edit",
        data: $("#Form_EditSalaryLevel").serialize(),
        success: function (result) {
            if (result == 1) {
                $("#Modal_Edit_SalaryLevel").hide();
                swal("Thông Báo!", "Cập nhập thành công bậc lương ", "success");
                SeachSalaryLevel();
            }
            else if (result == 0) {
                swal("Thông báo", "(cập nhật không thành công)", "error");

            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền cập nhật thông tin bậc lương của giáo viên)", "error");
            }
            else if (result == -2) {
                swal("Thông báo", "(cập nhật không  công  trùng bậc lương)", "error");
            }

        }
    });
}

// sang : lấy thông tin bâc lương theo id 
function GetSalaryLevelById(ID) {
    $.ajax({
        url: "/SalaryLevel/GetById",
        data: { ID: ID },
        success: function (result) {
            $("#txtEditIdSalaryLevels").val(result.ID);
            $("#txtAddMembersCounts").val(result.MEMBERS_COUNT);
            $("#txtAddLevers").val(result.LEVEL);
            $("#txtAddSalarys").val(result.SALARY);
            $("#Modal_Edit_SalaryLevel").show();
        }
    });

}
var IDDeleteSalaryLevel = 0;

function ShowFromDeleteSalaryLeve(Id) {
    IDDeleteSalaryLevel = Id;
    $("#Modal_Del_SalaryLevel").show();
}
function DelSalaryLeve() {
    $.ajax({
        url: "/SalaryLevel/Delete",
        data: { Id: IDDeleteSalaryLevel },
        success: function (result) {
            if (result == 1) {
                $("#Modal_Del_SalaryLevel").hide();
                swal("Thông Báo!", "Xóa thành công thông tin bậc lương của giáo viên ", "success");
            }
            else if (result == 0) {
                swal("Thông báo", "(Xóa không thành công thông tin bậc lương của giáo viên)", "error");
            }
            else if (result == -1) {
                swal("Thông báo", "(Bạn không có quyền xóa thông tin bậc lương của giáo viên)", "error");
            }
            SeachSalaryLevel()();
        }
    });
}

function CloesEditSalaryLevel() {
    $("#Modal_Edit_SalaryLevel").hide();
}
function CloseDeleteSalaryLevel() {
    $("#Modal_Del_SalaryLevel").hide();
}
function SeachSalaryLevel() {
    $.ajax({
        url: "/SalaryLevel/Seach",
        data: {
            Page: 1
        },
        success: function (result) {
            $("#Table_SalaryLevel").html(result);
        }
    });
}
function SeachConfigTime() {
    $.ajax({
        url: "/SalaryLevel/Seach",
        data: {
            Page: 1
        },
        success: function (result) {
            $("#Table_ConfigTime").html(result);
        }
    });
}

//-------------------------------------------------------------------------- thông tin của môn học ------------------------------------------------

// Phan Đình Kiên : hiển thị thông tin select 
function LoadSelectSubject() {
    $.ajax({
        url: "/Subject/GetSelect",
        success: function (result) {
            $.each(result, function (i, result) {
                $('.Select_subject').append($('<option>', {
                    value: result.ID,
                    text: result.NAME
                }));
            });
        }
    });
}

// Phan Đình Kiên : load Thông tin lớp học 
$(document).ready(function () {

    LoadSelectSubject();

});


//---------------------------------------------------------thông tin cấu hình nghỉ hệ thống---------------------------------
$(document).ready(function () {

    $(".date_configtime").datepicker();

});
//-------------------------------------------------------------------------- Thông tin điểm danh của lớp học ----------------------------------------

// Phan Đình Kiên : Tìm kiếm thông tin giáo viên 
function SeachAbsent() {
    var txt_count_list_absent = $("#txt_count_list_absent").val();
    var txt_page_list_absent = $("#txt_page_list_absent").val();

    if (txt_count_list_absent == "") {
        txt_count_list_absent = 10;
    }
    if (txt_page_list_absent == "") {
        txt_page_list_absent = 1;
    }
    $.ajax({
        url: "/Absent/Seach",
        data: {
            Page: 1,
            Count: txt_count_list_absent,
            BRANCH_ID: $("#txt_seach_barch_id_in_absent").val(),
            CLASS_ID: $("#txt_seach_start_date_in_absent").val(),
            END_DATE: $("#txt_seach_end_date_in_absent").val(),
            START_DATE: $("#txt_seach_start_date_in_absent").val(),
            STATUS: $("#txt_seach_status_in_absent").val(),
            TEACHER_NAME: $("#txt_seach_teacher_in_absent").val(),
        },
        success: function (result) {
            $("#Table_Absent").html(result);
        }
    });

}


var CheckListAbsentDetail;
function UpdateAbsentOfAddmin() {
    var ListAbsentDetaill = [];
    CheckListAbsentDetail = 0;
    $("#list_absent_detail tr").each(function () {

        // lấy thạng id của chi tiết điểm danh 
        var ID = $(this).find('td:nth-child(2) input').val();

        // lấy trạng thái điểm danh 
        var IdSelectStatus = "#txt_add__in_absent_of_add_min_" + ID + " option:selected";
        var Status = $(IdSelectStatus).val();
        ListAbsentDetaill.push({ ID: ID, STATUS: Status });
    });


    setTimeout(() => {
        $.ajax({
            url: "/Absent/EditAbsentOfAdmin",
            data: {
                ID: $("#txt_update_id_absent_by_absent").val(),
                NODE: $("#txt_update_status_in_absent_of_add_min").val(),
                ListAbsentDetail: JSON.stringify(ListAbsentDetaill)
            },
            success: function (result) {

                if (result == -1) {
                    swal("Thông báo", "(Bạn không có quyền cập nhập thông tin điểm danh)", "error");
                }
                else if (result == 1) {
                    swal("Thông Báo!", "Sửa thông tin điểm danh thành công", "success");
                }
                else if (result == 1) {
                    swal("Thông Báo!", "Sửa thông tin điểm danh không thành công", "success");
                }
            }
        });

    }, 100);
}

// Phan Đình Kiên : Cập nhập lại số thứ tự trong bảng học viên của lớp học (Edit)
function UpdateSttEditStudentClass() {
    var i = 0;
    $("#list_absent_detail tr").each(function () {

        $(this).find('td:nth-child(2) input').val;
    });
}


$(document).ready(function () {

    // Phan Đình Kiên : bắt sự kiện chọn giáo viên 
    $("#txt_count_list_absent").change(function () {

        $.ajax({
            url: "/Absent/Seach",
            data: {
                Page: 1,
                Count: $("#txt_count_list_absent").val(),
                BRANCH_ID: $("#txt_seach_barch_id_in_absent").val(),
                CLASS_ID: $("#txt_seach_start_date_in_absent").val(),
                END_DATE: $("#txt_seach_end_date_in_absent").val(),
                START_DATE: $("#txt_seach_start_date_in_absent").val(),
                STATUS: $("#txt_seach_status_in_absent").val(),
                TEACHER_NAME: $("#txt_seach_teacher_in_absent").val(),
            },
            success: function (result) {
                $("#Table_Absent").html(result);
            }
        });

    });
    $(".datepicker_absent").datepicker();

}); 