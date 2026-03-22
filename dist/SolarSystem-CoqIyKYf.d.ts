type BranchData = {
    name: string;
    date: string;
    commitCount: number;
};
type RepoData = {
    name: string;
    date: string;
    commitCount: number;
    branchCount: number;
    languages: string[];
    branches: BranchData[];
};
type UserData = {
    name: string;
    avatarUrl?: string;
};
type SolarSystemData = {
    user: UserData;
    repos: RepoData[];
};

declare class Moon {
    name: string;
    size: number;
    type: string;
    importance: number;
    constructor();
    CreateMoon(branch: BranchData): void;
}

declare class Asteroid {
}

declare class Planet {
    name: string;
    date: string;
    imageUrl: string;
    commitCount: number;
    branchCount: number;
    size: number;
    importance: number;
    color: string;
    isUserPlanet: boolean;
    hasRing: boolean;
    moons: Moon[];
    asteroids: Asteroid[];
    constructor(name: string);
    determineColor(languages: string[]): string;
    createPlanet(repo: RepoData): void;
    setRelativeSize(averageImportantCommitCount: number): void;
}

declare class SolarSystem {
    planets: Planet[];
    user: UserData;
    constructor(user: UserData, repos?: RepoData[]);
    createUserPlanet(): void;
    applyPlanetSizes(): void;
    createSolarSystem(repos: RepoData[]): void;
}

export { Asteroid as A, type BranchData as B, Moon as M, Planet as P, type RepoData as R, type SolarSystemData as S, type UserData as U, SolarSystem as a };
