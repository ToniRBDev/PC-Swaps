package com.tonidev.backend.config;

import com.tonidev.backend.model.Categoria;
import com.tonidev.backend.model.NombreCategoria;
import com.tonidev.backend.repository.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Componente que se ejecuta al arrancar la aplicación y carga los datos iniciales en la base de datos.
 * Inserta las categorías predefinidas únicamente si la tabla está vacía.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param categoriaRepository repositorio para la gestión de categorías en base de datos
     */
    public DataLoader(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Ejecuta la carga de datos iniciales al arrancar la aplicación.
     * Si la tabla de categorías está vacía, inserta todas las categorías definidas en {@link NombreCategoria}.
     *
     * @param args argumentos de línea de comandos (no utilizados)
     */
    @Override
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            Arrays.stream(NombreCategoria.values())
                    .map(nombreCategoria -> Categoria.builder()
                            .nombreCategoria(nombreCategoria.getValor())
                            .build())
                    .forEach(categoriaRepository::save);
        }
    }
}
