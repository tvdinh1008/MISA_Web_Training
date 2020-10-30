$(document).ready(function () {
    var ref = new Ref(); 
    
});
class Ref extends base {
    constructor() {
        super();
        this.loadData();
        this.InitEventsRef();
        this.ValidateDialogInput();
    }
    InitEventsRef() {
        //sự kiện thêm mới
        $('#dialog').on('click', '.date-picker', this.DatePicker.bind(this));
        $('.toolbar').on('click', 'button.add', this.OpenDialogAdd);
        $('#dialog').on('click', 'button.save', this.SaveRefNew.bind(this));
        $('#dialog').on('click', 'button.save-add', this.SaveAddRefNew.bind(this));
        $('#dialog').on('click', 'button.cancel', this.StatusCancel.bind(this));
        $('#dialogCancel').on('click', 'button.cancel2', this.CloseDialogCancel);
        $('#dialogCancel').on('click', 'button.no', this.CloseDialogAll);
        $('#dialogCancel').on('click', 'button.yes', this.SaveRefNewCancel.bind(this));
        //sự kiện xóa  .hàm này có cả xóa 1 hoặc xóa nhiều
        $('.toolbar').on('click', 'button.delete', this.OpenDialogDelete);
        $('#dialogDelete').on('click', 'button.yes', this.DeleteMultCus.bind(this));
        $('#dialogDelete').on('click', 'button.no', this.CloseDialogDelete);
        //sự kiện tích
        $('.main-table tbody').on('click', 'tr', this.RowOnClick);
        //sự kiện sửa đối tượng
        $('.toolbar').on('click', 'button.edit', this.OpenDialogEdit);
        //sự kiện phân trang
        $('.footer').on('change', 'select.page-size', this.loadData.bind(this));
        $('.footer').on('keyup', 'input.page-index', this.PagingLoadData.bind(this));
        $('.footer').on('click', '.first', this.PageFist.bind(this));
        $('.footer').on('click', '.prev', this.PagePrev.bind(this));
        $('.footer').on('click', '.last', this.PageLast.bind(this));
        $('.footer').on('click', '.next', this.PageNext.bind(this));
        //sự kiện filter-lọc dữ liệu
    }   
    /*
     *hàm xét trạng thái khi đóng dialog bằng cancel
     * Người tạo: Trần Văn Định
     * ngày tạo :25/8/2019
     * */
    StatusCancel() {       
        var me = this;//để sử dụng trong ajax(this đã chuyển về ajax)
       // debugger;
        //nếu dữ liệu trên form đã thay đổi thì hiện ra dialogCancel;
        var sttCancel = true;
        var listIntput = $('#dialog input[property]');       
        if ($('#dialog button.cancel').hasClass('cancel-edit')) {           
            var searchValue = $('tr.tick').data('recordID');
            var searchType = 0;
            $.ajax({
                method: 'GET',
                //url: '/refs/' + 'filtering/' + searchType + '/' + searchValue, 
                url: '/refs/filtering/{0}/{1}'.format(searchType, searchValue),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                //async: false,//bắt buộc phải có ??? do ta mở dialog???
                success: function (res) {
                    if (res.Success) {
                        var ref = res.Data;
                        $.each(listIntput, function (index, item) {
                            var prop = item.getAttribute('property');
                            if (prop === "BirthDay") {
                                var date = ref[0][prop];
                                date = new Date(date);
                                date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                                if (!(item.value === date)) {
                                    sttCancel = false;
                                }
                            }
                            else {
                                if (!(prop === "GrupCus")) {
                                    if (!(item.value === ref[0][prop])) //chú ý ref trả về là 1 mảng
                                    {
                                        sttCancel = false;
                                    }
                                }
                                else {
                                    if (item.value !== "") sttCancel = false;
                                }
                            }
                            
                        });
                        if (sttCancel) {
                           
                            me.CloseDialog();
                        }
                        else {
                           
                            $('#dialogCancel').dialog({
                                modal: true,
                                width: 400,
                                height: 125,
                            });
                            $('#dialogCancel').addClass('openCancel');
                        }                        
                    }
                    else {
                        alert(res.Message);
                    }
                }
            });           
        }
        else {
            $.each(listIntput, function (index, item) {
              
                var prop = item.getAttribute('property');                
                if (prop === "RefNo") {
                    if (!(item.value === "KH000")) {
                        sttCancel = false;                
                    }
                }
                else {
                    if (!(item.value === "")) {
                        sttCancel = false;
                    }
                }
            });
            if (sttCancel) { this.CloseDialog(); }
            else {
                $('#dialogCancel').dialog({
                    modal: true,
                    width: 400,
                    height: 125,
                });
                $('#dialogCancel').addClass('openCancel');
            }
        }
    }

