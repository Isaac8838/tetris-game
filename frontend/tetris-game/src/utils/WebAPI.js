const apiUrl = window?.appConfig?.API_URL || "http://localhost:8080/api";

if (apiUrl === undefined) {
    window.location.href = "/error.html";
}

// createUser API
export const createUserAPI = async ({ username, password, email }) => {
    const userData = {
        username,
        password,
        email,
    };

    try {
        const response = await fetch(`${apiUrl}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(JSON.stringify(errorResponse) || "fetch failed");
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

// loginUser API
export const loginAPI = async ({ username, password }) => {
    const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(JSON.stringify(errorResponse) || "Failed to login");
    }

    return response.json();
};

// renewToken API
export const renewTokenAPI = async ({ refresh_token }) => {
    const response = await fetch(`${apiUrl}/tokens/renew_access`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refresh_token }),
    });

    if (!response.ok) {
        throw new Error("Failed to renew token");
    }

    return response.json();
};

//createScore
export const createScoreAPI = async ({ stats, access_token }) => {
    const response = await fetch(`${apiUrl}/scores`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ score: stats.score, level: stats.level }),
    });

    if (!response.ok) {
        throw new Error("Failed to create score");
    }

    return response.json();
};

//rank
export const rankAPI = async ({ sort, page = 1 }) => {
    const response = await fetch(
        `${apiUrl}/rank/${sort}?page_id=${page}&page_size=5`,
    );

    if (!response.ok) {
        throw new Error("Failed to get rank");
    }
    const data = await response.json();
    return data;
};

//list score
export const listScoreAPI = async ({ username, page }) => {
    const res = await fetch(
        `${apiUrl}/scores?owner=${username}&page_id=${page}&page_size=5`,
    );
    if (!res.ok) {
        throw new Error("Failed to get list score");
    }

    const data = await res.json();

    return data;
};

//listAchievements
export const listAchievementsAPI = async ({ username }) => {
    const res = await fetch(`${apiUrl}/achievements?owner=${username}`);
    if (!res.ok) {
        throw new Error("Failed to get list score");
    }

    const data = await res.json();

    return data;
};
