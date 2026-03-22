export type BranchData = {
    name: string;
    date: string;
    commitCount: number;
};

export type RepoData = {
    name: string;
    date: string;
    commitCount: number;
    branchCount: number;
    languages: string[];
    branches: BranchData[];
};

export type UserData = {
    name: string;
    avatarUrl?: string;
};

export type SolarSystemData = {
    user: UserData;
    repos: RepoData[];
};
