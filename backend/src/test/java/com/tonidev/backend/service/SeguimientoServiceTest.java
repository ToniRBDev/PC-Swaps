package com.tonidev.backend.service;

import com.tonidev.backend.dto.ArticuloCardResponse;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.exception.ReglaNegocioException;
import com.tonidev.backend.mapper.ArticuloMapper;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Seguimiento;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.ArticuloRepository;
import com.tonidev.backend.repository.SeguimientoRepository;
import com.tonidev.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios del servicio {@link SeguimientoService}.
 * Verifica la lógica de negocio de gestión de seguimientos con dependencias simuladas.
 */
@ExtendWith(MockitoExtension.class)
class SeguimientoServiceTest {

    @Mock
    private SeguimientoRepository seguimientoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ArticuloRepository articuloRepository;

    @Mock
    private ArticuloMapper articuloMapper;

    @InjectMocks
    private SeguimientoService seguimientoService;

    private Usuario usuario;
    private Articulo articulo;

    /**
     * Inicializa los objetos de ejemplo reutilizados en los tests.
     */
    @BeforeEach
    void setUp() {
        usuario = Usuario.builder().idUsuario(1L).nombreUsuario("tonidev").build();
        articulo = Articulo.builder().idArticulo(1L).marca("AMD").modelo("Ryzen 7").build();
    }

    // ─── agregar ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("agregar: añade el seguimiento correctamente cuando el artículo no está seguido")
    void agregar_articuloNoSeguido_agregaCorrectamente() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));
        when(seguimientoRepository.existsByUsuarioAndArticulo(usuario, articulo)).thenReturn(false);

        seguimientoService.agregar(1L, 1L);

        verify(seguimientoRepository).save(any(Seguimiento.class));
    }

    @Test
    @DisplayName("agregar: lanza ReglaNegocioException si el artículo ya está en seguimiento")
    void agregar_articuloYaSeguido_lanzaReglaNegocioException() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));
        when(seguimientoRepository.existsByUsuarioAndArticulo(usuario, articulo)).thenReturn(true);

        assertThatThrownBy(() -> seguimientoService.agregar(1L, 1L))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("Ya estás siguiendo este artículo");

        verify(seguimientoRepository, never()).save(any());
    }

    @Test
    @DisplayName("agregar: lanza RecursoNoEncontradoException si el artículo no existe")
    void agregar_articuloNoExiste_lanzaRecursoNoEncontradoException() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(articuloRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> seguimientoService.agregar(1L, 99L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");

        verify(seguimientoRepository, never()).save(any());
    }

    @Test
    @DisplayName("agregar: lanza RecursoNoEncontradoException si el usuario no existe")
    void agregar_usuarioNoExiste_lanzaRecursoNoEncontradoException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> seguimientoService.agregar(99L, 1L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");
    }

    // ─── eliminar ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("eliminar: elimina el seguimiento correctamente")
    void eliminar_seguimientoExiste_eliminaCorrectamente() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));

        seguimientoService.eliminar(1L, 1L);

        verify(seguimientoRepository).deleteByUsuarioAndArticulo(usuario, articulo);
    }

    // ─── listar ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("listar: devuelve los artículos en seguimiento del usuario")
    void listar_hayArticulosSeguidos_devuelveLista() {
        Seguimiento seguimiento = Seguimiento.builder()
                .usuario(usuario)
                .articulo(articulo)
                .build();
        ArticuloCardResponse cardEjemplo = mock(ArticuloCardResponse.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(seguimientoRepository.findByUsuario(usuario)).thenReturn(List.of(seguimiento));
        when(articuloMapper.toCardResponse(articulo)).thenReturn(cardEjemplo);

        List<ArticuloCardResponse> resultado = seguimientoService.listar(1L);

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0)).isEqualTo(cardEjemplo);
    }

    @Test
    @DisplayName("listar: devuelve lista vacía si el usuario no sigue ningún artículo")
    void listar_sinArticulosSeguidos_devuelveListaVacia() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(seguimientoRepository.findByUsuario(usuario)).thenReturn(List.of());

        List<ArticuloCardResponse> resultado = seguimientoService.listar(1L);

        assertThat(resultado).isEmpty();
    }
}
