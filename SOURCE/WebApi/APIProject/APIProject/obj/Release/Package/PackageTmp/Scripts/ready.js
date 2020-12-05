
$(document).ready(function () {

    GetSessionLogin();

    FocusTabMenu();

    $('.date').datepicker({
        dateFormat: "dd/mm/yy"
    });

    $(document).on("wheel", "input[type=number]", function (e) {
        $(this).blur();
    });


}); //end document.ready


//
function FocusTabMenu() {

    var url = window.location.pathname;

    switch (url) {
        case "/Home/Index":
            $('#tabHome').addClass('active');
            break;
        case "/Batch/Index":
            $('#tabBatch').addClass('active');
            break;
        case "/Card/Index":
            $('#tabCard').addClass('active');
            break;
        case "/Item/Index":
            $('#tabItem').addClass('active');
            break;
        case "/Agent/Index":
            $('#tabAgent').addClass('active');
            break;
        case "/Shop/Index":
            $('#tabShop').addClass('active');
            break;
        case "/Order/Index":
            $('#tabOrder').addClass('active');
            break;
        case "/Request/Index":
            $('#tabRequest').addClass('active');
            break;
        case "/Warranty/Index":
            $('#tabWarranty').addClass('active');
            break;
        case "/Point/Index":
            $('#tabPoint').addClass('active');
            break;
        case "/Customer/Index":
            $('#tabCustomer').addClass('active');
            break;
        case "/Message/Chat":
            $('#tabMessage').addClass('active');
            break;
        case "/Config/Index":
            $('#tabConfig').addClass('active');
            break;
        case "/News/Index":
            $('#tabNews').addClass('active');
            break;
        case "/User/Index":
            $('#tabUser').addClass('active');
            break;
        case "/StatisticGift/Index":
            $("#ulStatistic").attr("aria-expanded", "true");
            $("#ulStatistic").addClass("collapse in");
            $('#tabStatistic').addClass('active');
            $('#tabStatisticGift').addClass('active');
            break;
        case "/StatisticPoit/Index":
            $("#ulStatistic").attr("aria-expanded", "true");
            $("#ulStatistic").addClass("collapse in");
            $('#tabStatistic').addClass('active');
            $('#tabStatisticPoit').addClass('active');
            break;
        case "/StatisticRevenue/Index":
            $("#ulStatistic").attr("aria-expanded", "true");
            $("#ulStatistic").addClass("collapse in");
            $('#tabStatistic').addClass('active');
            $('#tabStatisticRevenue').addClass('active');
            break;
        default:
            break;
    }

}


//lấy thông tin đối tượng vừa đăng nhập
function GetSessionLogin() {

    $.ajax({
        url: '/Home/GetUserLogin',
        type: 'GET',
        success: function (response) {
            $("#userNameLogin").text(response.UserName);
            var role = response.Role;
            if (role != 1) {
                $("#tabUser").hide(); 
            }
        },
        error: function (result) {
            console.log(result.responseText);
        }
    });

}