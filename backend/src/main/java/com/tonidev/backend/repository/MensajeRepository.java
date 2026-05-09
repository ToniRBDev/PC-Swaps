package com.tonidev.backend.repository;

import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la gestión de mensajes en la base de datos.
 */
@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    List<Mensaje> findByConversacionOrderByFechaEnvioAsc(Conversacion conversacion);
}
