export default function CreacionAnuncio() {
  // 4. Tipamos los estados
  const [categoria, setCategoria] = useState<Categoria>("Tarjeta gráfica");
  
  // Record<string, string> significa "un objeto donde las claves y valores son texto"
  const [especificaciones, setEspecificaciones] = useState<Record<string, string>>({});

  // 5. Tipamos el evento del select
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Forzamos (cast) el valor a nuestro tipo Categoria
    setCategoria(e.target.value as Categoria);
    setEspecificaciones({}); 
  };

  // 6. Tipamos los parámetros de la función
  const handleEspecificacionChange = (idPropiedad: string, valor: string) => {
    setEspecificaciones((prev) => ({
      ...prev,
      [idPropiedad]: valor
    }));
  };

  // ... (El bloque del return con el HTML/JSX se queda exactamente igual que en el código anterior)