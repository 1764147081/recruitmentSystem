import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getDepartmentInfo, getDepartmentIdByStationId } from '../services/user.js';
import { ElTabs, ElTabPane, ElButton, } from 'element-plus';
import Question from '../components/Question.vue';
// 获取路由参数
const route = useRoute();
// 活动标签页
const activeTab = ref('overview');
// 部门信息
const departmentInfo = ref({
    id: '',
    departmentId: 0,
    name: '',
    description: '',
    totalRegistrations: 0,
    pending: 0,
    approved: 0,
    administrators: []
});
// 获取部门详细信息(departmentId其实是stationId)
const fetchDepartmentInfo = async (departmentId) => {
    try {
        const res = await getDepartmentInfo(departmentId);
        if (res && res.data) {
            departmentInfo.value = res.data;
        }
        console.log('获取部门信息成功:', res.data);
    }
    catch (error) {
        console.error('获取部门信息失败:', error);
    }
};
const getDepartmentId = async (departmentId) => {
    try {
        const res = await getDepartmentIdByStationId(departmentId);
        if (res && res.data) {
            departmentInfo.value.departmentId = res.data.id;
        }
        console.log('获取部门id成功:', departmentInfo.value.departmentId);
    }
    catch (error) {
        throw error;
    }
};
// 组件挂载时获取部门信息
onMounted(() => {
    fetchDepartmentInfo(route.params.id);
    getDepartmentId(route.params.id);
});
// 监听路由参数变化
watch(() => route.params.id, (newId) => {
    fetchDepartmentInfo(newId);
    getDepartmentId(newId);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['department-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['department-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['department-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['department-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['description-box']} */ ;
/** @type {__VLS_StyleScopedClasses['description-box']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-info']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-list']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-list']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "department-detail" },
});
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    ...{ class: "department-tabs" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    ...{ class: "department-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "情况总览",
    name: "overview",
}));
const __VLS_6 = __VLS_5({
    label: "情况总览",
    name: "overview",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
(__VLS_ctx.departmentInfo.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stats-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.departmentInfo.totalRegistrations || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.departmentInfo.pending || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.departmentInfo.approved || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "description-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.departmentInfo.description);
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "admin-list" },
});
for (const [admin] of __VLS_getVForSourceType((__VLS_ctx.departmentInfo.administrators))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        key: (admin.id),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "admin-name" },
    });
    (admin.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "admin-contact" },
    });
    (admin.contact);
}
var __VLS_7;
const __VLS_8 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "报名管理",
    name: "registration",
}));
const __VLS_10 = __VLS_9({
    label: "报名管理",
    name: "registration",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
var __VLS_11;
const __VLS_12 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "题库管理",
    name: "questionBank",
}));
const __VLS_14 = __VLS_13({
    label: "题库管理",
    name: "questionBank",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
/** @type {[typeof Question, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(Question, new Question({
    departmentId: (__VLS_ctx.departmentInfo.id),
}));
const __VLS_17 = __VLS_16({
    departmentId: (__VLS_ctx.departmentInfo.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
var __VLS_15;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['department-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['department-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-container']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-box']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-box']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-box']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['description-box']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-info']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-list']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-name']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-contact']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ElTabs: ElTabs,
            ElTabPane: ElTabPane,
            Question: Question,
            activeTab: activeTab,
            departmentInfo: departmentInfo,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DepartmentDetail.vue.js.map