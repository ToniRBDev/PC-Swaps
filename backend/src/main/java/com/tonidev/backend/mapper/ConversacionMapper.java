package com.tonidev.backend.mapper;

import com.tonidev.backend.dto.ConversacionResponse;
import com.tonidev.backend.dto.MensajeResponse;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Mapper encargado de convertir entre la entidad {@link Conversacion} y sus DTOs.
 */
@Component
public class ConversacionMapper {

    private final UsuarioMapper usuarioMapper;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param usuarioMapper mapper para convertir el vendedor de la conversación
     */
    public ConversacionMapper(UsuarioMapper usuarioMapper) {
        this.usuarioMapper = usuarioMapper;
    }

    /**
     * Crea la entidad {@link Conversacion} a partir del artículo, comprador y vendedor.
     * El comprador se obtiene del usuario autenticado y el vendedor del artículo en el service.
     *
     * @param articulo  el artículo sobre el que se inicia la conversación
     * @param comprador el usuario que inicia la conversación
     * @param vendedor  el propietario del artículo
     * @return la entidad {@link Conversacion} lista para persistir
     */
    public Conversacion toEntity(Articulo articulo, Usuario comprador, Usuario vendedor) {
        return Conversacion.builder()
                .articulo(articulo)
                .comprador(comprador)
                .vendedor(vendedor)
                .fechaInicio(LocalDateTime.now())
                .build();
    }

    /**
     * Convierte una {@link Conversacion} a un {@link ConversacionResponse}.
     * Los mensajes deben ser mapeados previamente en el service con {@link MensajeMapper}.
     *
     * @param conversacion la entidad a convertir
     * @param mensajes     la lista de mensajes ya mapeados a {@link MensajeResponse}
     * @return el DTO con los datos de la conversación
     */
    public ConversacionResponse toResponse(Conversacion conversacion, List<MensajeResponse> mensajes) {
        return new ConversacionResponse(
                conversacion.getIdConversacion(),
                conversacion.getArticulo().getIdArticulo(),
                usuarioMapper.toSimpleInfoResponse(conversacion.getVendedor()),
                mensajes,
                conversacion.getFechaInicio().toLocalDate()
        );
    }
}
