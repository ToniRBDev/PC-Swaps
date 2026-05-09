package com.tonidev.backend.repository;

import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Categoria;
import com.tonidev.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la gestión de artículos en la base de datos.
 */
@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {

    // Útil para obtener todos los artículos publicados por un usuario
    List<Articulo> findByUsuario(Usuario usuario);

    // Útil para no mostrar al usuario sus propios artículos
    List<Articulo> findByUsuarioNot(Usuario usuario);

    List<Articulo> findByCategoria(Categoria categoria);

    List<Articulo> findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String marca, String modelo);
}

