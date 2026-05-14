package com.tonidev.backend.controller;

import com.tonidev.backend.dto.MensajeRequest;
import com.tonidev.backend.dto.MensajeResponse;
import com.tonidev.backend.service.MensajeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la gestión de mensajes.
 * Expone los endpoints bajo la ruta {@code /api/mensajes}.
 */
@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {

    private final MensajeService mensajeService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param mensajeService servicio encargado de la lógica de negocio de mensajes
     */
    public MensajeController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

    /**
     * Envía un mensaje en una conversación.
     *
     * @param idUsuario el identificador del usuario que envía el mensaje (emisor)
     * @param request   el DTO con el identificador de la conversación y el contenido del mensaje
     * @return el DTO con los datos del mensaje enviado con estado 201
     */
    @PostMapping
    public ResponseEntity<MensajeResponse> enviar(
            @RequestParam Long idUsuario,
            @RequestBody MensajeRequest request) {
        MensajeResponse respuesta = mensajeService.enviar(idUsuario, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    /**
     * Marca como leídos todos los mensajes de una conversación que no haya enviado el usuario receptor.
     *
     * @param idConversacion el identificador de la conversación
     * @param idUsuario      el identificador del usuario que está leyendo los mensajes
     * @return respuesta vacía con estado 204
     */
    @PutMapping("/conversacion/{idConversacion}/leer")
    public ResponseEntity<Void> marcarComoLeidos(
            @PathVariable Long idConversacion,
            @RequestParam Long idUsuario) {
        mensajeService.marcarComoLeidos(idConversacion, idUsuario);
        return ResponseEntity.noContent().build();
    }
}
