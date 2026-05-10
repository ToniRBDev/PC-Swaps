package com.tonidev.backend.repository;

import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Mensaje;
import com.tonidev.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la gestión de mensajes en la base de datos.
 */
@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    List<Mensaje> findByConversacionOrderByFechaEnvioAsc(Conversacion conversacion);

    // Mensajes no leídos de la conversación que no haya enviado el usuario receptor
    List<Mensaje> findByConversacionAndLeidoFalseAndEmisorNot(Conversacion conversacion, Usuario emisor);
}
