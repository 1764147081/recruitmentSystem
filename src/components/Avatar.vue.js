import { computed } from 'vue';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
// 优先使用用户头像，如果没有则使用默认头像
const userAvatar = computed(() => {
    return userStore.userInfo.avatar ||
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    size: (80),
    src: (__VLS_ctx.userAvatar),
}));
const __VLS_2 = __VLS_1({
    size: (80),
    src: (__VLS_ctx.userAvatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            userAvatar: userAvatar,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Avatar.vue.js.map