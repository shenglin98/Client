import { login, loginSinglePoint, logout, getInfo, getModules, getModulesTree, getOrgs, getUserID, getUserRealName } from '@/api/login'
import { getToken, setToken, removeToken, setLicenseKey, getLicenseKey, removeLicenseKey } from '@/utils/auth'
import { local } from '@/utils'
import JSEncrypt from "jsencrypt";
import Vue from "vue"
import { Base64 } from 'js-base64'
import { encryptedData, decryptData, encryptDataReturn } from "@/utils/jumpRouteLink.js";
import { initWebSocket } from "@/utils/webSocket.js";
import socketService from "@/utils/socketService.js";

const user = {
    state: {
        token: getToken(),
        licenseKey: getLicenseKey(),
        name: '',
        avatar: '',
        modules: null,
        defaultorg: null, // 登录后默认的操作机构
        id: '',
        account: "",
        realname: '',
        systemWarn: "",
        socketObj: null,
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_LICENSEKEY: (state, licenseKey) => {
            state.licenseKey = licenseKey
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_MODULES: (state, modules) => {
            state.modules = modules
        },
        SET_DEFAULTORG: (state, org) => {
            state.defaultorg = org
        },
        SET_ID: (state, id) => {
            state.id = id
        },
        SET_ACCOUNT: (state, account) => {
            state.account = account
        },
        SET_REALNAME: (state, id) => {
            state.id = id
        },
        SET_SYSTEMWARN: (state, systemWarn) => {
            state.systemWarn = systemWarn
        },
        SET_SOCKETOBJ: (state, socketObj) => {
            state.socketObj = socketObj
        }
    },

    actions: {
        // 存储socket数据
        setsocketObj({ commit }, data) {
            commit('SET_SOCKETOBJ', data)
        },
        // 单点登录
        LoginSinglePoint({ commit }, data) {
            return new Promise((resolve, reject) => {
                // username, userInfo.password, userInfo.Meccode
                removeToken()
                loginSinglePoint(data).then(response => {
                    const data = response
                    setToken(data.token)
                    let tempStr = data.licenseKey;
                    const forLength = Array.from(Array(Math.ceil(tempStr.length / 100)));
                    const slices = forLength.map((i, k) => {
                        return tempStr.slice(k * 100, (k + 1) * 100);
                    });
                    let rsaArr = [];
                    slices.forEach(k => {
                        rsaArr.push(encryptDataReturn(k))
                    })
                    let licenseKey = rsaArr.join("~");
                    setLicenseKey(licenseKey)
                    local.removeItem('visitedViews')
                    commit('SET_ACCOUNT', data.account)
                    commit('SET_TOKEN', data.token)
                    commit('SET_LICENSEKEY', licenseKey)
                        // 设置提醒内容
                    commit('SET_SYSTEMWARN', data.systemWarn)
                    localStorage.setItem("isDialog", JSON.stringify(true));
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username && userInfo.username.trim()
            if (userInfo.password && userInfo.password.length < 20) {
                var encryptor = new JSEncrypt(); // 创建加密对象实例
                //之前ssl生成的公钥，复制的时候要小心不要有空格
                encryptor.setPublicKey(window.pubKey); //设置公钥
                userInfo.password = encryptor.encrypt(Base64.encode(userInfo.password)); // 对内容进行加密
                // userInfo.password = Base64.encode(userInfo.password)
            }
            return new Promise((resolve, reject) => {
                removeToken()
                    // username, userInfo.password, userInfo.Meccode
                login(username, userInfo.password, userInfo.Meccode, '', localStorage.getItem("md5code")).then(async(response) => {
                    const data = response;
                    if (response.passwordStrength == 0) {
                        setToken(data.token);
                        let tempStr = data.licenseKey;
                        const forLength = Array.from(Array(Math.ceil(tempStr.length / 100)));
                        const slices = forLength.map((i, k) => {
                            return tempStr.slice(k * 100, (k + 1) * 100);
                        });
                        let rsaArr = [];
                        slices.forEach(k => {
                            rsaArr.push(encryptDataReturn(k))
                        })
                        let licenseKey = rsaArr.join("~");
                        setLicenseKey(licenseKey)
                        local.removeItem('visitedViews')
                        commit('SET_ACCOUNT', data.account)
                        commit('SET_TOKEN', data.token)
                        commit('SET_LICENSEKEY', licenseKey)
                            // 设置提醒内容
                        commit('SET_SYSTEMWARN', data.systemWarn)
                        localStorage.setItem("isDialog", JSON.stringify(true));
                        //initWebSocket(); // 登录成功进入系统连接socket通讯
                        // socketService.init("192.168.110.204:8081");
                        // socketService.init(location.host);
                        // socketService.init("101.200.229.181:9010");
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    commit('SET_NAME', response.result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户id
        GetUserID({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserID(state.token).then(response => {
                    commit('SET_ID', response.result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户id
        GetUserRealName({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserRealName(state.token).then(response => {
                    commit('SET_REALNAME', response.result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // todo:默认登录后取第一个机构的id作为默认，可以在【个人中心】界面修改默认
        // 在大型业务系统中，应该让用户登录成功后弹出选择框选择操作的机构
        GetDefaultOrg({ commit, state }) {
            return new Promise((resolve, reject) => {
                getOrgs(state.token).then(response => {
                    commit('SET_DEFAULTORG', response.result[0])
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户模块
        GetModules({ commit, state }) {
            return new Promise((resolve, reject) => {
                getModules(state.token).then(response => {
                    commit('SET_MODULES', response.result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户模块
        GetModulesTree({ commit, state }) {
            return new Promise((resolve, reject) => {
                if (state.modules != null) {
                    resolve(state.modules)
                    return
                }
                getModulesTree(state.token).then(response => {
                    commit('SET_MODULES', response.result)
                    resolve(response.result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_LICENSEKEY', '')
                    commit('SET_MODULES', [])
                    removeToken()
                    removeLicenseKey()
                    local.removeItem('visitedViews')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_LICENSEKEY', '')
                removeToken()
                removeLicenseKey()
                local.removeItem('visitedViews')
                resolve()
            })
        }
    }
}

export default user