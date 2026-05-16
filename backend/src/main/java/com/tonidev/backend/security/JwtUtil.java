package com.tonidev.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Componente encargado de generar, validar y extraer información de los tokens JWT.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secreto;

    @Value("${jwt.expiration}")
    private long expiracion;

    /**
     * Genera un token JWT firmado para el usuario indicado.
     *
     * @param idUsuario         el identificador del usuario
     * @param correoElectronico el correo electrónico del usuario (subject del token)
     * @return el token JWT generado como cadena de texto
     */
    public String generarToken(Long idUsuario, String correoElectronico) {
        return Jwts.builder()
                .subject(correoElectronico)
                .claim("idUsuario", idUsuario)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiracion))
                .signWith(construirSecretKey())
                .compact();
    }

    /**
     * Extrae el correo electrónico (subject) del token JWT.
     *
     * @param token el token JWT
     * @return el correo electrónico contenido en el token
     */
    public String extraerCorreo(String token) {
        return extraerClaims(token).getSubject();
    }

    /**
     * Verifica si el token JWT es válido (firma correcta y no expirado).
     *
     * @param token el token JWT a validar
     * @return {@code true} si el token es válido, {@code false} en caso contrario
     */
    public boolean esTokenValido(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (JwtException excepcion) {
            return false;
        }
    }

    /**
     * Extrae y parsea los claims del token JWT.
     *
     * @param token el token JWT
     * @return los claims contenidos en el token
     */
    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(construirSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Construye la clave secreta a partir del valor Base64 configurado en las propiedades.
     *
     * @return la clave secreta para firmar y verificar tokens
     */
    private SecretKey construirSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secreto);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
