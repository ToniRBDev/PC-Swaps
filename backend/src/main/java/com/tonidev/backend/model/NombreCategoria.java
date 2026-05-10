package com.tonidev.backend.model;

/**
 * Enum que define las categorías válidas de artículos en la plataforma.
 * Actúa como fuente de verdad para los nombres permitidos.
 * El DataLoader utiliza este enum para inicializar las categorías en base de datos al arrancar.
 */
public enum NombreCategoria {

    TARJETA_GRAFICA("Tarjeta gráfica"),
    PLACA_BASE("Placa base"),
    PROCESADOR("Procesador"),
    RAM("RAM"),
    MONITOR("Monitor");

    /**
     * Texto legible que se almacena en base de datos y se muestra en el frontend.
     */
    private final String valor;

    /**
     * Constructor del enum.
     *
     * @param valor el nombre legible de la categoría
     */
    NombreCategoria(String valor) {
        this.valor = valor;
    }

    /**
     * Devuelve el nombre legible de la categoría.
     *
     * @return el valor de texto de la categoría
     */
    public String getValor() {
        return valor;
    }
}
