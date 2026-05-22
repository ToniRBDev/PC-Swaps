package com.tonidev.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

/**
 * Servicio encargado de gestionar el almacenamiento de imágenes en el sistema de ficheros.
 */
@Service
public class ImagenService {

    /**
     * Tamano maximo permitido por imagen: 5 MB.
     */
    private static final long TAMANO_MAXIMO_BYTES = 5L * 1024L * 1024L;

    /**
     * Tipos de contenido permitidos para las imágenes subidas por los usuarios.
     */
    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/webp");

    /**
     * Ruta del sistema de ficheros donde se almacenan las imágenes.
     * Se lee del fichero application-{perfil}.properties (propiedad app.uploads.dir).
     */
    @Value("${app.uploads.dir}")
    private String uploadsDir;

    /**
     * Guarda una imagen en el sistema de ficheros y devuelve la ruta relativa
     * con la que el frontend puede acceder a ella.
     *
     * @param archivo el fichero de imagen enviado por el usuario
     * @return la ruta relativa de la imagen (por ejemplo: /uploads/uuid.jpg)
     * @throws IOException              si ocurre un error al escribir el fichero en disco
     * @throws IllegalArgumentException si el fichero está vacío o su tipo no está permitido
     */
    public String guardar(MultipartFile archivo) throws IOException {
        if (archivo.isEmpty()) {
            throw new IllegalArgumentException("El fichero de imagen está vacío");
        }

        if (archivo.getSize() > TAMANO_MAXIMO_BYTES) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB");
        }

        String tipoContenido = archivo.getContentType();
        if (tipoContenido == null || !TIPOS_PERMITIDOS.contains(tipoContenido)) {
            throw new IllegalArgumentException("Tipo de imagen no permitido. Se aceptan: JPEG, PNG y WebP");
        }

        // Obtenemos la extensión original del fichero (por ejemplo: .jpg)
        String nombreOriginal = archivo.getOriginalFilename();
        String extension = obtenerExtension(nombreOriginal);

        // Generamos un nombre único para evitar colisiones entre ficheros
        String nombreUnico = UUID.randomUUID() + extension;

        // Construimos la ruta absoluta de la carpeta uploads y la creamos si no existe
        Path rutaCarpeta = Paths.get(uploadsDir).toAbsolutePath().normalize();
        Files.createDirectories(rutaCarpeta);

        // Guardamos el fichero en disco
        Path rutaFichero = rutaCarpeta.resolve(nombreUnico);
        Files.copy(archivo.getInputStream(), rutaFichero);

        // Devolvemos la ruta relativa que se almacenará en base de datos
        return "/uploads/" + nombreUnico;
    }

    /**
     * Elimina una imagen del sistema de ficheros a partir de su ruta relativa.
     * Si el fichero no existe, no lanza ningún error.
     *
     * @param rutaImagen la ruta relativa de la imagen (por ejemplo: /uploads/uuid.jpg)
     * @throws IOException si ocurre un error al eliminar el fichero
     */
    public void eliminar(String rutaImagen) throws IOException {
        if (rutaImagen == null || rutaImagen.isBlank()) {
            return;
        }

        // Extraemos el nombre del fichero de la ruta relativa y construimos la ruta absoluta
        String nombreFichero = Paths.get(rutaImagen).getFileName().toString();
        Path rutaFichero = Paths.get(uploadsDir).toAbsolutePath().normalize().resolve(nombreFichero);

        Files.deleteIfExists(rutaFichero);
    }

    /**
     * Extrae la extensión de un nombre de fichero, incluyendo el punto (por ejemplo: .jpg).
     * Si el nombre no tiene extensión, devuelve una cadena vacía.
     *
     * @param nombreFichero el nombre original del fichero
     * @return la extensión del fichero o una cadena vacía si no tiene
     */
    private String obtenerExtension(String nombreFichero) {
        if (nombreFichero == null || !nombreFichero.contains(".")) {
            return "";
        }
        return nombreFichero.substring(nombreFichero.lastIndexOf("."));
    }
}
