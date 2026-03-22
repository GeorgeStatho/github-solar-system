import { Planet } from "./Planet";
import { RepoData, UserData } from "../types";

export class SolarSystem{
    name:string;
    planets:Planet[];
    user:UserData;

    constructor(user:UserData, repos:RepoData[]=[]){
        this.name = user.name;
        this.planets=[];
        this.user={
            name:user.name,
            avatarUrl:user.avatarUrl ?? "",
        };
        this.createSolarSystem(repos);
    }

    createUserPlanet(){
        const userPlanet = new Planet(this.user.name);
        userPlanet.color="#f4b942";
        userPlanet.importance=999;
        userPlanet.size=110;
        userPlanet.isUserPlanet=true;
        userPlanet.hasRing=false;
        userPlanet.imageUrl=this.user.avatarUrl ?? "";
        this.planets = [userPlanet];
    }

    applyPlanetSizes(){
        const repoPlanets = this.planets.filter((planet) => !planet.isUserPlanet);

        if (repoPlanets.length === 0) {
            return;
        }

        const importantPlanets = [...repoPlanets]
            .sort((left, right) => right.importance - left.importance)
            .slice(0, 5);
        const totalImportantCommits = importantPlanets.reduce(
            (total, planet) => total + planet.commitCount,
            0
        );
        const averageImportantCommitCount = totalImportantCommits / Math.max(importantPlanets.length, 1);

        for (const planet of repoPlanets) {
            planet.setRelativeSize(averageImportantCommitCount);
        }
    }

    createSolarSystem(repos:RepoData[]) {
        this.createUserPlanet();
        let planet:Planet;
        for (const repo of repos) {
          planet=new Planet(repo.name);

          planet.createPlanet(repo)
          this.planets.push(planet);
        }

        this.applyPlanetSizes();
    }


}
