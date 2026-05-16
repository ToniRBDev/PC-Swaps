package com.tonidev.backend.service;

import com.tonidev.backend.dto.LoginRequest;
import com.tonidev.backend.dto.LoginResponse;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.UsuarioRepository;
import com.tonidev.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

/**
 * Servicio encargado de la lógica de autenticación.
 * Valida las credenciales del usuario y genera el token JWT correspondiente.
 */
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param authenticationManager gestor de autenticación de Spring Security
     * @param usuarioRepository     repositorio para acceder a los usuarios en base de datos
     * @param jwtUtil               utilidad para generar tokens JWT
     */
    public AuthService(AuthenticationManager authenticationManager,
                       UsuarioRepository usuarioRepository,
                       JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Autentica al usuario con sus credenciales y devuelve un token JWT si son correctas.
     *
     * @param request el DTO con el correo electrónico y la contraseña del usuario
     * @return el DTO con el token JWT generado y el identificador del usuario
     * @throws org.springframework.security.core.AuthenticationException si las credenciales son incorrectas
     * @throws RecursoNoEncontradoException si no existe un usuario con ese correo electrónico
     */
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.correoElectronico(), request.password())
        );

        Usuario usuario = usuarioRepository.findByCorreoElectronico(request.correoElectronico())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un usuario con correo: " + request.correoElectronico()));

        String token = jwtUtil.generarToken(usuario.getIdUsuario(), usuario.getCorreoElectronico());
        return new LoginResponse(token, usuario.getIdUsuario());
    }
}
