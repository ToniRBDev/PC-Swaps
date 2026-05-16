package com.tonidev.backend.controller;

import com.tonidev.backend.dto.LoginRequest;
import com.tonidev.backend.dto.LoginResponse;
import com.tonidev.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la autenticación de usuarios.
 * Expone los endpoints bajo la ruta {@code /api/auth}.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param authService servicio encargado de la lógica de autenticación
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Autentica a un usuario con su correo electrónico y contraseña y devuelve un token JWT.
     *
     * @param request el DTO con las credenciales del usuario
     * @return el DTO con el token JWT y el identificador del usuario autenticado
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
