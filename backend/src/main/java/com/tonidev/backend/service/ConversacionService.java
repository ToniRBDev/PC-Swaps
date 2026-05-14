package com.tonidev.backend.service;

import com.tonidev.backend.dto.ConversacionRequest;
import com.tonidev.backend.dto.ConversacionResponse;
import com.tonidev.backend.dto.MensajeResponse;
import com.tonidev.backend.mapper.ConversacionMapper;
import com.tonidev.backend.mapper.MensajeMapper;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.ArticuloRepository;
import com.tonidev.backend.repository.ConversacionRepository;
import com.tonidev.backend.repository.MensajeRepository;
import com.tonidev.backend.repository.UsuarioRepository;
import com.tonidev.backend.exception.AccesoNoAutorizadoException;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.exception.ReglaNegocioException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio encargado de la lógica de negocio relacionada con las conversaciones.
 */
@Service
public class ConversacionService {

    private final ConversacionRepository conversacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final ArticuloRepository articuloRepository;
    private final MensajeRepository mensajeRepository;
    private final ConversacionMapper conversacionMapper;
    private final MensajeMapper mensajeMapper;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param conversacionRepository repositorio para acceder a las conversaciones en base de datos
     * @param usuarioRepository      repositorio para acceder a los usuarios en base de datos
     * @param articuloRepository     repositorio para acceder a los artículos en base de datos
     * @param mensajeRepository      repositorio para acceder a los mensajes en base de datos
     * @param conversacionMapper     mapper para convertir entre entidad y DTOs de conversación
     * @param mensajeMapper          mapper para convertir entre entidad y DTOs de mensaje
     */
    public ConversacionService(ConversacionRepository conversacionRepository,
                               UsuarioRepository usuarioRepository,
                               ArticuloRepository articuloRepository,
                               MensajeRepository mensajeRepository,
                               ConversacionMapper conversacionMapper,
                               MensajeMapper mensajeMapper) {
        this.conversacionRepository = conversacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.articuloRepository = articuloRepository;
        this.mensajeRepository = mensajeRepository;
        this.conversacionMapper = conversacionMapper;
        this.mensajeMapper = mensajeMapper;
    }

    /**
     * Inicia una conversación sobre un artículo.
     * Valida que el comprador no sea el vendedor del artículo y que no exista
     * ya una conversación entre ellos sobre ese mismo artículo.
     *
     * @param idComprador el identificador del usuario que inicia la conversación
     * @param request     el DTO con el identificador del artículo
     * @return el DTO con los datos de la conversación creada
     * @throws IllegalArgumentException si el usuario es el vendedor del artículo o ya existe una conversación
     */
    public ConversacionResponse iniciar(Long idComprador, ConversacionRequest request) {
        Usuario comprador = obtenerUsuarioPorId(idComprador);
        Articulo articulo = obtenerArticuloPorId(request.idArticulo());
        Usuario vendedor = articulo.getUsuario();

        if (vendedor.getIdUsuario().equals(idComprador)) {
            throw new ReglaNegocioException("No puedes iniciar una conversación sobre tu propio artículo");
        }

        if (conversacionRepository.existsByArticuloAndComprador(articulo, comprador)) {
            throw new ReglaNegocioException("Ya tienes una conversación abierta sobre este artículo");
        }

        Conversacion conversacion = conversacionMapper.toEntity(articulo, comprador, vendedor);
        Conversacion conversacionGuardada = conversacionRepository.save(conversacion);

        return conversacionMapper.toResponse(conversacionGuardada, List.of());
    }

    /**
     * Devuelve el detalle de una conversación con todos sus mensajes ordenados por fecha.
     * Valida que el usuario sea participante de la conversación.
     *
     * @param idConversacion el identificador de la conversación
     * @param idUsuario      el identificador del usuario autenticado
     * @return el DTO con los datos de la conversación y sus mensajes
     * @throws IllegalArgumentException si el usuario no es participante de la conversación
     */
    public ConversacionResponse obtener(Long idConversacion, Long idUsuario) {
        Conversacion conversacion = obtenerConversacionPorId(idConversacion);
        validarParticipante(conversacion, idUsuario);

        List<MensajeResponse> mensajes = mensajeRepository
                .findByConversacionOrderByFechaEnvioAsc(conversacion)
                .stream()
                .map(mensajeMapper::toResponse)
                .toList();

        return conversacionMapper.toResponse(conversacion, mensajes);
    }

    /**
     * Devuelve todas las conversaciones del usuario autenticado, tanto como comprador como vendedor.
     *
     * @param idUsuario el identificador del usuario autenticado
     * @return lista de conversaciones con sus mensajes
     */
    public List<ConversacionResponse> listar(Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);

        return conversacionRepository.findByCompradorOrVendedor(usuario, usuario)
                .stream()
                .map(conversacion -> {
                    List<MensajeResponse> mensajes = mensajeRepository
                            .findByConversacionOrderByFechaEnvioAsc(conversacion)
                            .stream()
                            .map(mensajeMapper::toResponse)
                            .toList();
                    return conversacionMapper.toResponse(conversacion, mensajes);
                })
                .toList();
    }

    /**
     * Elimina una conversación y todos sus mensajes.
     * Valida que el usuario sea participante antes de eliminar.
     *
     * @param idConversacion el identificador de la conversación a eliminar
     * @param idUsuario      el identificador del usuario autenticado
     * @throws IllegalArgumentException si el usuario no es participante de la conversación
     */
    public void eliminar(Long idConversacion, Long idUsuario) {
        Conversacion conversacion = obtenerConversacionPorId(idConversacion);
        validarParticipante(conversacion, idUsuario);
        conversacionRepository.delete(conversacion);
    }

    /**
     * Verifica que el usuario autenticado sea participante de la conversación.
     *
     * @param conversacion la conversación a verificar
     * @param idUsuario    el identificador del usuario autenticado
     * @throws IllegalArgumentException si el usuario no es ni comprador ni vendedor
     */
    private void validarParticipante(Conversacion conversacion, Long idUsuario) {
        boolean esComprador = conversacion.getComprador().getIdUsuario().equals(idUsuario);
        boolean esVendedor = conversacion.getVendedor().getIdUsuario().equals(idUsuario);

        if (!esComprador && !esVendedor) {
            throw new AccesoNoAutorizadoException("No tienes permiso para acceder a esta conversación");
        }
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
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe una conversación con id: " + idConversacion));
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
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe un usuario con id: " + idUsuario));
    }

    /**
     * Busca un artículo por su identificador o lanza una excepción si no existe.
     *
     * @param idArticulo el identificador del artículo
     * @return la entidad {@link Articulo}
     * @throws IllegalArgumentException si no existe un artículo con ese identificador
     */
    private Articulo obtenerArticuloPorId(Long idArticulo) {
        return articuloRepository.findById(idArticulo)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe un artículo con id: " + idArticulo));
    }
}
