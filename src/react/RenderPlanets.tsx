import React from "react";
import { Planet } from "../core/models/Planet";
import { scaleLog } from "../core/utils/scales";
import {
    getMoonAngle,
    getMoonSize,
    getPlanetBiome,
    getPlanetHref,
} from "./PlanetRenderHelpers";
import "../styles/Planet.css";
import "../styles/planet-biomes/PlanetBiomes.css";
import "../styles/Moon.css";
import "../styles/Sun.css";
import "../styles/Labels.css";

type RenderPlanetProps = {
    planet: Planet;
    githubUserName: string;
    forcedBiome?: string;
};

type PlanetLayerProps = {
    planet: Planet;
    planetSize: number;
    glowSize: number;
    ringSize: number;
    branchCount: number;
};

function renderPlanetOrbit(){
    return <div className="planet-orbit" />;
}

function renderPlanetAtmosphere({ planet, glowSize }: PlanetLayerProps) {
    return (
        <div
            className="planet-atmosphere"
            style={{
                width: `${glowSize}px`,
                height: `${glowSize}px`,
                background: `radial-gradient(circle, ${planet.color}55 0%, ${planet.color}1f 42%, transparent 72%)`,
            }}
        />
    );
}

function renderPlanetRings({ planet, ringSize }: PlanetLayerProps) {
    const ringCount = planet.hasRing ? Math.max(1, Math.min(3, Math.floor(planet.commitCount / 25))) : 0;
    const biome = getPlanetBiome(planet);

    if (ringCount <= 0) {
        return null;
    }

    return (
        <>
            {Array.from({ length: ringCount }).map((_, index) => {
                const sizeOffset = index * 12;
                const tilt = -18 + index * 6;

                return (
                    <React.Fragment key={`planet-ring-${planet.name}-${index}`}>
                        <div
                            className={`planet-rings planet-rings-back biome-${biome}`}
                            style={{
                                width: `${ringSize + sizeOffset}px`,
                                height: `${(ringSize + sizeOffset) * 0.42}px`,
                                ["--ring-tilt" as string]: `${tilt}deg`,
                            }}
                        />
                        <div
                            className={`planet-rings planet-rings-front biome-${biome}`}
                            style={{
                                width: `${ringSize + sizeOffset}px`,
                                height: `${(ringSize + sizeOffset) * 0.42}px`,
                                ["--ring-tilt" as string]: `${tilt}deg`,
                            }}
                        />
                    </React.Fragment>
                );
            })}
        </>
    );
}

function renderPlanetCore(
    { planet, planetSize }: PlanetLayerProps,
    githubUserName:string,
    forcedBiome?: string
) {
    const biome = getPlanetBiome(planet, forcedBiome);

    return (
        <a
            className="planet-core-link"
            href={getPlanetHref(planet, githubUserName)}
            target="_blank"
            rel="noreferrer"
        >
            <div
                className="planet-core"
                data-biome={biome}
                style={{
                    width: `${planetSize}px`,
                    height: `${planetSize}px`,
                    ["--planet-color" as string]: planet.color,
                } as React.CSSProperties}
            >
                <div className="planet-base" />
                <div className="planet-texture" />
                <div className="planet-shadow" />
                <div className="planet-rim-light" />
                <div className="planet-highlight" />
                <div className="planet-feature" />
            </div>
        </a>
    );
}

function renderUserPlanetCore({ planet, planetSize }:PlanetLayerProps, githubUserName:string){
    return (
        <a
            className="planet-core-link"
            href={getPlanetHref(planet, githubUserName)}
            target="_blank"
            rel="noreferrer"
        >
            <div
                className="planet-core user-planet-core"
                style={{
                    width: `${planetSize}px`,
                    height: `${planetSize}px`,
                    background: `radial-gradient(circle at 30% 30%, #fff7cc 0%, #ffd76a 24%, ${planet.color} 52%, #7c3b00 100%)`,
                    boxShadow: `0 0 34px ${planet.color}aa, 0 0 70px ${planet.color}55, inset -12px -14px 22px rgba(124, 59, 0, 0.35)`,
                }}
            >
                {planet.imageUrl ? (
                    <img
                        className="user-planet-avatar"
                        src={planet.imageUrl}
                        alt={`${planet.name} avatar`}
                    />
                ) : null}
                <div className="planet-surface user-planet-surface" />
                <div className="planet-highlight user-planet-highlight" />
                <div className="sun-corona sun-corona-outer" />
                <div className="sun-corona sun-corona-inner" />
            </div>
        </a>
    );
}

