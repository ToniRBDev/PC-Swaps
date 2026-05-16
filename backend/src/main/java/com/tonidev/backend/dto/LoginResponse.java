package com.tonidev.backend.dto;

/**
 * DTO con la respuesta del servidor tras un inicio de sesión exitoso.
 *
 * @param token     el token JWT generado para el usuario
 * @param idUsuario el identificador del usuario autenticado
 */
public record LoginResponse(String token, Long idUsuario) {}
