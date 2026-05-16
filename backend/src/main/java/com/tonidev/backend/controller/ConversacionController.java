package com.tonidev.backend.controller;

import com.tonidev.backend.dto.ConversacionRequest;
import com.tonidev.backend.dto.ConversacionResponse;
import com.tonidev.backend.security.UsuarioDetails;
import com.tonidev.backend.service.ConversacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de conversaciones.
 * Expone los endpoints bajo la ruta {@code /api/conversaciones}.
 */
@RestController
@RequestMapping("/api/conversaciones")
public class ConversacionController {

    private final ConversacionService conversacionService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param conversacionService servicio encargado de la lógica de negocio de conversaciones
     */
    public ConversacionController(ConversacionService conversacionService) {
        this.conversacionService = conversacionService;
    }

    /**
     * Inicia una conversación sobre un artículo.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT (comprador)
     * @param request        el DTO con el identificador del artículo
     * @return el DTO con los datos de la conversación creada con estado 201
     */
    @PostMapping
    public ResponseEntity<ConversacionResponse> iniciar(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @RequestBody ConversacionRequest request) {
        ConversacionResponse respuesta = conversacionService.iniciar(usuarioDetails.getIdUsuario(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    /**
     * Devuelve el detalle de una conversación con todos sus mensajes.
     *
     * @param idConversacion el identificador de la conversación
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return el DTO con los datos de la conversación y sus mensajes
     */
    @GetMapping("/{idConversacion}")
    public ResponseEntity<ConversacionResponse> obtener(
            @PathVariable Long idConversacion,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(conversacionService.obtener(idConversacion, usuarioDetails.getIdUsuario()));
    }

    /**
     * Devuelve todas las conversaciones del usuario autenticado, como comprador y como vendedor.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return lista de conversaciones con sus mensajes
     */
    @GetMapping
    public ResponseEntity<List<ConversacionResponse>> listar(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(conversacionService.listar(usuarioDetails.getIdUsuario()));
    }

    /**
     * Elimina una conversación y todos sus mensajes.
     *
     * @param idConversacion el identificador de la conversación a eliminar
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return respuesta vacía con estado 204
     */
    @DeleteMapping("/{idConversacion}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long idConversacion,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        conversacionService.eliminar(idConversacion, usuarioDetails.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
