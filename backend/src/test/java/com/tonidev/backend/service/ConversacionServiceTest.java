package com.tonidev.backend.service;

import com.tonidev.backend.dto.ConversacionRequest;
import com.tonidev.backend.dto.ConversacionResponse;
import com.tonidev.backend.dto.MensajeResponse;
import com.tonidev.backend.exception.AccesoNoAutorizadoException;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.exception.ReglaNegocioException;
import com.tonidev.backend.mapper.ConversacionMapper;
import com.tonidev.backend.mapper.MensajeMapper;
import com.tonidev.backend.model.Articulo;
import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.ArticuloRepository;
import com.tonidev.backend.repository.ConversacionRepository;
import com.tonidev.backend.repository.MensajeRepository;
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
 * Tests unitarios del servicio {@link ConversacionService}.
 * Verifica la lógica de negocio de gestión de conversaciones con dependencias simuladas.
 */
@ExtendWith(MockitoExtension.class)
class ConversacionServiceTest {

    @Mock
    private ConversacionRepository conversacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ArticuloRepository articuloRepository;

    @Mock
    private MensajeRepository mensajeRepository;

    @Mock
    private ConversacionMapper conversacionMapper;

    @Mock
    private MensajeMapper mensajeMapper;

    @InjectMocks
    private ConversacionService conversacionService;

    private Usuario comprador;
    private Usuario vendedor;
    private Articulo articulo;
    private Conversacion conversacionEjemplo;
    private ConversacionResponse responseEjemplo;

    /**
     * Inicializa los objetos de ejemplo reutilizados en los tests.
     */
    @BeforeEach
    void setUp() {
        comprador = Usuario.builder().idUsuario(1L).nombreUsuario("comprador").build();
        vendedor = Usuario.builder().idUsuario(2L).nombreUsuario("vendedor").build();

        articulo = Articulo.builder()
                .idArticulo(1L)
                .usuario(vendedor)
                .marca("AMD")
                .modelo("Ryzen 7")
                .build();

        conversacionEjemplo = Conversacion.builder()
                .idConversacion(1L)
                .articulo(articulo)
                .comprador(comprador)
                .vendedor(vendedor)
                .build();

        responseEjemplo = mock(ConversacionResponse.class);
    }

