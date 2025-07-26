import React, { useState, useEffect } from 'react'
import { supabase, CarModel } from './lib/supabase'
import { Dashboard } from './components/Dashboard'
import { Filters } from './components/Filters'
import { BulkActions } from './components/BulkActions'
import { CarModelsTable } from './components/CarModelsTable'
import { DataImporter } from './components/DataImporter'

function App() {
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [filteredModels, setFilteredModels] = useState<CarModel[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [needsImport, setNeedsImport] = useState(false)

  // États des filtres
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCollaborateur, setSelectedCollaborateur] = useState('')

  // Charger les données
  const loadData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('car_models')
        .select('*')
        .order('brand_label', { ascending: true })
        .order('label', { ascending: true })

      if (error) throw error

      setCarModels(data || [])
      setNeedsImport(data?.length === 0)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setNeedsImport(true)
    } finally {
      setLoading(false)
    }
  }

  // Appliquer les filtres
  useEffect(() => {
    let filtered = carModels

    if (selectedBrand) {
      filtered = filtered.filter(model => model.brand_label === selectedBrand)
    }

    if (selectedStatus) {
      filtered = filtered.filter(model => model.status === selectedStatus)
    }

    if (selectedCollaborateur) {
      if (selectedCollaborateur === 'null') {
        filtered = filtered.filter(model => model.collaborateur === null)
      } else {
        filtered = filtered.filter(model => model.collaborateur === selectedCollaborateur)
      }
    }

    setFilteredModels(filtered)
    // Nettoyer la sélection si les éléments sélectionnés ne sont plus visibles
    setSelectedIds(prev => prev.filter(id => filtered.some(model => model.id === id)))
  }, [carModels, selectedBrand, selectedStatus, selectedCollaborateur])

  // Charger les données au montage
  useEffect(() => {
    loadData()
  }, [])

  const handleClearFilters = () => {
    setSelectedBrand('')
    setSelectedStatus('')
    setSelectedCollaborateur('')
  }

  const handleImportComplete = () => {
    setNeedsImport(false)
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (needsImport) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <DataImporter onImportComplete={handleImportComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Dashboard */}
          <Dashboard 
            carModels={carModels}
            selectedBrand={selectedBrand}
            selectedCollaborateur={selectedCollaborateur}
          />

          {/* Filtres */}
          <Filters
            carModels={carModels}
            selectedBrand={selectedBrand}
            selectedStatus={selectedStatus}
            selectedCollaborateur={selectedCollaborateur}
            onBrandChange={setSelectedBrand}
            onStatusChange={setSelectedStatus}
            onCollaborateurChange={setSelectedCollaborateur}
            onClearFilters={handleClearFilters}
          />

          {/* Actions groupées */}
          <BulkActions
            selectedIds={selectedIds}
            carModels={carModels}
            onUpdate={loadData}
            onClearSelection={() => setSelectedIds([])}
          />

          {/* Tableau */}
          <CarModelsTable
            carModels={filteredModels}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onUpdate={loadData}
          />
        </div>
      </div>
    </div>
  )
}

export default App