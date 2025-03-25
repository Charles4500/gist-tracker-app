import { NextApiRequest, NextApiResponse } from "next";

const GITHUB_API_URL = "https://api.github.com/gists";
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN!;

//Create a new gist
export async function createGist(
    title: string,
    description: string,
    code: string
) {
    const response = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            description,
            public: true,
            files: {
                [`${title}.txt`]: { content: code },
            },
        }),
    });
    return response.json();
}

//Get a user's gists
export async function getUserGists(username: string) {
    const response = await fetch(
        `https://api.github.com/users/${username}/gists`,
        {
            headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` },
        }
    );

    return response.json();
}

//Get a single gist
export async function getGistById(gistId: string) {
    const response = await fetch(`${GITHUB_API_URL}/${gistId}`, {
        headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` },
    });

    return response.json();
}

//Update a gist
export async function updateGist(gistId: string, updatedData: unknown) {
    const response = await fetch(`${GITHUB_API_URL}/${gistId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });
    return response.json();
}

//Delete a gist
export async function deleteGist(gistId: string) {
    const response = await fetch(`${GITHUB_API_URL}/${gistId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
    });
    return response.status === 204 ? { success: true } : { succes: false };
}

//Api Route handler
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, body } = req;

    switch (method) {
        case "POST": {
            const { title, description, code } = body;
            const newGist = await createGist(title, description, code);
            return res.status(201).json(newGist);
        }
        case "GET": {
            const { username } = req.query;
            if (!username)
                return res.status(400).json({ error: "Username is required" });

            const gists = await getUserGists(username as string);
            return res.status(200).json(gists);
        }
        case "PATCH": {
            const { gistId, updatedData } = body;
            if (!gistId)
                return res.status(400).json({ error: "Gist ID is required" });

            const updatedGist = await updateGist(gistId, updatedData);
            return res.status(200).json(updatedGist);
        }

        case "DELETE": {
            const { gistId } = body;
            if (!gistId)
                return res.status(400).json({ error: "Gist ID is required" });

            const result = await deleteGist(gistId);
            return res.status(200).json(result);
        }

        default:
            return res.status(405).json({ error: "Method not allowed" });
    }
}
