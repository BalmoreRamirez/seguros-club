-- VERSIÓN MYSQL
-- Tabla para almacenar los períodos de seguro
CREATE TABLE insurance_periods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration INT NOT NULL COMMENT 'Duración en días',
    status VARCHAR(20) DEFAULT 'Próximo' COMMENT 'Activo, Finalizado, Próximo',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (end_date > start_date),
    CONSTRAINT check_status CHECK (status IN ('Activo', 'Finalizado', 'Próximo')),
    CONSTRAINT fk_insurance_periods_user FOREIGN KEY (created_by) REFERENCES Usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_insurance_periods_status ON insurance_periods(status);
CREATE INDEX idx_insurance_periods_dates ON insurance_periods(start_date, end_date);
CREATE INDEX idx_insurance_periods_created_at ON insurance_periods(created_at DESC);

-- Insertar el período actual (2024-04-01 al 2025-03-31)
INSERT INTO insurance_periods (start_date, end_date, duration, status)
VALUES ('2024-04-01', '2025-03-31', 365, 'Activo');

-- Evento para actualizar automáticamente el estado de los períodos (ejecuta diariamente)
CREATE EVENT IF NOT EXISTS update_insurance_periods_status
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
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
END;

