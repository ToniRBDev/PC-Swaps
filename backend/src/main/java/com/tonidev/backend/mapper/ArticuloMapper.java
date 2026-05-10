package com.tonidev.backend.mapper;

import com.tonidev.backend.dto.ArticuloCardResponse;
import com.tonidev.backend.dto.ArticuloRequest;
import com.tonidev.backend.dto.ArticuloResponse;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Categoria;
import com.tonidev.backend.model.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Mapper encargado de convertir entre la entidad {@link Articulo} y sus DTOs.
 */
@Component
public class ArticuloMapper {

    private final CategoriaMapper categoriaMapper;
    private final UsuarioMapper usuarioMapper;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param categoriaMapper mapper para convertir la categoría del artículo
     * @param usuarioMapper   mapper para convertir el vendedor del artículo
     */
    public ArticuloMapper(CategoriaMapper categoriaMapper, UsuarioMapper usuarioMapper) {
        this.categoriaMapper = categoriaMapper;
        this.usuarioMapper = usuarioMapper;
    }

    /**
     * Convierte un {@link ArticuloRequest} a la entidad {@link Articulo}.
     * El usuario y la categoría deben ser buscados en base de datos antes de llamar a este método.
     *
     * @param request   el DTO con los datos del artículo
     * @param usuario   el propietario del artículo
     * @param categoria la categoría del artículo
     * @return la entidad {@link Articulo} lista para persistir
     */
    public Articulo toEntity(ArticuloRequest request, Usuario usuario, Categoria categoria) {
        return Articulo.builder()
                .usuario(usuario)
                .categoria(categoria)
                .marca(request.marca())
                .modelo(request.modelo())
                .estado(request.estado())
                .precio(request.precio())
                .descripcion(request.descripcion())
                .imagen(request.imagen())
                .fechaPublicacion(LocalDateTime.now())
                .activo(true)
                .numeroVisitas(0)
                .build();
    }

    /**
     * Convierte un {@link Articulo} a un {@link ArticuloResponse} con el detalle completo.
     *
     * @param articulo la entidad a convertir
     * @return el DTO con el detalle completo del artículo
     */
    public ArticuloResponse toResponse(Articulo articulo) {
        return new ArticuloResponse(
                articulo.getIdArticulo(),
                usuarioMapper.toSimpleInfoResponse(articulo.getUsuario()),
                categoriaMapper.toResponse(articulo.getCategoria()),
                articulo.getMarca(),
                articulo.getModelo(),
                articulo.getEstado(),
                articulo.getPrecio(),
                articulo.getDescripcion(),
                articulo.getImagen(),
                articulo.getFechaPublicacion(),
                articulo.getNumeroVisitas()
        );
    }

    /**
     * Convierte un {@link Articulo} a un {@link ArticuloCardResponse} para mostrar en el listado.
     *
     * @param articulo la entidad a convertir
     * @return el DTO con los datos mínimos para la card
     */
    public ArticuloCardResponse toCardResponse(Articulo articulo) {
        return new ArticuloCardResponse(
                articulo.getIdArticulo(),
                articulo.getImagen(),
                articulo.getMarca(),
                articulo.getModelo(),
                articulo.getPrecio(),
                articulo.getEstado()
        );
    }
}