    /**
     * hàm mở dialog cảnh báo khi xóa
     * Người tạo: Trần Văn Định
     * ngày tạo :23/8/2019
     * */
    OpenDialogDelete() {
        $('#dialogDelete').dialog({
            modal: true,
            width: 400,
            height: 125,
        });
        var data = $('#dialogDelete span').text();//hàm lấy dữ liệu từ thẻ span . nếu truyền tham số cho text thì nó là set dữ liệu cho thẻ đó      
        var tickSize = $('.tick').length;
        if (tickSize === 1) {
            $('#dialogDelete span').text(function () {
                /*
                var items = $('tr.select,tr.tick td');
                var dat = $(items).find('td[fieldName]'); //hàm loadData phải gán fieldName vào mỗi td
                $.each(dat, function (index, item) {
                    var fieldName = item.getAttribute('fieldName'); //lấy giá trị của fieldName trong td                  
                            $('#Dialog input[property="' + fieldName + '"]').val($(item).text());
                });
                */
                var ref = $('.main-table tbody tr.tick td[fieldName]');
                var refNo = ref[0].textContent; // ta có thể ko dùng vòng lặp
                var Name = ref[1].textContent;            
                var value = "Bạn có chắc chắn muốn xóa khách hàng" + " <<" + refNo + " - " + Name + ">>" + " không";
                return value;
            })
        }
        else {
            $('#dialogDelete span').text('Bạn có chắc chắn muốn xóa những khách đã chọn không?'); 
        }
    }
    /**
     * hàm xóa nhiều hoặc xóa 1
     * Người tạo: Trần Văn Định
     * ngày tạo :23/8/2019
     * */
    DeleteMultCus() {
        var me = this;
        var listTick = $('.tick');
        var listRecodeID = [];
        $.each(listTick, function (index, item) {
            listRecodeID.push($(item).data('recordID'));
        });
        $.ajax({
            method: 'DELETE', 
            url: '/refs',
            contentType: "application/json; charset=utf-8", //kiểu dữ liệu gửi lên
            data: JSON.stringify(listRecodeID),
            success: function (res) {
                if (res.Success) {
                    me.loadData();
                    $('#dialogDelete').dialog('close');
                } else {
                    alert(res.Message);
                }
            }
        });
        $('button.delete').attr('disabled', 'disabled');
        $('button.edit').attr('disabled', 'disabled');
        $('button.duplicate').attr('disabled', 'disabled');
      //  $('button.view').attr('disabled', 'disabled');
      //  $('button.duplicate').attr('disabled', 'disabled');
    }
    /**
     * hàm mở cửa sổ edit 1 đối tượng ref
     * thêm class save-edit này để phân biệt khi nào lưu thêm mới khi nào lưu edit;
     * mặc định ban đầu chưa có class nào thì nó là add 
     * Người tạo: Trần Văn Định
     * ngày tạo :23/8/2019
     * */
    OpenDialogEdit() {
        $('#dialog').dialog({
            modal: true,
            width: 675,
            height: 330,
        });
        //set lại validate
        $('.error').hide();
        $('input[property]').removeClass('validate-length');
        $('input[property]').removeClass('validate-length-input-name');

        //thêm class này để phân biệt khi nào lưu thêm mới khi nào lưu edit;
        $('#dialog button.save').addClass('save-edit');
        $('#dialog button.cancel').addClass('cancel-edit');
        //có 2 cách : c1 lấy dữ liệu từ cách hàng tr trong html rồi gán giá trị cho các thẻ input tương ứng sử dụng fieldName trog từng td của tr
        //cách 2 : ta lấy recordID(ta gán từ lúc loadData-ứng với RefID của đối tượng ref). ta sẽ sử dụng controller-filter để lọc lấy và trả về đối
        //tượng với iD tương ứng rồi gắn vào các thẻ input trong dialog
        var searchValue = $('.tick').data('recordID');
        var searchType = 0;
        $.ajax({
            method: 'GET',
            //url: '/refs/' + 'filtering/' + searchType + '/' + searchValue, 
            url: '/refs/filtering/{0}/{1}'.format(searchType, searchValue),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
           // async: false,//bắt buộc phải có ??? do ta mở dialog???
            success: function (res) {
                if (res.Success) {
                    var data = res.Data;
                    var listInput = $('#dialog input[property]');
                    $.each(listInput, function (index, item) {
                        var prop = item.getAttribute('property');
                        var value = data[0][prop]; //do ajax trả về là 1 mảng nên ta phải sử dụng đên cả chỉ số mảng . mà edit chỉ trả về 1 phần tử
                        if (prop === "BirthDay") //sửa lại định đạng ngày
                        {
                           // value = new Date(value);
                            //  value = value.formatddMMyyyy();                         
                            var date = new Date(value);
                            value = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                            $('#dialog input[property="BirthDay"]').val(value);                          
                        }

                        $('#dialog input[property="' + prop + '"]').val(value);                   
                    });
                }
                else {
                    alert(res.Message);
                }
            } 
        });
    }
    /**
     * hàm bắt sự kiện khi tick vào 1 ô và bắt sự kiện khi ctrl+left mouse để tích nhiều ô 
     * Người tạo: Trần Văn Định
     * ngày tạo :21/8/2019
     * */
    RowOnClick(event) {        
        $('button.delete').removeAttr('disabled');  
        if (event.ctrlKey) //nếu ta bấm ctrl+left mouse ->ta có thể tick nhiều
        {
            // $('tbody tr').removeClass('tick');
            if ($(this).hasClass('tick')) {
                $(this).removeClass('tick');
            }
            else { $(this).addClass('tick'); }
        }
        else //chỉ có left mouse thì chỉ có tích 1
        {  
            $('button.duplicate').removeAttr('disabled');
            $('button.edit').removeAttr('disabled');
            if ($(this).hasClass('tick')) $('tr').removeClass('tick');
            else {
                $('tr').removeClass('tick');
                $(this).addClass('tick');
            }          
        }
        var refsize = $('.tick').length;
        if (refsize === 0) {
            $('button.delete').attr('disabled', 'disabled');
        }
        if (refsize === 1) {
            $('button.duplicate').removeAttr('disabled');
            $('button.edit').removeAttr('disabled');
        }
        else {
            $('button.duplicate').attr('disabled', 'disabled');
            $('button.edit').attr('disabled', 'disabled');
        }
    }
    /**
     * hàm chức năng thêm mới hoặc sửa nếu bấn "có" ở dialog cancel
     * Người tạo: Trần Văn Định
     * ngày tạo :25/8/2019
     * */
    SaveRefNewCancel() {
        this.CloseDialogCancel();//bắt buộc đóng dialog này trước sau đó mới đóng dialog dưới . nếu ko sẽ lỗi console:Uncaught TypeError: Cannot read property '_focusTabbable' 
        this.SaveRefNew();
        
    }

