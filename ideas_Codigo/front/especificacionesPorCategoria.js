const ESPECIFICACIONES_POR_CATEGORIA = {
  "Tarjeta gráfica": [
    { id: "vram", label: "VRAM (ej. 12GB)", placeholder: "8GB" },
    { id: "tipo_memoria", label: "Tipo de memoria", placeholder: "GDDR6" },
    { id: "ensamblador", label: "Ensamblador", placeholder: "ASUS, MSI..." },
  ],
  "Placa base": [
    { id: "socket", label: "Socket", placeholder: "AM4, LGA1700..." },
    { id: "formato", label: "Formato", placeholder: "ATX, Micro-ATX..." },
  ],
  Procesador: [
    { id: "nucleos", label: "Núcleos / Hilos", placeholder: "6C / 12T" },
    { id: "frecuencia", label: "Frecuencia Base", placeholder: "3.7 GHz" },
  ],
  RAM: [
    { id: "tipo", label: "Tipo", placeholder: "DDR4" },
    { id: "frecuencia", label: "Frecuencia", placeholder: "3200MHz" },
    { id: "capacidad", label: "Capacidad total", placeholder: "16GB (2x8GB)" },
  ],
  Monitor: [
    { id: "resolucion", label: "Resolución", placeholder: "1920x1080" },
    { id: "tasa_refresco", label: "Tasa de refresco", placeholder: "144Hz" },
    { id: "panel", label: "Tipo de Panel", placeholder: "IPS, VA, TN..." },
  ],
};
