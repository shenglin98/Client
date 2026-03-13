import request from '@/utils/request'
 // 获取职业危害字典数据
export function getHarm(params) {
  return request({
      url: '/DicOccupation/Load',
      params
  })
}

// 职业病登记新增
export function setAddData(data) {
  return request({
      url: '/OccupationalDisease/AddData',
      method: 'post',
      data
  })
}


// 职业病登记编辑
export function setEditData(data) {
  return request({
      url: '/OccupationalDisease/EditData',
      method: 'post',
      data
  })
}


// 职业病登记获取表格数据
export function getLoadProject(params) {
  return request({
      url: '/OccupationalDisease/Detail', 
      params
  })
}
// 职业病登记获取 职业危害数据
export function getGetHarms(params) {
  return request({
      url: '/OccupationalDisease/GetHarms', 
      params
  })
}
// 职业病登记 获取行业
export function getLoadType1(params) {
  return request({
      url: '/OccupationalDisease/Load?type=1', 
      params
  })
}
// 职业病登记 获取工种
export function getLoadType2(params) {
  return request({
      url: '/OccupationalDisease/Load?type=2', 
      params
  })
}
// 职业病登记  上传文件
export function OccupationalDiseaseUpload(data) {
  return request({
      url: '/Files/Upload', 
      method: 'post',
      data
  })
}
// 职业病登记  获取图片URL地址
export function GetFileUrl(params) {
  return request({
      url: '/Files/GetFile',  
      params
  })
}

// 职业病登记  上传Excl表格
export function ExcelToDb(data) {
  return request({
      url: '/OccupationalDisease/ExcelToDb',  
      method: 'post',
      data
  })
}
// 职业病登记  获取档案信息
export function GetProfessionList(params) {
  return request({
      url: '/OccupationalDisease/GetProfessionList', 
      params
  })
}
// 职业病登记  编辑
export function SetEditProfession(data) {
  return request({
      url: '/OccupationalDisease/EditProfession', 
      method: 'post',
      data
  })
}


// 获取照射种类  
export function Getirradiation(params) {
  return request({
      url: '/OccupationalDisease/Load?type=3',  
      params
  })
}

// 获取档案信息工作既往史回显
export function GetUserEmploymentHistory(params) {
  return request({
      url: '/OccupationalDisease/GetUserEmploymentHistory',  
      params
  })
}
// 获取 基本信息检查目的
export function GetPurposeOfTheInspection(params) {
  return request({
      url: '/OccupationalDisease/Load?type=5',  
      params
  })
}

//  保存档案信息中的问诊
export function SaveQuestionnaireArchives(data) {
  return request({
      url: '/CustomerRegisterOccupation/SaveQuestionnaire',   
      method: 'post',
      data
  })
}
//  获取档案信息中的问诊
export function QuestionnaireArchives(params) {
  return request({
      url: '/CustomerRegisterOccupation/Questionnaire',   
      params
  })
}

// 获取套餐字典列表
export function getTemplateList(params) {
  return request({
      url: '/DicSetmeal/LoadSetmealAndCombine',
      method: 'get',
      params
  })
}
// 获取套餐字典列表
export function GetOccupationCombine(data) {
  return request({
      url: '/OccupationalDisease/GetOccupationCombine',
      method: 'post',
      data
  })
}
// 获取入厂时间
export function GetDate(params) {
  return request({
      url: '/OccupationalDisease/GetDate',
      method: 'get',
      params
  })
}

// 根据职业危害id获取项目
export function GetSetmealCombine(data) {
  return request({
      url: '/OccupationalDisease/GetSetmealCombine', 
      method: 'post',
      data
  })
}
// 添加单位名称字典
export function addCompany(data) {
  return request({
      url: '/CompanyArchives/AddorUpdate',
      method: 'post',
      data
  })
}
 
// 单位名称添加字典 上级单位远程搜索
export function getCompanyArchivesDetail(params) {
  return request({
      url: '/CompanyArchives/Detail',
      method: 'get',
      params
  })
}
// 添加 行业 工种字典
export function AddOccupationalDisease(data) {
  return request({
      url: '/OccupationalDisease/Add',
      method: 'post',
      data
  })
}
 
// 获取当前用户历史体检记录
export function GetUserReview(params) {
  return request({
      url: '/OccupationalDisease/GetUserReview',
      method: 'get',
      params
  })
}
 
 
// 获取当前用户历史体检记录
export function GetUserReviewItem(params) {
  return request({
      url: '/OccupationalDisease/GetUserReviewItem',
      method: 'get',
      params
  })
}
 