import {
  scaleLog
} from "./chunk-6GIA5QFT.js";

// src/react.ts
import "./styles-F2YWWC2P.css";

// src/react/RenderPlanets.tsx
import React from "react";

// src/react/PlanetRenderHelpers.ts
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = hash * 31 + value.charCodeAt(index) >>> 0;
  }
  return hash;
}
function getPlanetHref(planet, githubUserName) {
  if (planet.isUserPlanet) {
    return `https://github.com/${githubUserName}`;
  }
  return `https://github.com/${githubUserName}/${planet.name}`;
}
function getPlanetBiome(planet, forcedBiome) {
  if (forcedBiome) return forcedBiome;
  if (planet.isUserPlanet) return "star";
  const biomes = ["rocky", "gas", "ocean", "tech", "storm", "lava", "ice", "crystal"];
  const seed = hashString(`${planet.name}-${planet.date}-${planet.commitCount}-${planet.importance}`);
  return biomes[seed % biomes.length];
}
function getMoonAngle(planet, moonIndex, visibleMoonCount) {
  const seed = Math.sin((planet.importance + 1) * 17 + (moonIndex + 1) * 97 + visibleMoonCount * 31) * 1e4;
  const normalizedSeed = seed - Math.floor(seed);
  return normalizedSeed * Math.PI * 2;
}
function getMoonSize(rawMoonSize, averageMoonSize) {
  const safeAverage = Math.max(averageMoonSize, 1);
  const relativeMoonSize = rawMoonSize / safeAverage;
  return clamp(Math.max(8, Math.sqrt(relativeMoonSize) * 12), 8, 20);
}

