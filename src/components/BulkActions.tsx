import React, { useState } from 'react'
import { Users, Edit3, UserPlus } from 'lucide-react'
import { CarModel, STATUS_OPTIONS, COLLABORATEUR_OPTIONS, supabase } from '../lib/supabase'

interface BulkActionsProps {
  selectedIds: string[]
  carModels: CarModel[]
  onUpdate: () => void
  onClearSelection: () => void
}

export function BulkActions({ selectedIds, carModels, onUpdate, onClearSelection }: BulkActionsProps) {
  const [bulkStatus, setBulkStatus] = useState('')
  const [bulkCollaborateur, setBulkCollaborateur] = useState('')
  const [assignBrand, setAssignBrand] = useState('')
  const [assignCollaborateur, setAssignCollaborateur] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const uniqueBrands = Array.from(new Set(carModels.map(model => model.brand_label))).sort()

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedIds.length === 0) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('car_models')
        .update({ status: bulkStatus })
        .in('id', selectedIds)

      if (error) throw error

      setBulkStatus('')
      onClearSelection()
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      alert('Erreur lors de la mise à jour du statut')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkCollaborateurUpdate = async () => {
    if (!bulkCollaborateur || selectedIds.length === 0) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('car_models')
        .update({ collaborateur: bulkCollaborateur === 'null' ? null : bulkCollaborateur })
        .in('id', selectedIds)

      if (error) throw error

      setBulkCollaborateur('')
      onClearSelection()
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du collaborateur:', error)
      alert('Erreur lors de la mise à jour du collaborateur')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBrandAssignment = async () => {
    if (!assignBrand || !assignCollaborateur) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('car_models')
        .update({ collaborateur: assignCollaborateur === 'null' ? null : assignCollaborateur })
        .eq('brand_label', assignBrand)

      if (error) throw error

      setAssignBrand('')
      setAssignCollaborateur('')
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de l\'affectation par marque:', error)
      alert('Erreur lors de l\'affectation par marque')
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedIds.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <UserPlus className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Affectation par marque</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marque
            </label>
            <select
              value={assignBrand}
              onChange={(e) => setAssignBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une marque</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>
                  {brand} ({carModels.filter(m => m.brand_label === brand).length} modèles)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collaborateur
            </label>
            <select
              value={assignCollaborateur}
              onChange={(e) => setAssignCollaborateur(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un collaborateur</option>
              <option value="null">Non assigné</option>
              {COLLABORATEUR_OPTIONS.map(collaborateur => (
                <option key={collaborateur} value={collaborateur}>
                  {collaborateur}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={handleBrandAssignment}
              disabled={!assignBrand || !assignCollaborateur || isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Affectation...' : 'Assigner'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Edit3 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Actions groupées ({selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''})
          </h3>
        </div>
        <button
          onClick={onClearSelection}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Désélectionner tout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modification groupée du statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Changer le statut
          </label>
          <div className="flex space-x-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un statut</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkStatusUpdate}
              disabled={!bulkStatus || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Mise à jour...' : 'Appliquer'}
            </button>
          </div>
        </div>

        {/* Modification groupée du collaborateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Changer le collaborateur
          </label>
          <div className="flex space-x-2">
            <select
              value={bulkCollaborateur}
              onChange={(e) => setBulkCollaborateur(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un collaborateur</option>
              <option value="null">Non assigné</option>
              {COLLABORATEUR_OPTIONS.map(collaborateur => (
                <option key={collaborateur} value={collaborateur}>
                  {collaborateur}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkCollaborateurUpdate}
              disabled={!bulkCollaborateur || isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Mise à jour...' : 'Appliquer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}