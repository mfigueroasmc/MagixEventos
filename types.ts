
export interface Articulo {
    id: string;
    codigo: string;
    descripcion: string;
    tipo: 'propio' | 'subarriendo';
    valor: number;
    cantidad_total: number;
    cantidad_disponible: number;
    estado: 'activo' | 'inactivo';
    created_at?: string;
}

export interface EventoDetalle {
    id: string;
    evento_id: string;
    articulo_id: string;
    articulo_descripcion?: string; // For display purposes
    cantidad: number;
    valor_unitario: number;
    subtotal: number;
}

export interface Evento {
    id: string;
    codigo_evento: string;
    fecha: string; // YYYY-MM-DD
    descripcion: string;
    salon: string;
    compania: string;
    total_neto: number;
    iva: number;
    total_general: number;
    created_at?: string;
    detalles?: EventoDetalle[];
}

export interface Reserva {
    id: string;
    evento_id: string;
    articulo_id: string;
    fecha_inicio: string; // YYYY-MM-DD
    fecha_fin: string; // YYYY-MM-DD
    cantidad: number;
    estado: 'reservado' | 'devuelto';
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    isLoading?: boolean;
}
