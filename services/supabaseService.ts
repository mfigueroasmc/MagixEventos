
import type { Articulo, Evento, EventoDetalle } from '../types';

// Mock Data
let mockArticulos: Articulo[] = [
    { id: 'a1', codigo: 'PROJ-001', descripcion: 'Proyector Epson 5000 Lumens', tipo: 'propio', valor: 150, cantidad_total: 10, cantidad_disponible: 8, estado: 'activo', created_at: new Date().toISOString() },
    { id: 'a2', codigo: 'MIC-001', descripcion: 'Micrófono Shure SM58', tipo: 'propio', valor: 25, cantidad_total: 20, cantidad_disponible: 20, estado: 'activo', created_at: new Date().toISOString() },
    { id: 'a3', codigo: 'SPK-001', descripcion: 'Altavoz JBL EON 15"', tipo: 'propio', valor: 80, cantidad_total: 12, cantidad_disponible: 10, estado: 'activo', created_at: new Date().toISOString() },
    { id: 'a4', codigo: 'LED-WALL-01', descripcion: 'Pantalla LED P3 3x2m', tipo: 'subarriendo', valor: 800, cantidad_total: 5, cantidad_disponible: 4, estado: 'activo', created_at: new Date().toISOString() },
    { id: 'a5', codigo: 'LAP-001', descripcion: 'Laptop HP i7', tipo: 'propio', valor: 70, cantidad_total: 8, cantidad_disponible: 8, estado: 'inactivo', created_at: new Date().toISOString() },
];

let mockEventos: Evento[] = [
    { id: 'e1', codigo_evento: 'EVT-2024-001', fecha: '2024-08-15', descripcion: 'Congreso Anual de Tecnología', salon: 'Gran Salón A', compania: 'Tech Corp', total_neto: 1350, iva: 256.5, total_general: 1606.5, created_at: new Date().toISOString(), detalles: [
        { id: 'ed1', evento_id: 'e1', articulo_id: 'a1', articulo_descripcion: 'Proyector Epson 5000 Lumens', cantidad: 2, valor_unitario: 150, subtotal: 300 },
        { id: 'ed2', evento_id: 'e1', articulo_id: 'a4', articulo_descripcion: 'Pantalla LED P3 3x2m', cantidad: 1, valor_unitario: 800, subtotal: 800 },
        { id: 'ed3', evento_id: 'e1', articulo_id: 'a2', articulo_descripcion: 'Micrófono Shure SM58', cantidad: 10, valor_unitario: 25, subtotal: 250 }
    ]},
    { id: 'e2', codigo_evento: 'EVT-2024-002', fecha: '2024-09-01', descripcion: 'Lanzamiento de Producto', salon: 'Salón Pacífico', compania: 'Innovate Inc.', total_neto: 320, iva: 60.8, total_general: 380.8, created_at: new Date().toISOString(), detalles: [
        { id: 'ed4', evento_id: 'e2', articulo_id: 'a3', articulo_descripcion: 'Altavoz JBL EON 15"', cantidad: 4, valor_unitario: 80, subtotal: 320 }
    ]}
];

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

// --- Articulos API ---
export const getArticulos = async (): Promise<Articulo[]> => simulateDelay([...mockArticulos]);
export const addArticulo = async (articulo: Omit<Articulo, 'id' | 'created_at'>): Promise<Articulo> => {
    if (mockArticulos.some(a => a.codigo === articulo.codigo)) {
        throw new Error("El código del artículo ya existe.");
    }
    const newArticulo: Articulo = {
        ...articulo,
        id: `a${Math.random()}`,
        created_at: new Date().toISOString(),
    };
    mockArticulos.push(newArticulo);
    return simulateDelay(newArticulo);
};
export const updateArticulo = async (id: string, updates: Partial<Articulo>): Promise<Articulo> => {
    let articuloToUpdate = mockArticulos.find(a => a.id === id);
    if (!articuloToUpdate) throw new Error("Artículo no encontrado.");
    if (updates.codigo && mockArticulos.some(a => a.codigo === updates.codigo && a.id !== id)) {
        throw new Error("El código del artículo ya existe.");
    }
    articuloToUpdate = { ...articuloToUpdate, ...updates };
    mockArticulos = mockArticulos.map(a => a.id === id ? articuloToUpdate! : a);
    return simulateDelay(articuloToUpdate);
};
export const deleteArticulo = async (id: string): Promise<{ success: boolean }> => {
    mockArticulos = mockArticulos.filter(a => a.id !== id);
    return simulateDelay({ success: true });
};

// --- Eventos API ---
export const getEventos = async (): Promise<Evento[]> => simulateDelay([...mockEventos]);
export const addEvento = async (evento: Omit<Evento, 'id' | 'created_at'>): Promise<Evento> => {
    if (mockEventos.some(e => e.codigo_evento === evento.codigo_evento)) {
        throw new Error("El código del evento ya existe.");
    }
    const newEvento: Evento = {
        ...evento,
        id: `e${Math.random()}`,
        created_at: new Date().toISOString(),
    };
    mockEventos.push(newEvento);
    return simulateDelay(newEvento);
};
export const updateEvento = async (id: string, updates: Partial<Evento>): Promise<Evento> => {
    let eventoToUpdate = mockEventos.find(e => e.id === id);
    if (!eventoToUpdate) throw new Error("Evento no encontrado.");
    eventoToUpdate = { ...eventoToUpdate, ...updates };
    mockEventos = mockEventos.map(e => e.id === id ? eventoToUpdate! : e);
    return simulateDelay(eventoToUpdate);
};
export const deleteEvento = async (id: string): Promise<{ success: boolean }> => {
    mockEventos = mockEventos.filter(e => e.id !== id);
    return simulateDelay({ success: true });
};


// --- RPC Simulation ---
export const checkDisponibilidad = async (articuloId: string, cantidad: number): Promise<{ disponible: boolean, cantidad_disponible: number }> => {
    const articulo = mockArticulos.find(a => a.id === articuloId);
    if (!articulo) return { disponible: false, cantidad_disponible: 0 };
    return simulateDelay({
        disponible: articulo.cantidad_disponible >= cantidad,
        cantidad_disponible: articulo.cantidad_disponible,
    });
};

// --- Dashboard Data ---
export const getDashboardData = async () => {
    const eventsByMonth = mockEventos.reduce((acc, event) => {
        const month = new Date(event.fecha).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const incomeByCompany = mockEventos.reduce((acc, event) => {
        acc[event.compania] = (acc[event.compania] || 0) + event.total_general;
        return acc;
    }, {} as Record<string, number>);
    
    const topArticles = mockEventos.flatMap(e => e.detalles || []).reduce((acc, detail) => {
        const desc = detail.articulo_descripcion || 'Unknown';
        acc[desc] = (acc[desc] || 0) + detail.cantidad;
        return acc;
    }, {} as Record<string, number>);

    return simulateDelay({
        totalRevenue: mockEventos.reduce((sum, e) => sum + e.total_general, 0),
        upcomingEvents: mockEventos.filter(e => new Date(e.fecha) > new Date()).length,
        lowStockItems: mockArticulos.filter(a => a.cantidad_disponible < 5 && a.estado === 'activo').length,
        eventsByMonth: Object.entries(eventsByMonth).map(([name, value]) => ({ name, Eventos: value })),
        incomeByCompany: Object.entries(incomeByCompany).map(([name, value]) => ({ name, Ingresos: value })),
        topArticles: Object.entries(topArticles).map(([name, value]) => ({ name, Cantidad: value })).sort((a,b) => b.Cantidad - a.Cantidad).slice(0, 5),
    });
};
