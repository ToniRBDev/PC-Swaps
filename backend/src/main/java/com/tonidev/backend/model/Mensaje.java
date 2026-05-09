package com.tonidev.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa un mensaje enviado dentro de una conversación.
 */
@Entity
@Table(name = "mensaje")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje")
    private Long idMensaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_conversacion", nullable = false)
    private Conversacion conversacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emisor", nullable = false)
    private Usuario emisor;

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    /** Fecha establecida automáticamente en el momento del envío. */
    @Column(name = "fecha_envio", nullable = false, updatable = false)
    private LocalDateTime fechaEnvio;

    /** Se actualiza a true cuando el destinatario lee el mensaje. */
    @Setter
    @Column(name = "leido", nullable = false)
    private Boolean leido;
}
