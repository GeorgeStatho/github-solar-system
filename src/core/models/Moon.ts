import { BranchData } from "../types";
import { calculateImportance } from "../utils/calculateImportance";

export class Moon{
    name:string;
    size:number;
    type:string;
    importance:number;

    constructor(){
        this.name="main";
        this.size=1;
        this.type="";
        this.importance=0;
    }
    
    

    CreateMoon(branch:BranchData){
        this.name=branch.name;
        this.size=branch.commitCount;
        this.importance=calculateImportance(branch.date,branch.commitCount,0)
    }

    

}
