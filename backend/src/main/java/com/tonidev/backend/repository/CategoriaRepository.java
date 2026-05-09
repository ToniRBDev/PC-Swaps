package com.tonidev.backend.repository;

import com.tonidev.backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la gestión de categorías en la base de datos.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
