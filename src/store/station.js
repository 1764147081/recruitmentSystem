import { defineStore } from 'pinia';
export const useStationStore = defineStore('station', {
    actions: {
        changeName(value) {
            this.name = value;
        },
        changeId(value) {
            this.id = value;
        },
        changeParentId(value) {
            this.parentId = value;
        },
        changeDescription(value) {
            this.description = value;
        },
        addChild(child) {
            this.children.push(child);
        },
        changeImg(value) {
            this.img = value;
        },
        changeIsDepartment(value) {
            this.isDepartment = value;
        }
    },
    getters: {
        getName() {
            return this.name;
        },
        getId() {
            return this.id;
        },
        getParentId() {
            return this.parentId;
        },
        getDescription() {
            return this.description;
        },
        getChildren() {
            return this.children;
        },
        getImg() {
            return this.img;
        },
        getIsDepartment() {
            return this.isDepartment;
        }
    },
    state() {
        return {
            name: '',
            id: 0,
            parentId: 0,
            description: '',
            img: '',
            stationId: 0,
            isDepartment: 0,
            children: []
        };
    }
});
//# sourceMappingURL=station.js.map