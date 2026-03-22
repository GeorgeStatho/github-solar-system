// src/core/utils/calculateImportance.ts
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function getRecencyScore(date) {
  const updatedAt = new Date(date).getTime();
  if (!Number.isFinite(updatedAt)) {
    return 0;
  }
  const ageInDays = (Date.now() - updatedAt) / (1e3 * 60 * 60 * 24);
  return clamp(100 - ageInDays / 365 * 100, 0, 100);
}
function getLogScore(value, maxReference) {
  if (value <= 0) {
    return 0;
  }
  return clamp(Math.log(value + 1) / Math.log(maxReference + 1) * 100, 0, 100);
}
function calculateImportance(date, commits, xNum) {
  const recencyScore = getRecencyScore(date);
  const commitScore = getLogScore(commits, 500);
  const branchScore = getLogScore(xNum, 20);
  return 0.45 * recencyScore + 0.4 * commitScore + 0.15 * branchScore;
}

// src/core/models/Moon.ts
var Moon = class {
  name;
  size;
  type;
  importance;
  constructor() {
    this.name = "main";
    this.size = 1;
    this.type = "";
    this.importance = 0;
  }
  CreateMoon(branch) {
    this.name = branch.name;
    this.size = branch.commitCount;
    this.importance = calculateImportance(branch.date, branch.commitCount, 0);
  }
};

// src/core/utils/languageColors.ts
var languageColors = {
  javascript: "#f1e05a",
  python: "#3572A5",
  typescript: "#3178c6",
  sql: "#e38c00",
  shell: "#89e051",
  java: "#b07219",
  "c#": "#178600",
  "c++": "#f34b7d",
  c: "#555555",
  php: "#4F5D95",
  go: "#00ADD8",
  rust: "#dea584",
  kotlin: "#A97BFF",
  html: "#e34c26",
  css: "#563d7c"
};
var languageColors_default = languageColors;

// src/core/utils/scales.ts
function scaleSqrt(value, minValue, maxValue, minSize, maxSize) {
  if (maxValue <= minValue) return minSize;
  const safeValue = Math.max(value, minValue);
  const normalized = (Math.sqrt(safeValue) - Math.sqrt(minValue)) / (Math.sqrt(maxValue) - Math.sqrt(minValue));
  const clamped = Math.max(0, Math.min(1, normalized));
  return minSize + clamped * (maxSize - minSize);
}
function scaleLog(value, minValue, maxValue, minSize, maxSize) {
  if (maxValue <= minValue) return minSize;
  const normalized = (Math.log(value + 1) - Math.log(minValue + 1)) / (Math.log(maxValue + 1) - Math.log(minValue + 1));
  return minSize + normalized * (maxSize - minSize);
}

// src/core/models/Planet.ts
var Planet = class {
  name;
  date;
  imageUrl;
  commitCount;
  branchCount;
  size;
  importance;
  color;
  isUserPlanet;
  hasRing;
  moons;
  asteroids;
  constructor(name) {
    this.name = name;
    this.date = "";
    this.imageUrl = "";
    this.commitCount = 0;
    this.branchCount = 0;
    this.size = 0;
    this.importance = 0;
    this.color = "";
    this.isUserPlanet = false;
    this.hasRing = true;
    this.moons = [];
    this.asteroids = [];
  }
  determineColor(languages) {
    const primaryLanguage = languages[0]?.toLowerCase();
    return languageColors_default[primaryLanguage] ?? "#94a3b8";
  }
  createPlanet(repo) {
    this.date = repo.date;
    this.commitCount = repo.commitCount;
    this.branchCount = repo.branchCount;
    this.importance = calculateImportance(repo.date, repo.commitCount, repo.branchCount);
    this.color = this.determineColor(repo.languages);
    this.moons = [];
    for (let branch of repo.branches) {
      const moon = new Moon();
      moon.CreateMoon(branch);
      this.moons.push(moon);
    }
  }
  setRelativeSize(averageImportantCommitCount) {
    const safeAverage = Math.max(averageImportantCommitCount, 1);
    const relativeCommitCount = this.commitCount / safeAverage;
    this.size = scaleSqrt(relativeCommitCount, 0.2, 2.4, 28, 64);
  }
};

// src/core/models/SolarSystem.ts
var SolarSystem = class {
  planets;
  user;
  constructor(user, repos = []) {
    this.planets = [];
    this.user = {
      name: user.name,
      avatarUrl: user.avatarUrl ?? ""
    };
    this.createSolarSystem(repos);
  }
  createUserPlanet() {
    const userPlanet = new Planet(this.user.name);
    userPlanet.color = "#f4b942";
    userPlanet.importance = 999;
    userPlanet.size = 110;
    userPlanet.isUserPlanet = true;
    userPlanet.hasRing = false;
    userPlanet.imageUrl = this.user.avatarUrl ?? "";
    this.planets = [userPlanet];
  }
  applyPlanetSizes() {
    const repoPlanets = this.planets.filter((planet) => !planet.isUserPlanet);
    if (repoPlanets.length === 0) {
      return;
    }
    const importantPlanets = [...repoPlanets].sort((left, right) => right.importance - left.importance).slice(0, 5);
    const totalImportantCommits = importantPlanets.reduce(
      (total, planet) => total + planet.commitCount,
      0
    );
    const averageImportantCommitCount = totalImportantCommits / Math.max(importantPlanets.length, 1);
    for (const planet of repoPlanets) {
      planet.setRelativeSize(averageImportantCommitCount);
    }
  }
  createSolarSystem(repos) {
    this.createUserPlanet();
    let planet;
    for (const repo of repos) {
      planet = new Planet(repo.name);
      planet.createPlanet(repo);
      this.planets.push(planet);
    }
    this.applyPlanetSizes();
  }
};

export {
  calculateImportance,
  Moon,
  languageColors_default,
  scaleSqrt,
  scaleLog,
  Planet,
  SolarSystem
};
