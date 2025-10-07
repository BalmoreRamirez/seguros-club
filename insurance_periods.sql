-- Tabla para almacenar los períodos de seguro
CREATE TABLE insurance_periods (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration INTEGER NOT NULL, -- Duración en días
    status VARCHAR(20) DEFAULT 'Próximo', -- 'Activo', 'Finalizado', 'Próximo'
    created_by INTEGER REFERENCES Usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (end_date > start_date),
    CONSTRAINT check_status CHECK (status IN ('Activo', 'Finalizado', 'Próximo'))
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_insurance_periods_status ON insurance_periods(status);
CREATE INDEX idx_insurance_periods_dates ON insurance_periods(start_date, end_date);
CREATE INDEX idx_insurance_periods_created_at ON insurance_periods(created_at DESC);

-- Trigger para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_insurance_periods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_insurance_periods_updated_at
    BEFORE UPDATE ON insurance_periods
    FOR EACH ROW
    EXECUTE FUNCTION update_insurance_periods_updated_at();

-- Función para actualizar automáticamente el estado de los períodos
CREATE OR REPLACE FUNCTION update_insurance_period_status()
RETURNS void AS $$
BEGIN
    -- Marcar como Finalizado los períodos que ya pasaron
    UPDATE insurance_periods
    SET status = 'Finalizado'
    WHERE end_date < CURRENT_DATE
    AND status != 'Finalizado';

    -- Marcar como Activo el período actual
    UPDATE insurance_periods
    SET status = 'Activo'
    WHERE start_date <= CURRENT_DATE
    AND end_date >= CURRENT_DATE
    AND status != 'Activo';

    -- Marcar como Próximo los períodos futuros
    UPDATE insurance_periods
    SET status = 'Próximo'
    WHERE start_date > CURRENT_DATE
    AND status != 'Próximo';
END;
$$ LANGUAGE plpgsql;

-- Insertar el período actual (2024-04-01 al 2025-03-31)
INSERT INTO insurance_periods (start_date, end_date, duration, status)
VALUES ('2024-04-01', '2025-03-31', 365, 'Activo');

-- Comentarios para documentación
COMMENT ON TABLE insurance_periods IS 'Almacena los períodos de vigencia del seguro';
COMMENT ON COLUMN insurance_periods.start_date IS 'Fecha de inicio del período de seguro';
COMMENT ON COLUMN insurance_periods.end_date IS 'Fecha de finalización del período de seguro';
COMMENT ON COLUMN insurance_periods.duration IS 'Duración del período en días';
COMMENT ON COLUMN insurance_periods.status IS 'Estado del período: Activo, Finalizado, o Próximo';
COMMENT ON COLUMN insurance_periods.created_by IS 'ID del usuario administrador que creó el período';

