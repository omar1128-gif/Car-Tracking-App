import { useEffect, useState, useRef } from "react";

import Map from "./Map";
import CarsComponent from "./CarsComponent";
import { getCars, getCar } from "../utils/carRequests";
import getRandomColor from "../utils/randomColor";
import "./Main.css";

const Main = ({ socket }) => {
  const [center, _setCenter] = useState({ lat: 30.0444, lng: 31.2357 });
  const [cars, _setCars] = useState([]);
  const [zoom, setZoom] = useState(10);

  const carsRef = useRef(cars);
  const centerRef = useRef(center);

  const setCars = (cars) => {
    carsRef.current = cars;
    _setCars(cars);
  };
  const setCenter = (position) => {
    centerRef.current = position;
    _setCenter(position);
  };

  useEffect(() => {
    socket.on("car-updated", async (carPN) => {
      const res = await getCar(carPN);
      const newCars = carsRef.current.map((car) =>
        car.plateNumber !== carPN
          ? car
          : { ...res.car, displayColor: car.displayColor }
      );
      setCars(newCars);
    });
  }, [socket]);

  //on first render fetch cars from server
  useEffect(() => {
    const getAllCars = async () => {
      const res = await getCars();
      //Add unique color for each car
      setCars(
        res.cars.map((car) => {
          car.displayColor = getRandomColor();
          return car;
        })
      );
    };
    getAllCars();
  }, []);

  return (
    <div className="main">
      <Map center={center} zoom={zoom} cars={carsRef.current} />
      <CarsComponent
        cars={carsRef.current}
        setCars={setCars}
        setCenter={setCenter}
        setZoom={setZoom}
        socket={socket}
      />
    </div>
  );
};

export default Main;
