package com.tonidev.backend.dto;

public record UsuarioSimpleInfoResponse(
        Long idUsuario,
        String nombreUsuario,
        String imagenUsuario
){}
