package com.tonidev.backend.model;

/**
 * Representa el estado de conservación de un artículo publicado en la plataforma.
 * Se utiliza para informar al comprador sobre la condición del producto.
 */
public enum EstadoArticulo {
    NUEVO_CON_ETIQUETAS,
    COMO_NUEVO,
    MUY_BUENO,
    BUENO,
    ACEPTABLE,
    PARA_REPARAR
}
