const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    licenseKey: state => state.user.licenseKey,
    name: state => state.user.name,
    id: state => state.user.id,
    account: state => state.user.account,
    defaultorgid: state => state.user.defaultorg.id,
    isIdentityAuth: state => state.serverConf.isIdentityAuth,
    modules: state => state.user.modules,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    addRouters: state => state.permission.addRouters,
    permission_routers: state => state.permission.routers,
    tenantid: state => state.tenant.id,
    systemWarn: state => state.user.systemWarn
}
export default getters