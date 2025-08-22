import { ref, reactive } from 'vue';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElTabs, ElTabPane, ElIcon } from 'element-plus';
import { User, Key } from '@element-plus/icons-vue';
const router = useRouter();
const baseURL = "https://i.sdu.edu.cn/XSZX/NXXT/api";
const loginType = ref('account');
const form1 = reactive({
    studentNumber: '',
    password: '',
    autoLogin: false
});
const form2 = reactive({
    studentNumber: '',
    password: '',
    autoLogin: false
});
const user = useUserStore();
// 登录
// 账号密码登录
async function handleLoginOne() {
    user.changeStudentNumber(form1.studentNumber);
    user.changePassword(form1.password);
    user.changeAutoLogin(form1.autoLogin);
    console.log(user.getStudentNumber);
    console.log(user.getPassword);
    console.log(user.getAutoLogin);
    try {
        const queryParams = new URLSearchParams({
            studentNumber: user.getStudentNumber,
            password: user.getPassword
        });
        const response = await fetch(`${baseURL}/user/login?${queryParams}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const message = await response.json();
        console.log(message);
        if (message.code === 200) {
            user.changeToken(message.data);
            user.changeIsLogin();
            // 根据自动登录选项设置token存储
            if (form1.autoLogin) {
                // 长期存储
                localStorage.setItem('token', message.data);
                localStorage.setItem('autoLogin', 'true');
            }
            else {
                // 短期存储
                sessionStorage.setItem('token', message.data);
                localStorage.setItem('autoLogin', 'false');
            }
            router.push('/');
        }
        else {
            ElMessage.error('登录失败，请重试');
        }
    }
    catch (err) {
        console.error("登录失败:", err);
        ElMessage.error('登录失败，请重试');
    }
}
// 统一认证登录
async function handleLoginTwo() {
    user.changeStudentNumber(form2.studentNumber);
    user.changePassword(form2.password);
    user.changeAutoLogin(form2.autoLogin);
    console.log(user.getStudentNumber);
    console.log(user.getPassword);
    console.log(user.getAutoLogin);
    console.log(typeof user.getStudentNumber);
    try {
        const queryParams = new URLSearchParams({
            studentNumber: user.getStudentNumber,
            password: user.getPassword,
            fingerprint: user.getStudentNumber
        });
        const response = await fetch(`${baseURL}/user/login/cas?${queryParams}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const message = await response.json();
        console.log(message);
        if (message.code === 200) {
            router.push('/');
            user.changeToken(message.data);
        }
        else if (message.code === 400) {
            // 弹窗获取验证码
            const { value } = await ElMessageBox.prompt('请输入验证码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            });
            // 带验证码的第二次请求
            const queryParams2 = new URLSearchParams({
                studentNumber: user.getStudentNumber,
                password: user.getPassword,
                fingerprint: user.getStudentNumber,
                captcha: value
            });
            const secondResponse = await fetch(`${baseURL}/user/login/cas?${queryParams2}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const secondMessage = await secondResponse.json();
            if (secondMessage.code === 200) {
                user.changeToken(secondMessage.data);
                user.changeIsLogin();
                console.log(user.getToken);
                // 根据自动登录选项设置token存储
                if (form2.autoLogin) {
                    // 长期存储
                    localStorage.setItem('token', secondMessage.data);
                    localStorage.setItem('autoLogin', 'true');
                }
                else {
                    // 短期存储
                    sessionStorage.setItem('token', secondMessage.data);
                    localStorage.setItem('autoLogin', 'false');
                }
                router.push('/');
            }
        }
    }
    catch (err) {
        console.error("登录失败:", err);
        this.$message.error('登录失败，请重试');
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['loginHeader']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__nav-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['account-login']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['cas-login']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-header']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-login-checkbox']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "login" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "loginHeader" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: '@/assets/logo.png',
    alt: "logo",
    id: "logo",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "login-toggle" },
});
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.loginType),
    ...{ class: "login-tabs" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.loginType),
    ...{ class: "login-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    name: "account",
}));
const __VLS_6 = __VLS_5({
    name: "account",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_7.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tab-label account-tab" },
    });
    const __VLS_8 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    const __VLS_12 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    var __VLS_11;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-container account-login" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "login-type-header" },
});
const __VLS_16 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "login-type-icon" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "login-type-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.User;
/** @type {[typeof __VLS_components.User, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_24 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    model: (__VLS_ctx.form1),
    rules: (__VLS_ctx.rules),
    ref: "formRef1",
    labelWidth: "0px",
    ...{ class: "demo-form-inline" },
}));
const __VLS_26 = __VLS_25({
    model: (__VLS_ctx.form1),
    rules: (__VLS_ctx.rules),
    ref: "formRef1",
    labelWidth: "0px",
    ...{ class: "demo-form-inline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
/** @type {typeof __VLS_ctx.formRef1} */ ;
var __VLS_28 = {};
__VLS_27.slots.default;
const __VLS_30 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    prop: "studentNumber",
}));
const __VLS_32 = __VLS_31({
    prop: "studentNumber",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
const __VLS_34 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.form1.studentNumber),
    placeholder: "请输入学号",
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.form1.studentNumber),
    placeholder: "请输入学号",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
var __VLS_33;
const __VLS_38 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    prop: "password",
}));
const __VLS_40 = __VLS_39({
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
const __VLS_42 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.form1.password),
    placeholder: "请输入密码",
    showPassword: true,
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.form1.password),
    placeholder: "请输入密码",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
var __VLS_41;
const __VLS_46 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    ...{ class: "auto-login-checkbox" },
}));
const __VLS_48 = __VLS_47({
    ...{ class: "auto-login-checkbox" },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
const __VLS_50 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    modelValue: (__VLS_ctx.form1.autoLogin),
    label: "自动登录",
    size: "small",
}));
const __VLS_52 = __VLS_51({
    modelValue: (__VLS_ctx.form1.autoLogin),
    label: "自动登录",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
var __VLS_49;
const __VLS_54 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-button" },
}));
const __VLS_60 = __VLS_59({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_62;
let __VLS_63;
let __VLS_64;
const __VLS_65 = {
    onClick: (__VLS_ctx.handleLoginOne)
};
__VLS_61.slots.default;
var __VLS_61;
var __VLS_57;
var __VLS_27;
var __VLS_7;
const __VLS_66 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    name: "cas",
}));
const __VLS_68 = __VLS_67({
    name: "cas",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_69.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tab-label cas-tab" },
    });
    const __VLS_70 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({}));
    const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
    __VLS_73.slots.default;
    const __VLS_74 = {}.Key;
    /** @type {[typeof __VLS_components.Key, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
    const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
    var __VLS_73;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-container cas-login" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "login-type-header" },
});
const __VLS_78 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    ...{ class: "login-type-icon" },
}));
const __VLS_80 = __VLS_79({
    ...{ class: "login-type-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.Key;
/** @type {[typeof __VLS_components.Key, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({}));
const __VLS_84 = __VLS_83({}, ...__VLS_functionalComponentArgsRest(__VLS_83));
var __VLS_81;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_86 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    model: (__VLS_ctx.form2),
    rules: (__VLS_ctx.rules),
    ref: "formRef2",
    labelWidth: "0px",
    ...{ class: "demo-form-inline" },
}));
const __VLS_88 = __VLS_87({
    model: (__VLS_ctx.form2),
    rules: (__VLS_ctx.rules),
    ref: "formRef2",
    labelWidth: "0px",
    ...{ class: "demo-form-inline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
/** @type {typeof __VLS_ctx.formRef2} */ ;
var __VLS_90 = {};
__VLS_89.slots.default;
const __VLS_92 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "studentNumber",
}));
const __VLS_94 = __VLS_93({
    prop: "studentNumber",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    modelValue: (__VLS_ctx.form2.studentNumber),
    placeholder: "请输入学号",
}));
const __VLS_98 = __VLS_97({
    modelValue: (__VLS_ctx.form2.studentNumber),
    placeholder: "请输入学号",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
var __VLS_95;
const __VLS_100 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "password",
}));
const __VLS_102 = __VLS_101({
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    modelValue: (__VLS_ctx.form2.password),
    placeholder: "请输入密码",
    showPassword: true,
}));
const __VLS_106 = __VLS_105({
    modelValue: (__VLS_ctx.form2.password),
    placeholder: "请输入密码",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
var __VLS_103;
const __VLS_108 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ class: "auto-login-checkbox" },
}));
const __VLS_110 = __VLS_109({
    ...{ class: "auto-login-checkbox" },
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    modelValue: (__VLS_ctx.form2.autoLogin),
    label: "自动登录",
    size: "small",
}));
const __VLS_114 = __VLS_113({
    modelValue: (__VLS_ctx.form2.autoLogin),
    label: "自动登录",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
var __VLS_111;
const __VLS_116 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-button" },
}));
const __VLS_122 = __VLS_121({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_124;
let __VLS_125;
let __VLS_126;
const __VLS_127 = {
    onClick: (__VLS_ctx.handleLoginTwo)
};
__VLS_123.slots.default;
var __VLS_123;
var __VLS_119;
var __VLS_89;
var __VLS_69;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['loginHeader']} */ ;
/** @type {__VLS_StyleScopedClasses['login-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['login-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-label']} */ ;
/** @type {__VLS_StyleScopedClasses['account-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['account-login']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-form-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-login-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-label']} */ ;
/** @type {__VLS_StyleScopedClasses['cas-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cas-login']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-type-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-form-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-login-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
// @ts-ignore
var __VLS_29 = __VLS_28, __VLS_91 = __VLS_90;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ElForm: ElForm,
            ElFormItem: ElFormItem,
            ElInput: ElInput,
            ElButton: ElButton,
            ElTabs: ElTabs,
            ElTabPane: ElTabPane,
            ElIcon: ElIcon,
            User: User,
            Key: Key,
            loginType: loginType,
            form1: form1,
            form2: form2,
            handleLoginOne: handleLoginOne,
            handleLoginTwo: handleLoginTwo,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Login.vue.js.map