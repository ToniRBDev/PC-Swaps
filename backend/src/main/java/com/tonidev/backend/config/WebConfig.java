package com.tonidev.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuración web de la aplicación.
 * Registra el handler de recursos estáticos para servir las imágenes subidas por los usuarios.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Ruta del sistema de ficheros donde se almacenan las imágenes subidas.
     * Se lee del fichero application-{perfil}.properties (propiedad app.uploads.dir).
     */
    @Value("${app.uploads.dir}")
    private String uploadsDir;

    /**
     * Registra un handler para que Spring sirva los ficheros de la carpeta uploads
     * como si fueran recursos estáticos accesibles desde el navegador.
     *
     * Ejemplo: una imagen guardada en uploads/foto.jpg será accesible en
     * http://localhost:8080/uploads/foto.jpg
     *
     * @param registry el registro de handlers de recursos de Spring MVC
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convertimos la ruta relativa (./uploads) a una ruta absoluta del sistema
        Path uploadPath = Paths.get(uploadsDir).toAbsolutePath().normalize();

        // Mapeamos todas las peticiones a /uploads/** hacia la carpeta física en disco
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
