
import React, { useState, useEffect, useCallback } from 'react';
import type { Articulo } from '../types';
import { getArticulos, addArticulo, updateArticulo, deleteArticulo } from '../services/supabaseService';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import CloseIcon from './icons/CloseIcon';
import { useNotifications } from '../hooks/useNotifications';

const ArticuloModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (articulo: Articulo | Omit<Articulo, 'id' | 'created_at'>) => void;
    articulo: Articulo | null;
}> = ({ isOpen, onClose, onSave, articulo }) => {
    const [formData, setFormData] = useState<Omit<Articulo, 'id' | 'created_at'>>({
        codigo: '', descripcion: '', tipo: 'propio', valor: 0, cantidad_total: 0, cantidad_disponible: 0, estado: 'activo'
    });

    useEffect(() => {
        if (articulo) {
            setFormData(articulo);
        } else {
            setFormData({
                codigo: '', descripcion: '', tipo: 'propio', valor: 0, cantidad_total: 0, cantidad_disponible: 0, estado: 'activo'
            });
        }
    }, [articulo]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumber = ['valor', 'cantidad_total', 'cantidad_disponible'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(articulo ? { ...formData, id: articulo.id } : formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{articulo ? 'Edit Article' : 'New Article'}</h2>
                    <button onClick={onClose}><CloseIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Código" required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="propio">Propio</option>
                            <option value="subarriendo">Subarriendo</option>
                        </select>
                        <input type="number" name="valor" value={formData.valor} onChange={handleChange} placeholder="Valor" required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input type="number" name="cantidad_total" value={formData.cantidad_total} onChange={handleChange} placeholder="Cantidad Total" required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input type="number" name="cantidad_disponible" value={formData.cantidad_disponible} onChange={handleChange} placeholder="Cantidad Disponible" required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700">{articulo ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Articulos: React.FC = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticulo, setEditingArticulo] = useState<Articulo | null>(null);
    const notify = useNotifications();

    const fetchArticulos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getArticulos();
            setArticulos(data);
        } catch (error) {
            notify('Error fetching articles.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [notify]);

    useEffect(() => {
        fetchArticulos();
    }, [fetchArticulos]);

    const handleSave = async (articuloData: Articulo | Omit<Articulo, 'id'| 'created_at'>) => {
        try {
            if ('id' in articuloData) {
                await updateArticulo(articuloData.id, articuloData);
                notify('Article updated successfully!', 'success');
            } else {
                await addArticulo(articuloData);
                notify('Article created successfully!', 'success');
            }
            fetchArticulos();
            setIsModalOpen(false);
            setEditingArticulo(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            notify(message, 'error');
            console.error(error);
        }
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this article?')) {
            try {
                await deleteArticulo(id);
                notify('Article deleted successfully!', 'success');
                fetchArticulos();
            } catch (error) {
                notify('Error deleting article.', 'error');
                console.error(error);
            }
        }
    };

    const openModalForEdit = (articulo: Articulo) => {
        setEditingArticulo(articulo);
        setIsModalOpen(true);
    };

    const openModalForNew = () => {
        setEditingArticulo(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Articles Management</h1>
                <button onClick={openModalForNew} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    New Article
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Código</th>
                                <th scope="col" className="px-6 py-3">Descripción</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3 text-right">Valor</th>
                                <th scope="col" className="px-6 py-3 text-center">Disponibilidad</th>
                                <th scope="col" className="px-6 py-3 text-center">Estado</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center p-8">Loading articles...</td></tr>
                            ) : articulos.map(a => (
                                <tr key={a.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{a.codigo}</td>
                                    <td className="px-6 py-4">{a.descripcion}</td>
                                    <td className="px-6 py-4 capitalize">{a.tipo}</td>
                                    <td className="px-6 py-4 text-right">${a.valor.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">{a.cantidad_disponible} / {a.cantidad_total}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${a.estado === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {a.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                        <button onClick={() => openModalForEdit(a)} className="p-2 text-blue-600 hover:text-blue-800"><EditIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600 hover:text-red-800"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ArticuloModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} articulo={editingArticulo} />
        </div>
    );
};

export default Articulos;
