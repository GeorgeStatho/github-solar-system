import { Moon } from "./Moon";
import { Asteroid } from "./AsteroidRing";
import { RepoData } from "../types";
import languageColors from "../utils/languageColors";
import { calculateImportance } from "../utils/calculateImportance";
import { scaleSqrt } from "../utils/scales";

export class Planet{
    name:string;
    date:string;
    imageUrl:string;
    commitCount:number;
    branchCount:number;
    size:number;
    importance:number;
    color:string;
    isUserPlanet:boolean;
    hasRing:boolean;
    moons:Moon[];
    asteroids:Asteroid[];
    constructor(name:string){
        this.name=name;
        this.date="";
        this.imageUrl="";
        this.commitCount=0;
        this.branchCount=0;
        this.size=0;
        this.importance=0;
        this.color="";
        this.isUserPlanet=false;
        this.hasRing=true;
        this.moons=[];
        this.asteroids=[];
    }

    determineColor(languages:string[]){
        const primaryLanguage = languages[0]?.toLowerCase();
        return languageColors[primaryLanguage] ?? "#94a3b8";
    }

    createPlanet(repo:RepoData){
        this.date=repo.date;
        this.commitCount=repo.commitCount;
        this.branchCount=repo.branchCount;
        this.importance=calculateImportance(repo.date,repo.commitCount,repo.branchCount);
        this.color=this.determineColor(repo.languages);
        this.moons = [];
        for (let branch of repo.branches){
            const moon=new Moon();
            moon.CreateMoon(branch);
            this.moons.push(moon);
        }
    }

    setRelativeSize(averageImportantCommitCount:number){
        const safeAverage = Math.max(averageImportantCommitCount, 1);
        const relativeCommitCount = this.commitCount / safeAverage;

        this.size = scaleSqrt(relativeCommitCount, 0.2, 2.4, 28, 64);
    }

}
