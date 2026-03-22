import {Repo} from "./Repo";
import { getRepos } from "./gitAPI";
import { SolarSystemData, UserData } from "../../core/types";

export class GitUser{
    name:string;
    avatarUrl:string;
    Repos:Repo[];

    constructor(name:string){
        this.name=name;
        this.avatarUrl="";
        this.Repos=[];
    }

    async fillRepos(){
        const result =await getRepos(this.name);
        const userData = result?.data?.user;

        if (!userData) {
            throw new Error(
                `GitHub user "${this.name}" was not found or did not return repository contribution data.`
            );
        }

        this.avatarUrl = userData.avatarUrl ?? "";
        const repoNodes =
        userData.contributionsCollection?.commitContributionsByRepository ?? [];

        for (const repoData of repoNodes) {
            const repoName = repoData.repository.name;
            const repoCreatedAt = repoData.repository.createdAt;
            const repoCommitCount =
                repoData.repository.defaultBranchRef?.target?.history?.totalCount ?? 0;
            const repoLanguages =
                (repoData.repository.languages?.nodes ?? [])
                    .map((language: any) => language?.name)
                    .filter((language: string | undefined): language is string => Boolean(language));
            const repoBranchCount = repoData.repository.refs?.totalCount ?? 0;
            const repo = new Repo(
                repoName,
                repoCreatedAt,
                repoCommitCount,
                repoLanguages,
                repoBranchCount
            );
            repo.fillBranches(repoData.repository.refs?.nodes ?? []);
            this.Repos.push(repo);
        }
    }

    toUserData(): UserData {
        return {
            name: this.name,
            avatarUrl: this.avatarUrl,
        };
    }

    toSolarSystemData(): SolarSystemData {
        return {
            user: this.toUserData(),
            repos: this.Repos.map((repo) => repo.toRepoData()),
        };
    }

}
