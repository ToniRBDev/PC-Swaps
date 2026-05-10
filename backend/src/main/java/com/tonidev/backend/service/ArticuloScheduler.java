package com.tonidev.backend.service;

import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.repository.ArticuloRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Tarea programada encargada de desactivar automáticamente los artículos
 * que llevan más de 7 días sin ser renovados.
 */
@Component
public class ArticuloScheduler {

    private final ArticuloRepository articuloRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param articuloRepository repositorio para acceder a los artículos en base de datos
     */
    public ArticuloScheduler(ArticuloRepository articuloRepository) {
        this.articuloRepository = articuloRepository;
    }

    /**
     * Desactiva los artículos que llevan más de 7 días sin renovarse.
     * Se ejecuta cada día a las 3:00 AM para no impactar el tráfico normal.
     * Un artículo se desactiva si:
     * - Tiene fecha de última renovación y han pasado más de 7 días desde ella.
     * - Nunca ha sido renovado y han pasado más de 7 días desde su publicación.
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void desactivarArticulosExpirados() {
        LocalDateTime limite = LocalDateTime.now().minusDays(7);
        List<Articulo> articulosExpirados = articuloRepository.findArticulosParaDesactivar(limite);

        articulosExpirados.forEach(articulo -> articulo.setActivo(false));
        articuloRepository.saveAll(articulosExpirados);
    }
}
