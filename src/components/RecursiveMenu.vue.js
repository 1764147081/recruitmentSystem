import { ref } from 'vue';
import MenuItem from './MenuItem.vue';
import { useStationStore } from '../store/station';
const stationStore = useStationStore();
const props = defineProps({
    menuData: Array,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    isCollapse: Boolean,
});
const activeMenu = ref('');
// 直接监听子组件的 item-click 事件
const handleItemClick = (itemId, isDepartment, parentId) => {
    console.log('当前选中项 ID:', itemId);
    activeMenu.value = itemId;
    stationStore.changeId(itemId);
    stationStore.changeIsDepartment(isDepartment);
    stationStore.changeParentId(parentId);
    console.log(stationStore.getIsDepartment);
    console.log(stationStore.getId);
    console.log(stationStore.getParentId);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    defaultActive: (__VLS_ctx.activeMenu),
    ...{ class: "el-menu-vertical" },
    backgroundColor: (__VLS_ctx.backgroundColor),
    textColor: (__VLS_ctx.textColor),
    activeTextColor: (__VLS_ctx.activeTextColor),
    collapse: (__VLS_ctx.isCollapse),
}));
const __VLS_2 = __VLS_1({
    defaultActive: (__VLS_ctx.activeMenu),
    ...{ class: "el-menu-vertical" },
    backgroundColor: (__VLS_ctx.backgroundColor),
    textColor: (__VLS_ctx.textColor),
    activeTextColor: (__VLS_ctx.activeTextColor),
    collapse: (__VLS_ctx.isCollapse),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.menuData))) {
    /** @type {[typeof MenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(MenuItem, new MenuItem({
        ...{ 'onItemClick': {} },
        key: (item.id),
        item: (item),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onItemClick': {} },
        key: (item.id),
        item: (item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onItemClick: (__VLS_ctx.handleItemClick)
    };
    var __VLS_7;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            MenuItem: MenuItem,
            activeMenu: activeMenu,
            handleItemClick: handleItemClick,
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
//# sourceMappingURL=RecursiveMenu.vue.js.map