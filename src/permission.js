import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// 已删掉 '/report/panorama' 白名单
const whiteList = ['/login', '/oidc-callback', '/swagger', '/usermanager/profile', '/report/login', '/report/index', '/triagcall/index', '/triagcallmobile/index'] // 不重定向白名单
    // 保存cookie
function setCookie(cName, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
};
router.beforeEach((to, from, next) => {
    NProgress.start()
        // http://localhost:1803/#/login?token=88888888
    let paramsStr = location.href.split('?')[1];
    let paramsArr = [];
    paramsStr && (paramsArr = paramsStr.split('&'));
    let asTokenArr = paramsArr.filter(k => {
        return k.includes('accessToken') || k.includes('token')
    })[0];
    if (to.path === '/login' && paramsArr.length > 0 && (asTokenArr.includes('accessToken') || asTokenArr.includes('token'))) {
        let accessToken = asTokenArr.split('=')[1];
        if (!accessToken) {
            Message.error("获取服务器登录方式失败,请传入认证密匙!")
            return;
        }
        let data = {
            singleLoginItem: {
                accessToken
            }
        }
        store.dispatch("LoginSinglePoint", data)
            .then((res) => {
                //     // 储存登录信息
                setCookie("username", res.account, 7);
                setCookie("password", "");
                Message.success("登入成功!")
                localStorage.setItem("critical", JSON.stringify(true));
                if (
                    localStorage.getItem("md5code") == null ||
                    localStorage.getItem("md5code") == undefined ||
                    localStorage.getItem("md5code") == ""
                ) {
                    let options = { excludes: {} };
                    Fingerprint2.get(options, function(components) {
                        const values = components.filter((t) => {
                            return t.key == "canvas" ? t.value : "";
                        })[0].value;
                        // 指纹
                        const murmur = Fingerprint2.x64hash128(values.join(""), 31);
                        //写入cookied
                        localStorage.setItem("md5code", murmur);
                    });
                }
                next({ path: '/' })
            })
            .catch((err) => {
                // Message.error("获取服务器登录方式失败!")
                // next({ path: '/login', query: { accessToken: "" } })
                setTimeout(() => {
                    location.href = location.origin;
                }, 2000)
                return;
            });
        return;
    }
    store.dispatch('GetIdentityAuth').then(isIdentity => {
        if (isIdentity) { // 采用Identity认证
            // 如果是oidcRedirect必须进入授权
            // 没登录时，如果是白名单页面，可以直接访问
            // 没登录时，如果是非登录页面，则跳转到登录
            if (store.getters.oidcUser == null && to.path !== '/oidcRedirect') {
                if (whiteList.indexOf(to.path) !== -1) {
                    next()
                    return
                } else {
                    next('/login')
                    return
                }
            }

            store.dispatch('oidcCheckAccess', to).then(function(hasAccess) {
                if (!hasAccess) {
                    return
                }
                if (to.path === '/login') { // 登录后login自动跳转
                    next({ path: '/' })
                    return
                }
                if (store.getters.modules != null) {
                    next()
                    return
                }
                store.dispatch('GetModulesTree').then(modules => { // 获取用户可访问的模块
                    store.dispatch('GenerateRoutes', { modules }).then(() => { // 根据权限生成可访问的路由表
                        store.dispatch('GetDefaultOrg')
                        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        next({...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                    })
                })
            })
        } else { // 普通登录方式
            if (getToken()) {
                if (to.path === '/login') { // 登录后login自动跳转
                    next({ path: '/' })
                    return
                }
                if (store.getters.modules != null) {
                    next()
                    return
                }
                // if (to.path === "/dashboard") {
                store.dispatch('GetInfo').then(() => { // 拉取用户信息
                    store.dispatch('GetModulesTree').then(modules => { // 获取用户可访问的模块
                        store.dispatch('GenerateRoutes', { modules }).then(() => { // 根据权限生成可访问的路由表
                            store.dispatch('GetDefaultOrg')
                            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                            next({...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                        })
                    })
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(() => {
                        // Message.error(err || '获取用户信息失败')
                        next({ path: '/' })
                    })
                })
                return
                // }
            }
            if (whiteList.indexOf(to.path) !== -1) { // 没登录情况下过滤白名单
                next()
            } else {
                next('/login')
            }
        }
    }).catch((err) => {
        Message.error(err || '获取服务器登录方式失败')
    })
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})