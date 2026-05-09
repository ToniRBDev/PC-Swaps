package com.tonidev.backend.repository;

import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la gestión de conversaciones en la base de datos.
 */
@Repository
public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    List<Conversacion> findByCompradorOrVendedor(Usuario comprador, Usuario vendedor);

    List<Conversacion> findByArticulo(Articulo articulo);

    boolean existsByArticuloAndComprador(Articulo articulo, Usuario comprador);
}
