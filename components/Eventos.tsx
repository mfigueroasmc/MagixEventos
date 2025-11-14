
import React, { useState, useEffect, useCallback } from 'react';
import type { Evento } from '../types';
import { getEventos, deleteEvento } from '../services/supabaseService';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import { useNotifications } from '../hooks/useNotifications';

// NOTE: A full-featured Event Modal would be very complex, involving article search,
// availability checks, and dynamic total calculations. This component is a simplified
// representation to demonstrate the module's structure.
const Eventos: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotifications();

    const fetchEventos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getEventos();
            setEventos(data);
        } catch (error) {
            notify('Error fetching events.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [notify]);

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvento(id);
                notify('Event deleted successfully!', 'success');
                fetchEventos();
            } catch (error) {
                notify('Error deleting event.', 'error');
                console.error(error);
            }
        }
    };

    const handleEdit = (evento: Evento) => {
      notify(`Editing for event "${evento.codigo_evento}" is not implemented yet.`, 'info');
    }

    const handleAddNew = () => {
      notify("Creating a new event is not implemented yet.", 'info');
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Events Management</h1>
                <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    New Event
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Código</th>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Compañía</th>
                                <th scope="col" className="px-6 py-3">Salón</th>
                                <th scope="col" className="px-6 py-3 text-right">Total</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center p-8">Loading events...</td></tr>
                            ) : eventos.map(e => (
                                <tr key={e.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{e.codigo_evento}</td>
                                    <td className="px-6 py-4">{new Date(e.fecha).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{e.compania}</td>
                                    <td className="px-6 py-4">{e.salon}</td>
                                    <td className="px-6 py-4 text-right font-semibold">${e.total_general.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                        <button onClick={() => handleEdit(e)} className="p-2 text-blue-600 hover:text-blue-800"><EditIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleDelete(e.id)} className="p-2 text-red-600 hover:text-red-800"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Eventos;
