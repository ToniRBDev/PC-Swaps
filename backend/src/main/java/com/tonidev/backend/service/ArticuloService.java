package com.tonidev.backend.service;

import com.tonidev.backend.dto.ArticuloCardResponse;
import com.tonidev.backend.dto.ArticuloRequest;
import com.tonidev.backend.dto.ArticuloResponse;
import com.tonidev.backend.mapper.ArticuloMapper;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Categoria;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.ArticuloRepository;
import com.tonidev.backend.repository.CategoriaRepository;
import com.tonidev.backend.repository.UsuarioRepository;
import com.tonidev.backend.exception.AccesoNoAutorizadoException;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio encargado de la lógica de negocio relacionada con los artículos.
 */
@Service
public class ArticuloService {

    private final ArticuloRepository articuloRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ArticuloMapper articuloMapper;
    private final ImagenService imagenService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param articuloRepository  repositorio para acceder a los artículos en base de datos
     * @param usuarioRepository   repositorio para acceder a los usuarios en base de datos
     * @param categoriaRepository repositorio para acceder a las categorías en base de datos
     * @param articuloMapper      mapper para convertir entre entidad y DTOs
     * @param imagenService       servicio para gestionar imágenes en el sistema de ficheros
     */
    public ArticuloService(ArticuloRepository articuloRepository,
                           UsuarioRepository usuarioRepository,
                           CategoriaRepository categoriaRepository,
                           ArticuloMapper articuloMapper,
                           ImagenService imagenService) {
        this.articuloRepository = articuloRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.articuloMapper = articuloMapper;
        this.imagenService = imagenService;
    }

    /**
     * Publica un nuevo artículo en la plataforma.
     *
     * @param idUsuario el identificador del usuario que publica el artículo
     * @param request   el DTO con los datos del artículo
     * @param imagen    el fichero de imagen del artículo
     * @return el detalle completo del artículo publicado
     * @throws IOException si ocurre un error al guardar la imagen en disco
     */
    public ArticuloResponse publicar(Long idUsuario, ArticuloRequest request, MultipartFile imagen) throws IOException {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        Categoria categoria = obtenerCategoriaPorId(request.idCategoria());
        String rutaImagen = imagenService.guardar(imagen);
        Articulo articulo = articuloMapper.toEntity(request, usuario, categoria, rutaImagen);
        return articuloMapper.toResponse(articuloRepository.save(articulo));
    }

    /**
     * Devuelve el detalle completo de un artículo e incrementa su contador de visitas.
     *
     * @param idArticulo el identificador del artículo
     * @return el DTO con el detalle completo del artículo
     * @throws IllegalArgumentException si no existe un artículo con ese identificador
     */
    public ArticuloResponse obtenerDetalle(Long idArticulo) {
        Articulo articulo = obtenerArticuloPorId(idArticulo);
        articulo.setNumeroVisitas(articulo.getNumeroVisitas() + 1);
        return articuloMapper.toResponse(articuloRepository.save(articulo));
    }

    /**
     * Devuelve todos los artículos activos de la plataforma excluyendo los del usuario autenticado.
     *
     * @param idUsuario el identificador del usuario autenticado
     * @return lista de artículos en formato card
     */
    public List<ArticuloCardResponse> listarTodos(Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        return articuloRepository.findByActivoTrueAndUsuarioNot(usuario)
                .stream()
                .map(articuloMapper::toCardResponse)
                .toList();
    }

    /**
     * Devuelve todos los artículos del usuario autenticado, activos e inactivos.
     * Los artículos inactivos se muestran oscurecidos en el frontend.
     *
     * @param idUsuario el identificador del usuario autenticado
     * @return lista de artículos en formato card
     */
    public List<ArticuloCardResponse> listarPropios(Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        return articuloRepository.findByUsuario(usuario)
                .stream()
                .map(articuloMapper::toCardResponse)
                .toList();
    }

    /**
     * Devuelve los artículos activos de una categoría excluyendo los del usuario autenticado.
     *
     * @param idCategoria el identificador de la categoría
     * @param idUsuario   el identificador del usuario autenticado
     * @return lista de artículos en formato card
     */
    public List<ArticuloCardResponse> listarPorCategoria(Long idCategoria, Long idUsuario) {
        Categoria categoria = obtenerCategoriaPorId(idCategoria);
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        return articuloRepository.findByCategoriaAndActivoTrueAndUsuarioNot(categoria, usuario)
                .stream()
                .map(articuloMapper::toCardResponse)
                .toList();
    }

