package com.tonidev.backend.controller;

import com.tonidev.backend.dto.CambiarPasswordRequest;
import com.tonidev.backend.dto.UsuarioActualizarRequest;
import com.tonidev.backend.dto.UsuarioContactoResponse;
import com.tonidev.backend.dto.UsuarioPerfilResponse;
import com.tonidev.backend.dto.UsuarioRegistroRequest;
import com.tonidev.backend.security.UsuarioDetails;
import com.tonidev.backend.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Controlador REST para la gestión de usuarios.
 * Expone los endpoints bajo la ruta {@code /api/usuarios}.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param usuarioService servicio encargado de la lógica de negocio de usuarios
     */
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Registra un nuevo usuario en la plataforma. Endpoint público.
     *
     * @param request el DTO con los datos de registro
     * @return el perfil del usuario recién creado con estado 201
     */
    @PostMapping("/registro")
    public ResponseEntity<UsuarioPerfilResponse> registrar(@RequestBody UsuarioRegistroRequest request) {
        UsuarioPerfilResponse respuesta = usuarioService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    /**
     * Devuelve el perfil completo del usuario autenticado.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return el DTO con los datos del perfil
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioPerfilResponse> obtenerPerfil(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(usuarioService.obtenerPerfil(usuarioDetails.getIdUsuario()));
    }

    /**
     * Devuelve los datos de contacto de un vendedor para mostrarlos en el detalle de un artículo.
     *
     * @param idUsuario el identificador del vendedor
     * @return el DTO con los datos de contacto
     */
    @GetMapping("/{idUsuario}/contacto")
    public ResponseEntity<UsuarioContactoResponse> obtenerDatosContacto(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(usuarioService.obtenerDatosContacto(idUsuario));
    }

    /**
     * Actualiza los datos del perfil del usuario autenticado.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @param request        el DTO con los datos a actualizar
     * @return el perfil actualizado
     */
    @PutMapping("/me")
    public ResponseEntity<UsuarioPerfilResponse> actualizar(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @RequestBody UsuarioActualizarRequest request) {
        return ResponseEntity.ok(usuarioService.actualizar(usuarioDetails.getIdUsuario(), request));
    }

    /**
     * Cambia la contraseña del usuario autenticado.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @param request        el DTO con la contraseña actual y la nueva
     * @return respuesta vacía con estado 204
     */
    @PutMapping("/me/password")
    public ResponseEntity<Void> cambiarPassword(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @RequestBody CambiarPasswordRequest request) {
        usuarioService.cambiarPassword(usuarioDetails.getIdUsuario(), request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Actualiza la foto de perfil del usuario autenticado.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @param archivo        el fichero de imagen enviado
     * @return el perfil actualizado con la nueva imagen
     * @throws IOException si ocurre un error al guardar la imagen en disco
     */
    @PutMapping("/me/imagen")
    public ResponseEntity<UsuarioPerfilResponse> actualizarImagen(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @RequestParam("archivo") MultipartFile archivo) throws IOException {
        return ResponseEntity.ok(usuarioService.actualizarImagen(usuarioDetails.getIdUsuario(), archivo));
    }

    /**
     * Elimina la cuenta del usuario autenticado y todo lo relacionado con él.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return respuesta vacía con estado 204
     */
    @DeleteMapping("/me")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        usuarioService.eliminar(usuarioDetails.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
