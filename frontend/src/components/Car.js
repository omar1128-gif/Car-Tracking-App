import moment from "moment";
import { useMemo } from "react";
import { IconContext } from "react-icons";
import { FaCar } from "react-icons/fa";

import "./Car.css";

const Car = ({ car, trackedPN, setTrackedPN, setCenter, setZoom}) => {
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
            setZoom(10);
            setTrackedPN("");
        } else {

            if (!car.lastLat || !car.lastLng) {   
                setTrackedPN(car.plateNumber);
            } else {
                setCenter({
                    lat: car.lastLat,
                    lng: car.lastLng,
                });
                setZoom(14);
                setTrackedPN(car.plateNumber);
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
