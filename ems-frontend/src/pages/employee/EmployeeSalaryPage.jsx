import { useQuery } from '@tanstack/react-query'
import { Download, DollarSign } from 'lucide-react'
import { salaryService, employeeService } from '../../services/api'
import { formatCurrency } from '../../utils/helpers'
import { generateSalarySlipPDF } from '../../utils/pdfGenerator'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { usePagination } from '../../hooks/useCommon'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function EmployeeSalaryPage() {
  const { user } = useAuth()
  const { page, size, nextPage, prevPage, goToPage } = usePagination()

  const { data, isLoading } = useQuery({
    queryKey: ['my-salary', page],
    queryFn: () => salaryService.getMySalary({ page, size }).then(r => r.data),
    retry: 1,
  })

  const { data: profile } = useQuery({
    queryKey: ['employee-profile-salary'],
    queryFn: () => employeeService.getProfile().then(r => r.data),
    retry: 1,
  })

  const salaries = data?.content || []
  const totalPages = data?.totalPages || 0

  const handleDownload = (s) => {
    generateSalarySlipPDF(s, profile || user)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Latest salary banner */}
      {salaries[0] && (
        <div className="card p-5 bg-gradient-to-r from-primary-600 to-violet-700 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-200 text-xs font-medium">Current Month Net Salary</p>
              <p className="text-white text-3xl font-bold mt-1">{formatCurrency(salaries[0].netSalary)}</p>
              <p className="text-primary-200 text-xs mt-1">{MONTHS[(salaries[0].month || 1) - 1]} {salaries[0].year}</p>
            </div>
            <Button
              variant="secondary"
              leftIcon={Download}
              onClick={() => handleDownload(salaries[0])}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Download Slip
            </Button>
          </div>
        </div>
      )}

      {/* Salary history table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <p className="font-semibold text-[var(--text-primary)] text-sm">Salary History</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="table-header text-left">Period</th>
                <th className="table-header text-right">Basic</th>
                <th className="table-header text-right">Bonus</th>
                <th className="table-header text-right">Deductions</th>
                <th className="table-header text-center">Present Days</th>
                <th className="table-header text-right">Net Salary</th>
                <th className="table-header text-center">Download</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7}><LoadingSpinner /></td></tr>
              ) : salaries.length === 0 ? (
                <tr><td colSpan={7}><EmptyState title="No salary records" icon={DollarSign} description="Your salary history will appear here." /></td></tr>
              ) : salaries.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-medium">{MONTHS[(s.month || 1) - 1]} {s.year}</td>
                  <td className="table-cell text-right text-sm">{formatCurrency(s.basicSalary)}</td>
                  <td className="table-cell text-right text-sm text-emerald-600">+{formatCurrency(s.bonus || 0)}</td>
                  <td className="table-cell text-right text-sm text-red-500">-{formatCurrency(s.deductions || 0)}</td>
                  <td className="table-cell text-center text-sm">{s.presentDays ?? '—'}/{26}</td>
                  <td className="table-cell text-right font-semibold text-primary-600">{formatCurrency(s.netSalary)}</td>
                  <td className="table-cell text-center">
                    <button
                      onClick={() => handleDownload(s)}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-emerald-600 transition-colors"
                    >
                      <Download size={14} />
                    </button>
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
    </div>
  )
}