    /**
     * hàm lưu và mở ô thêm mới khách hàng
     * lưu có 2 TH là thêm mới hoặc lưu chỉnh sửa (đã làm trong hàm SaveRefNew())
     * Người tạo: Trần Văn Định
     * ngày tạo :22/8/2019
     * */
    SaveAddRefNew()
    {
        var me = this;          
        me.SaveRefNew();
        var check = me.CheckError();
        if (check) { me.OpenDialogAdd(); }       
    }
    /**
     * hàm thêm mới 1 khách hàng 
     * hoặc lưu chỉnh sửa khách hàng (nếu click vào sửa ở toolbar-ta sẽ add class save-edit để phân biệt)
     * Người tạo: Trần Văn Định
     * ngày tạo :22/8/2019
     * */
    SaveRefNew() {
        var me = this;
        var checkValidate = me.CheckError();
        if (checkValidate) {
            var object = {};
            var listInput = $('#dialog input[property]');
            $.each(listInput, function (index, item) {
                var property = item.getAttribute('property');
                var value = $(this).val();
                if (property === "BirthDay") {                    
                    var date = $('input[property="BirthDay"]').val();
                    if (!me.isValidDate(date, "MDY")) // chưa validate dc date
                    {
                        var x = new Date();
                        x = (x.getMonth() + 1) + "/" + x.getDate() + "/" + x.getFullYear();
                        value = x;
                    }
                }
                object[property] = value;
            });
            if ($('#dialog button.save').hasClass('save-edit')) {
                var refID = $('tr.tick').data('recordID');
                object["RefID"] = refID;
                $.ajax({
                    method: 'PUT',
                    url: '/refs',
                    contentType: "application/json; charset=utf-8", //kiểu dữ liệu gửi lên
                    data: JSON.stringify(object),
                    async: false,//phải có do ta gọi lại ở hàm SaveAddRefNew()
                    success: function (res) {
                        if (res.Success) {
                            me.CloseDialog();
                            me.loadData();
                        }
                        else {
                            alert(res.Message);
                        }
                    }
                });
                $('#dialog button.save').removeClass('save-edit');
            }
            else {
                object["MembF"] = "có";
                object["Status"] = "không";
                var date = $('input[property="BirthDay"]').val();
                if (!me.isValidDate(date, "MDY")) // chưa validate dc date
                {  
                     var x = new Date();
                    x = (x.getMonth() + 1) + "/" + x.getDate() + "/" + x.getFullYear();
                    object["BirthDay"] = x; 
                }               
                $.ajax({
                    method: 'POST',
                    url: '/refs',
                    contentType: "application/json; charset=utf-8", //kiểu dữ liệu gửi lên
                    data: JSON.stringify(object),
                    async: false,//phải có do ta gọi lại ở hàm SaveAddRefNew()
                    success: function (res) {                      
                        if (res.Success) {
                            me.CloseDialog();
                            me.loadData();
                        }
                        else {
                            alert(res.Message);
                        }
                    }
                });

            }
            //do khi ta save thì nó gọi lại hàm loadData nên sẽ ko còn cái class tick nào ở tr nữa -> ta phải disabled ở các button
            var statusbutton = $('.tick').length;
            if (statusbutton === 0) {
                $('button.delete').attr('disabled', 'disabled');
                $('button.edit').attr('disabled', 'disabled');
                $('button.duplicate').attr('disabled', 'disabled');
            }       
        }
        else {
            if ($('#dialogCancel').hasClass('openCancel')) { me.CloseDialogCancel(); }
           // alert("ban đang nhập sai hoặc thiếu");         
        }
        
       
    }
    /**
     * hàm mở dialog khi ấn vào thêm mới
     * Người tạo: Trần Văn Định
     * ngày tạo :21/8/2019
     * */
    OpenDialogAdd() {
        $('#dialog').dialog({
            modal: true,
            width: 675,
            height: 330,
        });
        //set lại validate
        $('.error').hide();
        $('input[property]').removeClass('validate-length');
        $('input[property]').removeClass('validate-length-input-name');
        //do khi ta chuyển từ edit sang add thì vẫn con class phân biệt(cất & thêm)
        $('#dialog button.save').removeClass('save-edit');
        $('#dialog button.cancel').removeClass('cancel-edit');
        var value = "KH000";
        //reset lại các ô input
        $('#dialog input').val('');
        //thiết lập giá trị mặc định
        $('#dialog input[property="RefNo"]').val(value);
    }
   
