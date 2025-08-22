import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { getUserInfo, updateUserInfo, uploadAvatar, updatePassword } from '../services/user';
import { ElMessage, ElMessageBox } from 'element-plus';
const router = useRouter();
const userStore = useUserStore();
const baseURL = "https://i.sdu.edu.cn/XSZX/NXXT/api";
// 用户信息
const userInfo = ref({
    username: '',
    gender: '',
    depart: '',
    major: '',
    name: '',
    email: '',
    type: 0,
    avatar: '',
    qq: '',
    profile: '',
    password: ''
});
// 编辑状态
const isEditing = ref(false);
// 编辑表单
const editForm = ref({
    username: '',
    gender: '',
    depart: '',
    major: '',
    name: '',
    email: '',
    qq: '',
    profile: '',
    password: ''
});
// 编辑表单引用
const editFormRef = ref();
// 头像上传输入框引用
const avatarInputRef = ref();
// 修改密码对话框显示状态
const passwordDialogVisible = ref(false);
// 修改密码表单
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
// 修改密码表单引用
const passwordFormRef = ref();
// 是否有密码
const hasPassword = ref(false);
// 获取用户信息
const fetchUserInfo = async () => {
    try {
        // 从store获取用户信息
        const storedUserInfo = userStore.getUserInfo;
        console.log('store中的用户信息:', storedUserInfo);
        if (storedUserInfo && storedUserInfo.name) {
            // 如果store中有用户信息，直接使用
            userInfo.value = storedUserInfo;
            // 检查是否有密码
            hasPassword.value = storedUserInfo.password && storedUserInfo.password !== '';
        }
        else {
            // 如果store中没有用户信息，通过接口获取
            const res = await getUserInfo();
            console.log('接口获取的用户信息:', res);
            if (res.code === 200) {
                // 更新store中的用户信息
                userStore.changeUserInfo(res.data);
                // 更新页面显示的用户信息
                userInfo.value = res.data;
                // 检查是否有密码
                hasPassword.value = res.data.password && res.data.password !== '';
            }
        }
    }
    catch (error) {
        console.error('获取用户信息失败:', error);
    }
};
// 编辑信息
const handleEdit = () => {
    isEditing.value = true;
    // 初始化编辑表单
    editForm.value = { ...userInfo.value };
};
// 保存编辑
const saveEdit = async () => {
    try {
        const res = await updateUserInfo(editForm.value);
        console.log('更新用户信息成功:', res);
        // 更新store中的用户信息
        userStore.changeUserInfo(editForm.value);
        // 更新页面显示的用户信息
        userInfo.value = { ...editForm.value };
        // 退出编辑状态
        isEditing.value = false;
        ElMessage.success('信息更新成功');
    }
    catch (error) {
        console.error('更新用户信息失败:', error);
        ElMessage.error('信息更新失败');
    }
};
// 取消编辑
const cancelEdit = () => {
    isEditing.value = false;
};
// 修改头像
const handleAvatarUpload = () => {
    // 触发文件选择
    avatarInputRef.value.click();
};
// 头像文件选择回调
const onAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file)
        return;
    try {
        // 上传头像
        const res = await uploadAvatar(file);
        console.log('上传头像成功:', res);
        // 更新store中的用户信息
        const updatedUserInfo = { ...userStore.getUserInfo, avatar: res.data.url };
        userStore.changeUserInfo(updatedUserInfo);
        // 更新页面显示的用户信息
        userInfo.value = updatedUserInfo;
        ElMessage.success('头像更新成功');
    }
    catch (error) {
        console.error('上传头像失败:', error);
        ElMessage.error('头像更新失败');
    }
    finally {
        // 清空input的value，确保下次选择同一文件也能触发change事件
        e.target.value = '';
    }
};
// 修改密码
const handleChangePassword = () => {
    // 重置表单
    passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    // 显示对话框
    passwordDialogVisible.value = true;
};
// 保存密码
const savePassword = async () => {
    try {
        // 验证密码
        if (!passwordForm.value.newPassword) {
            ElMessage.error('请输入新密码');
            return;
        }
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
            ElMessage.error('两次输入的密码不一致');
            return;
        }
        // 准备数据
        const data = {
            // 只有当旧密码不为空时才传递旧密码
            ...(passwordForm.value.oldPassword && { oldPassword: passwordForm.value.oldPassword }),
            newPassword: passwordForm.value.newPassword
        };
        // 调用接口更新密码
        const res = await updatePassword(data);
        console.log('更新密码成功:', res);
        if (res.code === 200) {
            ElMessage.success('密码修改成功');
            // 关闭对话框
            passwordDialogVisible.value = false;
            // 如果用户之前没有密码，更新hasPassword状态
            if (!hasPassword.value) {
                hasPassword.value = true;
            }
        }
        else {
            ElMessage.error(res.message || '密码修改失败');
        }
    }
    catch (error) {
        console.error('更新密码失败:', error);
        ElMessage.error('密码修改失败');
    }
};
// 退出登录
const handleLogout = () => {
    userStore.logout();
    router.push({ name: 'login' });
};
onMounted(() => {
    fetchUserInfo();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-content" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "profile-card" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "profile-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
if (!__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-info" },
    });
    const __VLS_4 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        gutter: (20),
    }));
    const __VLS_6 = __VLS_5({
        gutter: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        span: (8),
    }));
    const __VLS_10 = __VLS_9({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-avatar" },
    });
    const __VLS_12 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        size: (100),
        src: (__VLS_ctx.userInfo.avatar),
    }));
    const __VLS_14 = __VLS_13({
        size: (100),
        src: (__VLS_ctx.userInfo.avatar),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    if (!__VLS_ctx.isEditing) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "avatar-upload" },
        });
        const __VLS_16 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_18 = __VLS_17({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        let __VLS_20;
        let __VLS_21;
        let __VLS_22;
        const __VLS_23 = {
            onClick: (__VLS_ctx.handleAvatarUpload)
        };
        __VLS_19.slots.default;
        var __VLS_19;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (__VLS_ctx.onAvatarChange) },
            type: "file",
            ref: "avatarInputRef",
            ...{ style: {} },
            accept: "image/*",
        });
        /** @type {typeof __VLS_ctx.avatarInputRef} */ ;
    }
    var __VLS_11;
    const __VLS_24 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        span: (16),
    }));
    const __VLS_26 = __VLS_25({
        span: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        column: (1),
        border: true,
    }));
    const __VLS_30 = __VLS_29({
        column: (1),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        label: "用户名",
    }));
    const __VLS_34 = __VLS_33({
        label: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (__VLS_ctx.userInfo.username);
    var __VLS_35;
    const __VLS_36 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        label: "姓名",
    }));
    const __VLS_38 = __VLS_37({
        label: "姓名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    (__VLS_ctx.userInfo.name);
    var __VLS_39;
    const __VLS_40 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "性别",
    }));
    const __VLS_42 = __VLS_41({
        label: "性别",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    (__VLS_ctx.userInfo.gender);
    var __VLS_43;
    const __VLS_44 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        label: "学院",
    }));
    const __VLS_46 = __VLS_45({
        label: "学院",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    (__VLS_ctx.userInfo.depart);
    var __VLS_47;
    const __VLS_48 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        label: "专业",
    }));
    const __VLS_50 = __VLS_49({
        label: "专业",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    (__VLS_ctx.userInfo.major || '未填写');
    var __VLS_51;
    const __VLS_52 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "邮箱",
    }));
    const __VLS_54 = __VLS_53({
        label: "邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    (__VLS_ctx.userInfo.email);
    var __VLS_55;
    const __VLS_56 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        label: "QQ",
    }));
    const __VLS_58 = __VLS_57({
        label: "QQ",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    (__VLS_ctx.userInfo.qq);
    var __VLS_59;
    const __VLS_60 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "类型",
    }));
    const __VLS_62 = __VLS_61({
        label: "类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    (__VLS_ctx.userInfo.type === 0 ? '学生' : '教师');
    var __VLS_63;
    const __VLS_64 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "个人简介",
    }));
    const __VLS_66 = __VLS_65({
        label: "个人简介",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (__VLS_ctx.userInfo.profile);
    var __VLS_67;
    var __VLS_31;
    var __VLS_27;
    var __VLS_7;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-edit" },
    });
    const __VLS_68 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        model: (__VLS_ctx.editForm),
        labelWidth: "100px",
        ref: "editFormRef",
    }));
    const __VLS_70 = __VLS_69({
        model: (__VLS_ctx.editForm),
        labelWidth: "100px",
        ref: "editFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    /** @type {typeof __VLS_ctx.editFormRef} */ ;
    var __VLS_72 = {};
    __VLS_71.slots.default;
    const __VLS_74 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
        label: "用户名",
    }));
    const __VLS_76 = __VLS_75({
        label: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    __VLS_77.slots.default;
    const __VLS_78 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        modelValue: (__VLS_ctx.editForm.username),
        disabled: true,
    }));
    const __VLS_80 = __VLS_79({
        modelValue: (__VLS_ctx.editForm.username),
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    var __VLS_77;
    const __VLS_82 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
        label: "姓名",
    }));
    const __VLS_84 = __VLS_83({
        label: "姓名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    __VLS_85.slots.default;
    const __VLS_86 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        modelValue: (__VLS_ctx.editForm.name),
        disabled: true,
    }));
    const __VLS_88 = __VLS_87({
        modelValue: (__VLS_ctx.editForm.name),
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    var __VLS_85;
    const __VLS_90 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        label: "性别",
    }));
    const __VLS_92 = __VLS_91({
        label: "性别",
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    __VLS_93.slots.default;
    const __VLS_94 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        modelValue: (__VLS_ctx.editForm.gender),
        placeholder: "请选择性别",
        disabled: true,
    }));
    const __VLS_96 = __VLS_95({
        modelValue: (__VLS_ctx.editForm.gender),
        placeholder: "请选择性别",
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_97.slots.default;
    const __VLS_98 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        label: "男",
        value: "男",
    }));
    const __VLS_100 = __VLS_99({
        label: "男",
        value: "男",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const __VLS_102 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        label: "女",
        value: "女",
    }));
    const __VLS_104 = __VLS_103({
        label: "女",
        value: "女",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    var __VLS_97;
    var __VLS_93;
    const __VLS_106 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
        label: "学院",
    }));
    const __VLS_108 = __VLS_107({
        label: "学院",
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    __VLS_109.slots.default;
    const __VLS_110 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
        modelValue: (__VLS_ctx.editForm.depart),
        disabled: true,
    }));
    const __VLS_112 = __VLS_111({
        modelValue: (__VLS_ctx.editForm.depart),
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    var __VLS_109;
    const __VLS_114 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        label: "专业",
    }));
    const __VLS_116 = __VLS_115({
        label: "专业",
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    __VLS_117.slots.default;
    const __VLS_118 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
        modelValue: (__VLS_ctx.editForm.major),
    }));
    const __VLS_120 = __VLS_119({
        modelValue: (__VLS_ctx.editForm.major),
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    var __VLS_117;
    const __VLS_122 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        label: "邮箱",
    }));
    const __VLS_124 = __VLS_123({
        label: "邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    __VLS_125.slots.default;
    const __VLS_126 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
        modelValue: (__VLS_ctx.editForm.email),
    }));
    const __VLS_128 = __VLS_127({
        modelValue: (__VLS_ctx.editForm.email),
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    var __VLS_125;
    const __VLS_130 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
        label: "QQ",
    }));
    const __VLS_132 = __VLS_131({
        label: "QQ",
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    __VLS_133.slots.default;
    const __VLS_134 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
        modelValue: (__VLS_ctx.editForm.qq),
    }));
    const __VLS_136 = __VLS_135({
        modelValue: (__VLS_ctx.editForm.qq),
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    var __VLS_133;
    const __VLS_138 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
        label: "个人简介",
    }));
    const __VLS_140 = __VLS_139({
        label: "个人简介",
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    __VLS_141.slots.default;
    const __VLS_142 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
        modelValue: (__VLS_ctx.editForm.profile),
        type: "textarea",
    }));
    const __VLS_144 = __VLS_143({
        modelValue: (__VLS_ctx.editForm.profile),
        type: "textarea",
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    var __VLS_141;
    const __VLS_146 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({}));
    const __VLS_148 = __VLS_147({}, ...__VLS_functionalComponentArgsRest(__VLS_147));
    __VLS_149.slots.default;
    const __VLS_150 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_152 = __VLS_151({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    let __VLS_154;
    let __VLS_155;
    let __VLS_156;
    const __VLS_157 = {
        onClick: (__VLS_ctx.saveEdit)
    };
    __VLS_153.slots.default;
    var __VLS_153;
    const __VLS_158 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
        ...{ 'onClick': {} },
    }));
    const __VLS_160 = __VLS_159({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    let __VLS_162;
    let __VLS_163;
    let __VLS_164;
    const __VLS_165 = {
        onClick: (__VLS_ctx.cancelEdit)
    };
    __VLS_161.slots.default;
    var __VLS_161;
    var __VLS_149;
    var __VLS_71;
}
var __VLS_3;
const __VLS_166 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    ...{ class: "profile-card" },
}));
const __VLS_168 = __VLS_167({
    ...{ class: "profile-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
__VLS_169.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_169.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-actions" },
});
if (!__VLS_ctx.isEditing) {
    const __VLS_170 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_172 = __VLS_171({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    let __VLS_174;
    let __VLS_175;
    let __VLS_176;
    const __VLS_177 = {
        onClick: (__VLS_ctx.handleEdit)
    };
    __VLS_173.slots.default;
    var __VLS_173;
}
const __VLS_178 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
    ...{ 'onClick': {} },
}));
const __VLS_180 = __VLS_179({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
let __VLS_182;
let __VLS_183;
let __VLS_184;
const __VLS_185 = {
    onClick: (__VLS_ctx.handleChangePassword)
};
__VLS_181.slots.default;
var __VLS_181;
const __VLS_186 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
    ...{ 'onClick': {} },
}));
const __VLS_188 = __VLS_187({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
let __VLS_190;
let __VLS_191;
let __VLS_192;
const __VLS_193 = {
    onClick: (__VLS_ctx.handleLogout)
};
__VLS_189.slots.default;
var __VLS_189;
var __VLS_169;
const __VLS_194 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
    modelValue: (__VLS_ctx.passwordDialogVisible),
    title: "修改密码",
    width: "500px",
}));
const __VLS_196 = __VLS_195({
    modelValue: (__VLS_ctx.passwordDialogVisible),
    title: "修改密码",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
__VLS_197.slots.default;
const __VLS_198 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    model: (__VLS_ctx.passwordForm),
    labelWidth: "100px",
    ref: "passwordFormRef",
}));
const __VLS_200 = __VLS_199({
    model: (__VLS_ctx.passwordForm),
    labelWidth: "100px",
    ref: "passwordFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
/** @type {typeof __VLS_ctx.passwordFormRef} */ ;
var __VLS_202 = {};
__VLS_201.slots.default;
const __VLS_204 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "旧密码",
}));
const __VLS_206 = __VLS_205({
    label: "旧密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.passwordForm.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "如果没有旧密码可不填",
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.passwordForm.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "如果没有旧密码可不填",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
var __VLS_207;
const __VLS_212 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    label: "新密码",
}));
const __VLS_214 = __VLS_213({
    label: "新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
}));
const __VLS_218 = __VLS_217({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
var __VLS_215;
const __VLS_220 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "确认密码",
}));
const __VLS_222 = __VLS_221({
    label: "确认密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
}));
const __VLS_226 = __VLS_225({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
var __VLS_223;
var __VLS_201;
{
    const { footer: __VLS_thisSlot } = __VLS_197.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_228 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        ...{ 'onClick': {} },
    }));
    const __VLS_230 = __VLS_229({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    let __VLS_232;
    let __VLS_233;
    let __VLS_234;
    const __VLS_235 = {
        onClick: (...[$event]) => {
            __VLS_ctx.passwordDialogVisible = false;
        }
    };
    __VLS_231.slots.default;
    var __VLS_231;
    const __VLS_236 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_238 = __VLS_237({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    let __VLS_240;
    let __VLS_241;
    let __VLS_242;
    const __VLS_243 = {
        onClick: (__VLS_ctx.savePassword)
    };
    __VLS_239.slots.default;
    var __VLS_239;
}
var __VLS_197;
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-content']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-info']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_73 = __VLS_72, __VLS_203 = __VLS_202;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            userInfo: userInfo,
            isEditing: isEditing,
            editForm: editForm,
            editFormRef: editFormRef,
            avatarInputRef: avatarInputRef,
            passwordDialogVisible: passwordDialogVisible,
            passwordForm: passwordForm,
            passwordFormRef: passwordFormRef,
            handleEdit: handleEdit,
            saveEdit: saveEdit,
            cancelEdit: cancelEdit,
            handleAvatarUpload: handleAvatarUpload,
            onAvatarChange: onAvatarChange,
            handleChangePassword: handleChangePassword,
            savePassword: savePassword,
            handleLogout: handleLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Profile.vue.js.map