import { createQuestionnaire, getQuestionnaireDetailedById, getQuestionnaire, addQuestion, publishQuestionnaire, deleteQuestionnaire } from '../services/user.js';
import { ElMessage, ElTableColumn, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';
import { onMounted } from 'vue';
import { watch } from 'vue';
const props = defineProps({
    departmentId: {
        type: Number,
        required: true
    },
});
const form = reactive({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    status: 0
});
const questionnaireId = ref(0);
const sort = ref(0);
watch(() => props.departmentId, (newId) => {
    if (newId) {
        fetchQuestionnaire(newId);
        getQuestion(newId);
    }
});
const ifCreate = ref(false);
const show = ref(false);
const showEdit = ref(false);
//获取题目
const questionList = ref([]);
//编辑题目
const type = ref(0);
const formdata = reactive({
    departmentId: props.departmentId,
    questionnaireId: questionnaireId.value,
    type: 1,
    content: '',
    sort: sort.value + 1,
    options: [
        {
            optionContent: '',
            optionSort: 0
        },
        {
            optionContent: '',
            optionSort: 1
        },
        {
            optionContent: '',
            optionSort: 2
        },
        {
            optionContent: '',
            optionSort: 3
        }
    ]
});
async function addQuestions() {
    try {
        if (type.value === 3) {
            formdata.options = [];
        }
        await addQuestion([formdata]);
        ElMessage.success('添加成功');
        getQuestion(props.departmentId);
    }
    catch (error) {
        ElMessage.error('添加失败');
    }
}
//获取问卷列表
async function fetchQuestionnaire() {
    try {
        const result = await getQuestionnaire(props.departmentId);
        if (result.code === 200) {
            ifCreate.value = true;
            console.log(result.data);
            form.title = result.data.title;
            form.description = result.data.description;
            form.startTime = result.data.startTime;
            form.endTime = result.data.endTime;
            form.status = result.data.status;
            questionnaireId.value = result.data.id;
            console.log(questionnaireId.value);
        }
    }
    catch (error) {
        console.error("发生错误:", error);
        ifCreate.value = false;
    }
}
async function getQuestion() {
    try {
        const result = await getQuestionnaireDetailedById(props.departmentId);
        if (result.code === 200) {
            console.log(result.data);
            questionList.value = result.data.questions;
            if (result.data.questions === null) {
                sort.value = 0;
            }
            else {
                sort.value = result.data.questions.length;
                console.log(result.data.questions.length);
            }
        }
    }
    catch (error) {
        console.error("发生错误:", error);
    }
}
async function handleCreateQuestionnaire() {
    try {
        const result = await createQuestionnaire(props.departmentId, {
            id: props.departmentId,
            title: form.title,
            description: form.description,
            startTime: form.startTime,
            endTime: form.endTime,
            departmentId: props.departmentId,
            collected: 200,
            status: 0
        });
        if (result.code === 200) {
            ElMessage.success('创建成功');
        }
        else {
            ElMessage.error('创建失败');
            console.log(result);
        }
    }
    catch (error) {
        console.error("发生错误:", error);
    }
}
async function handlePublish() {
    try {
        const result = await publishQuestionnaire(questionnaireId.value);
        if (result.code === 200) {
            ElMessage.success('发布成功');
        }
        else {
            ElMessage.error('发布失败');
            console.log(result);
        }
    }
    catch (error) {
        console.error("发生错误:", error);
    }
}
async function handleDelete() {
    try {
        const result = await deleteQuestionnaire(props.departmentId);
        if (result.code === 200) {
            ElMessage.success('删除成功');
        }
        else {
            ElMessage.error('删除失败');
            console.log(result);
        }
    }
    catch (error) {
        console.error("发生错误:", error);
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (!__VLS_ctx.showEdit) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "showQuestionnaire" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "questionnaire" },
    });
    if (__VLS_ctx.ifCreate) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (__VLS_ctx.form.title);
    }
    if (__VLS_ctx.ifCreate) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
        (__VLS_ctx.form.startTime);
    }
    if (__VLS_ctx.ifCreate) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
        (__VLS_ctx.form.endTime);
    }
    if (!__VLS_ctx.ifCreate) {
        const __VLS_0 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onClick': {} },
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_4;
        let __VLS_5;
        let __VLS_6;
        const __VLS_7 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.showEdit))
                    return;
                if (!(!__VLS_ctx.ifCreate))
                    return;
                __VLS_ctx.show = true;
            }
        };
        __VLS_3.slots.default;
        var __VLS_3;
    }
    if (__VLS_ctx.ifCreate) {
        const __VLS_8 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            ...{ 'onClick': {} },
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_12;
        let __VLS_13;
        let __VLS_14;
        const __VLS_15 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.showEdit))
                    return;
                if (!(__VLS_ctx.ifCreate))
                    return;
                __VLS_ctx.showEdit = true;
            }
        };
        __VLS_11.slots.default;
        var __VLS_11;
    }
    if (__VLS_ctx.ifCreate) {
        const __VLS_16 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            ...{ 'onClick': {} },
        }));
        const __VLS_18 = __VLS_17({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        let __VLS_20;
        let __VLS_21;
        let __VLS_22;
        const __VLS_23 = {
            onClick: (__VLS_ctx.handleDelete)
        };
        __VLS_19.slots.default;
        var __VLS_19;
    }
    if (__VLS_ctx.show) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "createQuestionnaire" },
        });
        const __VLS_24 = {}.ElForm;
        /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            model: (__VLS_ctx.form),
            rules: (__VLS_ctx.rules),
            ref: "formRef",
            labelWidth: "120px",
            ...{ class: "demo-ruleForm" },
        }));
        const __VLS_26 = __VLS_25({
            model: (__VLS_ctx.form),
            rules: (__VLS_ctx.rules),
            ref: "formRef",
            labelWidth: "120px",
            ...{ class: "demo-ruleForm" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        /** @type {typeof __VLS_ctx.formRef} */ ;
        var __VLS_28 = {};
        __VLS_27.slots.default;
        const __VLS_30 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
            label: "问卷名称",
            prop: "title",
        }));
        const __VLS_32 = __VLS_31({
            label: "问卷名称",
            prop: "title",
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        __VLS_33.slots.default;
        const __VLS_34 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
            modelValue: (__VLS_ctx.form.title),
            autocomplete: "off",
        }));
        const __VLS_36 = __VLS_35({
            modelValue: (__VLS_ctx.form.title),
            autocomplete: "off",
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        var __VLS_33;
        const __VLS_38 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
            label: "问卷描述",
            prop: "description",
        }));
        const __VLS_40 = __VLS_39({
            label: "问卷描述",
            prop: "description",
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        __VLS_41.slots.default;
        const __VLS_42 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
            modelValue: (__VLS_ctx.form.description),
            autocomplete: "off",
        }));
        const __VLS_44 = __VLS_43({
            modelValue: (__VLS_ctx.form.description),
            autocomplete: "off",
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        var __VLS_41;
        const __VLS_46 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
            label: "开始时间",
            prop: "startTime",
        }));
        const __VLS_48 = __VLS_47({
            label: "开始时间",
            prop: "startTime",
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        __VLS_49.slots.default;
        const __VLS_50 = {}.ElDatePicker;
        /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
            modelValue: (__VLS_ctx.form.startTime),
            type: "date",
            placeholder: "选择日期",
        }));
        const __VLS_52 = __VLS_51({
            modelValue: (__VLS_ctx.form.startTime),
            type: "date",
            placeholder: "选择日期",
        }, ...__VLS_functionalComponentArgsRest(__VLS_51));
        var __VLS_49;
        const __VLS_54 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
            label: "结束时间",
            prop: "endTime",
        }));
        const __VLS_56 = __VLS_55({
            label: "结束时间",
            prop: "endTime",
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        __VLS_57.slots.default;
        const __VLS_58 = {}.ElDatePicker;
        /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
            modelValue: (__VLS_ctx.form.endTime),
            type: "date",
            placeholder: "选择日期",
        }));
        const __VLS_60 = __VLS_59({
            modelValue: (__VLS_ctx.form.endTime),
            type: "date",
            placeholder: "选择日期",
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        var __VLS_57;
        const __VLS_62 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({}));
        const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
        __VLS_65.slots.default;
        const __VLS_66 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_68 = __VLS_67({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        let __VLS_70;
        let __VLS_71;
        let __VLS_72;
        const __VLS_73 = {
            onClick: (__VLS_ctx.handleCreateQuestionnaire)
        };
        __VLS_69.slots.default;
        var __VLS_69;
        const __VLS_74 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_76 = __VLS_75({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        let __VLS_78;
        let __VLS_79;
        let __VLS_80;
        const __VLS_81 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.showEdit))
                    return;
                if (!(__VLS_ctx.show))
                    return;
                __VLS_ctx.show = false;
            }
        };
        __VLS_77.slots.default;
        var __VLS_77;
        var __VLS_65;
        var __VLS_27;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "questionnaire" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "questionList" },
    });
    const __VLS_82 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
        data: (__VLS_ctx.questionList),
    }));
    const __VLS_84 = __VLS_83({
        data: (__VLS_ctx.questionList),
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    __VLS_85.slots.default;
    const __VLS_86 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        prop: "content",
        label: "题目名称",
        width: "180",
    }));
    const __VLS_88 = __VLS_87({
        prop: "content",
        label: "题目名称",
        width: "180",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const __VLS_90 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        prop: "type",
        label: "题目类型",
        width: "200",
    }));
    const __VLS_92 = __VLS_91({
        prop: "type",
        label: "题目类型",
        width: "200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    var __VLS_85;
    const __VLS_94 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_96 = __VLS_95({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    let __VLS_98;
    let __VLS_99;
    let __VLS_100;
    const __VLS_101 = {
        onClick: (__VLS_ctx.handlePublish)
    };
    __VLS_97.slots.default;
    var __VLS_97;
}
if (__VLS_ctx.showEdit) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "editQuestion" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    const __VLS_102 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
        ...{ style: {} },
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_106;
    let __VLS_107;
    let __VLS_108;
    const __VLS_109 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.showEdit))
                return;
            __VLS_ctx.showEdit = false;
        }
    };
    __VLS_105.slots.default;
    var __VLS_105;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dropdown-container" },
    });
    const __VLS_110 = {}.ElDropdown;
    /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "el-dropdown-link" },
    });
    const __VLS_114 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        ...{ class: "el-icon--right" },
    }));
    const __VLS_116 = __VLS_115({
        ...{ class: "el-icon--right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    __VLS_117.slots.default;
    const __VLS_118 = {}.ArrowDown;
    /** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({}));
    const __VLS_120 = __VLS_119({}, ...__VLS_functionalComponentArgsRest(__VLS_119));
    var __VLS_117;
    const __VLS_122 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({}));
    const __VLS_124 = __VLS_123({}, ...__VLS_functionalComponentArgsRest(__VLS_123));
    {
        const { dropdown: __VLS_thisSlot } = __VLS_125.slots;
        const __VLS_126 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
            ...{ 'onClick': {} },
        }));
        const __VLS_128 = __VLS_127({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_127));
        let __VLS_130;
        let __VLS_131;
        let __VLS_132;
        const __VLS_133 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showEdit))
                    return;
                __VLS_ctx.type = 3;
            }
        };
        __VLS_129.slots.default;
        var __VLS_129;
        const __VLS_134 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
            ...{ 'onClick': {} },
        }));
        const __VLS_136 = __VLS_135({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        let __VLS_138;
        let __VLS_139;
        let __VLS_140;
        const __VLS_141 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showEdit))
                    return;
                __VLS_ctx.type = 1;
            }
        };
        __VLS_137.slots.default;
        var __VLS_137;
        const __VLS_142 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
            ...{ 'onClick': {} },
        }));
        const __VLS_144 = __VLS_143({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_143));
        let __VLS_146;
        let __VLS_147;
        let __VLS_148;
        const __VLS_149 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showEdit))
                    return;
                __VLS_ctx.type = 2;
            }
        };
        __VLS_145.slots.default;
        var __VLS_145;
    }
    var __VLS_125;
    var __VLS_113;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-container" },
    });
    const __VLS_150 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
        model: (__VLS_ctx.formdata),
        rules: (__VLS_ctx.rules),
        ref: "formRef",
        labelWidth: "120px",
    }));
    const __VLS_152 = __VLS_151({
        model: (__VLS_ctx.formdata),
        rules: (__VLS_ctx.rules),
        ref: "formRef",
        labelWidth: "120px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    /** @type {typeof __VLS_ctx.formRef} */ ;
    var __VLS_154 = {};
    __VLS_153.slots.default;
    const __VLS_156 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        label: "请输入题目",
        prop: "content",
    }));
    const __VLS_158 = __VLS_157({
        label: "请输入题目",
        prop: "content",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    const __VLS_160 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        modelValue: (__VLS_ctx.formdata.content),
    }));
    const __VLS_162 = __VLS_161({
        modelValue: (__VLS_ctx.formdata.content),
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    var __VLS_159;
    if (__VLS_ctx.type !== 3) {
        const __VLS_164 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            label: "请输入选项",
            prop: "options",
        }));
        const __VLS_166 = __VLS_165({
            label: "请输入选项",
            prop: "options",
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        __VLS_167.slots.default;
        const __VLS_168 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            modelValue: (__VLS_ctx.formdata.options[0].optionContent),
        }));
        const __VLS_170 = __VLS_169({
            modelValue: (__VLS_ctx.formdata.options[0].optionContent),
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        const __VLS_172 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            modelValue: (__VLS_ctx.formdata.options[1].optionContent),
        }));
        const __VLS_174 = __VLS_173({
            modelValue: (__VLS_ctx.formdata.options[1].optionContent),
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        const __VLS_176 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            modelValue: (__VLS_ctx.formdata.options[2].optionContent),
        }));
        const __VLS_178 = __VLS_177({
            modelValue: (__VLS_ctx.formdata.options[2].optionContent),
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        const __VLS_180 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            modelValue: (__VLS_ctx.formdata.options[3].optionContent),
        }));
        const __VLS_182 = __VLS_181({
            modelValue: (__VLS_ctx.formdata.options[3].optionContent),
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        var __VLS_167;
    }
    const __VLS_184 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({}));
    const __VLS_186 = __VLS_185({}, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    const __VLS_188 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        ...{ 'onClick': {} },
    }));
    const __VLS_190 = __VLS_189({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    let __VLS_192;
    let __VLS_193;
    let __VLS_194;
    const __VLS_195 = {
        onClick: (__VLS_ctx.addQuestions)
    };
    __VLS_191.slots.default;
    var __VLS_191;
    var __VLS_187;
    var __VLS_153;
}
/** @type {__VLS_StyleScopedClasses['showQuestionnaire']} */ ;
/** @type {__VLS_StyleScopedClasses['questionnaire']} */ ;
/** @type {__VLS_StyleScopedClasses['createQuestionnaire']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-ruleForm']} */ ;
/** @type {__VLS_StyleScopedClasses['questionnaire']} */ ;
/** @type {__VLS_StyleScopedClasses['questionList']} */ ;
/** @type {__VLS_StyleScopedClasses['editQuestion']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-container']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dropdown-link']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
// @ts-ignore
var __VLS_29 = __VLS_28, __VLS_155 = __VLS_154;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            ElTableColumn: ElTableColumn,
            ElButton: ElButton,
            ElDropdown: ElDropdown,
            ElDropdownMenu: ElDropdownMenu,
            ElDropdownItem: ElDropdownItem,
            ElIcon: ElIcon,
            ArrowDown: ArrowDown,
            form: form,
            ifCreate: ifCreate,
            show: show,
            showEdit: showEdit,
            questionList: questionList,
            type: type,
            formdata: formdata,
            addQuestions: addQuestions,
            handleCreateQuestionnaire: handleCreateQuestionnaire,
            handlePublish: handlePublish,
            handleDelete: handleDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Question.vue.js.map