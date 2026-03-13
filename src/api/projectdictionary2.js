import request from '@/utils/request'

// 项目字典列表
export function getDicItemList(params) {
    return request({
        url: '/DicItem/Load',
        method: 'get',
        params
    })
}

// 项目字典详情
export function getDicItemDetail(params) {
    return request({
        url: '/DicItem/Detail',
        method: 'get',
        params
    })
}
// 项目字典新增
export function setDicItemCreate(data) {
    return request({
        url: '/DicItem/Create',
        method: 'post',
        data
    })
}
// 项目字典更新
export function setDicItemUpdate(data) {
    return request({
        url: '/DicItem/Update',
        method: 'post',
        data
    })
}
// 项目字典删除
export function setDicItemDelete(data) {
    return request({
        url: '/DicItem/Delete',
        method: 'post',
        data
    })
}

// 组合字典列表
export function getDicCombineList(params) {
    return request({
        url: '/DicCombine/Load',
        method: 'get',
        params
    })
}

// 组合字典列表-简化
export function getTriagCombineList(params) {
    return request({
        url: '/DicCombine/TriagCombineList',
        method: 'get',
        params
    })
}

// 组合字典详情
export function getDicCombineItemList(data) {
    return request({
        url: '/DicCombine/ItemList',
        method: 'post',
        data
    })
}

// 组合字典详情
export function getDicCombineDetail(params) {
    return request({
        url: '/DicCombine/Detail',
        method: 'get',
        params
    })
}

// 组合字典新增
export function setDicCombineCreate(data) {
    return request({
        url: '/DicCombine/Create',
        method: 'post',
        data
    })
}
// 组合字典更新
export function setDicCombineUpdate(data) {
    return request({
        url: '/DicCombine/Update',
        method: 'post',
        data
    })
}
// 组合字典更新
export function setDicCombineDelete(data) {
    return request({
        url: '/DicCombine/Delete',
        method: 'post',
        data
    })
}

// 项目字典结果、对照列表
export function getDicItemChildDetail(params) {
    return request({
        url: '/DicItem/ChildDetail',
        method: 'get',
        params
    })
}

// 项目字典结果、对照列表保存
export function setDicItemChildUpdate(data) {
    return request({
        url: '/DicItem/ChildUpdate',
        method: 'post',
        data
    })
}

// 项目字典结果、对照列表删除
export function setDeleteItemValue(data) {
    return request({
        url: '/DicItem/DeleteItemValue',
        method: 'post',
        data
    })
}

// 收费字典-收费字典列表 
export function getDicItemChargeList(data) {
    return request({
        url: '/DicItemCharge/Load',
        method: 'post',
        data
    })
}
// 收费字典-收费字典保存
export function setDicItemChargeSave(data) {
    return request({
        url: '/DicItemCharge/Save',
        method: 'post',
        data
    })
}
// 收费字典-收费字典详情
export function getDicItemChargeDetail(params) {
    return request({
        url: '/DicItemCharge/Detail',
        method: 'get',
        params
    })
}
// 收费字典-收费字典删除
export function setDicItemChargeDelete(data) {
    return request({
        url: '/DicItemCharge/Delete',
        method: 'post',
        data
    })
}

// 组合收费明细
export function getCombineChargeDetail(params) {
    return request({
        url: '/DicItemCharge/CombineChargeDetail',
        method: 'get',
        params
    })
}

// 组合收费明细
export function setCombineChargeSave(data) {
    return request({
        url: '/DicItemCharge/CombineChargeSave',
        method: 'post',
        data
    })
}

// 组合收费删除
export function setCombineChargeDelete(data) {
    return request({
        url: '/DicItemCharge/CombineChargeDelete',
        method: 'post',
        data
    })
}

// 组合对应申请单字典列表
export function getDicCombineApplyList(params) {
    return request({
        url: '/DicCombineApply/Load',
        method: 'get',
        params
    })
}

// 组合对应申请单字典新增或修改
export function getDicCombineApplySave(data) {
    return request({
        url: '/DicCombineApply/Save',
        method: 'post',
        data
    })
}

// 组合对应申请单字典删除
export function setDicCombineApplyDelete(data) {
    return request({
        url: '/DicCombineApply/Delete',
        method: 'post',
        data
    })
}


// 体检中心
export function getDictionaryDicLoad(params) {
    return request({
        url: '/dictionary/DicLoad',
        params
    })
}

// 收费字典价格同步
export function getChargeSync(params) {
    return request({
        url: '/DicCombine/ChargeSync',
        params
    })
}

// 组合包含收费字典价格同步
export function getCombineChargeSync(params) {
    return request({
        url: '/DicCombine/CombineChargeSync',
        params
    })
}
// 项目字典人体部位数据
export function getbodyDicLoad(params) {
    return request({
        url: '/Dictionary/DicLoad',
        params
    })
}


// 项目字典his 获取列表数据
export function getCombineHisLoad(params) {
    return request({
        url: '/DicCombineHis/Load',
        params
    })
}

// 项目字典his 获取列表数据-子表
export function getCombineHisDetail(params) {
    return request({
        url: '/DicCombineHis/Detail',
        params
    })
}
// 项目字典his新增/修改
export function setCombineHisSave(data) {
    return request({
        url: '/DicCombineHis/Save',
        method: 'POST',
        data
    })
}
// 项目字典his 删除
export function setCombineHisDelete(data) {
    return request({
        url: '/DicCombineHis/Delete',
        method: 'POST',
        data
    })
}
// 项目字典his 同步
export function getCombineSync(params) {
    return request({
        url: '/DicCombineHis/CombineSync',
        params
    })
}
// 项目字典 同步
export function DicItemSync(params) {
    return request({
        url: '/DicItem/DicItemSync',
        params
    })
}
// 项目对照字典 同步
export function DicItemContrastSync(params) {
    return request({
        url: '/DicItem/DicItemContrastSync',
        params
    })
}
// 组合字典 同步
export function DicCombineSync(params) {
    return request({
        url: '/DicCombine/DicCombineSync',
        params
    })
}
// 组合同步项目字典 同步
export function DicCombineItemSync(params) {
    return request({
        url: '/DicCombine/DicCombineItemSync',
        params
    })
}

// 组合分组字典新增
export function DicCombineGroupCreate(data) {
    return request({
        url: '/DicCombineGroup/Create',
        method: 'POST',
        data
    })
}

// 组合分组字典详情
export function DicCombineGroupDetail(params) {
    return request({
        url: '/DicCombineGroup/Detail',
        method: 'get',
        params
    })
}

// 组合分组字典列表
export function DicCombineGroupLoad(params) {
    return request({
        url: '/DicCombineGroup/Load',
        method: 'get',
        params
    })
}

// 组合分组字典删除
export function DicCombineGroupDelete(data) {
    return request({
        url: '/DicCombineGroup/Delete',
        method: 'POST',
        data
    })
}

// 收费明细字典启用/停用
export function ChangeChargeStatus(data) {
    return request({
        url: '/DicItemCharge/ChangeChargeStatus',
        method: 'POST',
        data
    })
}

// 收费明细字典启用/停用
export function DicCombineSyncUpdate(params) {
    return request({
        url: '/DicCombine/DicCombineSyncUpdate',
        method: 'get',
        params
    })
}

// 职业病对照编码
export function GetOccupationTreeList(params) {
    return request({
        url: '/DicOccupationTree/GetOccupationTreeList',
        method: 'get',
        params
    })
}