import React, { useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface DataImporterProps {
  onImportComplete: () => void
}

export function DataImporter({ onImportComplete }: DataImporterProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importMessage, setImportMessage] = useState('')

  const importData = async () => {
    setIsImporting(true)
    setImportStatus('idle')
    
    try {
      // Charger le fichier JSON
      const response = await fetch('/cars-brands-models.json')
      if (!response.ok) {
        throw new Error('Impossible de charger le fichier JSON')
      }
      
      const jsonData = await response.json()
      
      if (!jsonData.data || !Array.isArray(jsonData.data)) {
        throw new Error('Format de données invalide')
      }

      // Préparer les données pour l'insertion
      const carModels = jsonData.data.map((item: any) => ({
        id: item.id,
        label: item.label,
        brand_label: item.brandLabel,
        brand_id: item.brandId,
        status: 'Pas encore',
        commentaire: '',
        collaborateur: null
      }))

      // Insérer les données dans Supabase (avec upsert pour éviter les doublons)
      const { error } = await supabase
        .from('car_models')
        .upsert(carModels, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })

      if (error) throw error

      setImportStatus('success')
      setImportMessage(`${carModels.length} modèles importés avec succès !`)
      onImportComplete()
      
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      setImportStatus('error')
      setImportMessage(error instanceof Error ? error.message : 'Erreur lors de l\'import')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Importer les données
        </h3>
        <p className="text-gray-600 mb-6">
          Cliquez sur le bouton ci-dessous pour importer les modèles de voitures depuis le fichier JSON.
        </p>
        
        <button
          onClick={importData}
          disabled={isImporting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isImporting ? (
            <>
              <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Import en cours...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Importer les données
            </>
          )}
        </button>

        {importStatus === 'success' && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{importMessage}</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="mt-4 flex items-center justify-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{importMessage}</span>
          </div>
        )}
      </div>
    </div>
  )
}