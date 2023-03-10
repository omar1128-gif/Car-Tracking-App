const api = process.env.REACT_APP_SERVER_API_URL || "http://localhost:5000";

const headers = {
    Accept: "application/json",
};

export const getCars = () =>
    fetch(`${api}/cars`, { method: "GET", headers }).then((res) => res.json());

export const getCar = (carPN) =>
    fetch(`${api}/cars/${carPN}`, { method: "GET", headers }).then((res) =>
        res.json()
    );

export const addCar = (body) =>
    fetch(`${api}/cars`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((res) => res.json());

export const removeCar = (carPN) =>
    fetch(`${api}/cars/${carPN}`, { method: "DELETE", headers }).then((res) =>
        res.json()
    );

export const updateCoordinates = (body) =>
    fetch(`${api}/coordinates/${body.plateNumber}`, {
        method: "PATCH",
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((res) => res.json());

export const getStats = () =>
    fetch(`${api}/cars/stats`, {
        method: "GET",
        headers,
    }).then((res) => res.json());