function renderPlanetMoons({ planet, planetSize }:PlanetLayerProps){
    const visibleMoons = [...planet.moons]
        .sort((left, right) => right.importance - left.importance)
        .slice(0, 5);
    const moonOrbitSize = planetSize + 68;
    const maxMoonSize = Math.max(...visibleMoons.map((moon) => moon.size || 1), 1);
    const averageMoonSize =
        visibleMoons.reduce((total, moon) => total + (moon.size || 1), 0) /
        Math.max(visibleMoons.length, 1);

    return (
        <div className="planet-moons">
            {visibleMoons.length > 0 ? (
                <div
                    className="moon-orbit-ring"
                    style={{
                        width: `${moonOrbitSize}px`,
                        height: `${moonOrbitSize}px`,
                    }}
                />
            ) : null}
            {visibleMoons.map((moon, index) => {
                const angle = getMoonAngle(planet, index, visibleMoons.length);
                const moonSize = getMoonSize(moon.size || 1, averageMoonSize);
                const orbitDuration = scaleLog(moon.size || 1,1,maxMoonSize,6,20);

                return (
                    <div
                        key={`${moon.name}-${index}`}
                        className="moon-orbit"
                        style={{
                            width: `${moonOrbitSize}px`,
                            height: `${moonOrbitSize}px`,
                            ["--moon-orbit-duration" as string]: `${orbitDuration}s`,
                            ["--moon-orbit-angle" as string]: `${angle}rad`,
                        }}
                    >
                        <div
                            className="moon"
                            title={moon.name}
                            style={{
                                width: `${moonSize}px`,
                                height: `${moonSize}px`,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

function renderPlanetLabel({ planet, branchCount }:PlanetLayerProps){
    return (
        <div className="planet-label">
            <div className="planet-label-name">{planet.name}</div>
            <div className="planet-label-meta">
                {branchCount} branches
            </div>
        </div>
    );
}

function renderUserPlanetLabel({ planet }:PlanetLayerProps){
    return (
        <div className="planet-label user-planet-label">
            <div className="planet-label-name">{planet.name}</div>
            <div className="planet-label-meta">GitHub sun</div>
        </div>
    );
}

function renderUserPlanet(layerProps:PlanetLayerProps, githubUserName:string){
    const { glowSize } = layerProps;

    return (
        <>
            <div
                className="planet-atmosphere user-planet-atmosphere"
                style={{
                    width: `${glowSize * 1.15}px`,
                    height: `${glowSize * 1.15}px`,
                    background: "radial-gradient(circle, rgba(255,220,120,0.58) 0%, rgba(255,177,64,0.28) 42%, transparent 74%)",
                }}
            />
            {renderUserPlanetCore(layerProps, githubUserName)}
        </>
    );
}

function RenderPlanet({ planet, githubUserName, forcedBiome }:RenderPlanetProps){
    const planetSize = planet.size;
    const glowSize = planetSize * 1.8;
    const ringSize = planetSize * 1.55;
    const visualBoxSize = glowSize + 40;
    const layerProps = {
        planet,
        planetSize,
        glowSize,
        ringSize,
        branchCount: planet.branchCount,
    };

    return (
        <div
            className="planet-system"
            data-planet-type={planet.isUserPlanet ? "user" : "repo"}
            style={{
                width: `${glowSize + 120}px`,
                height: `${glowSize + 120}px`,
                ["--planet-color" as string]: planet.color,
            }}
        >
            <div className="planet-visual-anchor">
                <div
                    className="planet-visual-box"
                    style={{
                        width: `${visualBoxSize}px`,
                        height: `${visualBoxSize}px`,
                    }}
                >
                {planet.isUserPlanet ? (
                    renderUserPlanet(layerProps, githubUserName)
                ) : (
                    <>
                        {renderPlanetOrbit()}
                        {renderPlanetAtmosphere(layerProps)}
                        {renderPlanetRings(layerProps)}
                        {renderPlanetCore(layerProps, githubUserName, forcedBiome)}
                        {renderPlanetMoons(layerProps)}
                    </>
                )}
                </div>
            </div>
            {planet.isUserPlanet ? renderUserPlanetLabel(layerProps) : renderPlanetLabel(layerProps)}
        </div>
    );
}

export default RenderPlanet;
