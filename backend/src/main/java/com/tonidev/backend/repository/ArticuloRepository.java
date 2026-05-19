package com.tonidev.backend.repository;

import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Categoria;
import com.tonidev.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la gestión de artículos en la base de datos.
 */
@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {

    // Todos los artículos de un usuario (activos e inactivos) para la sección "Mis anuncios"
    List<Articulo> findByUsuario(Usuario usuario);

    // Artículos activos de otros usuarios para el listado general
    List<Articulo> findByActivoTrueAndUsuarioNot(Usuario usuario);

    // Artículos activos de una categoría excluyendo los del usuario autenticado
    List<Articulo> findByCategoriaAndActivoTrueAndUsuarioNot(Categoria categoria, Usuario usuario);

    // Búsqueda por marca o modelo entre artículos activos excluyendo los del usuario autenticado
    @Query("SELECT a FROM Articulo a WHERE a.activo = true AND a.usuario <> :usuario AND " +
           "(LOWER(a.marca) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(a.modelo) LIKE LOWER(CONCAT('%', :texto, '%')))")
    List<Articulo> buscarPorTexto(@Param("usuario") Usuario usuario, @Param("texto") String texto);

    // Artículos activos a los que han pasado más de 7 días desde su última renovación (o publicación si nunca se renovaron)
    @Query("SELECT a FROM Articulo a WHERE a.activo = true AND " +
           "((a.fechaUltimaRenovacion IS NOT NULL AND a.fechaUltimaRenovacion < :limite) OR " +
           "(a.fechaUltimaRenovacion IS NULL AND a.fechaPublicacion < :limite))")
    List<Articulo> findArticulosParaDesactivar(@Param("limite") LocalDateTime limite);
}