// src/react/RenderPlanets.tsx
import "./Planet-GCGPJUS5.css";
import "./PlanetBiomes-VPREPIF4.css";
import "./Moon-ZTOVZFGD.css";
import "./Sun-GROVDCGC.css";
import "./Labels-VKFUCZTV.css";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function renderPlanetOrbit() {
  return /* @__PURE__ */ jsx("div", { className: "planet-orbit" });
}
function renderPlanetAtmosphere({ planet, glowSize }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "planet-atmosphere",
      style: {
        width: `${glowSize}px`,
        height: `${glowSize}px`,
        background: `radial-gradient(circle, ${planet.color}55 0%, ${planet.color}1f 42%, transparent 72%)`
      }
    }
  );
}
function renderPlanetRings({ planet, ringSize }) {
  const ringCount = planet.hasRing ? Math.max(1, Math.min(3, Math.floor(planet.commitCount / 25))) : 0;
  const biome = getPlanetBiome(planet);
  if (ringCount <= 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: ringCount }).map((_, index) => {
    const sizeOffset = index * 12;
    const tilt = -18 + index * 6;
    return /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `planet-rings planet-rings-back biome-${biome}`,
          style: {
            width: `${ringSize + sizeOffset}px`,
            height: `${(ringSize + sizeOffset) * 0.42}px`,
            ["--ring-tilt"]: `${tilt}deg`
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `planet-rings planet-rings-front biome-${biome}`,
          style: {
            width: `${ringSize + sizeOffset}px`,
            height: `${(ringSize + sizeOffset) * 0.42}px`,
            ["--ring-tilt"]: `${tilt}deg`
          }
        }
      )
    ] }, `planet-ring-${planet.name}-${index}`);
  }) });
}
function renderPlanetCore({ planet, planetSize }, githubUserName, forcedBiome) {
  const biome = getPlanetBiome(planet, forcedBiome);
  return /* @__PURE__ */ jsx(
    "a",
    {
      className: "planet-core-link",
      href: getPlanetHref(planet, githubUserName),
      target: "_blank",
      rel: "noreferrer",
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "planet-core",
          "data-biome": biome,
          style: {
            width: `${planetSize}px`,
            height: `${planetSize}px`,
            ["--planet-color"]: planet.color
          },
          children: [
            /* @__PURE__ */ jsx("div", { className: "planet-base" }),
            /* @__PURE__ */ jsx("div", { className: "planet-texture" }),
            /* @__PURE__ */ jsx("div", { className: "planet-shadow" }),
            /* @__PURE__ */ jsx("div", { className: "planet-rim-light" }),
            /* @__PURE__ */ jsx("div", { className: "planet-highlight" }),
            /* @__PURE__ */ jsx("div", { className: "planet-feature" })
          ]
        }
      )
    }
  );
}
function renderUserPlanetCore({ planet, planetSize }, githubUserName) {
  return /* @__PURE__ */ jsx(
    "a",
    {
      className: "planet-core-link",
      href: getPlanetHref(planet, githubUserName),
      target: "_blank",
      rel: "noreferrer",
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "planet-core user-planet-core",
          style: {
            width: `${planetSize}px`,
            height: `${planetSize}px`,
            background: `radial-gradient(circle at 30% 30%, #fff7cc 0%, #ffd76a 24%, ${planet.color} 52%, #7c3b00 100%)`,
            boxShadow: `0 0 34px ${planet.color}aa, 0 0 70px ${planet.color}55, inset -12px -14px 22px rgba(124, 59, 0, 0.35)`
          },
          children: [
            planet.imageUrl ? /* @__PURE__ */ jsx(
              "img",
              {
                className: "user-planet-avatar",
                src: planet.imageUrl,
                alt: `${planet.name} avatar`
              }
            ) : null,
            /* @__PURE__ */ jsx("div", { className: "planet-surface user-planet-surface" }),
            /* @__PURE__ */ jsx("div", { className: "planet-highlight user-planet-highlight" }),
            /* @__PURE__ */ jsx("div", { className: "sun-corona sun-corona-outer" }),
            /* @__PURE__ */ jsx("div", { className: "sun-corona sun-corona-inner" })
          ]
        }
      )
    }
  );
}
function renderPlanetMoons({ planet, planetSize }) {
  const visibleMoons = [...planet.moons].sort((left, right) => right.importance - left.importance).slice(0, 5);
  const moonOrbitSize = planetSize + 68;
  const maxMoonSize = Math.max(...visibleMoons.map((moon) => moon.size || 1), 1);
  const averageMoonSize = visibleMoons.reduce((total, moon) => total + (moon.size || 1), 0) / Math.max(visibleMoons.length, 1);
  return /* @__PURE__ */ jsxs("div", { className: "planet-moons", children: [
    visibleMoons.length > 0 ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "moon-orbit-ring",
        style: {
          width: `${moonOrbitSize}px`,
          height: `${moonOrbitSize}px`
        }
      }
    ) : null,
    visibleMoons.map((moon, index) => {
      const angle = getMoonAngle(planet, index, visibleMoons.length);
      const moonSize = getMoonSize(moon.size || 1, averageMoonSize);
      const orbitDuration = scaleLog(moon.size || 1, 1, maxMoonSize, 6, 20);
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "moon-orbit",
          style: {
            width: `${moonOrbitSize}px`,
            height: `${moonOrbitSize}px`,
            ["--moon-orbit-duration"]: `${orbitDuration}s`,
            ["--moon-orbit-angle"]: `${angle}rad`
          },
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "moon",
              title: moon.name,
              style: {
                width: `${moonSize}px`,
                height: `${moonSize}px`
              }
            }
          )
        },
        `${moon.name}-${index}`
      );
    })
  ] });
}
function renderPlanetLabel({ planet, branchCount }) {
  return /* @__PURE__ */ jsxs("div", { className: "planet-label", children: [
    /* @__PURE__ */ jsx("div", { className: "planet-label-name", children: planet.name }),
    /* @__PURE__ */ jsxs("div", { className: "planet-label-meta", children: [
      branchCount,
      " branches"
    ] })
  ] });
}
function renderUserPlanetLabel({ planet }) {
  return /* @__PURE__ */ jsxs("div", { className: "planet-label user-planet-label", children: [
    /* @__PURE__ */ jsx("div", { className: "planet-label-name", children: planet.name }),
    /* @__PURE__ */ jsx("div", { className: "planet-label-meta", children: "GitHub sun" })
  ] });
}
function renderUserPlanet(layerProps, githubUserName) {
  const { glowSize } = layerProps;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "planet-atmosphere user-planet-atmosphere",
        style: {
          width: `${glowSize * 1.15}px`,
          height: `${glowSize * 1.15}px`,
          background: "radial-gradient(circle, rgba(255,220,120,0.58) 0%, rgba(255,177,64,0.28) 42%, transparent 74%)"
        }
      }
    ),
    renderUserPlanetCore(layerProps, githubUserName)
  ] });
}
function RenderPlanet({ planet, githubUserName, forcedBiome }) {
  const planetSize = planet.size;
  const glowSize = planetSize * 1.8;
  const ringSize = planetSize * 1.55;
  const visualBoxSize = glowSize + 40;
  const layerProps = {
    planet,
    planetSize,
    glowSize,
    ringSize,
    branchCount: planet.branchCount
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "planet-system",
      "data-planet-type": planet.isUserPlanet ? "user" : "repo",
      style: {
        width: `${glowSize + 120}px`,
        height: `${glowSize + 120}px`,
        ["--planet-color"]: planet.color
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "planet-visual-anchor", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "planet-visual-box",
            style: {
              width: `${visualBoxSize}px`,
              height: `${visualBoxSize}px`
            },
            children: planet.isUserPlanet ? renderUserPlanet(layerProps, githubUserName) : /* @__PURE__ */ jsxs(Fragment, { children: [
              renderPlanetOrbit(),
              renderPlanetAtmosphere(layerProps),
              renderPlanetRings(layerProps),
              renderPlanetCore(layerProps, githubUserName, forcedBiome),
              renderPlanetMoons(layerProps)
            ] })
          }
        ) }),
        planet.isUserPlanet ? renderUserPlanetLabel(layerProps) : renderPlanetLabel(layerProps)
      ]
    }
  );
}
var RenderPlanets_default = RenderPlanet;

