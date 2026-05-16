package com.tonidev.backend.controller;

import com.tonidev.backend.dto.ArticuloCardResponse;
import com.tonidev.backend.dto.ArticuloRequest;
import com.tonidev.backend.dto.ArticuloResponse;
import com.tonidev.backend.security.UsuarioDetails;
import com.tonidev.backend.service.ArticuloService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Controlador REST para la gestión de artículos.
 * Expone los endpoints bajo la ruta {@code /api/articulos}.
 */
@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    private final ArticuloService articuloService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param articuloService servicio encargado de la lógica de negocio de artículos
     */
    public ArticuloController(ArticuloService articuloService) {
        this.articuloService = articuloService;
    }

    /**
     * Publica un nuevo artículo en la plataforma.
     * Recibe los datos del artículo y su imagen como partes de un formulario multipart.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @param request        el DTO con los datos del artículo
     * @param imagen         el fichero de imagen del artículo
     * @return el detalle del artículo publicado con estado 201
     * @throws IOException si ocurre un error al guardar la imagen en disco
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticuloResponse> publicar(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @RequestPart("articulo") ArticuloRequest request,
            @RequestPart("imagen") MultipartFile imagen) throws IOException {
        ArticuloResponse respuesta = articuloService.publicar(usuarioDetails.getIdUsuario(), request, imagen);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    /**
     * Devuelve el detalle completo de un artículo e incrementa su contador de visitas.
     *
     * @param idArticulo el identificador del artículo
     * @return el DTO con el detalle del artículo
     */
    @GetMapping("/{idArticulo}")
    public ResponseEntity<ArticuloResponse> obtenerDetalle(@PathVariable Long idArticulo) {
        return ResponseEntity.ok(articuloService.obtenerDetalle(idArticulo));
    }

    /**
     * Devuelve todos los artículos activos de la plataforma excluyendo los del usuario autenticado.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return lista de artículos en formato card
     */
    @GetMapping
    public ResponseEntity<List<ArticuloCardResponse>> listarTodos(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(articuloService.listarTodos(usuarioDetails.getIdUsuario()));
    }

    /**
     * Devuelve todos los artículos del usuario autenticado, activos e inactivos.
     *
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return lista de artículos en formato card
     */
    @GetMapping("/propios")
    public ResponseEntity<List<ArticuloCardResponse>> listarPropios(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(articuloService.listarPropios(usuarioDetails.getIdUsuario()));
    }

    /**
     * Devuelve los artículos activos de una categoría excluyendo los del usuario autenticado.
     *
     * @param idCategoria    el identificador de la categoría
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return lista de artículos en formato card
     */
    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<ArticuloCardResponse>> listarPorCategoria(
            @PathVariable Long idCategoria,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(articuloService.listarPorCategoria(idCategoria, usuarioDetails.getIdUsuario()));
    }

    /**
     * Busca artículos activos por marca o modelo excluyendo los del usuario autenticado.
     *
     * @param texto          el texto a buscar
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return lista de artículos en formato card
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<ArticuloCardResponse>> buscar(
            @RequestParam String texto,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(articuloService.buscar(texto, usuarioDetails.getIdUsuario()));
    }

    /**
     * Edita los datos de un artículo. Solo el propietario puede editarlo.
     * La imagen es opcional: si no se envía, se conserva la existente.
     *
     * @param idArticulo     el identificador del artículo a editar
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @param request        el DTO con los nuevos datos
     * @param imagen         la nueva imagen del artículo (opcional)
     * @return el detalle actualizado del artículo
     * @throws IOException si ocurre un error al gestionar la imagen en disco
     */
    @PutMapping(value = "/{idArticulo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticuloResponse> editar(
            @PathVariable Long idArticulo,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @RequestPart("articulo") ArticuloRequest request,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        return ResponseEntity.ok(articuloService.editar(idArticulo, usuarioDetails.getIdUsuario(), request, imagen));
    }

    /**
     * Renueva un artículo, actualizando su fecha de renovación y marcándolo como activo.
     * Solo el propietario puede renovarlo.
     *
     * @param idArticulo     el identificador del artículo a renovar
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return respuesta vacía con estado 204
     */
    @PutMapping("/{idArticulo}/renovar")
    public ResponseEntity<Void> renovar(
            @PathVariable Long idArticulo,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        articuloService.renovar(idArticulo, usuarioDetails.getIdUsuario());
        return ResponseEntity.noContent().build();
    }

    /**
     * Elimina un artículo y su imagen del disco. Solo el propietario puede eliminarlo.
     *
     * @param idArticulo     el identificador del artículo a eliminar
     * @param usuarioDetails los datos del usuario extraídos del token JWT
     * @return respuesta vacía con estado 204
     * @throws IOException si ocurre un error al eliminar la imagen del disco
     */
    @DeleteMapping("/{idArticulo}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long idArticulo,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) throws IOException {
        articuloService.eliminar(idArticulo, usuarioDetails.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