    /**
   * Hàm validate :sự kiện blur là khi người dùng thoát khỏi focus trong trường nhập (input).
   * Người tạo: Trần Văn Định
   * ngày tạo :25/8/2019
   * */
    ValidateDialogInput() {
        $('.notification').hide();
        $('input[property="RefNo"]').blur(function () {
            var value = this.value;
            if (!value) {
                $('.error.errRefNo').show();
                $(this).addClass('validate-length');
            }
            else {
                $('.error.errRefNo').hide();
                $(this).removeClass('validate-length');
            }
        });
        $('input[property="Name"]').blur(function () {
            var value = this.value;
            if (!value) {
                $('input[property="Name"]').addClass('validate-length-input-name');
                $('.error.errName').show();
                $(this).addClass('validate-length');
            }
            else {
                $('.error.errName').hide();
                $(this).removeClass('validate-length');
                $('input[property="Name"]').removeClass('validate-length-input-name');
            }
        });
        $('input[property="PhoneNb"]').blur(function () {
            var phone = this.value;
            if (!phone || !$.isNumeric(phone)) {
                $('.error.errPhoneNb').show();
                $(this).addClass('validate-length');
                $('.error.errPhoneNb').hover(function () {
                    $(this).css("cursor", "pointer");
                    $('.notification').show();
                    $('.error.noti-err').show();
                },
                    function () {
                        $(this).css("cursor", "none");
                        $('.notification').hide();
                    })
            }
            else {
                $('.error.errPhoneNb').hide();
                $(this).removeClass('validate-length');

            }
        });
    }

