import React from "react";
import { Planet } from "../core/models/Planet";
import { SolarSystem } from "../core/models/SolarSystem";
import RenderPlanet from "./RenderPlanets";
import {
    getDeadPlanetSlotStyle,
    getPlanetSlotStyle,
    getRecencyRingIndex,
    ringSizes,
} from "./SolarSystemHelpers";
import "../styles/SolarSystem.css";

export function RenderRings() {
    const tilt = 0.48;

    return (
        <div className="solar-system-rings" aria-hidden="true">
            {ringSizes.map((size, index) => (
                <div
                    key={size}
                    className="solar-system-ring"
                    style={{
                        width: `${size}px`,
                        height: `${size * tilt}px`,
                        opacity: `${0.34 - index * 0.04}`,
                    }}
                />
            ))}
        </div>
    );
}

function renderOverflowDot(
    planet:Planet,
    githubUserName:string,
    index:number,
    dotCount:number
){
    const style = getDeadPlanetSlotStyle(planet, index, dotCount);
    const dotSize = Math.max(5, Math.min(10, 4 + planet.importance / 20));
    const href = `https://github.com/${githubUserName}/${planet.name}`;

    return (
        <a
            key={`${planet.name}-dot-${index}`}
            className="solar-system-overflow-dot-slot"
            href={href}
            target="_blank"
            rel="noreferrer"
            style={style}
        >
            <div
                className="solar-system-overflow-dot"
                style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                }}
            />
            <div className="solar-system-overflow-dot-label">
                {planet.name}
            </div>
        </a>
    );
}

function RenderSolarSystem({ system }:{ system: SolarSystem }){
    const userPlanet = system.planets.find((planet) => planet.isUserPlanet);
    const repoPlanets = system.planets
        .filter((planet) => !planet.isUserPlanet)
        .sort((left, right) => right.importance - left.importance);
    const visibleRepoPlanets = repoPlanets.slice(0, 9);
    const deadRepoPlanets = repoPlanets.slice(9, 29);
    const overflowDotPlanets = repoPlanets.slice(29);
    const planetsByRing = visibleRepoPlanets.reduce<Record<number, Planet[]>>((groups, planet) => {
        const ringIndex = getRecencyRingIndex(planet);
        const group = groups[ringIndex] ?? [];
        group.push(planet);
        groups[ringIndex] = group;
        return groups;
    }, {});

    return (
        <section className="solar-system-stage">
        <div className="solar-system-scene solar-system-container">
            <RenderRings />
            {userPlanet ? (
                <div
                    className="solar-system-planet-slot solar-system-sun-slot"
                    key={`${userPlanet.name}-sun`}
                >
                    <RenderPlanet planet={userPlanet} githubUserName={system.user.name} />
                </div>
            ) : null}
            {Object.entries(planetsByRing).flatMap(([ringKey, planets]) =>
                planets.map((planet, index) => (
                    <div
                        key={`${planet.name}-${ringKey}-${index}`}
                        className="solar-system-planet-slot solar-system-orbiting-planet-slot"
                        style={getPlanetSlotStyle(Number(ringKey), index, planets.length)}
                    >
                        <RenderPlanet planet={planet} githubUserName={system.user.name} />
                    </div>
                ))
            )}
            {deadRepoPlanets.map((planet, index) => (
                <div
                    key={`${planet.name}-dead-${index}`}
                    className="solar-system-planet-slot solar-system-orbiting-planet-slot solar-system-dead-planet-slot"
                    style={getDeadPlanetSlotStyle(planet, index, deadRepoPlanets.length)}
                >
                    <RenderPlanet
                        planet={planet}
                        githubUserName={system.user.name}
                        forcedBiome="dead"
                    />
                </div>
            ))}
            {overflowDotPlanets.map((planet, index) =>
                renderOverflowDot(planet, system.user.name, index, overflowDotPlanets.length)
            )}
        </div>
        </section>
    );
}

export default RenderSolarSystem;
