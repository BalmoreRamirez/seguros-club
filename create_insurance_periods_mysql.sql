-- ============================================
-- SCRIPT DE CREACIÓN: TABLA insurance_periods
-- Base de datos: MySQL / MariaDB
-- ============================================

-- Crear la tabla insurance_periods
CREATE TABLE insurance_periods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration INT NOT NULL COMMENT 'Duración en días',
    status VARCHAR(20) DEFAULT 'Próximo' COMMENT 'Activo, Finalizado, Próximo',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT check_dates CHECK (end_date > start_date),
    CONSTRAINT check_status CHECK (status IN ('Activo', 'Finalizado', 'Próximo')),
    CONSTRAINT fk_insurance_periods_user
        FOREIGN KEY (created_by)
        REFERENCES Usuarios(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_insurance_periods_status ON insurance_periods(status);
CREATE INDEX idx_insurance_periods_dates ON insurance_periods(start_date, end_date);
CREATE INDEX idx_insurance_periods_created_at ON insurance_periods(created_at DESC);

-- Insertar el período actual (1 abril 2024 - 31 marzo 2025)
INSERT INTO insurance_periods (start_date, end_date, duration, status, created_at)
VALUES ('2024-04-01', '2025-03-31', 365, 'Activo', CURRENT_TIMESTAMP);

-- Crear evento para actualizar automáticamente el estado de los períodos (ejecuta diariamente a las 00:00)
DELIMITER $$

CREATE EVENT IF NOT EXISTS event_update_insurance_periods_status
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURRENT_DATE + INTERVAL 1 DAY, ' 00:00:00')
DO
BEGIN
    -- Marcar como Finalizado los períodos que ya pasaron
    UPDATE insurance_periods
    SET status = 'Finalizado'
    WHERE end_date < CURDATE()
    AND status != 'Finalizado';

    -- Marcar como Activo el período actual
    UPDATE insurance_periods
    SET status = 'Activo'
    WHERE start_date <= CURDATE()
    AND end_date >= CURDATE()
    AND status != 'Activo';

    -- Marcar como Próximo los períodos futuros
    UPDATE insurance_periods
    SET status = 'Próximo'
    WHERE start_date > CURDATE()
    AND status != 'Próximo';
END$$

DELIMITER ;

-- Verificar que el evento esté habilitado
SET GLOBAL event_scheduler = ON;

-- Verificar la creación
DESCRIBE insurance_periods;

-- Ver el evento creado
SHOW EVENTS WHERE Name = 'event_update_insurance_periods_status';

