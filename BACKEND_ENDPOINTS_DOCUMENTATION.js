/**
 * ============================================
 * ENDPOINTS PARA PERÍODOS DE SEGURO
 * Backend API Documentation
 * ============================================
 */

// ============================================
// 1. POST /api/insurance-periods
// Crear un nuevo período de seguro
// ============================================

/**
 * Endpoint: POST /api/insurance-periods
 * Descripción: Crea un nuevo período de seguro
 * Autenticación: Requerida (Solo Admin)
 * 
 * Request Body:
 * {
 *   "start_date": "2025-04-01",     // Formato: YYYY-MM-DD
 *   "end_date": "2026-03-31",       // Formato: YYYY-MM-DD
 *   "duration": 365                 // Número de días
 * }
 * 
 * Response Success (201):
 * {
 *   "success": true,
 *   "message": "Período creado exitosamente",
 *   "data": {
 *     "id": 2,
 *     "start_date": "2025-04-01",
 *     "end_date": "2026-03-31",
 *     "duration": 365,
 *     "status": "Próximo",
 *     "created_by": 1,
 *     "created_at": "2025-10-07T10:30:00Z",
 *     "updated_at": "2025-10-07T10:30:00Z"
 *   }
 * }
 * 
 * Response Error (400):
 * {
 *   "success": false,
 *   "message": "La fecha de fin debe ser posterior a la fecha de inicio"
 * }
 */

// Ejemplo de implementación (Node.js/Express):
router.post('/insurance-periods', authenticate, isAdmin, async (req, res) => {
  try {
    const { start_date, end_date, duration } = req.body;
    const created_by = req.user.id; // Del middleware de autenticación

    // Validaciones
    if (!start_date || !end_date || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    // Determinar el estado basado en las fechas
    const today = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    let status = 'Próximo';
    if (today >= startDate && today <= endDate) {
      status = 'Activo';
      // Opcional: marcar otros períodos activos como finalizados
      await pool.query(
        'UPDATE insurance_periods SET status = $1 WHERE status = $2',
        ['Finalizado', 'Activo']
      );
    } else if (today > endDate) {
      status = 'Finalizado';
    }

    // Insertar en la base de datos
    const result = await pool.query(
      `INSERT INTO insurance_periods 
       (start_date, end_date, duration, status, created_by) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [start_date, end_date, duration, status, created_by]
    );

    res.status(201).json({
      success: true,
      message: 'Período creado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear período:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el período'
    });
  }
});


// ============================================
// 2. GET /api/insurance-periods
// Listar todos los períodos de seguro
// ============================================

/**
 * Endpoint: GET /api/insurance-periods
 * Descripción: Obtiene todos los períodos de seguro ordenados por fecha
 * Autenticación: Requerida (Solo Admin)
 * 
 * Query Parameters (opcionales):
 * - status: Filtrar por estado (Activo, Finalizado, Próximo)
 * - limit: Número máximo de resultados
 * - offset: Paginación
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "start_date": "2024-04-01",
 *       "end_date": "2025-03-31",
 *       "duration": 365,
 *       "status": "Activo",
 *       "created_by": 1,
 *       "created_at": "2024-03-15T10:00:00Z",
 *       "updated_at": "2024-03-15T10:00:00Z"
 *     },
 *     {
 *       "id": 2,
 *       "start_date": "2025-04-01",
 *       "end_date": "2026-03-31",
 *       "duration": 365,
 *       "status": "Próximo",
 *       "created_by": 1,
 *       "created_at": "2025-10-07T10:30:00Z",
 *       "updated_at": "2025-10-07T10:30:00Z"
 *     }
 *   ],
 *   "total": 2
 * }
 */

// Ejemplo de implementación:
router.get('/insurance-periods', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM insurance_periods';
    let params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY start_date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Obtener el total
    const countQuery = status 
      ? 'SELECT COUNT(*) FROM insurance_periods WHERE status = $1'
      : 'SELECT COUNT(*) FROM insurance_periods';
    const countResult = await pool.query(countQuery, status ? [status] : []);

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count)
    });

  } catch (error) {
    console.error('Error al obtener períodos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los períodos'
    });
  }
});


// ============================================
// 3. GET /api/insurance-periods/current
// Obtener el período activo actual
// ============================================

/**
 * Endpoint: GET /api/insurance-periods/current
 * Descripción: Obtiene el período de seguro activo actual
 * Autenticación: Requerida
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "start_date": "2024-04-01",
 *     "end_date": "2025-03-31",
 *     "duration": 365,
 *     "status": "Activo",
 *     "created_by": 1,
 *     "created_at": "2024-03-15T10:00:00Z",
 *     "updated_at": "2024-03-15T10:00:00Z"
 *   }
 * }
 * 
 * Response Error (404):
 * {
 *   "success": false,
 *   "message": "No hay período activo"
 * }
 */

// Ejemplo de implementación:
router.get('/insurance-periods/current', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM insurance_periods 
       WHERE status = $1 
       ORDER BY start_date DESC 
       LIMIT 1`,
      ['Activo']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay período activo'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener período actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el período actual'
    });
  }
});


// ============================================
// 4. PUT /api/insurance-periods/:id
// Actualizar un período de seguro
// ============================================

