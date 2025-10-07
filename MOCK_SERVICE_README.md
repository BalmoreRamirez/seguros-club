# 🔧 Configuración de Mock Service - Insurance Periods

## 📝 Estado Actual

Actualmente la aplicación está usando un **Mock Service** (servicio simulado) para los endpoints de períodos de seguro. Esto permite que toda la funcionalidad esté operativa mientras implementas los endpoints reales en el backend.

## ✅ Funcionalidades Disponibles con Mock Service

- ✅ Ver período actual (muestra: 1 abril 2024 - 31 marzo 2025)
- ✅ Crear nuevos períodos
- ✅ Editar períodos existentes
- ✅ Eliminar períodos
- ✅ Ver historial completo
- ✅ Los datos persisten durante la sesión actual (se pierden al recargar)

## 🔄 Cómo Cambiar al Backend Real

### Paso 1: Implementa los Endpoints en tu Backend

Debes crear estos 5 endpoints en tu backend:

```
GET    /api/insurance-periods/current    - Obtener período activo
GET    /api/insurance-periods             - Listar todos los períodos
POST   /api/insurance-periods             - Crear nuevo período
PUT    /api/insurance-periods/:id         - Actualizar período
DELETE /api/insurance-periods/:id         - Eliminar período
```

### Paso 2: Crea la Tabla en la Base de Datos

Ejecuta uno de estos scripts según tu base de datos:
- **PostgreSQL**: `create_insurance_periods_postgresql.sql`
- **MySQL**: `create_insurance_periods_mysql.sql`

### Paso 3: Desactiva el Mock Service

Abre el archivo:
```
src/views/modules/administrator/services/adminServices.js
```

Cambia la línea 5 de:
```javascript
const USE_MOCK_SERVICE = true;
```

A:
```javascript
const USE_MOCK_SERVICE = false;
```

### Paso 4: (Opcional) Elimina los Archivos Mock

Una vez que el backend esté funcionando correctamente, puedes eliminar:
```
src/services/mockInsurancePeriodService.js
```

Y en `adminServices.js` puedes eliminar:
- La importación del mock service (línea 2)
- La constante USE_MOCK_SERVICE (línea 5)
- Los if statements dentro de cada función

## 📊 Formato de Datos

### Request Body para POST/PUT:
```json
{
  "start_date": "2024-04-01",
  "end_date": "2025-03-31",
  "duration": 365,
  "status": "Activo",
  "created_by": 1
}
```

### Response del Backend:
```json
{
  "data": {
    "id": 1,
    "start_date": "2024-04-01",
    "end_date": "2025-03-31",
    "duration": 365,
    "status": "Activo",
    "created_by": 1,
    "created_at": "2024-03-15T10:00:00Z",
    "updated_at": "2024-03-15T10:00:00Z"
  }
}
```

## 🎯 Estados Posibles

- **Activo**: El período está en curso actualmente
- **Próximo**: El período aún no ha comenzado
- **Finalizado**: El período ya terminó

## ⚠️ Notas Importantes

1. El mock service simula las validaciones del backend
2. Solo puede haber UN período con status 'Activo' a la vez
3. No se puede eliminar un período activo
4. No se puede editar un período finalizado
5. Los datos del mock service se reinician al recargar la página

