import { useLoadScript } from "@react-google-maps/api";
import { io } from "socket.io-client";
import { useEffect } from "react";

import Main from "./components/Main";
import CarChart from "./components/CarChart";
import "./App.css";

const socket = io("http://localhost:5000");

const App = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    });

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Client connected to server", socket.id);
        });
    }, []);

    if (!isLoaded) return <div>Loading...</div>;
    return (
        <div className="app">
            <Main socket={socket} />
            <CarChart socket={socket} />
        </div>
    );
};

export default App;
