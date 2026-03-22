import { Planet } from "../core/models/Planet";
import { SolarSystem } from "../core/models/SolarSystem";

export const ringSizes = [380, 600, 840, 1000, 1100];

export async function createSolarSystem(name:string){
    const system = new SolarSystem(name);
    await system.createSolarSystem();
    return system;
}

export function getRecencyRingIndex(planet:Planet){
    const updatedAt = new Date(planet.date).getTime();
    const now = Date.now();
    const ageInDays = (now - updatedAt) / (1000 * 60 * 60 * 24);

    if (!Number.isFinite(updatedAt)) {
        return ringSizes.length - 1;
    }

    if (ageInDays <= 20) {
        return 0;
    }

    if (ageInDays <= 45) {
        return 1;
    }

    if (ageInDays <= 90) {
        return 2;
    }

    if (ageInDays <= 365) {
        return 3;
    }

    return 4;
}

function greatestCommonDivisor(left:number, right:number){
    let a = Math.abs(left);
    let b = Math.abs(right);

    while (b !== 0) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }

    return a || 1;
}

function hashString(value:string){
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }

    return hash;
}

export function getPlanetSlotStyle(ringIndex: number, slotIndex: number, slotCount: number) {
    const baseRingRadius = ringSizes[Math.min(ringIndex, ringSizes.length - 1)] / 2;

    const angleSeed =
        Math.sin((ringIndex + 1) * 97 + (slotIndex + 1) * 131 + slotCount * 53) * 10000;
    const normalizedAngleSeed = angleSeed - Math.floor(angleSeed);
    const radiusSeed =
        Math.sin((ringIndex + 1) * 191 + (slotIndex + 1) * 173 + slotCount * 67) * 10000;
    const normalizedRadiusSeed = radiusSeed - Math.floor(radiusSeed);

    const separationStep = (Math.PI * 2) / Math.max(slotCount, 1);
    let slotJump = Math.max(2, Math.floor(slotCount / 2) + ringIndex + 1);

    while (slotCount > 1 && greatestCommonDivisor(slotJump, slotCount) !== 1) {
        slotJump += 1;
    }

    const distributedIndex = slotCount > 1 ? (slotIndex * slotJump) % slotCount : 0;
    const diagonalOffset = Math.PI / 4;
    const ringPhaseOffset = (ringIndex % 2 === 0 ? 1 : -1) * (Math.PI / 14);
    const seededPhaseOffset = (normalizedAngleSeed - 0.5) * Math.min(0.36, separationStep * 0.2);
    const baseAngle = distributedIndex * separationStep + diagonalOffset + ringPhaseOffset + seededPhaseOffset;
    const maxJitter = Math.min(0.3, separationStep * 0.16);
    const jitter = (normalizedAngleSeed - 0.5) * maxJitter * 2;
    const angle = baseAngle + jitter;

    const ringRadius = baseRingRadius + (normalizedRadiusSeed - 0.5) * Math.min(140, 60 + slotCount * 12);

    const tilt = 0.48;
    const x = Math.cos(angle) * ringRadius;
    const y = Math.sin(angle) * ringRadius * tilt;

    const depth = Math.sin(angle);
    const normalizedDepth = (depth + 1) / 2;

    const scale = 0.88 + normalizedDepth * 0.18;
    const opacity = 0.62 + normalizedDepth * 0.38;
    const zIndex = Math.round(20 + normalizedDepth * 100);

    return {
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        zIndex,
    };
}

export function getDeadPlanetSlotStyle(planet:Planet, index:number, slotCount:number){
    const angleSeed = Math.sin((index + 1) * 149 + slotCount * 61) * 10000;
    const normalizedAngleSeed = angleSeed - Math.floor(angleSeed);
    const radiusSeed = Math.sin(hashString(`${planet.name}-${index}`) * 0.00173) * 10000;
    const normalizedRadiusSeed = radiusSeed - Math.floor(radiusSeed);

    const separationStep = (Math.PI * 2) / Math.max(slotCount, 1);
    let slotJump = Math.max(2, Math.floor(slotCount / 2) + 3);

    while (slotCount > 1 && greatestCommonDivisor(slotJump, slotCount) !== 1) {
        slotJump += 1;
    }

    const distributedIndex = slotCount > 1 ? (index * slotJump) % slotCount : 0;
    const baseAngle = distributedIndex * separationStep;
    const angleJitter = (normalizedAngleSeed - 0.5) * Math.min(0.28, separationStep * 0.18) * 2;
    const angle = baseAngle + angleJitter;

    const innerRadius = ringSizes[ringSizes.length - 1] / 2 + 80;
    const outerRadius = innerRadius + Math.min(260, Math.max(120, slotCount * 14));
    const radius = innerRadius + normalizedRadiusSeed * (outerRadius - innerRadius);
    const tilt = 0.48;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * tilt;
    const depth = Math.sin(angle);
    const normalizedDepth = (depth + 1) / 2;
    const scale = 0.72 + normalizedDepth * 0.12;
    const opacity = 0.28 + normalizedDepth * 0.28;
    const zIndex = Math.round(4 + normalizedDepth * 18);

    return {
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        zIndex,
    };
}
