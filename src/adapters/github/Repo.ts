import { Branch } from "./Branch";
import { RepoData } from "../../core/types";

export class Repo{
    name:string;
    date:string;
    commitCount:number;
    branchCount:number;
    languages:string[];
    branches:Branch[];

    constructor(name:string,date:string,commitCount:number=0,languages:string[]=[],branchCount:number=0){
        this.name=name;
        this.date=date;
        this.commitCount=commitCount;
        this.branchCount=branchCount;
        this.languages=languages;
        this.branches=[];        
    }

    fillBranches(branchNodes: any[] = []) {
        this.branches = [];

        for (const branch of branchNodes) {
            const branchData = new Branch(
                branch.name,
                branch.target?.committedDate ?? "",
                branch.target?.history?.totalCount ?? 0
            );
            // getRepos no longer loads individual branch commits; keep the array shape intact.
            branchData.fillCommits(branch.target?.history?.nodes ?? []);
            this.branches.push(branchData);
        }
    }

    toRepoData(): RepoData {
        return {
            name: this.name,
            date: this.date,
            commitCount: this.commitCount,
            branchCount: this.branchCount,
            languages: this.languages,
            branches: this.branches.map((branch) => branch.toBranchData()),
        };
    }
}
