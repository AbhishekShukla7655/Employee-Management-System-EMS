import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDate, formatCurrency } from './helpers'

export const generateSalarySlipPDF = (salary, employee) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header background
  doc.setFillColor(79, 70, 229)
  doc.rect(0, 0, pageWidth, 45, 'F')

  // Company name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('NEXUS EMS', 14, 20)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Employee Management System', 14, 30)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('SALARY SLIP', pageWidth - 14, 20, { align: 'right' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`${getMonthName(salary.month)} ${salary.year}`, pageWidth - 14, 30, { align: 'right' })

  // Employee Info Section
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Employee Information', 14, 58)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const empDetails = [
    ['Employee Name', `${employee?.firstName || ''} ${employee?.lastName || ''}`],
    ['Employee ID', `EMP-${String(employee?.id || '').padStart(4, '0')}`],
    ['Designation', employee?.designation || '—'],
    ['Department', employee?.department || '—'],
    ['Date of Joining', formatDate(employee?.joiningDate)],
    ['Pay Period', `${getMonthName(salary.month)} ${salary.year}`],
  ]

  autoTable(doc, {
    startY: 63,
    head: [],
    body: empDetails,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: [100, 100, 100] },
      1: { cellWidth: 80 },
    },
  })

  const afterInfo = doc.lastAutoTable.finalY + 8

  // Salary Breakdown
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Salary Breakdown', 14, afterInfo)

  const earningsData = [
    ['Basic Salary', formatCurrency(salary.basicSalary)],
    ['Bonus', formatCurrency(salary.bonus || 0)],
    ['Present Days Salary', formatCurrency(
      Math.round((salary.basicSalary / 26) * (salary.presentDays || 0))
    )],
  ]

  const deductionsData = [
    ['Deductions', formatCurrency(salary.deductions || 0)],
    ['Absent Days Deduction', formatCurrency(
      Math.round((salary.basicSalary / 26) * (salary.absentDays || 0))
    )],
  ]

  autoTable(doc, {
    startY: afterInfo + 5,
    head: [['Earnings', 'Amount'], ['Deductions', 'Amount']],
    body: earningsData.map((e, i) => [...e, ...(deductionsData[i] || ['', ''])]),
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      1: { halign: 'right' },
      3: { halign: 'right' },
    },
  })

  const afterBreakdown = doc.lastAutoTable.finalY + 5

  // Attendance Summary
  autoTable(doc, {
    startY: afterBreakdown,
    head: [['Attendance Summary', '', '', '']],
    body: [
      ['Present Days', salary.presentDays || 0, 'Absent Days', salary.absentDays || 0],
      ['Working Days', 26, '', ''],
    ],
    theme: 'plain',
    headStyles: { fillColor: [241, 245, 249], textColor: [100, 100, 100], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 100, 100] },
      2: { fontStyle: 'bold', textColor: [100, 100, 100] },
    },
  })

  const afterAttendance = doc.lastAutoTable.finalY + 8

  // Net Salary
  doc.setFillColor(79, 70, 229)
  doc.roundedRect(14, afterAttendance, pageWidth - 28, 18, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Net Salary:', 20, afterAttendance + 12)
  doc.text(formatCurrency(salary.netSalary), pageWidth - 20, afterAttendance + 12, { align: 'right' })

  // Footer
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('This is a computer-generated document. No signature required.', pageWidth / 2, 285, { align: 'center' })
  doc.text(`Generated on ${formatDate(new Date())}`, pageWidth / 2, 290, { align: 'center' })

  doc.save(`salary-slip-${employee?.firstName}-${getMonthName(salary.month)}-${salary.year}.pdf`)
}

const getMonthName = (month) => {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return months[(month || 1) - 1] || 'Unknown'
}
