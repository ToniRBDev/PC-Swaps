package com.tonidev.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad que representa un artículo publicado en la plataforma PC-SWAPS.
 * Un artículo pertenece a un usuario y está asociado a una categoría.
 */
@Entity
@Table(name = "articulo")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_articulo")
    private Long idArticulo;

    /** El propietario del artículo no puede cambiar una vez publicado. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Setter
    @Column(name = "marca", nullable = false)
    private String marca;

    @Setter
    @Column(name = "modelo", nullable = false)
    private String modelo;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoArticulo estado;

    @Setter
    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Setter
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Setter
    @Column(name = "imagen")
    private String imagen;

    /** Fecha establecida automáticamente en el momento de la publicación. */
    @Column(name = "fecha_publicacion", nullable = false, updatable = false)
    private LocalDateTime fechaPublicacion;

    @Setter
    @Column(name = "fecha_ultima_renovacion")
    private LocalDateTime fechaUltimaRenovacion;

    @Setter
    @Column(name = "activo", nullable = false)
    private Boolean activo;
}
