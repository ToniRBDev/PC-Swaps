package com.tonidev.backend.dto;

import java.time.LocalDate;

/**
 * DTO con todos los datos del perfil del usuario autenticado.
 */
public record UsuarioPerfilResponse(
        Long idUsuario,
        String nombre,
        String apellidos,
        String dni,
        String correoElectronico,
        LocalDate fechaNacimiento,
        String direccion,
        String numTelefono,
        String imagenUsuario,
        String nombreUsuario
) {}
