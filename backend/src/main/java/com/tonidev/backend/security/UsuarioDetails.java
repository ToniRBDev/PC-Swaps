package com.tonidev.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Implementación de {@link UserDetails} que encapsula los datos de autenticación de un usuario.
 * Spring Security utiliza esta clase para gestionar la autenticación y autorización.
 */
public class UsuarioDetails implements UserDetails {

    private final Long idUsuario;
    private final String correoElectronico;
    private final String passwordHash;

    /**
     * Constructor con los datos necesarios para la autenticación.
     *
     * @param idUsuario          el identificador único del usuario
     * @param correoElectronico  el correo electrónico utilizado como nombre de usuario
     * @param passwordHash       el hash de la contraseña almacenado en base de datos
     */
    public UsuarioDetails(Long idUsuario, String correoElectronico, String passwordHash) {
        this.idUsuario = idUsuario;
        this.correoElectronico = correoElectronico;
        this.passwordHash = passwordHash;
    }

    /**
     * Devuelve el identificador único del usuario autenticado.
     *
     * @return el identificador del usuario
     */
    public Long getIdUsuario() {
        return idUsuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return correoElectronico;
    }
}