// src/react/SolarSystemHelpers.ts
var ringSizes = [380, 600, 840, 1e3, 1100];
function getRecencyRingIndex(planet) {
  const updatedAt = new Date(planet.date).getTime();
  const now = Date.now();
  const ageInDays = (now - updatedAt) / (1e3 * 60 * 60 * 24);
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
function greatestCommonDivisor(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || 1;
}
function hashString2(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = hash * 31 + value.charCodeAt(index) >>> 0;
  }
  return hash;
}
function getPlanetSlotStyle(ringIndex, slotIndex, slotCount) {
  const baseRingRadius = ringSizes[Math.min(ringIndex, ringSizes.length - 1)] / 2;
  const angleSeed = Math.sin((ringIndex + 1) * 97 + (slotIndex + 1) * 131 + slotCount * 53) * 1e4;
  const normalizedAngleSeed = angleSeed - Math.floor(angleSeed);
  const radiusSeed = Math.sin((ringIndex + 1) * 191 + (slotIndex + 1) * 173 + slotCount * 67) * 1e4;
  const normalizedRadiusSeed = radiusSeed - Math.floor(radiusSeed);
  const separationStep = Math.PI * 2 / Math.max(slotCount, 1);
  let slotJump = Math.max(2, Math.floor(slotCount / 2) + ringIndex + 1);
  while (slotCount > 1 && greatestCommonDivisor(slotJump, slotCount) !== 1) {
    slotJump += 1;
  }
  const distributedIndex = slotCount > 1 ? slotIndex * slotJump % slotCount : 0;
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
    zIndex
  };
}
function getDeadPlanetSlotStyle(planet, index, slotCount) {
  const angleSeed = Math.sin((index + 1) * 149 + slotCount * 61) * 1e4;
  const normalizedAngleSeed = angleSeed - Math.floor(angleSeed);
  const radiusSeed = Math.sin(hashString2(`${planet.name}-${index}`) * 173e-5) * 1e4;
  const normalizedRadiusSeed = radiusSeed - Math.floor(radiusSeed);
  const separationStep = Math.PI * 2 / Math.max(slotCount, 1);
  let slotJump = Math.max(2, Math.floor(slotCount / 2) + 3);
  while (slotCount > 1 && greatestCommonDivisor(slotJump, slotCount) !== 1) {
    slotJump += 1;
  }
  const distributedIndex = slotCount > 1 ? index * slotJump % slotCount : 0;
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
    zIndex
  };
}

