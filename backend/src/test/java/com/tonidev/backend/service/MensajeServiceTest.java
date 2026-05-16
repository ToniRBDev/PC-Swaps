package com.tonidev.backend.service;

import com.tonidev.backend.dto.MensajeRequest;
import com.tonidev.backend.dto.MensajeResponse;
import com.tonidev.backend.exception.AccesoNoAutorizadoException;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.mapper.MensajeMapper;
import com.tonidev.backend.model.Conversacion;
import com.tonidev.backend.model.Mensaje;
import com.tonidev.backend.model.Usuario;
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
 * Tests unitarios del servicio {@link MensajeService}.
 * Verifica la lógica de negocio de gestión de mensajes con dependencias simuladas.
 */
@ExtendWith(MockitoExtension.class)
class MensajeServiceTest {

    @Mock
    private MensajeRepository mensajeRepository;

    @Mock
    private ConversacionRepository conversacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private MensajeMapper mensajeMapper;

    @InjectMocks
    private MensajeService mensajeService;

    private Usuario comprador;
    private Usuario vendedor;
    private Conversacion conversacionEjemplo;

    /**
     * Inicializa los objetos de ejemplo reutilizados en los tests.
     */
    @BeforeEach
    void setUp() {
        comprador = Usuario.builder().idUsuario(1L).nombreUsuario("comprador").build();
        vendedor = Usuario.builder().idUsuario(2L).nombreUsuario("vendedor").build();

        conversacionEjemplo = Conversacion.builder()
                .idConversacion(1L)
                .comprador(comprador)
                .vendedor(vendedor)
                .build();
    }

    // ─── enviar ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("enviar: envía el mensaje correctamente cuando el emisor es el comprador")
    void enviar_emisorEsComprador_enviaCorrectamente() {
        MensajeRequest request = new MensajeRequest(1L, "Hola, ¿sigue disponible?");
        Mensaje mensajeGuardado = mock(Mensaje.class);
        MensajeResponse responseEjemplo = mock(MensajeResponse.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));
        when(mensajeMapper.toEntity(request, conversacionEjemplo, comprador)).thenReturn(mensajeGuardado);
        when(mensajeRepository.save(mensajeGuardado)).thenReturn(mensajeGuardado);
        when(mensajeMapper.toResponse(mensajeGuardado)).thenReturn(responseEjemplo);

        MensajeResponse resultado = mensajeService.enviar(1L, request);

        assertThat(resultado).isEqualTo(responseEjemplo);
        verify(mensajeRepository).save(mensajeGuardado);
    }

    @Test
    @DisplayName("enviar: envía el mensaje correctamente cuando el emisor es el vendedor")
    void enviar_emisorEsVendedor_enviaCorrectamente() {
        MensajeRequest request = new MensajeRequest(1L, "Sí, está disponible");
        Mensaje mensajeGuardado = mock(Mensaje.class);
        MensajeResponse responseEjemplo = mock(MensajeResponse.class);

        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(vendedor));
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));
        when(mensajeMapper.toEntity(request, conversacionEjemplo, vendedor)).thenReturn(mensajeGuardado);
        when(mensajeRepository.save(mensajeGuardado)).thenReturn(mensajeGuardado);
        when(mensajeMapper.toResponse(mensajeGuardado)).thenReturn(responseEjemplo);

        MensajeResponse resultado = mensajeService.enviar(2L, request);

        assertThat(resultado).isEqualTo(responseEjemplo);
    }

    @Test
    @DisplayName("enviar: lanza AccesoNoAutorizadoException si el emisor no es participante")
    void enviar_emisorNoEsParticipante_lanzaAccesoNoAutorizadoException() {
        MensajeRequest request = new MensajeRequest(1L, "Mensaje no autorizado");
        Usuario tercero = Usuario.builder().idUsuario(3L).build();

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(tercero));
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));

        assertThatThrownBy(() -> mensajeService.enviar(3L, request))
                .isInstanceOf(AccesoNoAutorizadoException.class)
                .hasMessage("No tienes permiso para enviar mensajes en esta conversación");

        verify(mensajeRepository, never()).save(any());
    }

    @Test
    @DisplayName("enviar: lanza RecursoNoEncontradoException si la conversación no existe")
    void enviar_conversacionNoExiste_lanzaRecursoNoEncontradoException() {
        MensajeRequest request = new MensajeRequest(99L, "Hola");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(conversacionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mensajeService.enviar(1L, request))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");
    }

    // ─── marcarComoLeidos ──────────────────────────────────────────────────────

    @Test
    @DisplayName("marcarComoLeidos: marca como leídos los mensajes del otro participante")
    void marcarComoLeidos_hayMensajesNoLeidos_losMarcat() {
        Mensaje mensajeNoLeido = mock(Mensaje.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));
        when(mensajeRepository.findByConversacionAndLeidoFalseAndEmisorNot(conversacionEjemplo, comprador))
                .thenReturn(List.of(mensajeNoLeido));

        mensajeService.marcarComoLeidos(1L, 1L);

        verify(mensajeNoLeido).setLeido(true);
        verify(mensajeRepository).saveAll(List.of(mensajeNoLeido));
    }

    @Test
    @DisplayName("marcarComoLeidos: no guarda nada si no hay mensajes no leídos")
    void marcarComoLeidos_sinMensajesNoLeidos_noGuardaNada() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(comprador));
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));
        when(mensajeRepository.findByConversacionAndLeidoFalseAndEmisorNot(conversacionEjemplo, comprador))
                .thenReturn(List.of());

        mensajeService.marcarComoLeidos(1L, 1L);

        verify(mensajeRepository).saveAll(List.of());
    }

    @Test
    @DisplayName("marcarComoLeidos: lanza AccesoNoAutorizadoException si el usuario no es participante")
    void marcarComoLeidos_usuarioNoEsParticipante_lanzaAccesoNoAutorizadoException() {
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(Usuario.builder().idUsuario(3L).build()));
        when(conversacionRepository.findById(1L)).thenReturn(Optional.of(conversacionEjemplo));

        assertThatThrownBy(() -> mensajeService.marcarComoLeidos(1L, 3L))
                .isInstanceOf(AccesoNoAutorizadoException.class)
                .hasMessage("No tienes permiso para acceder a esta conversación");

        verify(mensajeRepository, never()).saveAll(any());
    }
}
