package com.masteringmicroservices.event;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Evento de dominio para item creado.
 * 
 * CARACTERÍSTICAS:
 * - ✅ Evento de dominio bien definido
 * - ✅ Información completa del evento
 * - ✅ Timestamp de ocurrencia
 * - ✅ Información del usuario
 * - ✅ Serialización JSON
 * 
 * @author Experto en Microservicios
 * @version 2.0 - Nivel Experto
 * @since 2024
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemCreatedEvent {

    private Long itemId;
    private String itemName;
    private String itemCode;
    private String createdBy;
    private LocalDateTime occurredAt;
    private String correlationId;
    private String source;
} 