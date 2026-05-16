package com.tonidev.backend.service;

import com.tonidev.backend.dto.CambiarPasswordRequest;
import com.tonidev.backend.dto.UsuarioActualizarRequest;
import com.tonidev.backend.dto.UsuarioContactoResponse;
import com.tonidev.backend.dto.UsuarioPerfilResponse;
import com.tonidev.backend.dto.UsuarioRegistroRequest;
import com.tonidev.backend.exception.RecursoNoEncontradoException;
import com.tonidev.backend.exception.ReglaNegocioException;
import com.tonidev.backend.mapper.UsuarioMapper;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios del servicio {@link UsuarioService}.
 * Verifica la lógica de negocio de gestión de usuarios con dependencias simuladas.
 */
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioMapper usuarioMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ImagenService imagenService;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioEjemplo;
    private UsuarioPerfilResponse perfilEjemplo;

    /**
     * Inicializa los objetos de ejemplo reutilizados en los tests.
     */
    @BeforeEach
    void setUp() {
        usuarioEjemplo = Usuario.builder()
                .idUsuario(1L)
                .nombre("Toni")
                .apellidos("Dev")
                .dni("12345678A")
                .correoElectronico("toni@ejemplo.com")
                .fechaNacimiento(LocalDate.of(2000, 1, 1))
                .direccion("Calle Mayor 1")
                .numTelefono("600000000")
                .nombreUsuario("tonidev")
                .passwordHash("hash")
                .build();

        perfilEjemplo = new UsuarioPerfilResponse(
                1L, "Toni", "Dev", "12345678A", "toni@ejemplo.com",
                LocalDate.of(2000, 1, 1), "Calle Mayor 1", "600000000", null, "tonidev"
        );
    }

    // ─── registrar ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("registrar: registra un usuario correctamente cuando los datos son únicos")
    void registrar_datosUnicos_registraCorrectamente() {
        UsuarioRegistroRequest request = new UsuarioRegistroRequest(
                "Toni", "Dev", "12345678A", "toni@ejemplo.com",
                LocalDate.of(2000, 1, 1), "Calle Mayor 1", "600000000", "tonidev", "password123"
        );

        when(usuarioRepository.existsByCorreoElectronico(request.correoElectronico())).thenReturn(false);
        when(usuarioRepository.existsByDni(request.dni())).thenReturn(false);
        when(usuarioRepository.existsByNombreUsuario(request.nombreUsuario())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("hashCodificado");
        when(usuarioMapper.toEntity(request, "hashCodificado")).thenReturn(usuarioEjemplo);
        when(usuarioRepository.save(usuarioEjemplo)).thenReturn(usuarioEjemplo);
        when(usuarioMapper.toPerfilResponse(usuarioEjemplo)).thenReturn(perfilEjemplo);

        UsuarioPerfilResponse resultado = usuarioService.registrar(request);

        assertThat(resultado).isEqualTo(perfilEjemplo);
        verify(usuarioRepository).save(usuarioEjemplo);
    }

    @Test
    @DisplayName("registrar: lanza ReglaNegocioException si el correo ya está en uso")
    void registrar_correoEnUso_lanzaReglaNegocioException() {
        UsuarioRegistroRequest request = new UsuarioRegistroRequest(
                "Toni", "Dev", "12345678A", "toni@ejemplo.com",
                LocalDate.of(2000, 1, 1), "Calle Mayor 1", "600000000", "tonidev", "password123"
        );

        when(usuarioRepository.existsByCorreoElectronico(request.correoElectronico())).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.registrar(request))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("El correo electrónico ya está en uso");

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("registrar: lanza ReglaNegocioException si el DNI ya está en uso")
    void registrar_dniEnUso_lanzaReglaNegocioException() {
        UsuarioRegistroRequest request = new UsuarioRegistroRequest(
                "Toni", "Dev", "12345678A", "toni@ejemplo.com",
                LocalDate.of(2000, 1, 1), "Calle Mayor 1", "600000000", "tonidev", "password123"
        );

        when(usuarioRepository.existsByCorreoElectronico(request.correoElectronico())).thenReturn(false);
        when(usuarioRepository.existsByDni(request.dni())).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.registrar(request))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("El DNI ya está en uso");

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("registrar: lanza ReglaNegocioException si el nombre de usuario ya está en uso")
    void registrar_nombreUsuarioEnUso_lanzaReglaNegocioException() {
        UsuarioRegistroRequest request = new UsuarioRegistroRequest(
                "Toni", "Dev", "12345678A", "toni@ejemplo.com",
                LocalDate.of(2000, 1, 1), "Calle Mayor 1", "600000000", "tonidev", "password123"
        );

        when(usuarioRepository.existsByCorreoElectronico(request.correoElectronico())).thenReturn(false);
        when(usuarioRepository.existsByDni(request.dni())).thenReturn(false);
        when(usuarioRepository.existsByNombreUsuario(request.nombreUsuario())).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.registrar(request))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("El nombre de usuario ya está en uso");

        verify(usuarioRepository, never()).save(any());
    }

    // ─── obtenerPerfil ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("obtenerPerfil: devuelve el perfil cuando el usuario existe")
    void obtenerPerfil_usuarioExiste_devuelvePerfil() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(usuarioMapper.toPerfilResponse(usuarioEjemplo)).thenReturn(perfilEjemplo);

        UsuarioPerfilResponse resultado = usuarioService.obtenerPerfil(1L);

        assertThat(resultado).isEqualTo(perfilEjemplo);
    }

    @Test
    @DisplayName("obtenerPerfil: lanza RecursoNoEncontradoException si el usuario no existe")
    void obtenerPerfil_usuarioNoExiste_lanzaRecursoNoEncontradoException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.obtenerPerfil(99L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");
    }

    // ─── obtenerDatosContacto ──────────────────────────────────────────────────

    @Test
    @DisplayName("obtenerDatosContacto: devuelve los datos de contacto cuando el usuario existe")
    void obtenerDatosContacto_usuarioExiste_devuelveDatosContacto() {
        UsuarioContactoResponse contactoEjemplo = new UsuarioContactoResponse(
                1L, "tonidev", "toni@ejemplo.com", "Calle Mayor 1", "600000000", null
        );

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(usuarioMapper.toContactoResponse(usuarioEjemplo)).thenReturn(contactoEjemplo);

        UsuarioContactoResponse resultado = usuarioService.obtenerDatosContacto(1L);

        assertThat(resultado.correoElectronico()).isEqualTo("toni@ejemplo.com");
        assertThat(resultado.nombreUsuario()).isEqualTo("tonidev");
    }

    // ─── actualizar ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("actualizar: actualiza los datos correctamente cuando el nombre de usuario no está en uso")
    void actualizar_nombreUsuarioLibre_actualizaCorrectamente() {
        UsuarioActualizarRequest request = new UsuarioActualizarRequest(
                "nuevoNombre", "Nueva Calle 2", "611111111"
        );

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(usuarioRepository.existsByNombreUsuario(request.nombreUsuario())).thenReturn(false);
        when(usuarioRepository.save(usuarioEjemplo)).thenReturn(usuarioEjemplo);
        when(usuarioMapper.toPerfilResponse(usuarioEjemplo)).thenReturn(perfilEjemplo);

        UsuarioPerfilResponse resultado = usuarioService.actualizar(1L, request);

        assertThat(resultado).isNotNull();
        verify(usuarioRepository).save(usuarioEjemplo);
    }

    @Test
    @DisplayName("actualizar: lanza ReglaNegocioException si el nuevo nombre de usuario ya está en uso")
    void actualizar_nombreUsuarioEnUso_lanzaReglaNegocioException() {
        UsuarioActualizarRequest request = new UsuarioActualizarRequest(
                "otroNombre", "Calle 2", "611111111"
        );

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(usuarioRepository.existsByNombreUsuario(request.nombreUsuario())).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.actualizar(1L, request))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("El nombre de usuario ya está en uso");
    }

    @Test
    @DisplayName("actualizar: permite mantener el mismo nombre de usuario sin lanzar excepción")
    void actualizar_mismoNombreUsuario_noLanzaExcepcion() {
        UsuarioActualizarRequest request = new UsuarioActualizarRequest(
                "tonidev", "Nueva Calle 3", "622222222"
        );

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(usuarioRepository.save(usuarioEjemplo)).thenReturn(usuarioEjemplo);
        when(usuarioMapper.toPerfilResponse(usuarioEjemplo)).thenReturn(perfilEjemplo);

        UsuarioPerfilResponse resultado = usuarioService.actualizar(1L, request);

        assertThat(resultado).isNotNull();
        verify(usuarioRepository, never()).existsByNombreUsuario(anyString());
    }

    // ─── cambiarPassword ───────────────────────────────────────────────────────

    @Test
    @DisplayName("cambiarPassword: cambia la contraseña cuando la actual es correcta")
    void cambiarPassword_passwordActualCorrecta_cambiaPassword() {
        CambiarPasswordRequest request = new CambiarPasswordRequest("passwordActual", "passwordNueva");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(passwordEncoder.matches(request.passwordActual(), usuarioEjemplo.getPasswordHash())).thenReturn(true);
        when(passwordEncoder.encode(request.passwordNueva())).thenReturn("nuevoHash");

        usuarioService.cambiarPassword(1L, request);

        verify(usuarioRepository).save(usuarioEjemplo);
    }

    @Test
    @DisplayName("cambiarPassword: lanza ReglaNegocioException si la contraseña actual no es correcta")
    void cambiarPassword_passwordActualIncorrecta_lanzaReglaNegocioException() {
        CambiarPasswordRequest request = new CambiarPasswordRequest("passwordErronea", "passwordNueva");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(passwordEncoder.matches(request.passwordActual(), usuarioEjemplo.getPasswordHash())).thenReturn(false);

        assertThatThrownBy(() -> usuarioService.cambiarPassword(1L, request))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessage("La contraseña actual no es correcta");

        verify(usuarioRepository, never()).save(any());
    }

    // ─── actualizarImagen ──────────────────────────────────────────────────────

    @Test
    @DisplayName("actualizarImagen: guarda la nueva imagen y elimina la anterior si existía")
    void actualizarImagen_conImagenPrevia_eliminaYGuardaNuevaImagen() throws IOException {
        usuarioEjemplo.setImagenUsuario("uploads/anterior.jpg");
        MultipartFile archivo = mock(MultipartFile.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(imagenService.guardar(archivo)).thenReturn("uploads/nueva.jpg");
        when(usuarioRepository.save(usuarioEjemplo)).thenReturn(usuarioEjemplo);
        when(usuarioMapper.toPerfilResponse(usuarioEjemplo)).thenReturn(perfilEjemplo);

        usuarioService.actualizarImagen(1L, archivo);

        verify(imagenService).eliminar("uploads/anterior.jpg");
        verify(imagenService).guardar(archivo);
    }

    @Test
    @DisplayName("actualizarImagen: no intenta eliminar imagen si el usuario no tenía una previamente")
    void actualizarImagen_sinImagenPrevia_soloGuardaNuevaImagen() throws IOException {
        MultipartFile archivo = mock(MultipartFile.class);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));
        when(imagenService.guardar(archivo)).thenReturn("uploads/nueva.jpg");
        when(usuarioRepository.save(usuarioEjemplo)).thenReturn(usuarioEjemplo);
        when(usuarioMapper.toPerfilResponse(usuarioEjemplo)).thenReturn(perfilEjemplo);

        usuarioService.actualizarImagen(1L, archivo);

        verify(imagenService, never()).eliminar(anyString());
        verify(imagenService).guardar(archivo);
    }

    // ─── eliminar ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("eliminar: elimina el usuario cuando existe")
    void eliminar_usuarioExiste_eliminaCorrectamente() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEjemplo));

        usuarioService.eliminar(1L);

        verify(usuarioRepository).delete(usuarioEjemplo);
    }

    @Test
    @DisplayName("eliminar: lanza RecursoNoEncontradoException si el usuario no existe")
    void eliminar_usuarioNoExiste_lanzaRecursoNoEncontradoException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.eliminar(99L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("99");

        verify(usuarioRepository, never()).delete(any());
    }
}
