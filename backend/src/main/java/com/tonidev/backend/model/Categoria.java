package com.tonidev.backend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad que representa una categoría de artículos en la plataforma.
 * Ejemplos: Tarjetas gráficas, Procesadores, Memoria RAM.
 */
@Entity
@Table(name = "categoria")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    /**
     * Identificador único de la categoría, generado automáticamente por la base de datos.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long idCategoria;

    @Setter
    @Column(name = "nombre_categoria", nullable = false, unique = true)
    private String nombreCategoria;
}
