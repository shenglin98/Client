import request from '@/utils/request'

// 当日业务
export function td_business(data) {
    return request({
        url: '/HealthCheckStatics/OnDayBusinessStatistics',
        method: 'post',
        data
    })
}

// 当日收入
export function td_income(data) {
    return request({
        url: '/HealthCheckStatics/OnDayIncomeStatistics',
        method: 'post',
        data
    })
}

// 当日团检
export function td_groupcheck(data) {
    return request({
        url: '/HealthCheckStatics/OnDayCompanyCheckStatistics',
        method: 'post',
        data
    })
}

// 本周团检
export function tw_groupcheck(data) {
    return request({
        url: '/HealthCheckStatics/ThisWeekCompanyCheckStatistics',
        method: 'post',
        data
    })
}

// 危急值提醒
export function risk_remind(data) {
    return request({
        url: '/HealthCheckStatics/WarningCriticalValueStatistics',
        method: 'post',
        data
    })
}

// 检查诊室
export function check_cr(data) {
    return request({
        url: '/HealthCheckStatics/CheckClinicStatistics',
        method: 'post',
        data
    })
}

// 检查TAT
export function ck_tat(data) {
    return request({
        url: '/HealthCheckStatics/PhysicalExaminationTATStatistics',
        method: 'post',
        data
    })
}

//  检查医生
export function ck_doctor(data) {
    return request({
        url: '/HealthCheckStatics/ExamineDoctorStatistics',
        method: 'post',
        data
    })
}

//  体检TAT提醒
export function tat_remind(data) {
    return request({
        url: '/HealthCheckStatics/PhysicalxaminationTATRemindStatistics',
        method: 'post',
        data
    })
}