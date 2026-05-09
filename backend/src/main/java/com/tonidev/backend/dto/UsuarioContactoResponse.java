package com.tonidev.backend.dto;

/**
 * DTO con los datos de contacto de un vendedor, visibles al consultar un artículo publicado.
 */
public record UsuarioContactoResponse(
        Long idUsuario,
        String nombreUsuario,
        String correoElectronico,
        String direccion,
        String numTelefono,
        String imagenUsuario
) {}
