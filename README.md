# github-solar-system

`github-solar-system` is a React package for turning GitHub repository data into a solar-system style visualization.

It provides:
- core types for GitHub-style solar-system data
- a builder that turns plain data into a `SolarSystem` model
- a GitHub adapter that fetches a user's repo data and builds the model
- a React renderer for displaying the system
- packaged CSS for the default visuals, labels, moons, and biome styles

## What It Does

The package maps GitHub repository data into:
- a user "sun"
- important repositories as main planets
- additional repositories as outer dead planets or dots
- branches as moons

The default renderer includes:
- orbit rings
- biome-based planet styling
- animated moons and planet layers
- clickable planets linking to GitHub

## Installation

```bash
npm install github-solar-system
```

Peer dependencies:
- `react`
- `react-dom`

## Public API

Core entry:

```ts
import {
  createSolarSystemData,
  mapGitHubReposToSolarSystem,
  type BranchData,
  type RepoData,
  type UserData,
  type SolarSystemData
} from "github-solar-system";
```

React entry:

```tsx
import { RenderSolarSystem } from "github-solar-system/react";
import "github-solar-system/styles.css";
```

## Usage

### 1. Render from plain data

Use this when you already have repo and branch data from your own backend or API layer.

```ts
import {
  createSolarSystemData,
  type SolarSystemData
} from "github-solar-system";

const data: SolarSystemData = {
  user: {
    name: "octocat",
    avatarUrl: "https://github.com/images/error/octocat_happy.gif"
  },
  repos: [
    {
      name: "my-repo",
      date: "2026-03-20T12:00:00Z",
      commitCount: 48,
      branchCount: 6,
      languages: ["TypeScript", "CSS"],
      branches: [
        { name: "main", date: "2026-03-20T12:00:00Z", commitCount: 30 },
        { name: "feature-ui", date: "2026-03-18T09:00:00Z", commitCount: 10 }
      ]
    }
  ]
};

const system = createSolarSystemData(data);
```

Then render it:

```tsx
import { RenderSolarSystem } from "github-solar-system/react";
import "github-solar-system/styles.css";

export function App() {
  return <RenderSolarSystem system={system} />;
}
```

### 2. Build directly from GitHub

Use the built-in GitHub adapter if you want the package to fetch and map a GitHub user's repositories.

```ts
import { mapGitHubReposToSolarSystem } from "github-solar-system";

const system = await mapGitHubReposToSolarSystem("octocat");
```

Then render:

```tsx
import { RenderSolarSystem } from "github-solar-system/react";
import "github-solar-system/styles.css";

export function App() {
  return <RenderSolarSystem system={system} />;
}
```

## Data Types

### `BranchData`

```ts
type BranchData = {
  name: string;
  date: string;
  commitCount: number;
};
```

### `RepoData`

```ts
type RepoData = {
  name: string;
  date: string;
  commitCount: number;
  branchCount: number;
  languages: string[];
  branches: BranchData[];
};
```

### `UserData`

```ts
type UserData = {
  name: string;
  avatarUrl?: string;
};
```

### `SolarSystemData`

```ts
type SolarSystemData = {
  user: UserData;
  repos: RepoData[];
};
```

## CSS

Import the packaged stylesheet once in your app:

```ts
import "github-solar-system/styles.css";
```

That stylesheet pulls in:
- solar system layout
- planets
- moons
- labels
- sun styling
- biome CSS

## Important Note About GitHub Fetching

The current GitHub adapter uses the package's GitHub fetch layer and expects a working GitHub API path/config in the host app.

In practice, the safest setup is:
- fetch GitHub data server-side or behind your own proxy
- normalize it into `SolarSystemData`
- pass it through `createSolarSystemData(...)`

That keeps tokens and network behavior under your control.

## Current Scope

This package currently focuses on:
- building a solar-system model from GitHub-style data
- rendering that model with the included React components and CSS

It does not currently expose:
- low-level planet renderer internals as public API
- a fully configurable theme system
- a framework-agnostic renderer

## Example Import Summary

```ts
import {
  createSolarSystemData,
  mapGitHubReposToSolarSystem
} from "github-solar-system";

import { RenderSolarSystem } from "github-solar-system/react";
import "github-solar-system/styles.css";
```