    /**
     * Hàm check xem có lỗi khi sửa hoặc thêm đối tượng nếu ta bấm "cất" hoặc "cất && thêm".
     * Người tạo: Trần Văn Định
     * ngày tạo :25/8/2019
     * */
    CheckError() {
        var check = true;
        var refNo = $('input[property="RefNo"]').val();
        if (!refNo) {
            $('.error.errRefNo').show();
            $('input[property="RefNo"]').addClass('validate-length');
            check = false;
        }
        var name = $('input[property="Name"]').val();
        if (!name) {
            $('input[property="Name"]').addClass('validate-length-input-name');
            $('.error.errName').show();
            $('input[property="Name"').addClass('validate-length');
            check = false;
        }
        var phone = $('input[property="PhoneNb"]').val();
        if (!phone || !$.isNumeric(phone) || $('input[property="PhoneNb"]').hasClass('validate-length')) {
            $('.error.errPhoneNb').show();
            $('input[property="PhoneNb"]').addClass('validate-length');
            $('.error.errPhoneNb').hover(function () {
                $(this).css("cursor", "pointer");
                $('.notification').show();
                $('.error.noti-err').show();
            },
                function () {
                    $(this).css("cursor", "none");
                    $('.notification').hide();
                });
            check = false;
        }
        //hiện tại chưa validate đc ngày
        //var me = this;
        //var date = $('input[property="BirthDay"]').val();
        //if (!me.isValidDate(date, "MDY")) // chưa validate dc date
        //{  
        //    var x = new Date();
        //    x = (x.getMonth() + 1) + "/" + x.getDate() + "/" + x.getFullYear();
        //    $('input[property="BirthDay"]').val(x);            
        //}
        return check;
        
    }

