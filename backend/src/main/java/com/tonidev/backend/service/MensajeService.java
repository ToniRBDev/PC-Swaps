package com.tonidev.backend.service;

import com.tonidev.backend.dto.MensajeRequest;
import com.tonidev.backend.dto.MensajeResponse;
import com.tonidev.backend.mapper.MensajeMapper;
import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Mensaje;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.ConversacionRepository;
import com.tonidev.backend.repository.MensajeRepository;
import com.tonidev.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio encargado de la lógica de negocio relacionada con los mensajes.
 */
@Service
public class MensajeService {

    private final MensajeRepository mensajeRepository;
    private final ConversacionRepository conversacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final MensajeMapper mensajeMapper;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param mensajeRepository      repositorio para acceder a los mensajes en base de datos
     * @param conversacionRepository repositorio para acceder a las conversaciones en base de datos
     * @param usuarioRepository      repositorio para acceder a los usuarios en base de datos
     * @param mensajeMapper          mapper para convertir entre entidad y DTOs de mensaje
     */
    public MensajeService(MensajeRepository mensajeRepository,
                          ConversacionRepository conversacionRepository,
                          UsuarioRepository usuarioRepository,
                          MensajeMapper mensajeMapper) {
        this.mensajeRepository = mensajeRepository;
        this.conversacionRepository = conversacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.mensajeMapper = mensajeMapper;
    }

    /**
     * Envía un mensaje en una conversación.
     * Valida que el emisor sea participante de la conversación antes de guardar el mensaje.
     *
     * @param idEmisor el identificador del usuario que envía el mensaje
     * @param request  el DTO con el identificador de la conversación y el contenido del mensaje
     * @return el DTO con los datos del mensaje enviado
     * @throws IllegalArgumentException si el emisor no es participante de la conversación
     */
    public MensajeResponse enviar(Long idEmisor, MensajeRequest request) {
        Usuario emisor = obtenerUsuarioPorId(idEmisor);
        Conversacion conversacion = obtenerConversacionPorId(request.idConversacion());

        boolean esComprador = conversacion.getComprador().getIdUsuario().equals(idEmisor);
        boolean esVendedor = conversacion.getVendedor().getIdUsuario().equals(idEmisor);

        if (!esComprador && !esVendedor) {
            throw new IllegalArgumentException("No tienes permiso para enviar mensajes en esta conversación");
        }

        Mensaje mensaje = mensajeMapper.toEntity(request, conversacion, emisor);
        return mensajeMapper.toResponse(mensajeRepository.save(mensaje));
    }

    /**
     * Marca como leídos todos los mensajes de una conversación que no haya enviado el usuario receptor.
     *
     * @param idConversacion el identificador de la conversación
     * @param idUsuario      el identificador del usuario que está leyendo los mensajes
     * @throws IllegalArgumentException si el usuario no es participante de la conversación
     */
    public void marcarComoLeidos(Long idConversacion, Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        Conversacion conversacion = obtenerConversacionPorId(idConversacion);

        boolean esComprador = conversacion.getComprador().getIdUsuario().equals(idUsuario);
        boolean esVendedor = conversacion.getVendedor().getIdUsuario().equals(idUsuario);

        if (!esComprador && !esVendedor) {
            throw new IllegalArgumentException("No tienes permiso para acceder a esta conversación");
        }

        List<Mensaje> mensajesNoLeidos = mensajeRepository
                .findByConversacionAndLeidoFalseAndEmisorNot(conversacion, usuario);

        mensajesNoLeidos.forEach(mensaje -> mensaje.setLeido(true));
        mensajeRepository.saveAll(mensajesNoLeidos);
    }

    /**
     * Busca un usuario por su identificador o lanza una excepción si no existe.
     *
     * @param idUsuario el identificador del usuario
     * @return la entidad {@link Usuario}
     * @throws IllegalArgumentException si no existe un usuario con ese identificador
     */
    private Usuario obtenerUsuarioPorId(Long idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("No existe un usuario con id: " + idUsuario));
    }

    /**
     * Busca una conversación por su identificador o lanza una excepción si no existe.
     *
     * @param idConversacion el identificador de la conversación
     * @return la entidad {@link Conversacion}
     * @throws IllegalArgumentException si no existe una conversación con ese identificador
     */
    private Conversacion obtenerConversacionPorId(Long idConversacion) {
        return conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new IllegalArgumentException("No existe una conversación con id: " + idConversacion));
    }
}
