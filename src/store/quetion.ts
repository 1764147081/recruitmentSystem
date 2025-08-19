import { defineStore } from 'pinia'

export interface Question{
    content:string,
    type:number,
    options:Option[]
}
export interface Option{
    optionContent:string,
    optionSort:number

}

export const useQuestionStore = defineStore('question', {
    state(){
        return{
           content:'',
           type:0,
           options:[]
        }
    },
    actions:{
        changeContent(value:string){
            this.content=value
        }
        ,
        changeType(value:number){
            this.type=value
        }
        ,
        addOption(option:Option){
            this.options.push(option)
        }
        ,
        changeOptionSort(value:number){
            this.options[value].optionSort=value
        }
        ,
        changeOptionContent(value:number,content:string){
            this.options[value].optionContent=content
        }

    },
    getters:{
        getContent():string{
            return this.content
        },
        getType():number{
            return this.type    
        },
        getOptions():Option[]{
            return this.options
        }
    }
})

