package com.tonidev.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa el seguimiento de un artículo por parte de un usuario.
 * Se crea cuando un usuario guarda un artículo y se elimina cuando lo quita.
 */
@Entity
@Table(name = "seguimiento")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seguimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_seguimiento")
    private Long idSeguimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_articulo", nullable = false)
    private Articulo articulo;

    /** Fecha establecida automáticamente en el momento de guardar el seguimiento. */
    @Column(name = "fecha_guardado", nullable = false, updatable = false)
    private LocalDateTime fechaGuardado;
}