    // ─── iniciar ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("iniciar: crea una conversación correctamente cuando los datos son válidos")
    void iniciar_datosValidos_creaConversacion() {
        ConversacionRequest request = new ConversacionRequest(1L);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));
        when(conversacionRepository.existsByArticuloAndComprador(articulo, comprador)).thenReturn(false);
        when(conversacionMapper.toEntity(articulo, comprador, vendedor)).thenReturn(conversacionEjemplo);
        when(conversacionRepository.save(conversacionEjemplo)).thenReturn(conversacionEjemplo);
        when(conversacionMapper.toResponse(conversacionEjemplo, List.of())).thenReturn(responseEjemplo);

        ConversacionResponse resultado = conversacionService.iniciar(1L, request);

        assertThat(resultado).isEqualTo(responseEjemplo);
        verify(conversacionRepository).save(conversacionEjemplo);
    }

    @Test
    @DisplayName("iniciar: lanza ReglaNegocioException si el comprador es el mismo vendedor del artículo")
    void iniciar_compradorEsVendedor_lanzaReglaNegocioException() {
        ConversacionRequest request = new ConversacionRequest(1L);

        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(vendedor));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));

        assertThatThrownBy(() -> conversacionService.iniciar(2L, request))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("No puedes iniciar una conversación sobre tu propio artículo");

        verify(conversacionRepository, never()).save(any());
    }

    @Test
    @DisplayName("iniciar: lanza ReglaNegocioException si ya existe una conversación sobre ese artículo")
    void iniciar_conversacionDuplicada_lanzaReglaNegocioException() {
        ConversacionRequest request = new ConversacionRequest(1L);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));
        when(conversacionRepository.existsByArticuloAndComprador(articulo, comprador)).thenReturn(true);

        assertThatThrownBy(() -> conversacionService.iniciar(1L, request))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("Ya tienes una conversación abierta sobre este artículo");

        verify(conversacionRepository, never()).save(any());
    }

    @Test
    @DisplayName("iniciar: lanza RecursoNoEncontradoException si el artículo no existe")
    void iniciar_articuloNoExiste_lanzaRecursoNoEncontradoException() {
        ConversacionRequest request = new ConversacionRequest(99L);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(articuloRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> conversacionService.iniciar(1L, request))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");
    }

    // ─── obtener ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("obtener: devuelve la conversación con mensajes cuando el usuario es el comprador")
    void obtener_usuarioEsComprador_devuelveConversacion() {
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));
        when(mensajeRepository.findByConversacionOrderByFechaEnvioAsc(conversacionEjemplo))
                .thenReturn(List.of());
        when(conversacionMapper.toResponse(conversacionEjemplo, List.of())).thenReturn(responseEjemplo);

        ConversacionResponse resultado = conversacionService.obtener(1L, 1L);

        assertThat(resultado).isEqualTo(responseEjemplo);
    }

    @Test
    @DisplayName("obtener: devuelve la conversación con mensajes cuando el usuario es el vendedor")
    void obtener_usuarioEsVendedor_devuelveConversacion() {
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));
        when(mensajeRepository.findByConversacionOrderByFechaEnvioAsc(conversacionEjemplo))
                .thenReturn(List.of());
        when(conversacionMapper.toResponse(conversacionEjemplo, List.of())).thenReturn(responseEjemplo);

        ConversacionResponse resultado = conversacionService.obtener(1L, 2L);

        assertThat(resultado).isEqualTo(responseEjemplo);
    }

    @Test
    @DisplayName("obtener: lanza AccesoNoAutorizadoException si el usuario no es participante")
    void obtener_usuarioNoEsParticipante_lanzaAccesoNoAutorizadoException() {
        Usuario tercero = Usuario.builder().idUsuario(3L).build();

        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));

        assertThatThrownBy(() -> conversacionService.obtener(1L, 3L))
                .isInstanceOf(AccesoNoAutorizadoException.class)
                .hasMessage("No tienes permiso para acceder a esta conversación");
    }

    // ─── listar ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("listar: devuelve todas las conversaciones del usuario como comprador y vendedor")
    void listar_hayConversaciones_devuelveLista() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(conversacionRepository.findByCompradorOrVendedor(comprador, comprador))
                .thenReturn(List.of(conversacionEjemplo));
        when(mensajeRepository.findByConversacionOrderByFechaEnvioAsc(conversacionEjemplo))
                .thenReturn(List.of());
        when(conversacionMapper.toResponse(conversacionEjemplo, List.of())).thenReturn(responseEjemplo);

        List<ConversacionResponse> resultado = conversacionService.listar(1L);

        assertThat(resultado).hasSize(1);
    }

    @Test
    @DisplayName("listar: devuelve lista vacía si el usuario no tiene conversaciones")
    void listar_sinConversaciones_devuelveListaVacia() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(conversacionRepository.findByCompradorOrVendedor(comprador, comprador))
                .thenReturn(List.of());

        List<ConversacionResponse> resultado = conversacionService.listar(1L);

        assertThat(resultado).isEmpty();
    }

    // ─── eliminar ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("eliminar: elimina la conversación cuando el usuario es participante")
    void eliminar_usuarioEsParticipante_eliminaCorrectamente() {
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));

        conversacionService.eliminar(1L, 1L);

        verify(conversacionRepository).delete(conversacionEjemplo);
    }

    @Test
    @DisplayName("eliminar: lanza AccesoNoAutorizadoException si el usuario no es participante")
    void eliminar_usuarioNoEsParticipante_lanzaAccesoNoAutorizadoException() {
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));

        assertThatThrownBy(() -> conversacionService.eliminar(1L, 3L))
                .isInstanceOf(AccesoNoAutorizadoException.class);

        verify(conversacionRepository, never()).delete(any());
    }

    @Test
    @DisplayName("eliminar: lanza RecursoNoEncontradoException si la conversación no existe")
    void eliminar_conversacionNoExiste_lanzaRecursoNoEncontradoException() {
        when(conversacionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> conversacionService.eliminar(99L, 1L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");
    }
}
