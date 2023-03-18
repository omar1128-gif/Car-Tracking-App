import { useEffect, useState, useRef } from "react";

import Car from "./Car";
import CarSearch from "./CarSearch";
import "./CarsComponent.css";

const CarsComponent = ({ cars, setCars, setCenter, setZoom, socket }) => {
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
          car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );

  useEffect(() => {
    // trackedPN
    //   ? console.log("Tracked car is set to ", trackedPN)
    //   : console.log("No car is being tracked right now.");

    if (trackedPN) {
      const trackedCar = cars.filter(
        (car) => car.plateNumber === trackedPNRef.current
      )[0];

      if (trackedCar.lastLat === null || trackedCar.lastLng === null) return;

      setCenter({
        lat: trackedCar.lastLat,
        lng: trackedCar.lastLng,
      });

      setZoom(14);
    }
  }, [trackedPN, cars]);

  return (
    <div className="cars-component">
      <h2 className="cars-component__title">Cars Overview</h2>
      <CarSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ul className="cars-component__list">
        {searchResults.length > 0
          ? searchResults.map((car) => (
              <li key={car.plateNumber}>
                <Car
                  car={car}
                  trackedPN={trackedPNRef.current}
                  setTrackedPN={setTrackedPN}
                  setCenter={setCenter}
                  setZoom={setZoom}
                />
              </li>
            ))
          : "No results were found."}
      </ul>
    </div>
  );
};

export default CarsComponent;
