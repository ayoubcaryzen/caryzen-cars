import React, { useState } from 'react'
import { CarModel, STATUS_OPTIONS, COLLABORATEUR_OPTIONS, supabase } from '../lib/supabase'
import { getStatusColor, cn } from '../lib/utils'
import { Check, Square, CheckSquare, Edit2, Save, X } from 'lucide-react'

interface CarModelsTableProps {
  carModels: CarModel[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onUpdate: () => void
}

export function CarModelsTable({ carModels, selectedIds, onSelectionChange, onUpdate }: CarModelsTableProps) {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleSelectAll = () => {
    if (selectedIds.length === carModels.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(carModels.map(model => model.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const startEditing = (id: string, field: string, currentValue: string) => {
    setEditingCell({ id, field })
    setEditValue(currentValue || '')
  }

  const cancelEditing = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const saveEdit = async () => {
    if (!editingCell) return

    try {
      const updateData: any = {}
      updateData[editingCell.field] = editingCell.field === 'collaborateur' && editValue === 'null' ? null : editValue

      const { error } = await supabase
        .from('car_models')
        .update(updateData)
        .eq('id', editingCell.id)

      if (error) throw error

      setEditingCell(null)
      setEditValue('')
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const isAllSelected = carModels.length > 0 && selectedIds.length === carModels.length
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < carModels.length

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Modèles de voitures ({carModels.length})
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onSelectionChange([])}
              disabled={selectedIds.length === 0}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Tout désélectionner
            </button>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : isPartiallySelected ? (
                    <div className="w-5 h-5 border-2 border-gray-400 rounded bg-gray-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modèle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commentaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {carModels.map((model) => (
              <tr
                key={model.id}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  selectedIds.includes(model.id) && 'bg-blue-50'
                )}
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleSelectOne(model.id)}
                    className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {selectedIds.includes(model.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {model.brand_label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {model.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell?.id === model.id && editingCell?.field === 'status' ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(model.id, 'status', model.status)}
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border group hover:shadow-sm transition-all',
                        getStatusColor(model.status)
                      )}
                    >
                      {model.status}
                      <Edit2 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingCell?.id === model.id && editingCell?.field === 'commentaire' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1"
                        placeholder="Ajouter un commentaire..."
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(model.id, 'commentaire', model.commentaire)}
                      className="text-sm text-gray-900 hover:text-blue-600 transition-colors group flex items-center max-w-xs truncate"
                    >
                      {model.commentaire || 'Ajouter un commentaire...'}
                      <Edit2 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell?.id === model.id && editingCell?.field === 'collaborateur' ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      >
                        <option value="null">Non assigné</option>
                        {COLLABORATEUR_OPTIONS.map(collaborateur => (
                          <option key={collaborateur} value={collaborateur}>
                            {collaborateur}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(model.id, 'collaborateur', model.collaborateur || 'null')}
                      className="text-sm text-gray-900 hover:text-blue-600 transition-colors group flex items-center"
                    >
                      {model.collaborateur || 'Non assigné'}
                      <Edit2 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {carModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun modèle trouvé</p>
        </div>
      )}
    </div>
  )
}