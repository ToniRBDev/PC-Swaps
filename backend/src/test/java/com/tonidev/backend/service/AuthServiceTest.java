package com.tonidev.backend.service;

import com.tonidev.backend.dto.LoginRequest;
import com.tonidev.backend.dto.LoginResponse;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.UsuarioRepository;
import com.tonidev.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios del servicio {@link AuthService}.
 * Verifica la lógica de autenticación y generación de tokens JWT con dependencias simuladas.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private Usuario usuarioEjemplo;

    /**
     * Inicializa los objetos de ejemplo reutilizados en los tests.
     */
    @BeforeEach
    void setUp() {
        usuarioEjemplo = Usuario.builder()
                .idUsuario(1L)
                .correoElectronico("toni@ejemplo.com")
                .passwordHash("hash")
                .nombreUsuario("tonidev")
                .build();
    }

    // ─── login ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login: devuelve token e idUsuario cuando las credenciales son correctas")
    void login_credencialesCorrectas_devuelveLoginResponse() {
        LoginRequest request = new LoginRequest("toni@ejemplo.com", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(usuarioRepository.findByCorreoElectronico("toni@ejemplo.com"))
                .thenReturn(Optional.of(usuarioEjemplo));
        when(jwtUtil.generarToken(1L, "toni@ejemplo.com")).thenReturn("tokenGenerado");

        LoginResponse resultado = authService.login(request);

        assertThat(resultado.token()).isEqualTo("tokenGenerado");
        assertThat(resultado.idUsuario()).isEqualTo(1L);
        verify(jwtUtil).generarToken(1L, "toni@ejemplo.com");
    }

    @Test
    @DisplayName("login: lanza BadCredentialsException cuando la contraseña es incorrecta")
    void login_passwordIncorrecta_lanzaBadCredentialsException() {
        LoginRequest request = new LoginRequest("toni@ejemplo.com", "passwordErronea");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Credenciales incorrectas"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);

        verify(jwtUtil, never()).generarToken(any(), any());
    }

    @Test
    @DisplayName("login: lanza BadCredentialsException cuando el correo no está registrado")
    void login_correoNoRegistrado_lanzaBadCredentialsException() {
        LoginRequest request = new LoginRequest("noexiste@ejemplo.com", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Credenciales incorrectas"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);

        verify(usuarioRepository, never()).findByCorreoElectronico(any());
    }

    @Test
    @DisplayName("login: el token generado contiene el correo y el id del usuario")
    void login_credencialesCorrectas_tokenContieneCorreoEId() {
        LoginRequest request = new LoginRequest("toni@ejemplo.com", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(usuarioRepository.findByCorreoElectronico("toni@ejemplo.com"))
                .thenReturn(Optional.of(usuarioEjemplo));
        when(jwtUtil.generarToken(1L, "toni@ejemplo.com")).thenReturn("tokenGenerado");

        authService.login(request);

        verify(jwtUtil).generarToken(1L, "toni@ejemplo.com");
    }
}
