package com.tonidev.backend.dto;

/**
 * DTO con las credenciales enviadas por el usuario para iniciar sesión.
 *
 * @param correoElectronico el correo electrónico del usuario
 * @param password          la contraseña del usuario
 */
public record LoginRequest(String correoElectronico, String password) {}
