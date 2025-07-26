import React from 'react'
import { CarModel } from '../lib/supabase'
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react'
import { calculateCompletionPercentage } from '../lib/utils'

interface DashboardProps {
  carModels: CarModel[]
  selectedBrand?: string
  selectedCollaborateur?: string
}

export function Dashboard({ carModels, selectedBrand, selectedCollaborateur }: DashboardProps) {
  // Filtrer les données selon les filtres actifs
  const filteredModels = carModels.filter(model => {
    if (selectedBrand && model.brand_label !== selectedBrand) return false
    if (selectedCollaborateur && model.collaborateur !== selectedCollaborateur) return false
    return true
  })

  // Calculer les statistiques
  const stats = {
    total: filteredModels.length,
    pasEncore: filteredModels.filter(m => m.status === 'Pas encore').length,
    enCours: filteredModels.filter(m => m.status === 'En cours').length,
    termine: filteredModels.filter(m => m.status === 'Terminé').length,
    horsCible: filteredModels.filter(m => m.status === 'Hors cible').length,
    aPasGenerer: filteredModels.filter(m => m.status === 'À ne pas générer').length,
  }

  const completionPercentage = calculateCompletionPercentage(
    stats.total,
    stats.termine,
    stats.horsCible,
    stats.aPasGenerer
  )

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    bgColor 
  }: { 
    title: string
    value: number
    icon: React.ElementType
    color: string
    bgColor: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Suivi de génération de contenus automobile
          </h1>
          <p className="text-gray-600">
            Gérez l'avancement de la création de contenus pour chaque modèle
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-sm text-gray-600">Taux de finalisation</p>
            <p className="text-2xl font-bold text-green-600">{completionPercentage}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-green-500"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total"
          value={stats.total}
          icon={Target}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Pas encore"
          value={stats.pasEncore}
          icon={BarChart3}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="En cours"
          value={stats.enCours}
          icon={TrendingUp}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatCard
          title="Terminé"
          value={stats.termine}
          icon={Users}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Hors cible"
          value={stats.horsCible}
          icon={Target}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      {/* Graphique en barres simple */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
        <div className="space-y-3">
          {[
            { label: 'Pas encore', value: stats.pasEncore, color: 'bg-blue-500' },
            { label: 'En cours', value: stats.enCours, color: 'bg-orange-500' },
            { label: 'Terminé', value: stats.termine, color: 'bg-green-500' },
            { label: 'Hors cible', value: stats.horsCible, color: 'bg-red-500' },
            { label: 'À ne pas générer', value: stats.aPasGenerer, color: 'bg-gray-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600">{label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className={`${color} h-4 rounded-full transition-all duration-300`}
                  style={{ width: `${stats.total > 0 ? (value / stats.total) * 100 : 0}%` }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-gray-900">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}