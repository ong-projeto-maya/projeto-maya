'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Dog, 
  Cat,
  X,
  Save,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAnimals, Animal } from '@/hooks/useAnimals'

export default function AdminAnimaisPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const { animals, isLoading, addAnimal, updateAnimal, deleteAnimal } = useAnimals()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'dog' | 'cat'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog' as 'dog' | 'cat',
    age: '',
    gender: 'male' as 'male' | 'female',
    size: 'medium' as 'small' | 'medium' | 'large',
    temperament: '',
    story: '',
    image: '',
    isAdopted: false,
    isPuppy: false,
    isRescued: false,
    isMixed: false,
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading || isLoading) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-maya-brown dark:text-white">Carregando...</p>
    </div>
  }

  if (!isAuthenticated) return null

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || animal.type === filterType
    return matchesSearch && matchesType
  })

  const handleOpenModal = (animal?: Animal) => {
    if (animal) {
      setEditingAnimal(animal)
      setFormData({
        name: animal.name,
        type: animal.type,
        age: animal.age,
        gender: animal.gender,
        size: animal.size,
        temperament: animal.temperament.join(', '),
        story: animal.story,
        image: animal.image,
        isAdopted: animal.isAdopted,
        isPuppy: animal.isPuppy,
        isRescued: animal.isRescued || false,
        isMixed: animal.isMixed || false,
      })
    } else {
      setEditingAnimal(null)
      setFormData({
        name: '',
        type: 'dog',
        age: '',
        gender: 'male',
        size: 'medium',
        temperament: '',
        story: '',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
        isAdopted: false,
        isPuppy: false,
        isRescued: false,
        isMixed: false,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAnimal(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const animalData = {
      ...formData,
      temperament: formData.temperament.split(',').map(t => t.trim()).filter(t => t),
      images: formData.image ? [formData.image] : [],
    }

    if (editingAnimal) {
      updateAnimal(editingAnimal.id, animalData)
      setSuccessMessage(`${formData.name} atualizado com sucesso!`)
    } else {
      addAnimal(animalData)
      setSuccessMessage(`${formData.name} adicionado com sucesso!`)
    }

    handleCloseModal()
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleDelete = (animal: Animal) => {
    setAnimalToDelete(animal)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!animalToDelete) return
    deleteAnimal(animalToDelete.id)
    setSuccessMessage(`${animalToDelete.name} removido com sucesso!`)
    setTimeout(() => setSuccessMessage(''), 3000)
    setShowDeleteModal(false)
    setAnimalToDelete(null)
  }

  const handleToggleAdopted = (animal: Animal) => {
    updateAnimal(animal.id, { isAdopted: !animal.isAdopted })
    setSuccessMessage(`${animal.name} marcado como ${!animal.isAdopted ? 'adotado' : 'disponível'}!`)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-maya-green hover:text-maya-green mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display text-maya-brown dark:text-white mb-2">
                Gerenciar Animais
              </h1>
              <p className="text-maya-brown/70 dark:text-gray-300">
                Adicione, edite ou remova animais para adoção
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar Animal
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-maya-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('dog')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2 ${
                  filterType === 'dog'
                    ? 'bg-maya-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Dog size={16} /> Cães
              </button>
              <button
                onClick={() => setFilterType('cat')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2 ${
                  filterType === 'cat'
                    ? 'bg-maya-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Cat size={16} /> Gatos
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal encontrado' : 'animais encontrados'}
          </p>
        </div>

        {/* Animals Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Animal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Idade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Porte
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-maya-brown dark:text-white">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600">
                          <Image
                            src={animal.image}
                            alt={animal.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-maya-brown dark:text-white">{animal.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {animal.gender === 'male' ? 'Macho' : 'Fêmea'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        {animal.type === 'dog' ? <Dog size={16} /> : <Cat size={16} />}
                        {animal.type === 'dog' ? 'Cão' : 'Gato'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{animal.age}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{
                        animal.size === 'small' ? 'Pequeno' :
                        animal.size === 'medium' ? 'Médio' : 'Grande'
                      }</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAdopted(animal)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
                          animal.isAdopted
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-maya-green/10 text-maya-green dark:bg-maya-green/20'
                        }`}
                      >
                        {animal.isAdopted ? 'Adotado' : 'Disponível'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(animal)}
                          className="p-2 hover:bg-maya-beige dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} className="text-maya-green" />
                        </button>
                        <button
                          onClick={() => handleDelete(animal)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAnimals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Nenhum animal encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && animalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-maya-brown dark:text-white">Excluir Animal</h3>
              <button onClick={() => { setShowDeleteModal(false); setAnimalToDelete(null) }} className="text-maya-brown/40 hover:text-maya-brown dark:text-gray-400 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-6">
              Tem certeza que deseja excluir <strong>{animalToDelete.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setAnimalToDelete(null) }}
                className="flex-1 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-display text-maya-brown dark:text-white">
                {editingAnimal ? 'Editar Animal' : 'Adicionar Animal'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  required
                />
              </div>

              {/* Type and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'dog' | 'cat' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  >
                    <option value="dog">Cão</option>
                    <option value="cat">Gato</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Gênero *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  >
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                  </select>
                </div>
              </div>

              {/* Age and Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Idade *
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Ex: 2 anos"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                    Porte *
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value as 'small' | 'medium' | 'large' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  >
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
              </div>

              {/* Temperament */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  Temperamento (separado por vírgula) *
                </label>
                <input
                  type="text"
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                  placeholder="Ex: Dócil, Carinhoso, Brincalhão"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  required
                />
              </div>

              {/* Story */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  História *
                </label>
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white resize-none"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-2">
                  URL da Imagem *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-maya-green focus:outline-none bg-white dark:bg-gray-700 text-maya-brown dark:text-white"
                  required
                />
              </div>

              {/* Badges Section */}
              <div>
                <label className="block text-sm font-semibold text-maya-brown dark:text-white mb-3">
                  Badges (Selos) do Animal
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Selecione as badges que serão exibidas no card do animal
                </p>
                
                {/* Badge Preview */}
                {(formData.isAdopted || formData.isRescued || formData.isPuppy || formData.isMixed) && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs font-semibold text-maya-brown dark:text-white mb-2">Prévia da Badge:</p>
                    <div className="flex gap-2">
                      {formData.isAdopted && (
                        <div className="relative w-20 h-20">
                          <Image
                            src="/images/badge-adotado.png"
                            alt="Adotado"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      {(formData.isRescued || formData.isPuppy) && !formData.isAdopted && (
                        <div className="relative w-20 h-20">
                          <Image
                            src="/images/badge-novo-resgatado.png"
                            alt="Resgatado"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      {formData.isMixed && !formData.isAdopted && (
                        <div className="relative w-20 h-20">
                          <Image
                            src="/images/badge-sem-raca.png"
                            alt="SRD"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                    formData.isAdopted 
                      ? 'border-maya-green bg-maya-green/5' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-green'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isAdopted}
                      onChange={(e) => setFormData({ ...formData, isAdopted: e.target.checked })}
                      className="w-5 h-5 text-maya-green rounded focus:ring-maya-green mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-maya-brown dark:text-white block">🎉 Adotado</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Badge verde "ADOTADO"</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                    formData.isRescued 
                      ? 'border-maya-green bg-maya-green/5' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-green'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isRescued}
                      onChange={(e) => setFormData({ ...formData, isRescued: e.target.checked })}
                      className="w-5 h-5 text-maya-green rounded focus:ring-maya-green mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-maya-brown dark:text-white block">🆘 Resgatado</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Badge "NOVO / RESGATADO"</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                    formData.isPuppy 
                      ? 'border-maya-green bg-maya-green/5' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-green'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isPuppy}
                      onChange={(e) => setFormData({ ...formData, isPuppy: e.target.checked })}
                      className="w-5 h-5 text-maya-green rounded focus:ring-maya-green mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-maya-brown dark:text-white block">🐾 Filhote/Novo</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Badge "NOVO / RESGATADO"</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                    formData.isMixed 
                      ? 'border-maya-green bg-maya-green/5' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-green'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isMixed}
                      onChange={(e) => setFormData({ ...formData, isMixed: e.target.checked })}
                      className="w-5 h-5 text-maya-green rounded focus:ring-maya-green mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-maya-brown dark:text-white block">🌈 SRD</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Badge "SEM RAÇA DEFINIDA"</span>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-maya-brown/60 dark:text-gray-400 mt-3 italic">
                  💡 Se nenhuma badge for selecionada, será exibida a badge padrão "QUER ME ADOTAR?"
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingAnimal ? 'Salvar Alterações' : 'Adicionar Animal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
