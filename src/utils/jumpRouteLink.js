/**
 * 用于路由跳转。比如页面之间跳转 第一次进入缓存
 * @param {当前vue的this} _this 
 * @param {返回的路由对象} targetUrl
 */
import Encrypt from 'encryptlong'
import JSEncrypt from "jsencrypt";
export function jumpRouteLink(_this, targetUrl) {
    // 设置vuex中tabs值
    _this.$store.commit("handlerSetTabsArr", targetUrl);
}




export function encryptedData(data) {
    let encryptor = new Encrypt()
    encryptor.setPublicKey(window.pubKey)
    return encryptor.encryptLong(data)
}

export function decryptData(data) {
    let decrypt = new Encrypt()
    decrypt.setPrivateKey(window.priKey)
    return decrypt.decryptLong(data)
}

export function encryptDataReturn(data) {
    var encryptor = new JSEncrypt(); // 创建加密对象实例
    //之前ssl生成的公钥，复制的时候要小心不要有空格
    encryptor.setPublicKey(window.pubKey); //设置公钥
    return encryptor.encrypt(data); // 对内容进行加密
}