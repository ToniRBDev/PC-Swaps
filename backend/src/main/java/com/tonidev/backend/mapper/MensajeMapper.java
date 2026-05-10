package com.tonidev.backend.mapper;

import com.tonidev.backend.dto.MensajeRequest;
import com.tonidev.backend.dto.MensajeResponse;
import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Mensaje;
import com.tonidev.backend.model.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Mapper encargado de convertir entre la entidad {@link Mensaje} y sus DTOs.
 */
@Component
public class MensajeMapper {

    /**
     * Convierte un {@link MensajeRequest} a la entidad {@link Mensaje}.
     * La conversación y el emisor deben ser buscados en base de datos antes de llamar a este método.
     *
     * @param request      el DTO con los datos del mensaje
     * @param conversacion la conversación a la que pertenece el mensaje
     * @param emisor       el usuario que envía el mensaje
     * @return la entidad {@link Mensaje} lista para persistir
     */
    public Mensaje toEntity(MensajeRequest request, Conversacion conversacion, Usuario emisor) {
        return Mensaje.builder()
                .conversacion(conversacion)
                .emisor(emisor)
                .contenido(request.contenido())
                .fechaEnvio(LocalDateTime.now())
                .leido(false)
                .build();
    }

    /**
     * Convierte un {@link Mensaje} a un {@link MensajeResponse}.
     *
     * @param mensaje la entidad a convertir
     * @return el DTO con los datos del mensaje
     */
    public MensajeResponse toResponse(Mensaje mensaje) {
        return new MensajeResponse(
                mensaje.getIdMensaje(),
                mensaje.getEmisor().getIdUsuario(),
                mensaje.getContenido(),
                mensaje.getFechaEnvio(),
                mensaje.getLeido()
        );
    }
}
