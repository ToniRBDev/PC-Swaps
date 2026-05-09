package com.tonidev.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Entidad que representa a un usuario registrado en la plataforma PC-SWAPS.
 * Un usuario puede publicar artículos, iniciar conversaciones y guardar seguimientos.
 */
@Entity
@Table(name = "usuario")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    /**
     * Identificador único del usuario, generado automáticamente por la base de datos.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellidos", nullable = false)
    private String apellidos;

    @Column(name = "dni", nullable = false, unique = true)
    private String dni;

    /**
     * Correo electrónico del usuario. Se utiliza también como credencial de acceso.
     */
    @Column(name = "correo_electronico", nullable = false, unique = true)
    private String correoElectronico;

    @Setter
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Setter
    @Column(name = "direccion")
    private String direccion;

    @Setter
    @Column(name = "num_telefono")
    private String numTelefono;

    /**
     * Ruta o URL de la imagen de perfil del usuario.
     */
    @Setter
    @Column(name = "imagen_usuario")
    private String imagenUsuario;

    /**
     * Nombre de usuario público visible en la plataforma.
     */
    @Setter
    @Column(name = "nombre_usuario", nullable = false, unique = true)
    private String nombreUsuario;

    /**
     * Contraseña del usuario almacenada como hash. Nunca se guarda en texto plano.
     */
    @Setter
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
}
