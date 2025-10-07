# Documentación: Integración de Períodos de Seguro

## 📋 Estructura de la Tabla `insurance_periods`

### Campos:
- **id**: Identificador único (Primary Key)
- **start_date**: Fecha de inicio del período (ej: 2024-04-01)
- **end_date**: Fecha de fin del período (ej: 2025-03-31)
- **duration**: Duración en días calculada automáticamente
- **status**: Estado del período ('Activo', 'Finalizado', 'Próximo')
- **created_by**: ID del usuario administrador que creó el registro (FK a Usuarios.id)
- **created_at**: Fecha de creación del registro
- **updated_at**: Fecha de última actualización

### Constraints:
- `end_date` debe ser posterior a `start_date`
- `status` solo puede ser: 'Activo', 'Finalizado', o 'Próximo'

---

## 🔗 Relación con tu Schema Actual

```
┌─────────────────────────────┐
│      insurance_periods      │
├─────────────────────────────┤
│ id (PK)                     │
│ start_date                  │
│ end_date                    │
│ duration                    │
│ status                      │
│ created_by (FK)  ───────────┼──┐
│ created_at                  │  │
│ updated_at                  │  │
└─────────────────────────────┘  │
                                  │
                                  │
                                  ▼
┌─────────────────────────────────────┐
│           Usuarios                  │
├─────────────────────────────────────┤
│ id (PK)                             │
│ user                                │
│ password                            │
│ is_admin                            │
│ id_role (FK → roles.id)             │
└─────────────────────────────────────┘
```

### Relaciones:
1. **insurance_periods.created_by → Usuarios.id**: 
   - Registra qué administrador creó cada período
   - Permite auditoría y trazabilidad

### Uso Opcional - Relación con Clubes/Miembros:
Si necesitas relacionar períodos específicos con clubes o miembros, puedes:

```sql
-- Agregar campo a la tabla clubs para referenciar el período activo
ALTER TABLE clubs 
ADD COLUMN current_insurance_period_id INT,
ADD CONSTRAINT fk_clubs_insurance_period 
    FOREIGN KEY (current_insurance_period_id) 
    REFERENCES insurance_periods(id);

-- O agregar a miembros para rastrear en qué período se registraron
ALTER TABLE miembros
ADD COLUMN registered_period_id INT,
ADD CONSTRAINT fk_miembros_insurance_period 
    FOREIGN KEY (registered_period_id) 
    REFERENCES insurance_periods(id);
```

---

## 🚀 Instalación

### Para PostgreSQL:
```bash
psql -U tu_usuario -d tu_base_datos -f insurance_periods.sql
```

### Para MySQL:
```bash
mysql -u tu_usuario -p tu_base_datos < insurance_periods_mysql.sql
```

---

## 📊 Consultas Útiles

### Obtener el período activo actual:
```sql
SELECT * FROM insurance_periods 
WHERE status = 'Activo' 
ORDER BY start_date DESC 
LIMIT 1;
```

### Verificar si una fecha está dentro del período activo:
```sql
SELECT * FROM insurance_periods 
WHERE '2025-10-07' BETWEEN start_date AND end_date 
AND status = 'Activo';
```

### Historial completo ordenado:
```sql
SELECT 
    id,
    start_date,
    end_date,
    duration,
    status,
    created_at,
    u.user as created_by_user
FROM insurance_periods ip
LEFT JOIN Usuarios u ON ip.created_by = u.id
ORDER BY start_date DESC;
```

### Actualizar estados manualmente (si no usas el trigger/evento):
```sql
-- PostgreSQL
SELECT update_insurance_period_status();

-- MySQL - ejecutar manualmente
UPDATE insurance_periods SET status = 'Finalizado' WHERE end_date < CURDATE();
UPDATE insurance_periods SET status = 'Activo' WHERE start_date <= CURDATE() AND end_date >= CURDATE();
UPDATE insurance_periods SET status = 'Próximo' WHERE start_date > CURDATE();
```

---

## 🔧 Endpoints Sugeridos para el Backend

### GET `/api/insurance-period/current`
Retorna el período activo actual.

### POST `/api/insurance-period`
Crea un nuevo período (solo administradores).

**Body:**
```json
{
  "startDate": "2025-04-01",
  "endDate": "2026-03-31",
  "duration": 365
}
```

### GET `/api/insurance-period/history`
Retorna todos los períodos ordenados por fecha.

---

## ⚡ Ventajas de esta Estructura

1. **Histórico Completo**: Mantiene registro de todos los períodos pasados
2. **Actualización Automática**: Los estados se actualizan sin intervención manual
3. **Auditoría**: Sabe quién creó cada período
4. **Flexibilidad**: Puede tener múltiples períodos (solapados o no)
5. **Validaciones**: Asegura integridad de datos con constraints
6. **Performance**: Índices optimizados para consultas frecuentes

---

## 📝 Notas Importantes

- El campo `status` se actualiza automáticamente cada día
- Solo debe haber UN período con status 'Activo' a la vez
- Los períodos pueden crearse con anticipación (status 'Próximo')
- La duración se calcula en días (incluye día inicial y final)
- Ejemplo: 1 abril 2024 al 31 marzo 2025 = 365 días

