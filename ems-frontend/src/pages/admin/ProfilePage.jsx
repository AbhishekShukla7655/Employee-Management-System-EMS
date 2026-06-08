import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Camera, Save } from 'lucide-react'
import { employeeService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/helpers'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Avatar from '../../components/common/Avatar'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminProfilePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => employeeService.getProfile().then(r => r.data),
    retry: 1,
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    values: profile,
  })

  const updateMutation = useMutation({
    mutationFn: employeeService.updateProfile,
    onSuccess: () => queryClient.invalidateQueries(['admin-profile']),
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      await employeeService.uploadImage(profile?.id || user?.id, formData)
      queryClient.invalidateQueries(['admin-profile'])
    } finally { setUploading(false) }
  }

  if (isLoading) return <LoadingSpinner />

  const p = profile || user || {}

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Profile Header Card */}
      <div className="card p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar name={`${p.firstName} ${p.lastName}`} src={p.profileImageUrl} size="2xl" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center shadow-lg transition-colors"
            >
              <Camera size={14} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{p.firstName} {p.lastName}</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{p.email}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 mt-2">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Personal Information</h3>
        <form onSubmit={handleSubmit(d => updateMutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" {...register('firstName', { required: 'Required' })} error={errors.firstName?.message} />
            <Input label="Last Name" {...register('lastName', { required: 'Required' })} error={errors.lastName?.message} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Phone" {...register('phoneNumber')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
            <Select label="Gender" options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]} {...register('gender')} />
          </div>
          <Input label="Address" {...register('address')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Education" {...register('education')} />
            <Input label="Experience (years)" type="number" {...register('experience')} />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" leftIcon={Save} loading={updateMutation.isPending || isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
