export interface User {
    id: string;
    email: string;
    name: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Gist {
    id: string;
    title: string;
    email: string;
    description?: string;
    code: string;
    language: string;
    isPublic: boolean;
    owner: {
        login: string;
        id: string;
        avatar_url?: string;
    };
    created_at: Date;

    updated_at: Date;
    public?: unknown;
    starCount?: number;
    isStarred?: boolean;
    comments?: unknown;
}

export interface ErrorResponse {
    message: string;
    status?: number;
}
