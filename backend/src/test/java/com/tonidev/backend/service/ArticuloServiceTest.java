package com.tonidev.backend.service;

import com.tonidev.backend.dto.ArticuloCardResponse;
import com.tonidev.backend.dto.ArticuloRequest;
import com.tonidev.backend.dto.ArticuloResponse;
import com.tonidev.backend.exception.AccesoNoAutorizadoException;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.mapper.ArticuloMapper;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Categoria;
import com.tonidev.backend.model.EstadoArticulo;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.ArticuloRepository;
import com.tonidev.backend.repository.CategoriaRepository;
import com.tonidev.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios del servicio {@link ArticuloService}.
 * Verifica la lógica de negocio de gestión de artículos con dependencias simuladas.
 */
@ExtendWith(MockitoExtension.class)
class ArticuloServiceTest {

    @Mock
    private ArticuloRepository articuloRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ArticuloMapper articuloMapper;

    @Mock
    private ImagenService imagenService;

    @InjectMocks
    private ArticuloService articuloService;

    private Usuario propietario;
    private Usuario otroUsuario;
    private Categoria categoria;
    private Articulo articuloEjemplo;
    private ArticuloRequest requestEjemplo;
    private ArticuloResponse responseEjemplo;

    /**
     * Inicializa los objetos de ejemplo reutilizados en los tests.
     */
    @BeforeEach
    void setUp() {
        propietario = Usuario.builder().idUsuario(1L).nombreUsuario("tonidev").build();
        otroUsuario = Usuario.builder().idUsuario(2L).nombreUsuario("otro").build();
        categoria = Categoria.builder().idCategoria(1L).nombreCategoria("Procesador").build();

        articuloEjemplo = Articulo.builder()
                .idArticulo(1L)
                .usuario(propietario)
                .categoria(categoria)
                .marca("AMD")
                .modelo("Ryzen 7")
                .estado(EstadoArticulo.COMO_NUEVO)
                .precio(new BigDecimal("150.00"))
                .descripcion("Procesador en perfecto estado")
                .imagen("uploads/ryzen7.jpg")
                .fechaPublicacion(LocalDateTime.now())
                .activo(true)
                .numeroVisitas(0)
                .build();

        requestEjemplo = new ArticuloRequest(
                1L, "AMD", "Ryzen 7", EstadoArticulo.COMO_NUEVO,
                new BigDecimal("150.00"), "Procesador en perfecto estado"
        );

        responseEjemplo = mock(ArticuloResponse.class);
    }

    // ─── publicar ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("publicar: publica un artículo correctamente con imagen")
    void publicar_datosValidos_publicaCorrectamente() throws IOException {
        MultipartFile imagen = mock(MultipartFile.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(propietario));
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(imagenService.guardar(imagen)).thenReturn("uploads/ryzen7.jpg");
        when(articuloMapper.toEntity(requestEjemplo, propietario, categoria, "uploads/ryzen7.jpg"))
                .thenReturn(articuloEjemplo);
        when(articuloRepository.save(articuloEjemplo)).thenReturn(articuloEjemplo);
        when(articuloMapper.toResponse(articuloEjemplo)).thenReturn(responseEjemplo);

        ArticuloResponse resultado = articuloService.publicar(1L, requestEjemplo, imagen);

        assertThat(resultado).isEqualTo(responseEjemplo);
        verify(articuloRepository).save(articuloEjemplo);
    }

    @Test
    @DisplayName("publicar: lanza RecursoNoEncontradoException si la categoría no existe")
    void publicar_categoriaNoExiste_lanzaRecursoNoEncontradoException() throws IOException {
        MultipartFile imagen = mock(MultipartFile.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(propietario));
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        ArticuloRequest requestCategoriaInvalida = new ArticuloRequest(
                99L, "AMD", "Ryzen 7", EstadoArticulo.COMO_NUEVO,
                new BigDecimal("150.00"), "Descripción"
        );

        assertThatThrownBy(() -> articuloService.publicar(1L, requestCategoriaInvalida, imagen))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");
    }

    // ─── obtenerDetalle ────────────────────────────────────────────────────────

