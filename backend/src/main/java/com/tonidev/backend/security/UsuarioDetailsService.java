package com.tonidev.backend.security;

import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementación de {@link UserDetailsService} que carga los datos de autenticación
 * de un usuario desde la base de datos a partir de su correo electrónico.
 */
@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param usuarioRepository repositorio para acceder a los usuarios en base de datos
     */
    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Carga un usuario por su correo electrónico para que Spring Security pueda autenticarlo.
     *
     * @param correoElectronico el correo electrónico del usuario
     * @return los datos de autenticación del usuario
     * @throws UsernameNotFoundException si no existe un usuario con ese correo electrónico
     */
    @Override
    public UserDetails loadUserByUsername(String correoElectronico) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreoElectronico(correoElectronico)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No existe un usuario con correo: " + correoElectronico));
        return new UsuarioDetails(usuario.getIdUsuario(), usuario.getCorreoElectronico(), usuario.getPasswordHash());
    }
}
