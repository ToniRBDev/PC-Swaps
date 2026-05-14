package com.tonidev.backend.service;

import com.tonidev.backend.dto.ArticuloCardResponse;
import com.tonidev.backend.mapper.ArticuloMapper;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Seguimiento;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.ArticuloRepository;
import com.tonidev.backend.repository.SeguimientoRepository;
import com.tonidev.backend.repository.UsuarioRepository;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.exception.ReglaNegocioException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio encargado de la lógica de negocio relacionada con los seguimientos de artículos.
 */
@Service
public class SeguimientoService {

    private final SeguimientoRepository seguimientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ArticuloRepository articuloRepository;
    private final ArticuloMapper articuloMapper;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param seguimientoRepository repositorio para acceder a los seguimientos en base de datos
     * @param usuarioRepository     repositorio para acceder a los usuarios en base de datos
     * @param articuloRepository    repositorio para acceder a los artículos en base de datos
     * @param articuloMapper        mapper para convertir los artículos a DTOs
     */
    public SeguimientoService(SeguimientoRepository seguimientoRepository,
                              UsuarioRepository usuarioRepository,
                              ArticuloRepository articuloRepository,
                              ArticuloMapper articuloMapper) {
        this.seguimientoRepository = seguimientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.articuloRepository = articuloRepository;
        this.articuloMapper = articuloMapper;
    }

    /**
     * Añade un artículo a la lista de seguimiento del usuario.
     * Valida que el usuario no esté siguiendo ya ese artículo.
     *
     * @param idUsuario  el identificador del usuario
     * @param idArticulo el identificador del artículo a seguir
     * @throws IllegalArgumentException si el usuario ya está siguiendo ese artículo
     */
    public void agregar(Long idUsuario, Long idArticulo) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        Articulo articulo = obtenerArticuloPorId(idArticulo);

        if (seguimientoRepository.existsByUsuarioAndArticulo(usuario, articulo)) {
            throw new ReglaNegocioException("Ya estás siguiendo este artículo");
        }

        Seguimiento seguimiento = Seguimiento.builder()
                .usuario(usuario)
                .articulo(articulo)
                .fechaGuardado(LocalDateTime.now())
                .build();

        seguimientoRepository.save(seguimiento);
    }

    /**
     * Elimina un artículo de la lista de seguimiento del usuario.
     *
     * @param idUsuario  el identificador del usuario
     * @param idArticulo el identificador del artículo a dejar de seguir
     */
    @Transactional
    public void eliminar(Long idUsuario, Long idArticulo) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        Articulo articulo = obtenerArticuloPorId(idArticulo);
        seguimientoRepository.deleteByUsuarioAndArticulo(usuario, articulo);
    }

    /**
     * Devuelve los artículos guardados por el usuario en formato card.
     *
     * @param idUsuario el identificador del usuario
     * @return lista de artículos en formato card
     */
    public List<ArticuloCardResponse> listar(Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        return seguimientoRepository.findByUsuario(usuario)
                .stream()
                .map(seguimiento -> articuloMapper.toCardResponse(seguimiento.getArticulo()))
                .toList();
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
