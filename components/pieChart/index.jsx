"use client";
import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export default function PieChart({ consumedCount, maxCount }) {

    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }

            const context = chartRef.current.getContext("2d");

            const consumedPercentage = (consumedCount / maxCount) * 100;
            const remainingPercentage = 100 - consumedPercentage;

            const newChart = new Chart(context, {
                type: 'pie',
                data: {
                    labels: ["consumed", "max remaining consume"],
                    datasets: [
                        {
                            label: "info",
                            data: [consumedCount, maxCount - consumedCount],
                            backgroundColor: [
                                `rgb(255, 99, 132, ${consumedPercentage / 100})`,
                                `rgb(255, 159, 64, ${remainingPercentage / 100})`,
                            ],
                            borderColor: [
                                "rgb(255, 99, 132)",
                                "rgb(255, 159, 64)",
                            ],
                            borderWidth: 1,
                        }
                    ]
                },
                option: {
                    // responsive: true
                }
            });
            chartRef.current.chart = newChart;
        }
    }, [consumedCount, maxCount]);

    return (
        <>
            <div className="relative">
                <canvas ref={chartRef}></canvas>
            </div>
        </>
    )
}