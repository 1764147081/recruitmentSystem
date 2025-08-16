import { defineStore } from 'pinia'
export interface Station{
    name:string,
    id:number,
    parentId:number,
    description:string,
    img:string,
    stationId:number,
    isDepartment:number,
    children:Station[]
}



export const useStationStore = defineStore('station',{
    actions:{
        changeName(value:string){
            this.name=value
        },
        changeId(value:number){
            this.id=value
        },
        changeParentId(value:number){
            this.parentId=value
        },
        changeDescription(value:string){
            this.description=value
        }
        ,
        addChild(child:Station){
            this.children.push(child)
        }
        ,
        changeImg(value:string){
            this.img=value
        }


    },
    getters:{
        getName():string{
            return this.name
        },
        getId():number{
            return this.id
        },
        getParentId():number{
            return this.parentId
        },
        getDescription():string{
            return this.description
        }
        ,
        getChildren(){
            return this.children
        }
        ,
        getImg():string{
            return this.img
        }


    },

    state(){
        return{
            name:'',
            id:0,
            parentId:0,
            description:'',
            img:'',
            stationId:0,
            isDepartment:0,
            children:[]


        }
    }
})
