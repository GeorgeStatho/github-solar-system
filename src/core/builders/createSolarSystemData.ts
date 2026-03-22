import { SolarSystemData } from "../types";
import { SolarSystem } from "../models/SolarSystem";

export function createSolarSystemData(data:SolarSystemData){
    return new SolarSystem(data.user, data.repos);
}
