import React from 'react'
import { Filter, X } from 'lucide-react'
import { CarModel, COLLABORATEUR_OPTIONS } from '../lib/supabase'

interface FiltersProps {
  carModels: CarModel[]
  selectedBrand: string
  selectedStatus: string
  selectedCollaborateur: string
  onBrandChange: (brand: string) => void
  onStatusChange: (status: string) => void
  onCollaborateurChange: (collaborateur: string) => void
  onClearFilters: () => void
}

export function Filters({
  carModels,
  selectedBrand,
  selectedStatus,
  selectedCollaborateur,
  onBrandChange,
  onStatusChange,
  onCollaborateurChange,
  onClearFilters
}: FiltersProps) {
  // Extraire les marques uniques
  const uniqueBrands = Array.from(new Set(carModels.map(model => model.brand_label))).sort()
  
  const statusOptions = ['Pas encore', 'En cours', 'Terminé', 'Hors cible', 'À ne pas générer']

  const hasActiveFilters = selectedBrand || selectedStatus || selectedCollaborateur

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Effacer les filtres</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtre par marque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marque
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les marques</option>
            {uniqueBrands.map(brand => (
              <option key={brand} value={brand}>
                {brand} ({carModels.filter(m => m.brand_label === brand).length})
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status} ({carModels.filter(m => m.status === status).length})
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par collaborateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collaborateur
          </label>
          <select
            value={selectedCollaborateur}
            onChange={(e) => onCollaborateurChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les collaborateurs</option>
            <option value="null">Non assigné</option>
            {COLLABORATEUR_OPTIONS.map(collaborateur => (
              <option key={collaborateur} value={collaborateur}>
                {collaborateur} ({carModels.filter(m => m.collaborateur === collaborateur).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedBrand && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Marque: {selectedBrand}
              <button
                onClick={() => onBrandChange('')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedStatus && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Statut: {selectedStatus}
              <button
                onClick={() => onStatusChange('')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedCollaborateur && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Collaborateur: {selectedCollaborateur === 'null' ? 'Non assigné' : selectedCollaborateur}
              <button
                onClick={() => onCollaborateurChange('')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}