package com.tonidev.backend.repository;

import com.tonidev.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la gestión de usuarios en la base de datos.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreoElectronico(String correoElectronico);

    boolean existsByCorreoElectronico(String correoElectronico);

    boolean existsByNombreUsuario(String nombreUsuario);

    boolean existsByDni(String dni);
}
