import { defineStore } from 'pinia';
export const useQuestionStore = defineStore('question', {
    state() {
        return {
            content: '',
            type: 0,
            options: []
        };
    },
    actions: {
        changeContent(value) {
            this.content = value;
        },
        changeType(value) {
            this.type = value;
        },
        addOption(option) {
            this.options.push(option);
        },
        changeOptionSort(value) {
            this.options[value].optionSort = value;
        },
        changeOptionContent(value, content) {
            this.options[value].optionContent = content;
        }
    },
    getters: {
        getContent() {
            return this.content;
        },
        getType() {
            return this.type;
        },
        getOptions() {
            return this.options;
        }
    }
});
//# sourceMappingURL=quetion.js.map