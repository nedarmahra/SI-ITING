import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { PetaJabatanTable } from './components/PetaJabatanTable';
import { BukuPegawaiTable } from './components/BukuPegawaiTable';
import { SimulasiRedistribusi } from './components/SimulasiRedistribusi';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { ExcelManagerModal } from './components/ExcelManagerModal';
import { INITIAL_EMPLOYEES, INITIAL_JABATAN_FORMASI, INITIAL_OPD_LIST } from './data/initialData';
import { Employee, JabatanFormasi, Opd } from './types/bezetting';
import { exportBukuBezettingExcel } from './utils/excelExport';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  // State initialization with localStorage fallback
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('si_iting_employees');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMPLOYEES;
  });

  const [jabatanList, setJabatanList] = useState<JabatanFormasi[]>(() => {
    try {
      const saved = localStorage.getItem('si_iting_jabatan');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_JABATAN_FORMASI;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'peta' | 'pegawai' | 'simulasi'>('dashboard');

  // Modals state
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('si_iting_employees', JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem('si_iting_jabatan', JSON.stringify(jabatanList));
    } catch (e) {
      console.error(e);
    }
  }, [jabatanList]);

  // Recalculate OPD statistics dynamically based on active employees & jabatan
  const opdList: Opd[] = useMemo(() => {
    return INITIAL_OPD_LIST.map((opd) => {
      const opdEmployees = employees.filter((e) => e.opdId === opd.id);
      const opdJabatan = jabatanList.filter((j) => j.opdId === opd.id);

      const totalPns = opdEmployees.filter((e) => e.jenisPegawai === 'PNS').length;
      const totalPppk = opdEmployees.filter((e) => e.jenisPegawai === 'PPPK').length;
      const totalBezetting = opdEmployees.length;

      // Calculate total kebutuhan ABK from jabatan, or fallback to standard opd kebutuhan
      const calculatedAbk = opdJabatan.length > 0 
        ? opdJabatan.reduce((acc, curr) => acc + curr.kebutuhanABK, 0)
        : opd.totalKebutuhanABK;

      const selisih = totalBezetting - calculatedAbk;

      return {
        ...opd,
        totalKebutuhanABK: calculatedAbk,
        totalPns,
        totalPppk,
        totalBezetting,
        selisih,
      };
    });
  }, [employees, jabatanList]);

  // Total Summary
  const totalAsn = employees.length;
  const totalKebutuhan = opdList.reduce((acc, curr) => acc + curr.totalKebutuhanABK, 0);

  // Handlers
  const handleExportExcel = () => {
    exportBukuBezettingExcel(employees, jabatanList, opdList);
    showToast('Rekapitulasi Bezetting KBB berhasil diekspor ke format Excel (.xlsx)!');
  };

  const handleUpdateJabatan = (updated: JabatanFormasi) => {
    setJabatanList((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    showToast(`Formasi untuk jabatan ${updated.namaJabatan} berhasil diperbarui.`);
  };

  const handleAddJabatan = (newJabatanData: Omit<JabatanFormasi, 'id' | 'bezettingTotal' | 'selisih' | 'status'>) => {
    const total = newJabatanData.bezettingPns + newJabatanData.bezettingPppk;
    const selisih = total - newJabatanData.kebutuhanABK;
    const status = selisih === 0 ? 'Sesuai' : selisih > 0 ? 'Lebih' : 'Kurang';

    const newJabatan: JabatanFormasi = {
      ...newJabatanData,
      id: `jab-${Date.now()}`,
      bezettingTotal: total,
      selisih,
      status,
    };

    setJabatanList((prev) => [newJabatan, ...prev]);
    showToast(`Formasi jabatan "${newJabatan.namaJabatan}" berhasil ditambahkan.`);
  };

  const handleSaveEmployee = (savedEmployee: Employee) => {
    const isEdit = employees.some((e) => e.id === savedEmployee.id);
    if (isEdit) {
      setEmployees((prev) => prev.map((e) => (e.id === savedEmployee.id ? savedEmployee : e)));
      showToast(`Data pegawai ${savedEmployee.nama} berhasil diperbarui.`);
    } else {
      setEmployees((prev) => [savedEmployee, ...prev]);
      showToast(`Pegawai baru ${savedEmployee.nama} berhasil dicatat ke Buku Bezetting.`);
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const target = employees.find((e) => e.id === employeeId);
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
    showToast(`Data pegawai ${target?.nama || ''} telah dihapus dari sistem.`);
  };

  const handleImportSuccess = (newEmployees: Employee[]) => {
    setEmployees((prev) => [...newEmployees, ...prev]);
    showToast(`Berhasil mengimpor ${newEmployees.length} data pegawai ke dalam sistem!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 text-xs font-medium flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportExcel={handleExportExcel}
        onOpenImport={() => setIsExcelModalOpen(true)}
        onOpenAddPegawai={() => {
          setEmployeeToEdit(null);
          setIsFormModalOpen(true);
        }}
        totalAsn={totalAsn}
        totalKebutuhan={totalKebutuhan}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <ExecutiveSummary
            employees={employees}
            jabatanList={jabatanList}
            opdList={opdList}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'peta' && (
          <PetaJabatanTable
            jabatanList={jabatanList}
            opdList={opdList}
            onUpdateJabatan={handleUpdateJabatan}
            onAddJabatan={handleAddJabatan}
          />
        )}

        {activeTab === 'pegawai' && (
          <BukuPegawaiTable
            employees={employees}
            opdList={opdList}
            onSelectEmployee={(emp) => setSelectedEmployeeForDetail(emp)}
            onEditEmployee={(emp) => {
              setEmployeeToEdit(emp);
              setIsFormModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            onOpenAddModal={() => {
              setEmployeeToEdit(null);
              setIsFormModalOpen(true);
            }}
          />
        )}

        {activeTab === 'simulasi' && (
          <SimulasiRedistribusi
            employees={employees}
            jabatanList={jabatanList}
            opdList={opdList}
          />
        )}
      </main>

      {/* Modals */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        onClose={() => setSelectedEmployeeForDetail(null)}
        onEdit={(emp) => {
          setEmployeeToEdit(emp);
          setIsFormModalOpen(true);
        }}
      />

      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
        opdList={opdList}
      />

      <ExcelManagerModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        opdList={opdList}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-800">
              SI-ITING (Sistem Informasi Bezetting)
            </span>
            <span className="mx-2">·</span>
            <span>Bagian Organisasi Sekretariat Daerah Kabupaten Bandung Barat</span>
          </div>
          <div className="text-slate-400">
            "Data Tepat, Keputusan Tepat" — Pengelolaan Formasi Berbasis Analisis Beban Kerja (ABK)
          </div>
        </div>
      </footer>

    </div>
  );
}
