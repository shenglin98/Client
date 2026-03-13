// 文件流转换文件
export function $base64ToBlob(name, code) {
    //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
    code = code.replace(/[\n\r]/g, "");
    var raw = window.atob(code);
    let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: "application/pdf" });
}

// 下载文件
export function $downloadExportFile(name, blob) {
    let downloadElement = document.createElement("a");
    let href = blob;
    if (typeof blob == "string") {
        downloadElement.target = "_blank";
    } else {
        href = window.URL.createObjectURL(blob); //创建下载的链接
    }
    downloadElement.href = href;
    downloadElement.download = name + "." + "pdf"; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //触发点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    if (typeof blob != "string") {
        window.URL.revokeObjectURL(href); //释放掉blob对象
    }
}