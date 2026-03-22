import { Planet } from "../core/models/Planet";

function clamp(value:number,min:number,max:number){
    return Math.max(min,Math.min(max,value));
}

function hashString(value:string){
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }

    return hash;
}

export function getPlanetHref(planet:Planet, githubUserName:string){
    if (planet.isUserPlanet) {
        return `https://github.com/${githubUserName}`;
    }

    return `https://github.com/${githubUserName}/${planet.name}`;
}

export function getPlanetBiome(planet: Planet, forcedBiome?: string) {
    if (forcedBiome) return forcedBiome;
    if (planet.isUserPlanet) return "star";

    const biomes = ["rocky", "gas", "ocean", "tech","storm","lava","ice","crystal"];
    const seed = hashString(`${planet.name}-${planet.date}-${planet.commitCount}-${planet.importance}`);
    return biomes[seed % biomes.length];
}

export function getMoonAngle(planet:Planet, moonIndex:number, visibleMoonCount:number){
    const seed = Math.sin((planet.importance + 1) * 17 + (moonIndex + 1) * 97 + visibleMoonCount * 31) * 10000;
    const normalizedSeed = seed - Math.floor(seed);
    return normalizedSeed * Math.PI * 2;
}

export function getMoonSize(rawMoonSize:number, averageMoonSize:number){
    const safeAverage = Math.max(averageMoonSize, 1);
    const relativeMoonSize = rawMoonSize / safeAverage;

    return clamp(Math.max(8, Math.sqrt(relativeMoonSize) * 12), 8, 20);
}
