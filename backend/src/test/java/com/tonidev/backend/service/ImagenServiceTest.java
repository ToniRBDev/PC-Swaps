package com.tonidev.backend.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Tests unitarios del servicio {@link ImagenService}.
 */
class ImagenServiceTest {

    @Test
    @DisplayName("guardar: rechaza imagenes de mas de 5 MB")
    void guardar_imagenMayorDe5Mb_lanzaIllegalArgumentException() {
        MultipartFile archivo = mock(MultipartFile.class);
        when(archivo.isEmpty()).thenReturn(false);
        when(archivo.getSize()).thenReturn(5L * 1024L * 1024L + 1L);

        ImagenService imagenService = new ImagenService();

        assertThatThrownBy(() -> imagenService.guardar(archivo))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("La imagen no puede superar los 5 MB");
    }
}
