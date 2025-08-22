import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { unfoldStation } from '../services/user.js';
import { ref, onBeforeMount } from 'vue';
const baseURL = "https://i.sdu.edu.cn/XSZX/NXXT/api";
const router = useRouter();
const user = useUserStore();
console.log('此时为从user里拿', user.token);
// 用户信息
const userInfo = ref({
    name: '名字',
    avatar: '',
    username: ''
});
const stationTree = ref([]);
// 获取站点树
const fetchStationTree = async (stationId) => {
    try {
        console.log('正在获取站点ID为', stationId, '的站点树');
        const res = await unfoldStation(stationId);
        console.log('获取站点树响应:', res);
        if (res && res.data) {
            // 递归处理子站点
            const processChildren = async (items) => {
                for (let item of items) {
                    console.log('处理站点:', item);
                    // 如果不是部门，则继续获取子站点
                    if (item.isDepartment !== 1) {
                        console.log('站点', item.id, '不是部门，继续获取子站点');
                        try {
                            const childRes = await unfoldStation(item.id);
                            console.log('获取子站点响应:', childRes);
                            if (childRes && childRes.data) {
                                item.children = childRes.data;
                                if (item.children) {
                                    await processChildren(item.children);
                                }
                            }
                        }
                        catch (error) {
                            // 处理404错误，不影响其他节点的渲染
                            console.warn('获取子站点失败，可能无子菜单:', item.id, error);
                            // 即使出错也继续处理其他节点
                        }
                    }
                    else {
                        console.log('站点', item.id, '是部门，跳过获取子站点');
                    }
                }
            };
            // 处理顶层站点
            await processChildren(res.data);
            stationTree.value = res.data;
            console.log('最终站点树:', stationTree.value);
        }
    }
    catch (error) {
        console.error('获取站点树失败:', error);
    }
};
// 初始化站点数据
const initializeStationData = async () => {
    // 只有在用户已登录的情况下才获取站点数据
    if (!user.getToken || user.getToken === '--') {
        console.log('用户未登录，跳过站点数据初始化');
        return;
    }
    try {
        console.log('开始初始化站点数据');
        async function getPermission() {
            const username = parseInt(userInfo.value.username);
            const res = await fetch(`${baseURL}/permission/show/user?username=${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.getToken}`
                }
            }).then(res => res.json());
            return res.data[0].stationId;
        }
        const rootStationId = await getPermission();
        ``;
        console.log('使用根站点ID获取站点树:', rootStationId);
        await fetchStationTree(rootStationId);
    }
    catch (error) {
        console.error('初始化站点数据失败:', error);
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);
    }
};
async function fetchUserInfo() {
    try {
        const response = await fetch(`${baseURL}/user/info`, {
            headers: {
                'Authorization': `Bearer ${user.getToken}`
            }
        });
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.error('获取用户信息失败:', error);
    }
}
// 初始化用户状态
const initializeUserState = async () => {
    // 检查存储中的token
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (storedToken && storedToken !== '--') {
        user.changeToken(storedToken);
        user.changeIsLogin();
        // 获取用户信息
        try {
            const data = await fetchUserInfo();
            userInfo.value.name = data.data.name || '名字';
            userInfo.value.avatar = data.data.avatar || '';
            userInfo.value.username = data.data.username || '';
            console.log('用户信息:', data);
            // 保存用户信息到store
            user.changeUserInfo(data.data);
        }
        catch (error) {
            console.error('获取用户信息失败:', error);
        }
    }
};
// 在页面加载前初始化用户状态
onBeforeMount(async () => {
    await initializeUserState();
    await initializeStationData();
});
// 跳转到个人信息页面
const goToProfile = () => {
    router.push({ name: 'profile' });
};
// 跳转到部门详细页
const goToDepartment = (departmentId) => {
    router.push({ name: 'departmentDetail', params: { id: departmentId } });
};
const handleEditClick = () => {
    router.push({ name: 'stationIndex' });
};
// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['department-node']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['department-node']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "common-layout" },
});
const __VLS_0 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "header-container" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "header-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
    src: '@/assets/logo.png',
    alt: "logo",
    id: "logo",
});
if (!__VLS_ctx.user.getToken || __VLS_ctx.user.getToken === '--') {
    const __VLS_8 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        to: ({ name: 'login' }),
    }));
    const __VLS_10 = __VLS_9({
        to: ({ name: 'login' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
    var __VLS_11;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-info" },
    });
    const __VLS_16 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        src: (__VLS_ctx.userInfo.avatar),
        ...{ class: "user-avatar" },
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        src: (__VLS_ctx.userInfo.avatar),
        ...{ class: "user-avatar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        onClick: (__VLS_ctx.goToProfile)
    };
    var __VLS_19;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "user-name" },
    });
    (__VLS_ctx.userInfo.name);
}
var __VLS_7;
const __VLS_24 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ class: "tac" },
}));
const __VLS_34 = __VLS_33({
    ...{ class: "tac" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    span: (24),
}));
const __VLS_38 = __VLS_37({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ onClick: (__VLS_ctx.handleEditClick) },
    ...{ class: "edit" },
});
const __VLS_40 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    defaultActive: "2",
    ...{ class: "el-menu-vertical-demo" },
}));
const __VLS_42 = __VLS_41({
    defaultActive: "2",
    ...{ class: "el-menu-vertical-demo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    index: "1",
}));
const __VLS_46 = __VLS_45({
    index: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_47.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [station] of __VLS_getVForSourceType((__VLS_ctx.stationTree))) {
    (station.id);
    if (station.isDepartment === 1) {
        const __VLS_48 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            ...{ 'onClick': {} },
            index: (station.id.toString()),
            ...{ class: "department-node" },
        }));
        const __VLS_50 = __VLS_49({
            ...{ 'onClick': {} },
            index: (station.id.toString()),
            ...{ class: "department-node" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        let __VLS_52;
        let __VLS_53;
        let __VLS_54;
        const __VLS_55 = {
            onClick: (...[$event]) => {
                if (!(station.isDepartment === 1))
                    return;
                __VLS_ctx.goToDepartment(station.id);
            }
        };
        __VLS_51.slots.default;
        (station.name);
        var __VLS_51;
    }
    else {
        const __VLS_56 = {}.ElSubMenu;
        /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            index: (station.id.toString()),
        }));
        const __VLS_58 = __VLS_57({
            index: (station.id.toString()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        __VLS_59.slots.default;
        {
            const { title: __VLS_thisSlot } = __VLS_59.slots;
            (station.name);
        }
        for (const [child] of __VLS_getVForSourceType((station.children))) {
            (child.id);
            if (child.isDepartment === 1) {
                const __VLS_60 = {}.ElMenuItem;
                /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
                // @ts-ignore
                const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
                    ...{ 'onClick': {} },
                    index: (child.id.toString()),
                    ...{ class: "department-node" },
                }));
                const __VLS_62 = __VLS_61({
                    ...{ 'onClick': {} },
                    index: (child.id.toString()),
                    ...{ class: "department-node" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                let __VLS_64;
                let __VLS_65;
                let __VLS_66;
                const __VLS_67 = {
                    onClick: (...[$event]) => {
                        if (!!(station.isDepartment === 1))
                            return;
                        if (!(child.isDepartment === 1))
                            return;
                        __VLS_ctx.goToDepartment(child.id);
                    }
                };
                __VLS_63.slots.default;
                (child.name);
                var __VLS_63;
            }
            else {
                const __VLS_68 = {}.ElSubMenu;
                /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
                // @ts-ignore
                const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                    index: (child.id.toString()),
                }));
                const __VLS_70 = __VLS_69({
                    index: (child.id.toString()),
                }, ...__VLS_functionalComponentArgsRest(__VLS_69));
                __VLS_71.slots.default;
                {
                    const { title: __VLS_thisSlot } = __VLS_71.slots;
                    (child.name);
                }
                for (const [grandchild] of __VLS_getVForSourceType((child.children))) {
                    (grandchild.id);
                    if (grandchild.isDepartment === 1) {
                        const __VLS_72 = {}.ElMenuItem;
                        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
                        // @ts-ignore
                        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                            ...{ 'onClick': {} },
                            index: (grandchild.id.toString()),
                            ...{ class: "department-node" },
                        }));
                        const __VLS_74 = __VLS_73({
                            ...{ 'onClick': {} },
                            index: (grandchild.id.toString()),
                            ...{ class: "department-node" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
                        let __VLS_76;
                        let __VLS_77;
                        let __VLS_78;
                        const __VLS_79 = {
                            onClick: (...[$event]) => {
                                if (!!(station.isDepartment === 1))
                                    return;
                                if (!!(child.isDepartment === 1))
                                    return;
                                if (!(grandchild.isDepartment === 1))
                                    return;
                                __VLS_ctx.goToDepartment(grandchild.id);
                            }
                        };
                        __VLS_75.slots.default;
                        (grandchild.name);
                        var __VLS_75;
                    }
                    else {
                        const __VLS_80 = {}.ElSubMenu;
                        /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
                        // @ts-ignore
                        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
                            index: (grandchild.id.toString()),
                        }));
                        const __VLS_82 = __VLS_81({
                            index: (grandchild.id.toString()),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
                        __VLS_83.slots.default;
                        {
                            const { title: __VLS_thisSlot } = __VLS_83.slots;
                            (grandchild.name);
                        }
                        var __VLS_83;
                    }
                }
                var __VLS_71;
            }
        }
        var __VLS_59;
    }
}
var __VLS_47;
const __VLS_84 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    index: "2",
}));
const __VLS_86 = __VLS_85({
    index: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_87.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_88 = {}.ElMenuItemGroup;
/** @type {[typeof __VLS_components.ElMenuItemGroup, typeof __VLS_components.elMenuItemGroup, typeof __VLS_components.ElMenuItemGroup, typeof __VLS_components.elMenuItemGroup, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    index: "21",
}));
const __VLS_94 = __VLS_93({
    index: "21",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
var __VLS_95;
const __VLS_96 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    index: "22",
}));
const __VLS_98 = __VLS_97({
    index: "22",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
var __VLS_99;
var __VLS_91;
var __VLS_87;
var __VLS_43;
var __VLS_39;
var __VLS_35;
var __VLS_31;
const __VLS_100 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
var __VLS_103;
var __VLS_27;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['common-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['header-container']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['tac']} */ ;
/** @type {__VLS_StyleScopedClasses['edit']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['department-node']} */ ;
/** @type {__VLS_StyleScopedClasses['department-node']} */ ;
/** @type {__VLS_StyleScopedClasses['department-node']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterLink: RouterLink,
            user: user,
            userInfo: userInfo,
            stationTree: stationTree,
            goToProfile: goToProfile,
            goToDepartment: goToDepartment,
            handleEditClick: handleEditClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=layout.vue.js.map