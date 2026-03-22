import {
  SolarSystem
} from "./chunk-6GIA5QFT.js";

// src/core/builders/createSolarSystemData.ts
function createSolarSystemData(data) {
  return new SolarSystem(data.user, data.repos);
}
export {
  createSolarSystemData
};
