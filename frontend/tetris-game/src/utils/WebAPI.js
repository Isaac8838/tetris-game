const apiUrl = window.appConfig.API_URL;

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
        throw error;
    }
};

// loginUser API
export const loginAPI = async ({ username, password }) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

// renewToken API
export const renewTokenAPI = async ({ refresh_token }) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

//createScore
export const createScoreAPI = async ({ stats, access_token }) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

//rank
export const rankAPI = async ({ sort, page = 1 }) => {
    try {
        const response = await fetch(
            `${apiUrl}/rank/${sort}?page_id=${page}&page_size=5`,
        );

        if (!response.ok) {
            throw new Error("Failed to get rank");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

//list score
export const listScoreAPI = async ({ username, page }) => {
    try {
        const res = await fetch(
            `${apiUrl}/scores?owner=${username}&page_id=${page}&page_size=5`,
        );
        if (!res.ok) {
            throw new Error("Failed to get list score");
        }

        const data = await res.json();

        return data;
    } catch (err) {
        throw err;
    }
};

//listAchievements
export const listAchievementsAPI = async ({ username }) => {
    try {
        const res = await fetch(`${apiUrl}/achievements?owner=${username}`);
        if (!res.ok) {
            throw new Error("Failed to get list score");
        }

        const data = await res.json();

        return data;
    } catch (err) {
        throw err;
    }
};
