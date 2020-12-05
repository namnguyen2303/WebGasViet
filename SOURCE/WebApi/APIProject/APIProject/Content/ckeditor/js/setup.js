$(document).ready(function () {
    // data-tables
    
    CKEDITOR.replace("AddContactDescription");
     

    $('#btnSelectLogoImageCategory').click(function () {
        var fider = new CKFinder();
        // khi kích vào ảnh 
        fider.selectActionFunction = function (fileUrl) {
            $('#txtAddLogoCategory').val(fileUrl); 
        }
        fider.popup(); 
    })
});