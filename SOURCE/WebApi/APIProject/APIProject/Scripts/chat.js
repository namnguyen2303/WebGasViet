
$(document).ready(function () {
    var storage = firebase.storage();
    var database = firebase.database();
    var root = "tich_diem/";

    var USER_LOGIN_ID;
    var imageURL;
    var lastSelectedPhone;
    //CKEDITOR.replace('editor', { height: 300 });

    //lấy user login
    $.ajax({
        url: '/Home/GetUserLogin',
        type: 'GET',
        success: function (response) {

            USER_LOGIN_ID = response.UserID;
            USER_LOGIN_NAME = response.UserName;
            initListenerLastMessage(USER_LOGIN_ID);
        },
        error: function (result, status, err) {
            console.log(result.responseText);
            console.log(status.responseText);
            console.log(err.Message);
        }
    });

    //event listener last message
    function initListenerLastMessage(id) {
        var count=0;
        database.ref(root).orderByChild('last_message/timestamp').limitToLast(1000).on('value', function (snapshot) {
            $('.list-unstyled').empty();

            snapshot.forEach(function (childSnapshot) {
                count++;
                var phone = childSnapshot.key;
                var childLastMess = childSnapshot.val().last_message;
                var user = childLastMess.user;
                var avatar = childLastMess.user.urlAvatar;
                var isRead = childLastMess.isRead;
                var image;
                var time = timeConverter(childLastMess.timestamp); //bỏ dấu -
                var date = dateConverter(childLastMess.timestamp); //bỏ dấu -
                if (count == 1) {
                   // initMessage(phone, id, 1);
                }
                var idLastMsg = childLastMess.user._id; //id người chat cuối
                var text = childLastMess.text;

                if (text.length > 25) {
                    text = text.substr(0, 25) + '...';
                }

                //nếu tin nhắn cuối gửi ảnh
                if (childLastMess.image != null) {
                    var image = childLastMess.image;
                    text = "Đã gửi 1 ảnh.";
                }

                //nếu là người chat cuối
                if (user.name == "Admin") {
                    text = "Bạn: " + text;
                }
                var html = '<li  idUser="' + phone + '" idAdmin="' + id + '">';

                if (isRead == 0) {
                    html = html + '<div class="message-count"> 1 </div>';
                }
                html = html +
                    '<img alt="" class="img-circle medium-image float-left avartar-img"  src="' + avatar + '">' +
                    '<div class="vcentered info-combo">' +
                        '<h3 class="no-margin-bottom name';
                if (isRead == 0) {
                    html = html + " font-weight-bold";
                }
                html = html + '"> ' + user.name + ' </h3>' +
                '<h5>' + text + '</h5>' +
                '</div>' +
                '<div class="contacts-add">' +
                    '<span class="message-time">' + time + '</span>' +
                    ' <sup class="ml-2">' + date + '</sup>' +

                '</div>' +
                '</li>';

                $('.list-unstyled').html(html + $('.list-unstyled').html());

                //cập nhật giao diện
                $('#div_last_msg').append('<div class="col-md-12 px-0 item_last_msg" style="cursor: pointer" idUser="' + phone + '" idAdmin="' + id + '">' +
                    '<a class="text-dark" style="cursor: pointer">' + phone + '</a><br/>' +
                    '<p>' + text + '</p>' +
                    '<p>' + time + '</p></div>');

            });

            //đánh dấu lại người đang chat
            $('#div_last_msg a').each(function () {
                var row = $(this);
                var phone = row.text();
                if (phone == lastSelectedPhone) {
                    $(this).closest("div .item_last_msg").addClass('bg-selected-last-msg');
                }
            })

        })
    }

    //listener message
    function initMessage(phone, id,type) {
        //giao diện
        $("#user-title").html(phone);

        $('#chatContent').height('300');
        var last_message = database.ref(root + phone + "/last_message/");
        if (type == 0) {
            database.ref().child(root + phone + "/last_message/").update({ isRead: 1 });
        }
        database.ref(root + phone + "/message/").on('value', function (snapshot) {
            $('.chat-body').empty();

            snapshot.forEach(function (childSnapshot) {
                var image = childSnapshot.val().image;
                var time = timeMessageConverter(childSnapshot.val().timestamp);
                var idLastMsg = childSnapshot.val().user._id; //id người chat cuối
                var userName = childSnapshot.val().user.name;
                var avatar = childSnapshot.val().user.urlAvatar;

                var text = childSnapshot.val().text;
                updateUI(image, text, time, userName, avatar);

            });

        })
    }

    

    //hàm gửi tin nhắn
    function sendMessage() {
        var receiverId = $('#user-title').text();
        var text = $('.send-message-text').val().trim();
        var timestamp = Math.floor(Date.now());
        if (receiverId == '')  //chưa chọn người chat
        {
            swal("Thông báo","Vui lòng chọn khách hàng để gửi tin nhắn","warning");
            return;
        }

        //gửi ảnh (nếu người dùng gửi cả ảnh và tn, sẽ xử lý ở trong hàm này luôn)
        if (imageURL != null) {
            // lưu ảnh vào thư mục Dekko/images. tên ảnh là timestamp
            var uploadTask = storage.ref('Dekko/images').child(timestamp + '').putString(imageURL, 'data_url');
            //var uploadTask = storage.ref(receiverId).child(getRandomImageName(9)).putString(imageURL, 'data_url');
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                alert(error.code);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    sendTextMessage(receiverId, text, timestamp, downloadURL);
                });

            });
            return;
        }

        //chỉ gửi tn text
        if (text.length > 0) {
            sendTextMessage(receiverId, text, timestamp, null);
        }

        //Thuc hien gui thong bao
        $.ajax({
            url: "/api/Service/PushNotifyByPhone",
            data: { Phone: receiverId, Content: text },
            success: function () {

            }
        });

    }

    //gửi tin nhắn text
    function sendTextMessage(receiverId, text, timestamp, image) {
        clearChat();
        //dữ liệu cho tn trong content chat
        var messageData = {
            text: text,
            timestamp: timestamp,
            image: image
        }

        //dữ liệu cho tn bên cột last mess, đảo ngược timestamp để khi lấy về sắp xếp theo thứ tự
        var lastMessageData = {
            isRead: 1,
            text: text,
            timestamp: timestamp,
            image: image
        }

        database.ref().child(root + receiverId + "/last_message/").update({ isRead: 1, text: "Bạn: "+text, timestamp: timestamp });

        var userData = {
            _id: USER_LOGIN_ID,
            name: "Admin",
            phone: receiverId,
            urlAvatar: "https://profilepicturesdp.com/wp-content/uploads/2018/07/yellow-profile-pictures.png"
        }


        var updatesMsg = {}; /* update data cho child message */
        var updatesLastMsg = {}; /* update data cho child last_message */

        updatesMsg = messageData;
        updatesMsg['/user/'] = userData;

        updatesLastMsg = lastMessageData;
        updatesLastMsg['/user/'] = userData;

        database.ref(root + receiverId + "/message/").push().update(updatesMsg);
        //database.ref(root + receiverId + "/last_message/").update(updatesLastMsg);
    }

    //cập nhật giao diện chat isSender : check là người gửi hay nhận
    function updateUI(image, text, time, userName, avartar) {
        var imageHTML = '', textHTML = '', sender = "";
        var pad = "row pl-md-3 pl-sm-2 pl-5";
        var style = "bg-light";

        if (image != "" && image != undefined) {
            imageHTML = '<a href=' + image + ' target="_blank"><img id="imgNews" src="' + image + '" class="img-message" alt="your image" /></a>';
        }

        if (userName == 'Admin') {

            textHTML =
               '<div class="message my-message">' +
                //'<img alt="" class="img-circle medium-image" src="' + avartar + '">' +
                '<div class="message-body">' +
                '<div class="message-body-inner">' +
                //'<div class="message-info">' +
                //'<h4>' + userName + '</h4>' +
                //'<h5> <i class="fa fa-clock-o"></i> ' + time + ' </h5>' +
                //'</div>' +
                //'<hr>' +
                '<div class="message-text">' +
                text + imageHTML+
                '</div>' +
                '</div>' +
                '</div>' +
                '<span class="timeChat" style="float: right">' + time + '</span>' +
                '<br>' +
                '</div>';
        } else {
            $("#user-name").html(userName);
            textHTML = '<div class="message info">' +
                '<img alt="" class="img-circle medium-image" src="' + avartar + '">' +
                '<div class="message-body">' +
                //'<div class="message-info">' +
                //'<h4>' + userName + ' </h4>' +
                //'<h5> <i class="fa fa-clock-o"></i> ' + time + ' </h5>' +
                //'</div>' +
                //'<hr>' +
                '<div class="message-text">' + text + imageHTML+
                '</div>' +
                '</div>' +
                '<span class="timeChat" style="float: left">' + time + '</span>' +
                '<br>' +
                '</div>';

        }
        $('.chat-body').first().append(textHTML);

        //tự scroll nếu có chat mới
        $(".chat-body").scrollTop($(".chat-body")[0].scrollHeight);
    }

    //clear chat sau khi gửi 1 tin nhắn
    function clearChat() {
        $('#txtMessage').val("");
        $("#imgNews").addClass("hide");
        $('#ic_remove').addClass("hide");
        imageURL = null;
    }

    //search last message
    $("#inp_search").on("keyup paste", function () {
        var key = "^" + $(this).val();
        $('#div_last_msg a').each(function () {
            var row = $(this);
            var phone = row.text();
            if (phone.match(key)) {
                row.closest("div .item_last_msg").show();
            } else {
                row.closest("div .item_last_msg").hide();
            }
        })
    });

    //xoa toan bo anh
    $('#btn_del_img').click(function () {
        storage.ref().delete().then(function () {
            alert("Thành công");
        }, function (error) {
            alert(error.code);
        });

    });

    /*============= xử lý chọn ảnh */
    $("#imgInp").change(function () {
        var inp = this;

        var file = this.files[0];
        var fileType = file["type"];
        var ValidImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if ($.inArray(fileType, ValidImageTypes) < 0) {
            swal({
                title: "",
                text: "Image not valid.",
                icon: "warning"
            });
            $("#imgInp").val('');
        } else {
            readURL(inp);
        }

    })

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
               

                imageURL = e.target.result;

                sendMessage();
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    //xóa ảnh được chọn trên khung chat
    $('#ic_remove').click(function () {
        $("#imgNews").addClass("hide");
        $('#ic_remove').addClass("hide");
        imageURL = null;
    })


    //sự kiện click vào từng last message
    $("body").delegate(".contacts li", "click", function () {
        $(".contacts .active").removeClass("active");
        $(this).addClass("active");
        initMessage($(this).attr('idUser'), $(this).attr('idAdmin'), 0);
        lastSelectedPhone = $(this).attr('idUser'); //lưu lại người đang chat

        $('#div_last_msg .item_last_msg').each(function () {
            $(this).removeClass("bg-selected-last-msg");
        })

        $(this).addClass('bg-selected-last-msg');
    });

    //sự kiện gửi tin nhắn
    $('.send-message-button').click(function () {
        sendMessage();
        $('.send-message-text').val("");
    })

    // enter để gửi tin nhắn
    $('.send-message-text').keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            sendMessage();
            $('.send-message-text').val('');
        }
    });


});

function timeMessageConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var timeMessage = date + '/' + month + '/' + year + '\n' + hour + ':' + min;
    return timeMessage;
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = hour + ':' + min;
    return time;
}

function dateConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = date + '/' + month + '/' + year;
    return time;
}

function getRandomImageName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


