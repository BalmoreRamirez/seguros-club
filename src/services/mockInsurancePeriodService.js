// Mock service para simular el comportamiento del backend de insurance periods
// Este archivo simula los endpoints mientras se implementan en el backend real

let mockPeriods = [];
let nextId = 1;

export const mockInsurancePeriodService = {
  // Simula GET /api/insurance-periods/current
  getCurrentInsurancePeriod: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const activePeriod = mockPeriods.find(p => p.status === 'Activo');
        if (activePeriod) {
          resolve({ data: activePeriod });
        } else {
          reject({ response: { status: 404, data: { message: 'No hay período activo' } } });
        }
      }, 300);
    });
  },

  // Simula GET /api/insurance-periods
  getAllInsurancePeriods: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...mockPeriods].sort((a, b) => 
          new Date(b.start_date) - new Date(a.start_date)
        )});
      }, 300);
    });
  },

  // Simula POST /api/insurance-periods
  saveInsurancePeriod: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPeriod = {
          id: nextId++,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Si el nuevo período es activo, marcar otros como finalizados
        if (newPeriod.status === 'Activo') {
          mockPeriods = mockPeriods.map(p => ({
            ...p,
            status: p.status === 'Activo' ? 'Finalizado' : p.status
          }));
        }
        
        mockPeriods.push(newPeriod);
        resolve({ data: newPeriod });
      }, 500);
    });
  },

  // Simula PUT /api/insurance-periods/:id
  updateInsurancePeriod: (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPeriods.findIndex(p => p.id === id);
        if (index === -1) {
          reject({ response: { data: { message: 'Período no encontrado' } } });
          return;
        }

        // Si se actualiza a activo, marcar otros como finalizados
        if (data.status === 'Activo') {
          mockPeriods = mockPeriods.map((p, i) => ({
            ...p,
            status: i !== index && p.status === 'Activo' ? 'Finalizado' : p.status
          }));
        }

        mockPeriods[index] = {
          ...mockPeriods[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        
        resolve({ data: mockPeriods[index] });
      }, 500);
    });
  },

  // Simula DELETE /api/insurance-periods/:id
  deleteInsurancePeriod: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPeriods.findIndex(p => p.id === id);
        if (index === -1) {
          reject({ response: { data: { message: 'Período no encontrado' } } });
          return;
        }

        if (mockPeriods[index].status === 'Activo') {
          reject({ response: { data: { message: 'No se puede eliminar el período activo' } } });
          return;
        }

        mockPeriods.splice(index, 1);
        resolve({ data: { message: 'Período eliminado exitosamente' } });
      }, 500);
    });
  },

  // Método auxiliar para resetear los datos
  reset: () => {
    mockPeriods = [];
    nextId = 1;
  }
};
