package com.tonidev.backend.controller;

import com.tonidev.backend.dto.CambiarPasswordRequest;
import com.tonidev.backend.dto.UsuarioActualizarRequest;
import com.tonidev.backend.dto.UsuarioContactoResponse;
import com.tonidev.backend.dto.UsuarioPerfilResponse;
import com.tonidev.backend.dto.UsuarioRegistroRequest;
import com.tonidev.backend.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
     * Registra un nuevo usuario en la plataforma.
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
     * Devuelve el perfil completo de un usuario.
     *
     * @param idUsuario el identificador del usuario
     * @return el DTO con los datos del perfil
     */
    @GetMapping("/{idUsuario}")
    public ResponseEntity<UsuarioPerfilResponse> obtenerPerfil(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(usuarioService.obtenerPerfil(idUsuario));
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
     * Actualiza los datos del perfil de un usuario.
     *
     * @param idUsuario el identificador del usuario
     * @param request   el DTO con los datos a actualizar
     * @return el perfil actualizado
     */
    @PutMapping("/{idUsuario}")
    public ResponseEntity<UsuarioPerfilResponse> actualizar(@PathVariable Long idUsuario,
                                                            @RequestBody UsuarioActualizarRequest request) {
        return ResponseEntity.ok(usuarioService.actualizar(idUsuario, request));
    }

    /**
     * Cambia la contraseña de un usuario.
     *
     * @param idUsuario el identificador del usuario
     * @param request   el DTO con la contraseña actual y la nueva
     * @return respuesta vacía con estado 204
     */
    @PutMapping("/{idUsuario}/password")
    public ResponseEntity<Void> cambiarPassword(@PathVariable Long idUsuario,
                                                @RequestBody CambiarPasswordRequest request) {
        usuarioService.cambiarPassword(idUsuario, request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Actualiza la foto de perfil de un usuario.
     *
     * @param idUsuario el identificador del usuario
     * @param archivo   el fichero de imagen enviado
     * @return el perfil actualizado con la nueva imagen
     * @throws IOException si ocurre un error al guardar la imagen en disco
     */
    @PutMapping("/{idUsuario}/imagen")
    public ResponseEntity<UsuarioPerfilResponse> actualizarImagen(@PathVariable Long idUsuario,
                                                                  @RequestParam("archivo") MultipartFile archivo) throws IOException {
        return ResponseEntity.ok(usuarioService.actualizarImagen(idUsuario, archivo));
    }

    /**
     * Elimina la cuenta de un usuario y todo lo relacionado con él.
     *
     * @param idUsuario el identificador del usuario a eliminar
     * @return respuesta vacía con estado 204
     */
    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idUsuario) {
        usuarioService.eliminar(idUsuario);
        return ResponseEntity.noContent().build();
    }
}
