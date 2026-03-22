import {
  SolarSystem
} from "./chunk-GWDUBMQX.js";

// src/core/builders/createSolarSystemData.ts
function createSolarSystemData(data) {
  return new SolarSystem(data.user, data.repos);
}

// src/adapters/github/Commit.ts
var Commit = class {
  author;
  date;
  size;
  constructor(author, date, size) {
    this.author = author;
    this.date = date;
    this.size = size;
  }
};

// src/adapters/github/Branch.ts
var Branch = class {
  name;
  date;
  commitCount;
  commits;
  constructor(name, date, commitCount = 0) {
    this.name = name;
    this.date = date;
    this.commitCount = commitCount;
    this.commits = [];
  }
  fillCommits(commitNodes = []) {
    this.commits = [];
    for (const commit of commitNodes) {
      this.commits.push(
        new Commit(
          commit.messageHeadline,
          commit.committedDate,
          commit.additions + commit.deletions
        )
      );
    }
  }
  toBranchData() {
    return {
      name: this.name,
      date: this.date,
      commitCount: this.commitCount
    };
  }
};

// src/adapters/github/Repo.ts
var Repo = class {
  name;
  date;
  commitCount;
  branchCount;
  languages;
  branches;
  constructor(name, date, commitCount = 0, languages = [], branchCount = 0) {
    this.name = name;
    this.date = date;
    this.commitCount = commitCount;
    this.branchCount = branchCount;
    this.languages = languages;
    this.branches = [];
  }
  fillBranches(branchNodes = []) {
    this.branches = [];
    for (const branch of branchNodes) {
      const branchData = new Branch(
        branch.name,
        branch.target?.committedDate ?? "",
        branch.target?.history?.totalCount ?? 0
      );
      branchData.fillCommits(branch.target?.history?.nodes ?? []);
      this.branches.push(branchData);
    }
  }
  toRepoData() {
    return {
      name: this.name,
      date: this.date,
      commitCount: this.commitCount,
      branchCount: this.branchCount,
      languages: this.languages,
      branches: this.branches.map((branch) => branch.toBranchData())
    };
  }
};

// src/adapters/github/gitAPI.ts
var api_url = "/api/github/graphql";
function getErrorPreview(text, limit = 180) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit)}...` : normalized;
}
async function runQuery(query, operationName) {
  let response;
  try {
    response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `[GitHub API:${operationName}] Network request failed. Check that Vite is running and the proxy route /api/github/graphql is available. Original error: ${message}`
    );
  }
  const responseText = await response.text();
  let data = null;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    const preview = responseText ? ` Response preview: ${getErrorPreview(responseText)}` : "";
    throw new Error(
      `[GitHub API:${operationName}] Expected JSON but received a non-JSON response. HTTP ${response.status} ${response.statusText}.${preview}`
    );
  }
  if (!response.ok) {
    const preview = responseText ? ` Response: ${getErrorPreview(responseText)}` : "";
    throw new Error(
      `[GitHub API:${operationName}] HTTP ${response.status} ${response.statusText}.${preview}`
    );
  }
  if (data?.errors?.length) {
    const errorMessage = data.errors.map((error) => {
      const path = error.path?.length ? ` at ${error.path.join(".")}` : "";
      return `${error.message ?? "Unknown GraphQL error"}${path}`;
    }).join(" | ");
    throw new Error(`[GitHub API:${operationName}] GraphQL error: ${errorMessage}`);
  }
  if (!data?.data) {
    throw new Error(`[GitHub API:${operationName}] Response did not include a data field.`);
  }
  return data;
}
function getRepos(user) {
  return runQuery(
    `
        query Repos {
            user(login: "${user}") {
                avatarUrl(size: 256)
                contributionsCollection {
                commitContributionsByRepository(maxRepositories: 100) {
                    repository {
                    name
                    createdAt
                    languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                        nodes {
                        name
                        }
                    }
                    defaultBranchRef {
                        target {
                        ... on Commit {
                            history {
                            totalCount
                            }
                        }
                        }
                    }
                    refs(refPrefix: "refs/heads/", first: 10) {
                        totalCount
                        nodes {
                        name
                        target {
                            ... on Commit {
                            committedDate
                            history {
                                totalCount
                            }
                            }
                        }
                        }
                    }
                    }
                }
                }
            }
            }
        `,
    `getRepos:${user}`
  );
}

// src/adapters/github/GitHubUser.ts
var GitUser = class {
  name;
  avatarUrl;
  Repos;
  constructor(name) {
    this.name = name;
    this.avatarUrl = "";
    this.Repos = [];
  }
  async fillRepos() {
    const result = await getRepos(this.name);
    const userData = result?.data?.user;
    if (!userData) {
      throw new Error(
        `GitHub user "${this.name}" was not found or did not return repository contribution data.`
      );
    }
    this.avatarUrl = userData.avatarUrl ?? "";
    const repoNodes = userData.contributionsCollection?.commitContributionsByRepository ?? [];
    for (const repoData of repoNodes) {
      const repoName = repoData.repository.name;
      const repoCreatedAt = repoData.repository.createdAt;
      const repoCommitCount = repoData.repository.defaultBranchRef?.target?.history?.totalCount ?? 0;
      const repoLanguages = (repoData.repository.languages?.nodes ?? []).map((language) => language?.name).filter((language) => Boolean(language));
      const repoBranchCount = repoData.repository.refs?.totalCount ?? 0;
      const repo = new Repo(
        repoName,
        repoCreatedAt,
        repoCommitCount,
        repoLanguages,
        repoBranchCount
      );
      repo.fillBranches(repoData.repository.refs?.nodes ?? []);
      this.Repos.push(repo);
    }
  }
  toUserData() {
    return {
      name: this.name,
      avatarUrl: this.avatarUrl
    };
  }
  toSolarSystemData() {
    return {
      user: this.toUserData(),
      repos: this.Repos.map((repo) => repo.toRepoData())
    };
  }
};

// src/adapters/github/mapGitHubReposToSolarSystem.ts
async function mapGitHubReposToSolarSystem(userName) {
  const user = new GitUser(userName);
  await user.fillRepos();
  return createSolarSystemData(user.toSolarSystemData());
}
export {
  createSolarSystemData,
  mapGitHubReposToSolarSystem
};
