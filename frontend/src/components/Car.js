import moment from "moment";
import { useMemo } from "react";
import { IconContext } from "react-icons";
import { FaCar } from "react-icons/fa";

import "./Car.css";

const Car = ({ car, trackedPN, setTrackedPN, setCenter, setZoom, socket }) => {
    const isTracked = useMemo(
        () => car.plateNumber === trackedPN,
        [car, trackedPN]
    );
    const lastUpdated = useMemo(() => moment(car.lastUpdated), [car]).fromNow();
    const styles = {
        trackButton: {
            fontSize: "16px",
            color: isTracked ? "red" : "green",
            padding: "10px",
            border: "none",
            backgroundColor: "inherit",
            cursor: "pointer",
            display: "inline-block",
        },
    };

    const handleOnClick = () => {
        if (isTracked) {
            socket.emit("stop-tracking", trackedPN); // stop tracking the current car because the user clicked on untrack button
            setZoom(10);
            setTrackedPN("");
        } else {
            socket.emit("stop-tracking", trackedPN); // stop tracking the previous car

            if (!car.lastLat || !car.lastLng) {
                //Car is never updated and doesn't have latitude or longitude
                setTrackedPN(car.plateNumber);
                socket.emit("track-car", car.plateNumber); // track the new car
            } else {
                setCenter({
                    lat: car.lastLat,
                    lng: car.lastLng,
                });
                setZoom(14);
                setTrackedPN(car.plateNumber);
                socket.emit("track-car", car.plateNumber); // track the new car
            }
        }
    };

    return (
        <div className="car">
            <div className="car__details">
                <IconContext.Provider
                    value={{
                        color: car.displayColor,
                        size: "1.5em",
                        className: "car__details__icon",
                    }}
                >
                    <FaCar />
                </IconContext.Provider>

                <h2 className="car__details__plate-number">
                    {car.plateNumber}
                </h2>
            </div>

            <p className="car__last-update">
                {car.lastLat === null || car.lastLng === null
                    ? "Wasn't updated"
                    : `Last updated ${lastUpdated}`}
            </p>
            <button style={styles.trackButton} onClick={handleOnClick}>
                {isTracked ? "Untrack" : "Track"}
            </button>
        </div>
    );
};

export default Car;