// src/react/RenderSolarSystem.tsx
import "./SolarSystem-B7UQMPEC.css";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function RenderRings() {
  const tilt = 0.48;
  return /* @__PURE__ */ jsx2("div", { className: "solar-system-rings", "aria-hidden": "true", children: ringSizes.map((size, index) => /* @__PURE__ */ jsx2(
    "div",
    {
      className: "solar-system-ring",
      style: {
        width: `${size}px`,
        height: `${size * tilt}px`,
        opacity: `${0.34 - index * 0.04}`
      }
    },
    size
  )) });
}
function renderOverflowDot(planet, githubUserName, index, dotCount) {
  const style = getDeadPlanetSlotStyle(planet, index, dotCount);
  const dotSize = Math.max(5, Math.min(10, 4 + planet.importance / 20));
  const href = `https://github.com/${githubUserName}/${planet.name}`;
  return /* @__PURE__ */ jsxs2(
    "a",
    {
      className: "solar-system-overflow-dot-slot",
      href,
      target: "_blank",
      rel: "noreferrer",
      style,
      children: [
        /* @__PURE__ */ jsx2(
          "div",
          {
            className: "solar-system-overflow-dot",
            style: {
              width: `${dotSize}px`,
              height: `${dotSize}px`
            }
          }
        ),
        /* @__PURE__ */ jsx2("div", { className: "solar-system-overflow-dot-label", children: planet.name })
      ]
    },
    `${planet.name}-dot-${index}`
  );
}
function RenderSolarSystem({ system }) {
  const userPlanet = system.planets.find((planet) => planet.isUserPlanet);
  const repoPlanets = system.planets.filter((planet) => !planet.isUserPlanet).sort((left, right) => right.importance - left.importance);
  const visibleRepoPlanets = repoPlanets.slice(0, 9);
  const deadRepoPlanets = repoPlanets.slice(9, 29);
  const overflowDotPlanets = repoPlanets.slice(29);
  const planetsByRing = visibleRepoPlanets.reduce((groups, planet) => {
    const ringIndex = getRecencyRingIndex(planet);
    const group = groups[ringIndex] ?? [];
    group.push(planet);
    groups[ringIndex] = group;
    return groups;
  }, {});
  return /* @__PURE__ */ jsx2("section", { className: "solar-system-stage", children: /* @__PURE__ */ jsxs2("div", { className: "solar-system-scene solar-system-container", children: [
    /* @__PURE__ */ jsx2(RenderRings, {}),
    userPlanet ? /* @__PURE__ */ jsx2(
      "div",
      {
        className: "solar-system-planet-slot solar-system-sun-slot",
        children: /* @__PURE__ */ jsx2(RenderPlanets_default, { planet: userPlanet, githubUserName: system.user.name })
      },
      `${userPlanet.name}-sun`
    ) : null,
    Object.entries(planetsByRing).flatMap(
      ([ringKey, planets]) => planets.map((planet, index) => /* @__PURE__ */ jsx2(
        "div",
        {
          className: "solar-system-planet-slot solar-system-orbiting-planet-slot",
          style: getPlanetSlotStyle(Number(ringKey), index, planets.length),
          children: /* @__PURE__ */ jsx2(RenderPlanets_default, { planet, githubUserName: system.user.name })
        },
        `${planet.name}-${ringKey}-${index}`
      ))
    ),
    deadRepoPlanets.map((planet, index) => /* @__PURE__ */ jsx2(
      "div",
      {
        className: "solar-system-planet-slot solar-system-orbiting-planet-slot solar-system-dead-planet-slot",
        style: getDeadPlanetSlotStyle(planet, index, deadRepoPlanets.length),
        children: /* @__PURE__ */ jsx2(
          RenderPlanets_default,
          {
            planet,
            githubUserName: system.user.name,
            forcedBiome: "dead"
          }
        )
      },
      `${planet.name}-dead-${index}`
    )),
    overflowDotPlanets.map(
      (planet, index) => renderOverflowDot(planet, system.user.name, index, overflowDotPlanets.length)
    )
  ] }) });
}
var RenderSolarSystem_default = RenderSolarSystem;
export {
  RenderSolarSystem_default as RenderSolarSystem
};