    CloseDialog() {
        $('#dialog').dialog('close');
    }
    CloseDialogDelete() {
        $('#dialogDelete').dialog('close');
    }
    CloseDialogCancel() {
        $('#dialogCancel').dialog('close');
    }
    CloseDialogAll() {
        $('#dialogCancel').dialog('close');
        $('#dialog').dialog('close');
    }
    /**
    * Hàm phân trang
    * Người tạo: Trần Văn Định
    * ngày tạo :24/8/2019
    * 
    */
    PagingLoadData(event) {
        var me = this;
        if (event.keyCode === 13) {
            var pageIndex = $('.footer input.page-index').val();
            var pageSize = $('.footer select.page-size').val();
            if ($.isNumeric(pageIndex)) //nếu nhập vào là số
            {
                $('.footer input.page-index').removeClass('validate-length');
                var listRef = me.GetData().length;
                if (listRef <= pageSize || pageIndex < 1) {
                    $('.footer input.page-index').val(1);
                }
                else {
                    var k = parseInt((listRef / pageSize));
                    if (k === 0) {
                        k = 1;
                    }
                    else {
                        if (parseInt((listRef / pageSize)) !== (listRef / pageSize)) {                          
                            k = parseInt((listRef / pageSize)) + 1;
                        }
                    }                 
                    if (pageIndex > k) {
                        $('.footer input.page-index').val(k);
                    }
                }
                me.loadData();
            }
            else {
                alert("Bạn nhập không phải là số !!");
                $('.footer input.page-index').addClass('validate-length');
            }
        }
    }
    /**
     * hàm trở về trang đầu tiên*/
    PageFist() {
        $('.footer input.page-index').val(1);
        this.loadData();
    }
    /**
     * hàm lui trang về 1 bước*/
    PagePrev() {
        var x = parseInt($('.footer input.page-index').val());
        x = x - 1;
        $('.footer input.page-index').val(x);
        this.loadData();
    }
    /**
     * hàm tiến lên 1 trang*/
    PageNext() {     
        var x = parseInt($('.footer input.page-index').val());
        x = x + 1;
        $('.footer input.page-index').val(x);
        this.loadData();
    }
    /**
     * hàm đến trang cuối cùng*/
    PageLast() {
        var last = $('.footer span.sumPage').text();
        $('.footer input.page-index').val(last);
        this.loadData();
    }
    /**
     * Hàm xét trạng thái disabled của các nút
     * Người tạo: Trần Văn Định
     * ngày tạo :24/8/2019
     * */
    StatusPage() {      
        var pageIndex = parseInt($('.footer input.page-index').val());
        var pageSize = parseInt($('.footer select.page-size').val());
        var k = this.GetData().length;
        var sumpage = parseInt(k / pageSize);
        if (sumpage === 0) {
            sumpage = 1;
        }
        else {
            if (parseInt((k / pageSize)) !== (k / pageSize)) {               
                sumpage = parseInt((k / pageSize)) + 1;
            }
        }
        if (sumpage < pageIndex) {
            pageIndex = 1;
            $('.footer input.page-index').val(1);
        }
        $('.footer span.sumPage').text(sumpage);       
        if (pageIndex === 1 && sumpage === 1) {
            $('.first').attr('disabled', 'disabled');
            $('.prev').attr('disabled', 'disabled');
            $('.last').attr('disabled', 'disabled');
            $('.next').attr('disabled', 'disabled');
        }
        else {
            if (pageIndex === 1) {
                $('.first').attr('disabled', 'disabled');
                $('.prev').attr('disabled', 'disabled');
                $('.last').removeAttr('disabled');
                $('.next').removeAttr('disabled');
            }
            else {
                $('.first').removeAttr('disabled');
                $('.prev').removeAttr('disabled');
                if (pageIndex === sumpage) {
                    $('.last').attr('disabled', 'disabled');
                    $('.next').attr('disabled', 'disabled');
                }
                else {
                    $('.last').removeAttr('disabled');
                    $('.next').removeAttr('disabled');
                }
            }
        }
    }   
    /**
     *hàm kiểm tra định dạng date
     * Người tạo: Trần Văn Định
     * ngày tạo :25/8/2019
     */
    isValidDate(dateStr, format) // dateStr:chuỗi cần ktra, format :là định dạng ngày tháng cần kiểm tra (MDY hoặc DMY)
    {
        if (format == null) {
            format = "MDY";
        }
        format = format.toUpperCase();
        if (format.length != 3) {
            format = "MDY";
        }
        if ((format.indexOf("M") == -1) || (format.indexOf("D") == -1) ||
            (format.indexOf("Y") == -1)) {
            format = "MDY";
        }
        if (format.substring(0, 1) == "Y") { // If the year is first
            var reg1 = /^\d{2}(\-|\/)\d{1,2}\1\d{1,2}$/
            var reg2 = /^\d{4}(\-|\/)\d{1,2}\1\d{1,2}$/
        } else if (format.substring(1, 2) == "Y") { // If the year is second
            var reg1 = /^\d{1,2}(\-|\/)\d{2}\1\d{1,2}$/
            var reg2 = /^\d{1,2}(\-|\/)\d{4}\1\d{1,2}$/
        } else { // The year must be third
            // Tan :: Start : if 'd-m-Y' is invalid format (only remove -)
            var reg1 = /^\d{1,2}(\/)\d{1,2}\1\d{2}$/
            var reg2 = /^\d{1,2}(\/)\d{1,2}\1\d{4}$/
            // Tan :: End
        }

        // If it doesn't conform to the right format (with either a 2 digit year or 4 digit year), fail
        if ((reg1.test(dateStr) == false) && (reg2.test(dateStr) == false)) {
            return false;
        }
        var parts = dateStr.split(RegExp.$1); // Split into 3 parts based on what the divider was
        // Check to see if the 3 parts end up making a valid date
        if (format.substring(0, 1) == "M") {
            var mm = parts[0];
        }
        else if (format.substring(1, 2) == "M") {
            var mm = parts[1];
        }
        else {
            var mm = parts[2];
        }
        if (format.substring(0, 1) == "D") {
            var dd = parts[0];
        }
        else if (format.substring(1, 2) == "D") {
            var dd = parts[1];
        }
        else {
            var dd = parts[2];
        }

        if (format.substring(0, 1) == "Y") {
            var yy = parts[0];
        }
        else
            if (format.substring(1, 2) == "Y") {
                var yy = parts[1];
            }
            else {
                var yy = parts[2];
            }
        if (parseFloat(yy) <= 50) {
            yy = (parseFloat(yy) + 2000).toString();
        }
        if (parseFloat(yy) <= 99) {
            yy = (parseFloat(yy) + 1900).toString();
        }
        var dt = new Date(parseFloat(yy), parseFloat(mm) - 1, parseFloat(dd), 0, 0, 0, 0);
        if (parseFloat(dd) != dt.getDate()) {
            return false;
        }
        if (parseFloat(mm) - 1 != dt.getMonth()) {
            return false;
        }

        return true;
    }
    /**
     * hàm hiển thị date-picker
     * Người tạo: Trần Văn Định
     * ngày tạo :25/8/2019
     * */
    DatePicker() {
        //var k = this;
        var me = $('.date-picker').siblings('.birthday-input')
        me.datepicker({ dateFormat: 'mm/dd/yy' });
        me.focus();
        //me.blur(function () {
        //    var birthDay = this.value;
        //    if (!(k.isValidDate(birthDay, "MDY"))) {
        //        $('.error.BirthDay').show();
        //        $(this).addClass('validate-length');
        //    }
        //    else {
        //        $('.error.BirthDay').hide();
        //        $(this).removeClass('validate-length');
        //    }
        //});
        
       
    }
    RemoveClassError() {
        debugger;
        $('.error.BirthDay').hide();
        $('input[property="BirthDay"]').removeClass('validate-length');
    }
    /**
     * gắn lại disabled cho các button vì nếu ban đầu là null thì khi load lại nó vẫn là null
     * Người tạo: Trần Văn Định
     * ngày tạo :26/8/2019
     * */
    setStatusButton() {
        $('button.delete').attr('disabled', 'disabled');
        $('button.edit').attr('disabled', 'disabled');
        $('button.duplicate').attr('disabled', 'disabled');
      //  $('button.view').attr('disabled', 'disabled');
      //  $('button.duplicate').attr('disabled', 'disabled');
    }
    loadData() {     
        this.StatusPage();
        super.loadData();
        this.setStatusButton();
        
    }
}