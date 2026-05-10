package com.tonidev.backend.service;

import com.tonidev.backend.dto.*;
import com.tonidev.backend.mapper.UsuarioMapper;
import com.tonidev.backend.model.Usuario;
import com.tonidev.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Servicio encargado de la lógica de negocio relacionada con los usuarios.
 */
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final ImagenService imagenService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param usuarioRepository repositorio para acceder a los usuarios en base de datos
     * @param usuarioMapper     mapper para convertir entre entidad y DTOs
     * @param passwordEncoder   codificador de contraseñas proporcionado por Spring Security
     * @param imagenService     servicio para gestionar imágenes en el sistema de ficheros
     */
    public UsuarioService(UsuarioRepository usuarioRepository,
                          UsuarioMapper usuarioMapper,
                          PasswordEncoder passwordEncoder,
                          ImagenService imagenService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.passwordEncoder = passwordEncoder;
        this.imagenService = imagenService;
    }

    /**
     * Registra un nuevo usuario en la plataforma.
     * Valida que el correo, el DNI y el nombre de usuario no estén ya en uso.
     *
     * @param request el DTO con los datos de registro
     * @return el perfil del usuario recién creado
     * @throws IllegalArgumentException si el correo, DNI o nombre de usuario ya están en uso
     */
    public UsuarioPerfilResponse registrar(UsuarioRegistroRequest request) {
        if (usuarioRepository.existsByCorreoElectronico(request.correoElectronico())) {
            throw new IllegalArgumentException("El correo electrónico ya está en uso");
        }
        if (usuarioRepository.existsByDni(request.dni())) {
            throw new IllegalArgumentException("El DNI ya está en uso");
        }
        if (usuarioRepository.existsByNombreUsuario(request.nombreUsuario())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        String passwordHash = passwordEncoder.encode(request.password());
        Usuario usuario = usuarioMapper.toEntity(request, passwordHash);
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return usuarioMapper.toPerfilResponse(usuarioGuardado);
    }

    /**
     * Devuelve el perfil completo del usuario autenticado.
     *
     * @param idUsuario el identificador del usuario
     * @return el DTO con los datos del perfil
     * @throws IllegalArgumentException si no existe un usuario con ese identificador
     */
    public UsuarioPerfilResponse obtenerPerfil(Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        return usuarioMapper.toPerfilResponse(usuario);
    }

    /**
     * Devuelve los datos de contacto de un vendedor para mostrarlos en el detalle de un artículo.
     *
     * @param idUsuario el identificador del vendedor
     * @return el DTO con los datos de contacto del vendedor
     * @throws IllegalArgumentException si no existe un usuario con ese identificador
     */
    public UsuarioContactoResponse obtenerDatosContacto(Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        return usuarioMapper.toContactoResponse(usuario);
    }

    /**
     * Actualiza los datos del perfil de un usuario.
     * Valida que el nuevo nombre de usuario no esté ya en uso por otro usuario.
     *
     * @param idUsuario el identificador del usuario
     * @param request   el DTO con los datos a actualizar
     * @return el perfil actualizado
     * @throws IllegalArgumentException si el nombre de usuario ya está en uso
     */
    public UsuarioPerfilResponse actualizar(Long idUsuario, UsuarioActualizarRequest request) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);

        if (!usuario.getNombreUsuario().equals(request.nombreUsuario())
                && usuarioRepository.existsByNombreUsuario(request.nombreUsuario())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        usuario.setNombreUsuario(request.nombreUsuario());
        usuario.setDireccion(request.direccion());
        usuario.setNumTelefono(request.numTelefono());

        return usuarioMapper.toPerfilResponse(usuarioRepository.save(usuario));
    }

    /**
     * Cambia la contraseña de un usuario.
     * Valida que la contraseña actual sea correcta antes de actualizarla.
     *
     * @param idUsuario el identificador del usuario
     * @param request   el DTO con la contraseña actual y la nueva
     * @throws IllegalArgumentException si la contraseña actual no es correcta
     */
    public void cambiarPassword(Long idUsuario, CambiarPasswordRequest request) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);

        if (!passwordEncoder.matches(request.passwordActual(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("La contraseña actual no es correcta");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.passwordNueva()));
        usuarioRepository.save(usuario);
    }

    /**
     * Actualiza la foto de perfil de un usuario.
     * Si ya tenía una imagen previa, la elimina del sistema de ficheros antes de guardar la nueva.
     *
     * @param idUsuario el identificador del usuario
     * @param archivo   el fichero de imagen enviado por el usuario
     * @return el perfil actualizado con la nueva imagen
     * @throws IOException si ocurre un error al guardar o eliminar la imagen en disco
     */
    public UsuarioPerfilResponse actualizarImagen(Long idUsuario, MultipartFile archivo) throws IOException {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);

        if (usuario.getImagenUsuario() != null) {
            imagenService.eliminar(usuario.getImagenUsuario());
        }

        String rutaImagen = imagenService.guardar(archivo);
        usuario.setImagenUsuario(rutaImagen);

        return usuarioMapper.toPerfilResponse(usuarioRepository.save(usuario));
    }

    /**
     * Elimina la cuenta de un usuario.
     * El borrado en cascada de artículos, conversaciones, mensajes y seguimientos
     * se gestiona a nivel de base de datos mediante las relaciones definidas en las entidades.
     *
     * @param idUsuario el identificador del usuario a eliminar
     * @throws IllegalArgumentException si no existe un usuario con ese identificador
     */
    public void eliminar(Long idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        usuarioRepository.delete(usuario);
    }

    /**
     * Busca un usuario por su identificador o lanza una excepción si no existe.
     *
     * @param idUsuario el identificador del usuario
     * @return la entidad {@link Usuario}
     * @throws IllegalArgumentException si no existe un usuario con ese identificador
     */
    private Usuario obtenerUsuarioPorId(Long idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("No existe un usuario con id: " + idUsuario));
    }
}
