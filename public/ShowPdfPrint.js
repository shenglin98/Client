//=========================== start of LODOP ===========================
//初始化 CLodop
let lodop = null;

function initLodop() {
    var dtd = $.Deferred();
    try {
        lodop = getLodop();
        //注册语句
        lodop.SET_LICENSES('广州创惠信息科技有限公司', '4100B319B0D12FA847047ED0177E3152454', '廣州創惠信息科技有限公司', '11A895305AA0A5E28A513133B6E9079FE58');
        lodop.SET_LICENSES('THIRD LICENSE', '', 'Guangzhou Chuanghui Information Technology Co., Ltd', '87BF75AD14BCD61B0904912A831CED0EA75');
        dtd.resolve(lodop);
    } catch (e) {
        dtd.reject(e);
    }
    return dtd.promise();
}

//获取所有打印机
function getPrinters() {
    return $
        .when(initLodop())
        .then(function(lodop) {
            var printers = [];

            for (var idx = 0; idx < lodop.GET_PRINTER_COUNT(); idx++) {
                printers.push({ name: lodop.GET_PRINTER_NAME(idx) });
            }
            console.log(printers);
            return printers;
        }, function(err) {
            console.error('getPrinters: ' + err && (err.message || err.toString()));
        });
}

//<script src="http://localhost:8000/CLodopFuncs.js"></script>
function LodopPrinter(options, printName) {
    if (options == null) {
        options = {};
    }

    var $this = this;
    // $this.lodop = null;
    $.when(initLodop())
        .then(function(lodop) {
            //$this.lodop = lodop;
        });
    console.log(this.lodop, '打印机');
    this.options = {
        printerName: printName || this.lodop.GET_PRINTER_NAME(-1),
        width: '100%',
        height: '100%',
        origin: 'http://101.200.229.181:8092/',
        lodop: lodop,
    };

    this.options = $.extend({}, this.options, options);

    console.log(this.options);
}


LodopPrinter.prototype.printPdfReport1 = function(fileNames) {


    lodop = getLodop();

    for (i = 0; i < fileNames.length; i++) {
        var src = this.options.origin + fileNames[i];
        lodop.NewPage();
        lodop.SET_PRINTER_INDEX(this.options.printerName);
        lodop.ADD_PRINT_PDF(0, 0, this.options.width, this.options.height, src);
        lodop.PRINT();
    }
    //this.deleteReportFile(fileNames);
}

//打印图片报表
LodopPrinter.prototype.printImgReport = function(fileNames) {
        for (i = 0; i < fileNames.length; i++) {
            var src = fileNames[i];
            // var src = this.options.origin + fileNames[i];
            this.lodop.NewPage();
            this.lodop.SET_PRINTER_INDEX(this.options.printerName);
            this.lodop.ADD_PRINT_IMAGE(0, 0, this.options.width, this.options.height, src);
            this.lodop.SET_PRINT_STYLEA(0, "Stretch", 2);
            this.lodop.PRINT();
        }
        this.deleteReportFile(fileNames);
    }
    //打印 pdf 报表
LodopPrinter.prototype.printPdfReport = function(lodop, fileNames) {
        for (i = 0; i < fileNames.length; i++) {
            var src = fileNames[i];
            // var src = this.options.origin + fileNames[i];
            lodop.NewPage();
            lodop.SET_PRINTER_INDEX(this.options.printerName);
            lodop.ADD_PRINT_PDF(0, 0, this.options.width, this.options.height, src);
            lodop.PRINT();
        }
        // this.deleteReportFile(fileNames);
    }
    //打印 base64 格式的 pdf 数据报表
LodopPrinter.prototype.printBase64PdfReport = function(lodop, listData) {
        for (i = 0; i < listData.length; i++) {
            lodop.NewPage();
            lodop.SET_PRINTER_INDEX(this.options.printerName);
            lodop.ADD_PRINT_PDF(0, 0, this.options.width, this.options.height, listData[i]);
            lodop.PRINT();
        }
    }
    //打印条码
LodopPrinter.prototype.printPdfBarcode = function(fileNames) {
        this.options.width = '5cm';
        this.options.height = '3cm';
        this.printPdfReport(fileNames);
    }
    //删除文件（延迟）
LodopPrinter.prototype.deleteReportFile = function(fileNames) {
        $.ajax({
            url: showPdfPrintApplicationPath + 'LisHome/DeleteReportFiles',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ fileNames: fileNames }),
            error: function(err) { console.log(err); },
        });
    }
    //=========================== end of LODOP ===========================