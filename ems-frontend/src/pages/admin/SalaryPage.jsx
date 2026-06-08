import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Plus, Search, Download, Eye } from 'lucide-react'
import { salaryService, employeeService } from '../../services/api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { generateSalarySlipPDF } from '../../utils/pdfGenerator'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { useSearch, usePagination, useModal } from '../../hooks/useCommon'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'].map((l, i) => ({ value: i + 1, label: l }))

export default function SalaryPage() {
  const queryClient = useQueryClient()
  const { value: search, debouncedValue: dSearch, onChange } = useSearch()
  const { page, size, nextPage, prevPage, goToPage } = usePagination()
  const formModal = useModal()
  const viewModal = useModal()

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { month: new Date().getMonth() + 1, year: new Date().getFullYear() }
  })

  const { data, isLoading } = useQuery({
    queryKey: ['salaries', dSearch, page],
    queryFn: () => salaryService.getAll({ search: dSearch, page, size }).then(r => r.data),
    retry: 1,
  })

  const { data: employees } = useQuery({
    queryKey: ['employees-list'],
    queryFn: () => employeeService.getAll({ size: 200 }).then(r => r.data?.content || []),
    retry: 1,
  })

  const generateMutation = useMutation({
    mutationFn: salaryService.generate,
    onSuccess: () => { queryClient.invalidateQueries(['salaries']); formModal.close(); reset() },
  })

  const salaries = data?.content || []
  const totalPages = data?.totalPages || 0
  const employeeOptions = (employees || []).map(e => ({ value: e.id, label: `${e.firstName} ${e.lastName}` }))

  const handleDownload = (salary) => {
    const emp = (employees || []).find(e => e.id === salary.employeeId)
    generateSalarySlipPDF(salary, emp || { firstName: 'Employee', id: salary.employeeId })
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input value={search} onChange={onChange} placeholder="Search salary records..." className="input pl-9" />
        </div>
        <Button leftIcon={Plus} onClick={() => { reset(); formModal.open(null) }}>Generate Salary</Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="table-header text-left">Employee</th>
                <th className="table-header text-left">Period</th>
                <th className="table-header text-right">Basic</th>
                <th className="table-header text-right">Bonus</th>
                <th className="table-header text-right">Deductions</th>
                <th className="table-header text-right">Net Salary</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7}><LoadingSpinner /></td></tr>
              ) : salaries.length === 0 ? (
                <tr><td colSpan={7}><EmptyState title="No salary records" description="Generate salary for employees." /></td></tr>
              ) : salaries.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-medium text-[var(--text-primary)]">{s.employeeName || `EMP-${s.employeeId}`}</td>
                  <td className="table-cell text-[var(--text-secondary)]">{MONTHS.find(m => m.value === s.month)?.label} {s.year}</td>
                  <td className="table-cell text-right text-sm">{formatCurrency(s.basicSalary)}</td>
                  <td className="table-cell text-right text-sm text-emerald-600">+{formatCurrency(s.bonus || 0)}</td>
                  <td className="table-cell text-right text-sm text-red-500">-{formatCurrency(s.deductions || 0)}</td>
                  <td className="table-cell text-right font-semibold text-[var(--text-primary)]">{formatCurrency(s.netSalary)}</td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => viewModal.open(s)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-primary-600 transition-colors"><Eye size={14} /></button>
                      <button onClick={() => handleDownload(s)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-emerald-600 transition-colors"><Download size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-secondary)]">Page {page + 1} of {totalPages}</p>
            <Pagination page={page} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} onGoTo={goToPage} />
          </div>
        )}
      </div>

      <Modal isOpen={formModal.isOpen} onClose={formModal.close} title="Generate Salary" size="md">
        <form onSubmit={handleSubmit(d => generateMutation.mutate(d))} className="space-y-4">
          <Select label="Employee" options={employeeOptions} placeholder="Select employee..." error={errors.employeeId?.message} {...register('employeeId', { required: 'Required' })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Month" options={MONTHS} error={errors.month?.message} {...register('month', { required: 'Required', valueAsNumber: true })} />
            <Input label="Year" type="number" defaultValue={new Date().getFullYear()} {...register('year', { required: 'Required', valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Basic Salary (₹)" type="number" error={errors.basicSalary?.message} {...register('basicSalary', { required: 'Required', valueAsNumber: true })} />
            <Input label="Bonus (₹)" type="number" defaultValue={0} {...register('bonus', { valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Deductions (₹)" type="number" defaultValue={0} {...register('deductions', { valueAsNumber: true })} />
            <Input label="Present Days" type="number" defaultValue={26} {...register('presentDays', { valueAsNumber: true })} />
            <Input label="Absent Days" type="number" defaultValue={0} {...register('absentDays', { valueAsNumber: true })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={formModal.close}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={generateMutation.isPending}>Generate</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={viewModal.isOpen} onClose={viewModal.close} title="Salary Details" size="sm">
        {viewModal.data && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Employee', viewModal.data.employeeName],
                ['Period', `${MONTHS.find(m => m.value === viewModal.data.month)?.label} ${viewModal.data.year}`],
                ['Basic Salary', formatCurrency(viewModal.data.basicSalary)],
                ['Bonus', formatCurrency(viewModal.data.bonus || 0)],
                ['Deductions', formatCurrency(viewModal.data.deductions || 0)],
                ['Present Days', viewModal.data.presentDays],
                ['Absent Days', viewModal.data.absentDays],
                ['Net Salary', formatCurrency(viewModal.data.netSalary)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-[var(--text-secondary)]">{k}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{v ?? '—'}</p>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[var(--border)]">
              <Button className="w-full justify-center" leftIcon={Download} onClick={() => handleDownload(viewModal.data)}>
                Download Slip
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
