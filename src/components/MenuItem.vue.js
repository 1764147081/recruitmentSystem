import { computed } from 'vue';
const props = defineProps({
    item: {
        type: Object,
        required: true,
        default: () => ({ id: 0, name: '', children: [] })
    },
});
const emit = defineEmits(['item-click']);
const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0;
});
const handleSubMenuOpen = (index) => {
    console.log('子菜单展开:', index);
};
const handleTitleClick = (e) => {
    e.stopPropagation();
    emit('item-click', props.item.id, props.item.isDepartment, props.item.parentId);
};
const handleItemClick = () => {
    emit('item-click', props.item.id, props.item.isDepartment, props.item.parentId);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.hasChildren) {
    const __VLS_0 = {}.ElSubMenu;
    /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onOpen': {} },
        index: (String(__VLS_ctx.item.id)),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onOpen': {} },
        index: (String(__VLS_ctx.item.id)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onOpen: (__VLS_ctx.handleSubMenuOpen)
    };
    var __VLS_8 = {};
    __VLS_3.slots.default;
    {
        const { title: __VLS_thisSlot } = __VLS_3.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (__VLS_ctx.handleTitleClick) },
        });
        (__VLS_ctx.item.name);
    }
    for (const [child] of __VLS_getVForSourceType((__VLS_ctx.item.children))) {
        const __VLS_9 = {}.MenuItem;
        /** @type {[typeof __VLS_components.MenuItem, typeof __VLS_components.menuItem, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
            ...{ 'onItemClick': {} },
            key: (child.id),
            item: (child),
        }));
        const __VLS_11 = __VLS_10({
            ...{ 'onItemClick': {} },
            key: (child.id),
            item: (child),
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        let __VLS_13;
        let __VLS_14;
        let __VLS_15;
        const __VLS_16 = {
            onItemClick: ((id, isDepartment, parentId) => __VLS_ctx.$emit('item-click', id, isDepartment, parentId))
        };
        var __VLS_12;
    }
    var __VLS_3;
}
else {
    const __VLS_17 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
        index: (String(__VLS_ctx.item.id)),
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        index: (String(__VLS_ctx.item.id)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onClick: (__VLS_ctx.handleItemClick)
    };
    var __VLS_25 = {};
    __VLS_20.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.item.name);
    var __VLS_20;
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
            hasChildren: hasChildren,
            handleSubMenuOpen: handleSubMenuOpen,
            handleTitleClick: handleTitleClick,
            handleItemClick: handleItemClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MenuItem.vue.js.map