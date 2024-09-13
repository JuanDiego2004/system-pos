// components/BarraEstadistico.js
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarraEstadistico = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Referencia para el gráfico

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Si ya existe una instancia de gráfico, destruirla
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Crear una nueva instancia de gráfico
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line', // Usamos el tipo 'line' para el polígono de frecuencias
      data: {
        labels: data.map(d => d.label), // Etiquetas para los intervalos
        datasets: [{
          label: 'Frecuencias',
          data: data.map(d => d.frequency), // Frecuencias
          fill: false, // No llenar el área bajo la línea
          borderColor: 'blue', // Color de la línea
          tension: 0.1, // Tensión de la línea
        }],
      },
      options: {
        scales: {
          x: { 
            title: {
              display: true,
              text: 'Intervalos'
            },
            beginAtZero: true 
          },
          y: { 
            title: {
              display: true,
              text: 'Frecuencia'
            },
            beginAtZero: true 
          },
        },
      },
    });

    // Limpieza para evitar fugas de memoria
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <canvas ref={chartRef} />
  );
};

export default BarraEstadistico;
