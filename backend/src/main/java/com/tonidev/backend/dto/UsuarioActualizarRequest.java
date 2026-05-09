package com.tonidev.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

/**
 * DTO con los datos modificables del perfil de un usuario.
 */
public record UsuarioActualizarRequest(

        @NotBlank(message = "El nombre de usuario es obligatorio")
        String nombreUsuario,

        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
        LocalDate fechaNacimiento,

        String direccion,

        String numTelefono,

        String imagenUsuario
) {}
