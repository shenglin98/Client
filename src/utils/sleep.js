export function sleep(time) {
    let now = Date.now() // 获取当前毫秒数
        // 设置while循环，循环条件为：实时时间减去记录时间小于3s，否则则循环结束
    while (Date.now() - now < time) {}
}