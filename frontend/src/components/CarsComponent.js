import { useEffect, useState, useRef } from "react";

import Car from "./Car";
import CarSearch from "./CarSearch";
import "./CarsComponent.css";

const CarsComponent = ({
    carsRef,
    cars,
    setCars,
    setCenter,
    setZoom,
    socket,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [trackedPN, _setTrackedPN] = useState("");
    const trackedPNRef = useRef(trackedPN);

    const setTrackedPN = (trackedPN) => {
        trackedPNRef.current = trackedPN;
        _setTrackedPN(trackedPN);
    };

    const searchResults =
        searchTerm === ""
            ? cars
            : cars.filter((car) =>
                  car.plateNumber
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
              );

    // useEffect(() => {
    //     trackedPN
    //         ? console.log("Tracked car is set to ", trackedPN)
    //         : console.log("No car is being tracked right now.");
    // }, [trackedPN]);

    useEffect(() => {
        socket.on("send-updated-car", (updatedCar) => {
            const trackedCar = trackedPNRef.current
                ? carsRef.current.filter(
                      (car) => car.plateNumber === trackedPNRef.current
                  )[0]
                : null;

            if (trackedCar) {
                if (
                    trackedCar.lastLat !== updatedCar.lastLat ||
                    trackedCar.lastLng !== updatedCar.lastLng
                ) {
                    updatedCar.displayColor = trackedCar.displayColor;
                    const updatedCars = carsRef.current.map((car) =>
                        car.plateNumber === updatedCar.plateNumber
                            ? updatedCar
                            : car
                    );
                    setCars(updatedCars);
                    setCenter({
                        lat: updatedCar.lastLat,
                        lng: updatedCar.lastLng,
                    });
                    setZoom(14);
                }
            }
        });
    }, [carsRef, setCars, setCenter, setZoom, socket]);

    return (
        <div className="cars-component">
            <h2 className="cars-component__title">Cars Overview</h2>
            <CarSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ul className="cars-component__list">
                {searchResults.length > 0
                    ? searchResults.map((car) => (
                          <li key={car.id}>
                              <Car
                                  car={car}
                                  trackedPN={trackedPNRef.current}
                                  setTrackedPN={setTrackedPN}
                                  setCenter={setCenter}
                                  setZoom={setZoom}
                                  socket={socket}
                              />
                          </li>
                      ))
                    : "No results were found."}
            </ul>
        </div>
    );
};

export default CarsComponent;
