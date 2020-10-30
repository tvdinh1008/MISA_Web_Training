$(document).ready(function () {
});
class base {
    constructor() {
        //this.loadData();
       //this.setFooter();
    }
    /*
    loadData() {
        var fields = $('.main-table th[fieldName]');
        
        $('.main-table tbody').empty();
        
        $.ajax({
            method: 'GET',
            url: '/refs',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            
            success: function (res) {
                if (res.Success) {
                    var d = res.Data;
                    
                    $.each(res.Data, function (index, item) {
                        var rowHTML = $('<tr></tr>').data("recordID", item["RefID"]);
                        $.each(fields, function (fieldIndex, fieldItem) {
                            var fieldName = fieldItem.getAttribute('fieldName');
                            var value = item[fieldName];
                            var cls = 'text-left';
                            if (fieldName === "RefDate") {
                                value = new Date(value);
                            }
                            var type = $.type(value); //gan type=kieu du lieu cua value
                            //
                            if (fieldName === "PhoneNb") cls = 'text-center';
                            switch (type) {
                                case "date": value = value.formatddMMyyyy();
                                    cls = 'text-center';
                                    break;
                                case "number": value = value.formatMoney();
                                    cls = 'text-right';
                                    break;                               
                            }
                            if (fieldName === "MembF") {
                                if (value === "không")
                                    cls = 'uncheck';
                                else
                                    cls = 'checkbox';

                                rowHTML.append('<td fieldName="{1}" class="{0}"></td>'.format(cls, fieldName));
                            }
                            else if (fieldName === "Status") {
                                if (value === "không")
                                    cls = 'uncheck';
                                else
                                    cls = 'checkbox';
                                rowHTML.append('<td fieldName="{1}" class="{0}"></td>'.format(cls, fieldName));
                            }
                            else {                    
                                //if (value === null) rowHTML.append('<td fieldName="{0}"></td>'.format(fieldName));
                                //else
                                    rowHTML.append('<td fieldName="{2}" class="{1}">{0}</td>'.format(value, cls, fieldName));
                            }
                        });
                        $('.main-table tbody').append(rowHTML);
                    });
                }
                else {
                    alert(res.Message);
                }
            }
        });
    }
    */
    loadData() {
        var pageIndex = $('.footer input.page-index').val();
        var pageSize = $('.footer select.page-size option:selected').val();
        if (!$('.footer input.page-index').val()) { pageIndex = 1; $('.footer input.page-index').val(pageIndex); }
        var fields = $('.main-table th[fieldName]');
        $('.main-table tbody').empty();        
        $.ajax({
            method: 'GET',
            url: '/refs/' + pageIndex + '/' + pageSize,
            beforeSend: function () //ham chạy con quay
            {
                $('#loaddata').show();//hiện con quay

            },     
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.Success) {
                    //debugger;
                    $.each(res.Data, function (index, item) {
                        var rowHTML = $('<tr></tr>').data("recordID", item["RefID"]);
                        $.each(fields, function (fieldIndex, fieldItem) {
                            var fieldName = fieldItem.getAttribute('fieldName');
                            var value = item[fieldName];
                            var cls = 'text-left';
                            if (fieldName === "RefDate") {
                                value = new Date(value);
                            }
                            var type = $.type(value); //gan type=kieu du lieu cua value
                            //
                            if (fieldName === "PhoneNb") cls = 'text-center';
                            switch (type) {
                                case "date": value = value.formatddMMyyyy();
                                    cls = 'text-center';
                                    break;
                                case "number": value = value.formatMoney();
                                    cls = 'text-right';
                                    break;
                            }
                            if (fieldName === "MembF") {
                                if (value === "không")
                                    cls = 'uncheck';
                                else
                                    cls = 'checkbox';

                                rowHTML.append('<td fieldName="{1}" class="{0}"></td>'.format(cls, fieldName));
                            }
                            else if (fieldName === "Status") {
                                if (value === "không")
                                    cls = 'uncheck';
                                else
                                    cls = 'checkbox';
                                rowHTML.append('<td fieldName="{1}" class="{0}"></td>'.format(cls, fieldName));
                            }
                            else {
                                if (value === null) rowHTML.append('<td fieldName="{0}"></td>'.format(fieldName));
                                else
                                rowHTML.append('<td fieldName="{2}" class="{1}">{0}</td>'.format(value, cls, fieldName));
                            }
                        });
                        $('.main-table tbody').append(rowHTML);
                    });
                    //setTimeout(function () {
                    //    $('#loaddata').hide(); // ẩn con quay
                    //}, 2000);// đúng sau 2s mới ẩn con quay . có cách khác là làm trên controller
                    $('#loaddata').hide(); // ẩn con quay
                }
                else {
                    alert(res.Message);
                }
            }

        });


    }
    setStatusButton()
    {
        var sizeTable = $('.main-table tbody tr').length;
        debugger;
    }
    GetData() {
        var fakeData = [];
        $.ajax({
            method: 'GET',
            url: '/refs',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            success: function (res) {
                if (res.Success) {
                    fakeData = res.Data;
                }
                else {
                    alert(res.Message);
                }
            }

        });
        return fakeData;
    }
}