    @Test
    @DisplayName("obtenerDetalle: devuelve el detalle e incrementa el contador de visitas")
    void obtenerDetalle_articuloExiste_devuelveDetalleEIncrementaVisitas() {
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));
        when(articuloRepository.save(articuloEjemplo)).thenReturn(articuloEjemplo);
        when(articuloMapper.toResponse(articuloEjemplo)).thenReturn(responseEjemplo);

        articuloService.obtenerDetalle(1L);

        assertThat(articuloEjemplo.getNumeroVisitas()).isEqualTo(1);
        verify(articuloRepository).save(articuloEjemplo);
    }

    @Test
    @DisplayName("obtenerDetalle: lanza RecursoNoEncontradoException si el artículo no existe")
    void obtenerDetalle_articuloNoExiste_lanzaRecursoNoEncontradoException() {
        when(articuloRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> articuloService.obtenerDetalle(99L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");
    }

    // ─── listarTodos ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("listarTodos: devuelve artículos activos excluyendo los del usuario autenticado")
    void listarTodos_hayArticulos_devuelveListaExcluyendoPropios() {
        ArticuloCardResponse cardEjemplo = mock(ArticuloCardResponse.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(propietario));
        when(articuloRepository.findByActivoTrueAndUsuarioNot(propietario))
                .thenReturn(List.of(articuloEjemplo));
        when(articuloMapper.toCardResponse(articuloEjemplo)).thenReturn(cardEjemplo);

        List<ArticuloCardResponse> resultado = articuloService.listarTodos(1L);

        assertThat(resultado).hasSize(1);
    }

    // ─── listarPropios ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("listarPropios: devuelve todos los artículos del usuario, activos e inactivos")
    void listarPropios_hayArticulos_devuelveListaCompleta() {
        ArticuloCardResponse cardEjemplo = mock(ArticuloCardResponse.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(propietario));
        when(articuloRepository.findByUsuario(propietario)).thenReturn(List.of(articuloEjemplo));
        when(articuloMapper.toCardResponse(articuloEjemplo)).thenReturn(cardEjemplo);

        List<ArticuloCardResponse> resultado = articuloService.listarPropios(1L);

        assertThat(resultado).hasSize(1);
    }

    // ─── editar ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("editar: actualiza los datos del artículo cuando el usuario es el propietario")
    void editar_propietario_actualizaCorrectamente() throws IOException {
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(articuloRepository.save(articuloEjemplo)).thenReturn(articuloEjemplo);
        when(articuloMapper.toResponse(articuloEjemplo)).thenReturn(responseEjemplo);

        ArticuloResponse resultado = articuloService.editar(1L, 1L, requestEjemplo, null);

        assertThat(resultado).isEqualTo(responseEjemplo);
        verify(articuloRepository).save(articuloEjemplo);
    }

    @Test
    @DisplayName("editar: lanza AccesoNoAutorizadoException cuando el usuario no es el propietario")
    void editar_noPropietario_lanzaAccesoNoAutorizadoException() {
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));

        assertThatThrownBy(() -> articuloService.editar(1L, 2L, requestEjemplo, null))
                .isInstanceOf(AccesoNoAutorizadoException.class);

        verify(articuloRepository, never()).save(any());
    }

    @Test
    @DisplayName("editar: reemplaza la imagen cuando se proporciona una nueva")
    void editar_conNuevaImagen_eliminaAnteriorYGuardaNueva() throws IOException {
        MultipartFile nuevaImagen = mock(MultipartFile.class);
        when(nuevaImagen.isEmpty()).thenReturn(false);

        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(imagenService.guardar(nuevaImagen)).thenReturn("uploads/nueva.jpg");
        when(articuloRepository.save(articuloEjemplo)).thenReturn(articuloEjemplo);
        when(articuloMapper.toResponse(articuloEjemplo)).thenReturn(responseEjemplo);

        articuloService.editar(1L, 1L, requestEjemplo, nuevaImagen);

        verify(imagenService).eliminar("uploads/ryzen7.jpg");
        verify(imagenService).guardar(nuevaImagen);
    }

    // ─── renovar ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("renovar: renueva el artículo y lo marca como activo cuando el usuario es el propietario")
    void renovar_propietario_renovaYActivaArticulo() {
        articuloEjemplo.setActivo(false);

        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));

        articuloService.renovar(1L, 1L);

        assertThat(articuloEjemplo.getActivo()).isTrue();
        assertThat(articuloEjemplo.getFechaUltimaRenovacion()).isNotNull();
        verify(articuloRepository).save(articuloEjemplo);
    }

    @Test
    @DisplayName("renovar: lanza AccesoNoAutorizadoException cuando el usuario no es el propietario")
    void renovar_noPropietario_lanzaAccesoNoAutorizadoException() {
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));

        assertThatThrownBy(() -> articuloService.renovar(1L, 2L))
                .isInstanceOf(AccesoNoAutorizadoException.class);

        verify(articuloRepository, never()).save(any());
    }

    // ─── eliminar ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("eliminar: elimina el artículo y su imagen cuando el usuario es el propietario")
    void eliminar_propietario_eliminaArticuloEImagen() throws IOException {
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));

        articuloService.eliminar(1L, 1L);

        verify(imagenService).eliminar("uploads/ryzen7.jpg");
        verify(articuloRepository).delete(articuloEjemplo);
    }

    @Test
    @DisplayName("eliminar: lanza AccesoNoAutorizadoException cuando el usuario no es el propietario")
    void eliminar_noPropietario_lanzaAccesoNoAutorizadoException() {
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));

        assertThatThrownBy(() -> articuloService.eliminar(1L, 2L))
                .isInstanceOf(AccesoNoAutorizadoException.class);

        verify(articuloRepository, never()).delete(any());
    }
}
