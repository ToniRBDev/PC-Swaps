package com.tonidev.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa una conversación entre dos usuarios sobre un artículo concreto.
 * El comprador inicia la conversación y el vendedor es el propietario del artículo.
 */
@Entity
@Table(name = "conversacion")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conversacion")
    private Long idConversacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_articulo", nullable = false)
    private Articulo articulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_comprador", nullable = false)
    private Usuario comprador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_vendedor", nullable = false)
    private Usuario vendedor;

    /** Fecha establecida automáticamente en el momento de iniciar la conversación. */
    @Column(name = "fecha_inicio", nullable = false, updatable = false)
    private LocalDateTime fechaInicio;
}
