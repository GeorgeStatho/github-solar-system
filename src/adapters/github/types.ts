export type GitHubBranchNode = {
    name: string;
    target?: {
        committedDate?: string;
        history?: {
            totalCount?: number;
        };
    };
};

export type GitHubRepositoryNode = {
    repository: {
        name: string;
        createdAt: string;
        languages?: {
            nodes?: Array<{ name?: string }>;
        };
        defaultBranchRef?: {
            target?: {
                history?: {
                    totalCount?: number;
                };
            };
        };
        refs?: {
            totalCount?: number;
            nodes?: GitHubBranchNode[];
        };
    };
};
