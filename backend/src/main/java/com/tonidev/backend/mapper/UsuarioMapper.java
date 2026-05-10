package com.tonidev.backend.mapper;

import com.tonidev.backend.dto.UsuarioContactoResponse;
import com.tonidev.backend.dto.UsuarioPerfilResponse;
import com.tonidev.backend.dto.UsuarioRegistroRequest;
import com.tonidev.backend.dto.UsuarioSimpleInfoResponse;
import com.tonidev.backend.model.Usuario;
import org.springframework.stereotype.Component;

/**
 * Mapper encargado de convertir entre la entidad {@link Usuario} y sus DTOs.
 */
@Component
public class UsuarioMapper {

    /**
     * Convierte un {@link UsuarioRegistroRequest} a la entidad {@link Usuario}.
     * El hash de la contraseña debe ser calculado en el service antes de llamar a este método.
     *
     * @param request      el DTO con los datos de registro
     * @param passwordHash la contraseña ya cifrada
     * @return la entidad {@link Usuario} lista para persistir
     */
    public Usuario toEntity(UsuarioRegistroRequest request, String passwordHash) {
        return Usuario.builder()
                .nombre(request.nombre())
                .apellidos(request.apellidos())
                .dni(request.dni())
                .correoElectronico(request.correoElectronico())
                .fechaNacimiento(request.fechaNacimiento())
                .direccion(request.direccion())
                .numTelefono(request.numTelefono())
                .nombreUsuario(request.nombreUsuario())
                .passwordHash(passwordHash)
                .build();
    }

    /**
     * Convierte un {@link Usuario} a un {@link UsuarioPerfilResponse}.
     *
     * @param usuario la entidad a convertir
     * @return el DTO con el perfil completo del usuario
     */
    public UsuarioPerfilResponse toPerfilResponse(Usuario usuario) {
        return new UsuarioPerfilResponse(
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getApellidos(),
                usuario.getDni(),
                usuario.getCorreoElectronico(),
                usuario.getFechaNacimiento(),
                usuario.getDireccion(),
                usuario.getNumTelefono(),
                usuario.getImagenUsuario(),
                usuario.getNombreUsuario()
        );
    }

    /**
     * Convierte un {@link Usuario} a un {@link UsuarioContactoResponse}.
     *
     * @param usuario la entidad a convertir
     * @return el DTO con los datos de contacto del vendedor
     */
    public UsuarioContactoResponse toContactoResponse(Usuario usuario) {
        return new UsuarioContactoResponse(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getCorreoElectronico(),
                usuario.getDireccion(),
                usuario.getNumTelefono(),
                usuario.getImagenUsuario()
        );
    }

    /**
     * Convierte un {@link Usuario} a un {@link UsuarioSimpleInfoResponse}.
     *
     * @param usuario la entidad a convertir
     * @return el DTO con la información básica del usuario
     */
    public UsuarioSimpleInfoResponse toSimpleInfoResponse(Usuario usuario) {
        return new UsuarioSimpleInfoResponse(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getImagenUsuario()
        );
    }
}
