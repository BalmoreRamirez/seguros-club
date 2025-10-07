#!/bin/bash

# ============================================
# SCRIPT DE INSTALACIÓN: insurance_periods
# ============================================

echo "==================================="
echo "Instalación de tabla insurance_periods"
echo "==================================="
echo ""

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar el menú
show_menu() {
    echo "Seleccione el tipo de base de datos:"
    echo "1) PostgreSQL"
    echo "2) MySQL/MariaDB"
    echo "3) Salir"
    echo ""
}

# Función para PostgreSQL
install_postgresql() {
    echo -e "${YELLOW}Instalando en PostgreSQL...${NC}"
    echo ""

    read -p "Ingrese el nombre de usuario de PostgreSQL: " DB_USER
    read -p "Ingrese el nombre de la base de datos: " DB_NAME
    read -p "Ingrese el host (por defecto: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}

    echo ""
    echo -e "${YELLOW}Ejecutando script...${NC}"

    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -f create_insurance_periods_postgresql.sql

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Tabla insurance_periods creada exitosamente en PostgreSQL${NC}"
        echo ""
        echo "Puedes verificar la tabla con:"
        echo "psql -U $DB_USER -d $DB_NAME -c '\\d insurance_periods'"
    else
        echo ""
        echo -e "${RED}✗ Error al crear la tabla${NC}"
        exit 1
    fi
}

# Función para MySQL
install_mysql() {
    echo -e "${YELLOW}Instalando en MySQL/MariaDB...${NC}"
    echo ""

    read -p "Ingrese el nombre de usuario de MySQL: " DB_USER
    read -p "Ingrese el nombre de la base de datos: " DB_NAME
    read -p "Ingrese el host (por defecto: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    read -sp "Ingrese la contraseña: " DB_PASSWORD
    echo ""
    echo ""
    echo -e "${YELLOW}Ejecutando script...${NC}"

    mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME < create_insurance_periods_mysql.sql

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Tabla insurance_periods creada exitosamente en MySQL${NC}"
        echo ""
        echo "Puedes verificar la tabla con:"
        echo "mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e 'DESCRIBE insurance_periods;'"
    else
        echo ""
        echo -e "${RED}✗ Error al crear la tabla${NC}"
        exit 1
    fi
}

# Menú principal
while true; do
    show_menu
    read -p "Seleccione una opción [1-3]: " option

    case $option in
        1)
            install_postgresql
            break
            ;;
        2)
            install_mysql
            break
            ;;
        3)
            echo "Saliendo..."
            exit 0
            ;;
        *)
            echo -e "${RED}Opción inválida. Por favor, seleccione 1, 2 o 3.${NC}"
            echo ""
            ;;
    esac
done

echo ""
echo -e "${GREEN}==================================="
echo "Instalación completada"
echo "===================================${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Implementar los endpoints en tu backend"
echo "2. Verificar que la página de configuración funcione correctamente"
echo "3. Revisar la documentación en INSURANCE_PERIODS_DOCS.md"
echo ""
-- ============================================
-- SCRIPT DE CREACIÓN: TABLA insurance_periods
-- Base de datos: PostgreSQL
-- ============================================

-- Crear la tabla insurance_periods
CREATE TABLE insurance_periods (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'Próximo',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT check_dates CHECK (end_date > start_date),
    CONSTRAINT check_status CHECK (status IN ('Activo', 'Finalizado', 'Próximo')),
    CONSTRAINT fk_insurance_periods_user FOREIGN KEY (created_by) REFERENCES "Usuarios"(id) ON DELETE SET NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_insurance_periods_status ON insurance_periods(status);
CREATE INDEX idx_insurance_periods_dates ON insurance_periods(start_date, end_date);
CREATE INDEX idx_insurance_periods_created_at ON insurance_periods(created_at DESC);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_insurance_periods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
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

-- Insertar el período actual (1 abril 2024 - 31 marzo 2025)
INSERT INTO insurance_periods (start_date, end_date, duration, status, created_at)
VALUES ('2024-04-01', '2025-03-31', 365, 'Activo', CURRENT_TIMESTAMP);

-- Comentarios para documentación
COMMENT ON TABLE insurance_periods IS 'Almacena los períodos de vigencia del seguro';
COMMENT ON COLUMN insurance_periods.id IS 'Identificador único del período';
COMMENT ON COLUMN insurance_periods.start_date IS 'Fecha de inicio del período de seguro';
COMMENT ON COLUMN insurance_periods.end_date IS 'Fecha de finalización del período de seguro';
COMMENT ON COLUMN insurance_periods.duration IS 'Duración del período en días';
COMMENT ON COLUMN insurance_periods.status IS 'Estado del período: Activo, Finalizado, o Próximo';
COMMENT ON COLUMN insurance_periods.created_by IS 'ID del usuario administrador que creó el período';
COMMENT ON COLUMN insurance_periods.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN insurance_periods.updated_at IS 'Fecha y hora de última actualización';

-- Verificar la creación
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'insurance_periods'
ORDER BY ordinal_position;

