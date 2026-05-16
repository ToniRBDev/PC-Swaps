package com.tonidev.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que intercepta cada petición HTTP para validar el token JWT.
 * Si el token es válido, establece la autenticación en el {@link SecurityContextHolder}.
 * Se ejecuta una sola vez por petición gracias a {@link OncePerRequestFilter}.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioDetailsService usuarioDetailsService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param jwtUtil               utilidad para operar con tokens JWT
     * @param usuarioDetailsService servicio para cargar los datos del usuario autenticado
     */
    public JwtAuthenticationFilter(JwtUtil jwtUtil, UsuarioDetailsService usuarioDetailsService) {
        this.jwtUtil = jwtUtil;
        this.usuarioDetailsService = usuarioDetailsService;
    }

    /**
     * Lógica principal del filtro. Extrae el token JWT de la cabecera {@code Authorization},
     * lo valida y, si es correcto, establece la autenticación en el contexto de seguridad.
     *
     * @param solicitud  la petición HTTP entrante
     * @param respuesta  la respuesta HTTP
     * @param cadena     la cadena de filtros a continuar
     * @throws ServletException si ocurre un error en el filtro
     * @throws IOException      si ocurre un error de entrada/salida
     */
    @Override
    protected void doFilterInternal(HttpServletRequest solicitud,
                                    HttpServletResponse respuesta,
                                    FilterChain cadena) throws ServletException, IOException {
        String cabeceraAutorizacion = solicitud.getHeader("Authorization");

        if (cabeceraAutorizacion == null || !cabeceraAutorizacion.startsWith("Bearer ")) {
            cadena.doFilter(solicitud, respuesta);
            return;
        }

        String token = cabeceraAutorizacion.substring(7);

        if (jwtUtil.esTokenValido(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
            String correoElectronico = jwtUtil.extraerCorreo(token);
            UserDetails usuarioDetails = usuarioDetailsService.loadUserByUsername(correoElectronico);

            UsernamePasswordAuthenticationToken autenticacion = new UsernamePasswordAuthenticationToken(
                    usuarioDetails, null, usuarioDetails.getAuthorities()
            );
            autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(solicitud));
            SecurityContextHolder.getContext().setAuthentication(autenticacion);
        }

        cadena.doFilter(solicitud, respuesta);
    }
}
