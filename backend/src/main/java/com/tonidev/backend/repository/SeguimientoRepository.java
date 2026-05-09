package com.tonidev.backend.repository;

import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Seguimiento;
import com.tonidev.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la gestión de seguimientos en la base de datos.
 */
@Repository
public interface SeguimientoRepository extends JpaRepository<Seguimiento, Long> {

    List<Seguimiento> findByUsuario(Usuario usuario);

    boolean existsByUsuarioAndArticulo(Usuario usuario, Articulo articulo);

    void deleteByUsuarioAndArticulo(Usuario usuario, Articulo articulo);
}
