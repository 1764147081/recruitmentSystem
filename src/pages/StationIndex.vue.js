import { ref, reactive, onBeforeUnmount } from 'vue';
import { onBeforeMount } from 'vue';
import { useUserStore } from '../store/user';
import { useStationStore } from '../store/station';
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import RecursiveMenu from '../components/RecursiveMenu.vue';
import { getStationView } from '../store/stationTree';
const BaseUrl = 'https://i.sdu.edu.cn/XSZX/NXXT/api';
const user = useUserStore();
const station = useStationStore();
const menuData = ref([]);
let type = "";
const fetchMenuData = async () => {
    try {
        const sentProp = await getStationView(1);
        menuData.value = [sentProp];
    }
    catch (error) {
        console.error('获取菜单数据失败:', error);
        ElMessage.error('获取菜单数据失败');
    }
};
onBeforeMount(fetchMenuData);
const menuKey = ref(0);
const refreshMenu = () => {
    menuKey.value += 1;
    fetchMenuData();
};
const setDepartment = ref(false);
const setStation = ref(false);
const username = ref("");
const formData = reactive({
    name: '',
    parentId: 0,
    stationId: 0,
    description: '',
    manager: '',
    image: ''
});
const stationList = reactive({
    name: '',
    parentId: 0,
    description: '',
    manager: '',
    isDepartment: 0,
});
const stationStore = [];
const stationMap = ref(stationStore);
// 图片上传处理
function handleFileChange(file) {
    if (!file.raw.type.startsWith('image/')) {
        ElMessage.error('只能上传图片文件！');
        return false;
    }
    formData.image = URL.createObjectURL(file.raw);
    console.log(formData.image);
    station.changeImg(formData.image);
}
// 删除图片
function handleRemoveImage() {
    if (formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image);
    }
    formData.image = '';
}
// 组件卸载时清理
onBeforeUnmount(() => {
    if (formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image);
    }
});
//提交表单
async function search() {
    console.log(user.getToken);
    console.log(username.value);
    let url = `${BaseUrl}/user/info?username=${username.value}`;
    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': user.getToken
            }
        });
        let data = await response.json();
        if (data.code == 200) {
            username.value = data.data.username;
            alert(data.data.username);
        }
    }
    catch (error) {
        console.log(error);
    }
}
async function setPermission() {
    const queryParams = new URLSearchParams({
        username: username.value,
        stationId: station.getParentId.toString()
    });
    const url = `${BaseUrl}/permission/set?${queryParams}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.getToken}`
        }
    });
    let data = await response.json();
    if (data.code == 200) {
        alert("设置成功");
    }
    else {
        alert("设置失败");
    }
}
async function addStation() {
    station.changeName(stationList.name);
    station.changeDescription(stationList.description);
    let url = `${BaseUrl}/station/create`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.getToken}`
            },
            body: JSON.stringify({
                name: station.getName,
                description: station.getDescription,
                pId: station.getId,
                isDepartment: stationList.isDepartment
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        console.log('Success:', data);
        // 添加成功后刷新菜单
        await refreshMenu();
        ElMessage.success('模块创建成功');
        return data;
    }
    catch (error) {
        console.error('Request failed:', error);
        ElMessage.error('模块创建失败');
        throw error;
    }
}
async function addDepartment() {
    station.changeName(formData.name);
    station.changeDescription(formData.description);
    console.log(station.getParentId);
    console.log(station.getId);
    let url = `${BaseUrl}/department/create`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.getToken}`
            },
            body: JSON.stringify({
                pId: station.getId,
                name: station.getName,
                description: station.getDescription,
                image: station.getImg,
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        console.log('Success:', data);
        // 添加成功后刷新菜单
        refreshMenu();
        ElMessage.success('部门创建成功');
        return data;
    }
    catch (error) {
        console.error('Request failed:', error);
        ElMessage.error('部门创建失败');
        throw error;
    }
}
async function deleteDepartment() {
    try {
        const res = await fetch(`${BaseUrl}/station/del?stationId=${station.getId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.getToken}`
            }
        });
        if (res.status == 200) {
            ElMessage.success('部门删除成功');
        }
        refreshMenu();
    }
    catch (error) {
        console.error('Request failed:', error);
        ElMessage.error('部门删除失败');
        throw error;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['upload-square']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ onClick: (__VLS_ctx) },
    ...{ class: "edit" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "warning",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (...[$event]) => {
        __VLS_ctx.setDepartment = true;
        __VLS_ctx.setStation = false;
    }
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "warning",
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (...[$event]) => {
        __VLS_ctx.setStation = true;
        __VLS_ctx.setDepartment = false;
    }
};
__VLS_11.slots.default;
var __VLS_11;
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "danger",
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (__VLS_ctx.deleteDepartment)
};
__VLS_19.slots.default;
var __VLS_19;
/** @type {[typeof RecursiveMenu, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(RecursiveMenu, new RecursiveMenu({
    menuData: (__VLS_ctx.menuData),
    key: (__VLS_ctx.menuKey),
}));
const __VLS_25 = __VLS_24({
    menuData: (__VLS_ctx.menuData),
    key: (__VLS_ctx.menuKey),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    placeholder: "请输入管理员姓名",
    modelValue: (__VLS_ctx.username),
}));
const __VLS_29 = __VLS_28({
    placeholder: "请输入管理员姓名",
    modelValue: (__VLS_ctx.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_33 = __VLS_32({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_35;
let __VLS_36;
let __VLS_37;
const __VLS_38 = {
    onClick: (__VLS_ctx.search)
};
__VLS_34.slots.default;
var __VLS_34;
const __VLS_39 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_41 = __VLS_40({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_43;
let __VLS_44;
let __VLS_45;
const __VLS_46 = {
    onClick: (__VLS_ctx.setPermission)
};
__VLS_42.slots.default;
var __VLS_42;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content" },
});
if (__VLS_ctx.setDepartment) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_47 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        model: (__VLS_ctx.formData),
        labelWidth: "120px",
        ...{ class: "demo-ruleForm" },
    }));
    const __VLS_49 = __VLS_48({
        model: (__VLS_ctx.formData),
        labelWidth: "120px",
        ...{ class: "demo-ruleForm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    __VLS_50.slots.default;
    const __VLS_51 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        label: "设置部门名称",
        prop: "name",
    }));
    const __VLS_53 = __VLS_52({
        label: "设置部门名称",
        prop: "name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    __VLS_54.slots.default;
    const __VLS_55 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        modelValue: (__VLS_ctx.formData.name),
        autocomplete: "off",
    }));
    const __VLS_57 = __VLS_56({
        modelValue: (__VLS_ctx.formData.name),
        autocomplete: "off",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    var __VLS_54;
    const __VLS_59 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        label: "输入部门描述",
        prop: "description",
    }));
    const __VLS_61 = __VLS_60({
        label: "输入部门描述",
        prop: "description",
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    __VLS_62.slots.default;
    const __VLS_63 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        type: "textarea",
        modelValue: (__VLS_ctx.formData.description),
        autocomplete: "off",
    }));
    const __VLS_65 = __VLS_64({
        type: "textarea",
        modelValue: (__VLS_ctx.formData.description),
        autocomplete: "off",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    var __VLS_62;
    const __VLS_67 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        label: "上传部门海报",
        prop: "image",
    }));
    const __VLS_69 = __VLS_68({
        label: "上传部门海报",
        prop: "image",
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_70.slots.default;
    const __VLS_71 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        action: "#",
        autoUpload: (false),
        onChange: (__VLS_ctx.handleFileChange),
        showFileList: (false),
        accept: "image/*",
    }));
    const __VLS_73 = __VLS_72({
        action: "#",
        autoUpload: (false),
        onChange: (__VLS_ctx.handleFileChange),
        showFileList: (false),
        accept: "image/*",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    __VLS_74.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upload-square" },
    });
    if (!__VLS_ctx.formData.image) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "upload-placeholder" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "plus-icon" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "upload-text" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
            src: (__VLS_ctx.formData.image),
            alt: "部门海报预览",
            ...{ class: "preview-image" },
        });
    }
    if (__VLS_ctx.formData.image) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "image-actions" },
        });
        const __VLS_75 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
            ...{ 'onClick': {} },
            type: "danger",
            icon: "el-icon-delete",
            circle: true,
            size: "small",
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onClick': {} },
            type: "danger",
            icon: "el-icon-delete",
            circle: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_79;
        let __VLS_80;
        let __VLS_81;
        const __VLS_82 = {
            onClick: (__VLS_ctx.handleRemoveImage)
        };
        var __VLS_78;
    }
    var __VLS_74;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upload-tip" },
    });
    var __VLS_70;
    const __VLS_83 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({}));
    const __VLS_85 = __VLS_84({}, ...__VLS_functionalComponentArgsRest(__VLS_84));
    __VLS_86.slots.default;
    const __VLS_87 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
        ...{ 'onClick': {} },
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_91;
    let __VLS_92;
    let __VLS_93;
    const __VLS_94 = {
        onClick: (__VLS_ctx.addDepartment)
    };
    __VLS_90.slots.default;
    var __VLS_90;
    const __VLS_95 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        ...{ 'onClick': {} },
    }));
    const __VLS_97 = __VLS_96({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    let __VLS_99;
    let __VLS_100;
    let __VLS_101;
    const __VLS_102 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.setDepartment))
                return;
            __VLS_ctx.setDepartment = false;
        }
    };
    __VLS_98.slots.default;
    var __VLS_98;
    var __VLS_86;
    var __VLS_50;
}
if (__VLS_ctx.setStation) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_103 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        model: (__VLS_ctx.stationList),
        labelWidth: "120px",
        ...{ class: "demo-ruleForm" },
    }));
    const __VLS_105 = __VLS_104({
        model: (__VLS_ctx.stationList),
        labelWidth: "120px",
        ...{ class: "demo-ruleForm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    __VLS_106.slots.default;
    const __VLS_107 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        label: "设置模块名称",
        prop: "name",
    }));
    const __VLS_109 = __VLS_108({
        label: "设置模块名称",
        prop: "name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    __VLS_110.slots.default;
    const __VLS_111 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
        modelValue: (__VLS_ctx.stationList.name),
        autocomplete: "off",
    }));
    const __VLS_113 = __VLS_112({
        modelValue: (__VLS_ctx.stationList.name),
        autocomplete: "off",
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    var __VLS_110;
    const __VLS_115 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
        label: "输入模块描述",
        prop: "description",
    }));
    const __VLS_117 = __VLS_116({
        label: "输入模块描述",
        prop: "description",
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    __VLS_118.slots.default;
    const __VLS_119 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
        type: "textarea",
        modelValue: (__VLS_ctx.stationList.description),
        autocomplete: "off",
    }));
    const __VLS_121 = __VLS_120({
        type: "textarea",
        modelValue: (__VLS_ctx.stationList.description),
        autocomplete: "off",
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    var __VLS_118;
    const __VLS_123 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        label: "是否为部门",
    }));
    const __VLS_125 = __VLS_124({
        label: "是否为部门",
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    __VLS_126.slots.default;
    const __VLS_127 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        modelValue: (__VLS_ctx.stationList.isDepartment),
        label: "0",
    }));
    const __VLS_129 = __VLS_128({
        modelValue: (__VLS_ctx.stationList.isDepartment),
        label: "0",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    __VLS_130.slots.default;
    var __VLS_130;
    const __VLS_131 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
        modelValue: (__VLS_ctx.stationList.isDepartment),
        label: "1",
    }));
    const __VLS_133 = __VLS_132({
        modelValue: (__VLS_ctx.stationList.isDepartment),
        label: "1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    __VLS_134.slots.default;
    var __VLS_134;
    var __VLS_126;
    const __VLS_135 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({}));
    const __VLS_137 = __VLS_136({}, ...__VLS_functionalComponentArgsRest(__VLS_136));
    __VLS_138.slots.default;
    const __VLS_139 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        ...{ 'onClick': {} },
    }));
    const __VLS_141 = __VLS_140({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    let __VLS_143;
    let __VLS_144;
    let __VLS_145;
    const __VLS_146 = {
        onClick: (__VLS_ctx.addStation)
    };
    __VLS_142.slots.default;
    var __VLS_142;
    const __VLS_147 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
        ...{ 'onClick': {} },
    }));
    const __VLS_149 = __VLS_148({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    let __VLS_151;
    let __VLS_152;
    let __VLS_153;
    const __VLS_154 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.setStation))
                return;
            __VLS_ctx.setStation = false;
        }
    };
    __VLS_150.slots.default;
    var __VLS_150;
    var __VLS_138;
    var __VLS_106;
}
/** @type {__VLS_StyleScopedClasses['edit']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-ruleForm']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-square']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['plus-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-image']} */ ;
/** @type {__VLS_StyleScopedClasses['image-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-ruleForm']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ElForm: ElForm,
            ElFormItem: ElFormItem,
            ElInput: ElInput,
            ElButton: ElButton,
            RecursiveMenu: RecursiveMenu,
            menuData: menuData,
            menuKey: menuKey,
            setDepartment: setDepartment,
            setStation: setStation,
            username: username,
            formData: formData,
            stationList: stationList,
            handleFileChange: handleFileChange,
            handleRemoveImage: handleRemoveImage,
            search: search,
            setPermission: setPermission,
            addStation: addStation,
            addDepartment: addDepartment,
            deleteDepartment: deleteDepartment,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=StationIndex.vue.js.map