package com.tonidev.backend.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Aspecto encargado del registro de trazas de ejecución en la capa de servicio.
 * Intercepta todos los métodos de los servicios y registra su entrada, tiempo de ejecución y errores.
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    /**
     * Intercepta la ejecución de cualquier método en la capa de servicio.
     * Registra el inicio, el tiempo total de ejecución y, en caso de error, el mensaje de la excepción.
     *
     * @param joinPoint el punto de unión que representa el método interceptado
     * @return el valor devuelto por el método interceptado
     * @throws Throwable si el método interceptado lanza una excepción, se relanza sin modificar
     */
    @Around("execution(* com.tonidev.backend.service.*.*(..))")
    public Object registrarEjecucion(ProceedingJoinPoint joinPoint) throws Throwable {
        String nombreClase = joinPoint.getTarget().getClass().getSimpleName();
        String nombreMetodo = joinPoint.getSignature().getName();

        logger.info("Inicio: {}.{}()", nombreClase, nombreMetodo);
        long tiempoInicio = System.currentTimeMillis();

        try {
            Object resultado = joinPoint.proceed();
            long tiempoTotal = System.currentTimeMillis() - tiempoInicio;
            logger.info("Fin: {}.{}() — {} ms", nombreClase, nombreMetodo, tiempoTotal);
            return resultado;
        } catch (Exception excepcion) {
            logger.error("Error en {}.{}(): {}", nombreClase, nombreMetodo, excepcion.getMessage());
            throw excepcion;
        }
    }
}
