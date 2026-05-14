package com.tonidev.backend.exception;

/**
 * DTO que representa la estructura de una respuesta de error de la API.
 *
 * @param estado  el código de estado HTTP
 * @param mensaje la descripción del error ocurrido
 */
public record ErrorResponse(int estado, String mensaje) {}
