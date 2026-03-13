import request from "@/utils/request";

export function getList(params) {
    return request({
        url: "/DicCritical/CriticalList",
        method: "get",
        params,
    });
}

export function createOrUpdate(data) {
    return request({
        url: "/DicCritical/CreateOrUpdate",
        method: "post",
        data,
    });
}

export function del(data) {
    return request({
        url: "/DicCritical/Delete",
        method: "post",
        data,
    });
}
