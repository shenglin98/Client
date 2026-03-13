import request from "@/utils/request";

export function getList(data) {
    return request({
        url: "/SysAppVersion/FindList",
        method: "post",
        data,
    });
}

export function add(data) {
    return request({
        url: "/SysAppVersion/Add",
        method: "post",
        data,
    });
}

export function update(data) {
    return request({
        url: "/SysAppVersion/Update",
        method: "post",
        data,
    });
}

export function del(data) {
    return request({
        url: "/SysAppVersion/Delete",
        method: "post",
        data,
    });
}
