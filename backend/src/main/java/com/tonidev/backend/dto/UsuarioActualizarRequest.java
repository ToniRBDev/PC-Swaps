package com.tonidev.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

/**
 * DTO con los datos modificables del perfil de un usuario.
 */
public record UsuarioActualizarRequest(

        @NotBlank(message = "El nombre de usuario es obligatorio")
        String nombreUsuario,

        LocalDate fechaNacimiento,

        String direccion,

        String numTelefono,

        String imagenUsuario
) {}
