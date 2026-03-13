const moduleCache = {
    state: () => ({
        tabsArr: ["dashboard"], // 传递给头部tabs栏的数组
        editableTabsValue: "1", // tabs选中项值
        selectActive: "1", // 菜单栏选中项
        delsPareParts: '', // 删除销毁的组件
    }),
    mutations: {
        // 设置tabs栏方法,侧边栏添加
        handlerSetTabsArr(state, data) {
            let flag = true;
            // 判断数组中是否已经存在当前跳转路由对象
            if (state.tabsArr.length > 0) {
                state.tabsArr.forEach((val) => {
                    if (val === data) {
                        flag = false;
                    }
                });
            }
            if (flag) state.tabsArr.push(data); // 添加数据对象到tabs栏数组
        },
        // 单个移除tabs栏方法
        handlerSetTabRemove(state, data) {
            // 删除tabs栏中数组选中项
            state.tabsArr.forEach((item, index) => {
                if (item === data) {
                    state.tabsArr.splice(index, 1);
                }
            })
        },
        // 关闭其他移除tabs栏方法
        handlerSetTabRemoveOther(state, data) {
            // 删除tabs栏中数组选中项
            state.tabsArr = [data];
        },
        // 关闭全部移除tabs栏方法
        handlerSetTabRemoveAll(state) {
            // 删除tabs栏中数组选中项
            state.tabsArr = ["dashboard"];
        },
        // 点击tabs栏,设置侧边栏选中项
        handlerSetNavActive(state, data) {
            state.selectActive = data;
        },
    },
    actions: {},
    getters: {}
}

export default moduleCache