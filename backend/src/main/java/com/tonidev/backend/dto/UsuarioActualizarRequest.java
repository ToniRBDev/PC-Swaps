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

        String direccion,

        String numTelefono
) {}