    /**
     * Busca artículos activos por marca o modelo excluyendo los del usuario autenticado.
     *
     * @param texto     el texto a buscar en la marca o el modelo
     * @param idUsuario el identificador del usuario autenticado
     * @return lista de artículos en formato card
     */
    public List<ArticuloCardResponse> buscar(String texto, Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        return articuloRepository.buscarPorTexto(usuario, texto)
                .stream()
                .map(articuloMapper::toCardResponse)
                .toList();
    }

    /**
     * Edita los datos de un artículo. Solo el propietario puede editarlo.
     * Si se proporciona una nueva imagen, se elimina la anterior del disco.
     *
     * @param idArticulo el identificador del artículo a editar
     * @param idUsuario  el identificador del usuario autenticado
     * @param request    el DTO con los nuevos datos
     * @param imagen     la nueva imagen del artículo (opcional)
     * @return el detalle actualizado del artículo
     * @throws IOException              si ocurre un error al gestionar la imagen en disco
     * @throws IllegalArgumentException si el usuario no es el propietario del artículo
     */
    public ArticuloResponse editar(Long idArticulo, Long idUsuario, ArticuloRequest request, MultipartFile imagen) throws IOException {
        Articulo articulo = obtenerArticuloPorId(idArticulo);
        validarPropietario(articulo, idUsuario);

        Categoria categoria = obtenerCategoriaPorId(request.idCategoria());
        articulo.setCategoria(categoria);
        articulo.setMarca(request.marca());
        articulo.setModelo(request.modelo());
        articulo.setEstado(request.estado());
        articulo.setPrecio(request.precio());
        articulo.setDescripcion(request.descripcion());

        if (imagen != null && !imagen.isEmpty()) {
            imagenService.eliminar(articulo.getImagen());
            articulo.setImagen(imagenService.guardar(imagen));
        }

        return articuloMapper.toResponse(articuloRepository.save(articulo));
    }

    /**
     * Renueva un artículo, actualizando su fecha de última renovación y marcándolo como activo.
     * Solo el propietario puede renovarlo.
     *
     * @param idArticulo el identificador del artículo a renovar
     * @param idUsuario  el identificador del usuario autenticado
     * @throws IllegalArgumentException si el usuario no es el propietario del artículo
     */
    public void renovar(Long idArticulo, Long idUsuario) {
        Articulo articulo = obtenerArticuloPorId(idArticulo);
        validarPropietario(articulo, idUsuario);
        articulo.setFechaUltimaRenovacion(LocalDateTime.now());
        articulo.setActivo(true);
        articuloRepository.save(articulo);
    }

    /**
     * Elimina un artículo y su imagen del disco. Solo el propietario puede eliminarlo.
     *
     * @param idArticulo el identificador del artículo a eliminar
     * @param idUsuario  el identificador del usuario autenticado
     * @throws IOException              si ocurre un error al eliminar la imagen del disco
     * @throws IllegalArgumentException si el usuario no es el propietario del artículo
     */
    public void eliminar(Long idArticulo, Long idUsuario) throws IOException {
        Articulo articulo = obtenerArticuloPorId(idArticulo);
        validarPropietario(articulo, idUsuario);
        imagenService.eliminar(articulo.getImagen());
        articuloRepository.delete(articulo);
    }

    /**
     * Verifica que el usuario autenticado sea el propietario del artículo.
     *
     * @param articulo  el artículo a verificar
     * @param idUsuario el identificador del usuario autenticado
     * @throws IllegalArgumentException si el usuario no es el propietario
     */
    private void validarPropietario(Articulo articulo, Long idUsuario) {
        if (!articulo.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new AccesoNoAutorizadoException("No tienes permiso para realizar esta acción sobre este artículo");
        }
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
     * Busca una categoría por su identificador o lanza una excepción si no existe.
     *
     * @param idCategoria el identificador de la categoría
     * @return la entidad {@link Categoria}
     * @throws IllegalArgumentException si no existe una categoría con ese identificador
     */
    private Categoria obtenerCategoriaPorId(Long idCategoria) {
        return categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe una categoría con id: " + idCategoria));
    }
}
