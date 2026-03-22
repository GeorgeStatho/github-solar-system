import { S as SolarSystemData, a as SolarSystem } from './SolarSystem-aHm4KCfq.js';
export { B as BranchData, R as RepoData, U as UserData } from './SolarSystem-aHm4KCfq.js';

declare function createSolarSystemData(data: SolarSystemData): SolarSystem;

declare function mapGitHubReposToSolarSystem(userName: string): Promise<SolarSystem>;

export { SolarSystemData, createSolarSystemData, mapGitHubReposToSolarSystem };
