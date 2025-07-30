package com.masteringmicroservices.exception;

/**
 * Excepción personalizada para errores de validación.
 * 
 * CARACTERÍSTICAS:
 * - ✅ Excepción específica para validaciones
 * - ✅ Mensajes de error detallados
 * - ✅ Códigos de error estructurados
 * - ✅ Información de contexto
 * - ✅ Trazabilidad de errores
 * 
 * @author Experto en Microservicios
 * @version 2.0 - Nivel Experto
 * @since 2024
 */
public class ValidationException extends RuntimeException {

    private final String errorCode;
    private final String field;
    private final Object value;
    private final String context;

    /**
     * Constructor con mensaje
     * 
     * @param message Mensaje de error
     */
    public ValidationException(String message) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
        this.field = null;
        this.value = null;
        this.context = null;
    }

    /**
     * Constructor con mensaje y causa
     * 
     * @param message Mensaje de error
     * @param cause Causa del error
     */
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "VALIDATION_ERROR";
        this.field = null;
        this.value = null;
        this.context = null;
    }

    /**
     * Constructor completo
     * 
     * @param errorCode Código de error
     * @param message Mensaje de error
     * @param field Campo que causó el error
     * @param value Valor que causó el error
     * @param context Contexto del error
     */
    public ValidationException(String errorCode, String message, String field, Object value, String context) {
        super(message);
        this.errorCode = errorCode;
        this.field = field;
        this.value = value;
        this.context = context;
    }

    // Getters
    public String getErrorCode() {
        return errorCode;
    }

    public String getField() {
        return field;
    }

    public Object getValue() {
        return value;
    }

    public String getContext() {
        return context;
    }
} 