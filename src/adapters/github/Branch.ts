import Commit from "./Commit";
import { BranchData } from "../../core/types";

export class Branch{
    name:string;
    date:string;
    commitCount:number;
    commits:Commit[];


    constructor(name:string,date:string,commitCount:number=0){
        this.name=name;
        this.date=date;
        this.commitCount=commitCount;
        this.commits=[];
    }

    fillCommits(commitNodes: any[] = []) {
        this.commits = [];

        for (const commit of commitNodes) {
            this.commits.push(
                new Commit(
                    commit.messageHeadline,
                    commit.committedDate,
                    commit.additions + commit.deletions
                )
            );
        }
    }

    toBranchData(): BranchData {
        return {
            name: this.name,
            date: this.date,
            commitCount: this.commitCount,
        };
    }

}
