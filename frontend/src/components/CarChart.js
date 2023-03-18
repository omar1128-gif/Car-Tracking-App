import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import "./CarChart.css";
import { getStats } from "../utils/carRequests";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
            labels: {
                color: "rgb(255, 99, 132)",
            },
        },
        title: {
            display: true,
            text: "Cars Average Speed",
        },
    },
    scales: {
        y: {
            title: {
                display: true,
                text: "Km / h",
            },
        },
        x: {
            title: {
                display: true,
                text: "Plate Number",
            },
        },
    },
};

const CarChart = ({ socket }) => {
    const [labels, setLabels] = useState([]);
    const [avgSpeeds, setAvgSpeeds] = useState([]);

    const fetchData = async () => {
        const { data } = await getStats();
        const plateNumbers = data.map((c) => c.plateNumber);
        const speeds = data.map((c) => c.avgSpeed);
        setLabels(plateNumbers);
        setAvgSpeeds(speeds);
    };
    // on first render fetch statistics from server
    useEffect(() => {
        fetchData();
    }, []);

    // on car update when track button is clicked
    useEffect(() => {
        socket.on("car-updated", () => {
            fetchData();
        });
    }, [socket]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Cars",
                data: avgSpeeds,
                backgroundColor: "rgba(223, 46, 56, 0.5)",
                barThickness: 25,
                borderColor: "rgb(223, 46, 56)",
                borderWidth: 1,
            },
        ],
        xAxisID: "Plate Number",
        yAxisID: "Km/h",
    };

    return (
        <div className="chart-container">
            <div className="chart">
                <Bar options={options} data={data} />
            </div>
        </div>
    );
};

export default CarChart;