/**
 * Endpoint: PUT /api/insurance-periods/:id
 * Descripción: Actualiza un período de seguro existente
 * Autenticación: Requerida (Solo Admin)
 * 
 * URL Parameters:
 * - id: ID del período a actualizar
 * 
 * Request Body:
 * {
 *   "start_date": "2025-04-01",
 *   "end_date": "2026-03-31",
 *   "duration": 365
 * }
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "message": "Período actualizado exitosamente",
 *   "data": {
 *     "id": 2,
 *     "start_date": "2025-04-01",
 *     "end_date": "2026-03-31",
 *     "duration": 365,
 *     "status": "Próximo",
 *     "created_by": 1,
 *     "created_at": "2025-10-07T10:30:00Z",
 *     "updated_at": "2025-10-07T11:15:00Z"
 *   }
 * }
 * 
 * Response Error (404):
 * {
 *   "success": false,
 *   "message": "Período no encontrado"
 * }
 * 
 * Response Error (400):
 * {
 *   "success": false,
 *   "message": "No se puede modificar un período finalizado"
 * }
 */

// Ejemplo de implementación:
router.put('/insurance-periods/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, duration } = req.body;

    // Verificar que el período existe
    const checkResult = await pool.query(
      'SELECT * FROM insurance_periods WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Período no encontrado'
      });
    }

    // No permitir editar períodos finalizados
    if (checkResult.rows[0].status === 'Finalizado') {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar un período finalizado'
      });
    }

    // Validaciones
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    // Determinar el estado basado en las fechas
    const today = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    let status = 'Próximo';
    if (today >= startDate && today <= endDate) {
      status = 'Activo';
    } else if (today > endDate) {
      status = 'Finalizado';
    }

    // Actualizar
    const result = await pool.query(
      `UPDATE insurance_periods 
       SET start_date = $1, end_date = $2, duration = $3, status = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [start_date, end_date, duration, status, id]
    );

    res.json({
      success: true,
      message: 'Período actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar período:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el período'
    });
  }
});


// ============================================
// 5. DELETE /api/insurance-periods/:id
// Eliminar un período de seguro
// ============================================

/**
 * Endpoint: DELETE /api/insurance-periods/:id
 * Descripción: Elimina un período de seguro
 * Autenticación: Requerida (Solo Admin)
 * 
 * URL Parameters:
 * - id: ID del período a eliminar
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "message": "Período eliminado exitosamente"
 * }
 * 
 * Response Error (404):
 * {
 *   "success": false,
 *   "message": "Período no encontrado"
 * }
 * 
 * Response Error (400):
 * {
 *   "success": false,
 *   "message": "No se puede eliminar el período activo"
 * }
 */

// Ejemplo de implementación:
router.delete('/insurance-periods/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el período existe
    const checkResult = await pool.query(
      'SELECT * FROM insurance_periods WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Período no encontrado'
      });
    }

    // No permitir eliminar el período activo
    if (checkResult.rows[0].status === 'Activo') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el período activo'
      });
    }

    // Eliminar
    await pool.query('DELETE FROM insurance_periods WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Período eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar período:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el período'
    });
  }
});


// ============================================
// MIDDLEWARES DE AUTENTICACIÓN
// ============================================

/**
 * Middleware para verificar autenticación
 */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar que el usuario es administrador
 */
const isAdmin = (req, res, next) => {
  if (req.user.id_role !== 1 && !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  next();
};


// ============================================
// TAREA PROGRAMADA (CRON JOB)
// Actualizar estados automáticamente
// ============================================

/**
 * Ejecutar diariamente para actualizar estados de períodos
 * Puede usar node-cron, node-schedule, o similar
 */
const cron = require('node-cron');

// Ejecutar todos los días a las 00:00
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Actualizando estados de períodos de seguro...');

    // Marcar como Finalizado los períodos que ya pasaron
    await pool.query(
      `UPDATE insurance_periods 
       SET status = 'Finalizado' 
       WHERE end_date < CURRENT_DATE AND status != 'Finalizado'`
    );

    // Marcar como Activo el período actual
    await pool.query(
      `UPDATE insurance_periods 
       SET status = 'Activo' 
       WHERE start_date <= CURRENT_DATE 
       AND end_date >= CURRENT_DATE 
       AND status != 'Activo'`
    );

    // Marcar como Próximo los períodos futuros
    await pool.query(
      `UPDATE insurance_periods 
       SET status = 'Próximo' 
       WHERE start_date > CURRENT_DATE 
       AND status != 'Próximo'`
    );

    console.log('Estados actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar estados:', error);
  }
});


// ============================================
// NOTAS DE IMPLEMENTACIÓN
// ============================================

/**
 * 1. Asegúrate de tener instaladas las dependencias:
 *    npm install express jsonwebtoken node-cron pg
 * 
 * 2. Variables de entorno requeridas:
 *    - JWT_SECRET: Clave secreta para JWT
 *    - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME: Configuración de base de datos
 * 
 * 3. La tabla insurance_periods debe estar creada (usar el script SQL proporcionado)
 * 
 * 4. Los endpoints deben estar protegidos con autenticación JWT
 * 
 * 5. Solo usuarios con rol de administrador (id_role = 1) pueden acceder
 * 
 * 6. Para MySQL, cambiar la sintaxis de consultas de PostgreSQL ($1, $2) a MySQL (?, ?)
 */

module.exports = router;

