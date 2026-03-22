const api_url:string="/api/github/graphql";

function getErrorPreview(text:string,limit:number=180){
    const normalized = text.replace(/\s+/g," ").trim();
    return normalized.length > limit ? `${normalized.slice(0,limit)}...` : normalized;
}

async function runQuery(query:string,operationName:string){
    let response: Response;

    try {
        response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
            `[GitHub API:${operationName}] Network request failed. ` +
            `Check that Vite is running and the proxy route /api/github/graphql is available. ` +
            `Original error: ${message}`
        );
    }

    const responseText = await response.text();
    let data: any = null;

    try {
        data = responseText ? JSON.parse(responseText) : null;
    } catch {
        const preview = responseText ? ` Response preview: ${getErrorPreview(responseText)}` : "";
        throw new Error(
            `[GitHub API:${operationName}] Expected JSON but received a non-JSON response. ` +
            `HTTP ${response.status} ${response.statusText}.${preview}`
        );
    }

    if (!response.ok) {
        const preview = responseText ? ` Response: ${getErrorPreview(responseText)}` : "";
        throw new Error(
            `[GitHub API:${operationName}] HTTP ${response.status} ${response.statusText}.${preview}`
        );
    }

    if (data?.errors?.length) {
        const errorMessage = data.errors
            .map((error: { message?: string; path?: string[] }) => {
                const path = error.path?.length ? ` at ${error.path.join(".")}` : "";
                return `${error.message ?? "Unknown GraphQL error"}${path}`;
            })
            .join(" | ");
        throw new Error(`[GitHub API:${operationName}] GraphQL error: ${errorMessage}`);
    }

    if (!data?.data) {
        throw new Error(`[GitHub API:${operationName}] Response did not include a data field.`);
    }

    return data;
}





function getUser(){
    return runQuery(`
        query {
            viewer {
            login
            }
        }
        `,"getUser")
    .then((data) => console.log(data));
}

export function getRepos(user:string){
    return runQuery(`
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
    )
}
