const BASE_URL = process.env.REACT_APP_BASE_URL;

if (BASE_URL === undefined) {
    window.location.href = "/error.html";
}

// createUser API
export const createUserAPI = async ({ username, password, email }) => {
    const userData = {
        username,
        password,
        email,
    };

    console.log(userData);

    try {
        console.log("送出");
        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// loginUser API
export const loginAPI = async ({ username, password }) => {
    try {
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// renewToken API
export const renewTokenAPI = async ({ refreshToken }) => {
    try {
        const response = await fetch(`${BASE_URL}/tokens/renew_access`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

//createScore
export const createScoreAPI = async (Stats, accessToken) => {
    try {
        const response = await fetch(`${BASE_URL}/scores`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(Stats),
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
export const rankAPI = async (sort, page) => {
    try {
        const response = await fetch(
            `${BASE_URL}/rank/${sort}?page_id=${page}&page_size=5`
        );

        if (!response.ok) {
            throw new Error("Failed to get rank");
        }
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
};

//list score
export const listScoreAPI = async (username, page) => {
    try {
        const res = await fetch(
            `${BASE_URL}/scores?owner=${username}&page_id=${page}&page_size=5`
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
export const listAchievementsAPI = async (username) => {
    try {
        const res = await fetch(`${BASE_URL}/achievements?owner=${username}`);
        if (!res.ok) {
            throw new Error("Failed to get list score");
        }

        const data = await res.json();

        return data;
    } catch (err) {
        throw err;
    }
};
