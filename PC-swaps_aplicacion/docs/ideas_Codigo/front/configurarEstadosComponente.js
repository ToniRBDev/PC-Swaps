import React, { useState } from 'react';

export default function CreacionAnuncio() {
  // Estado para la categoría actual
  const [categoria, setCategoria] = useState("Tarjeta gráfica");
  
  // Estado para el JSON de especificaciones técnicas
  const [especificaciones, setEspecificaciones] = useState({});

  // Manejador cuando el usuario cambia de categoría
  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
    // ¡Importante! Si cambia de categoría, limpiamos las especificaciones anteriores
    setEspecificaciones({}); 
  };

  // Manejador para actualizar el mapa JSON cuando el usuario escribe
  const handleEspecificacionChange = (idPropiedad, valor) => {
    setEspecificaciones((prev) => ({
      ...prev,
      [idPropiedad]: valor
    }));
  };

  // ...