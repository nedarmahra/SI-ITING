import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  Plus, 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  Table2, 
  GitFork,
  Upload
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'peta' | 'pegawai' | 'simulasi';
  setActiveTab: (tab: 'dashboard' | 'peta' | 'pegawai' | 'simulasi') => void;
  onExportExcel: () => void;
  onOpenImport: () => void;
  onOpenAddPegawai: () => void;
  totalAsn: number;
  totalKebutuhan: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportExcel,
  onOpenImport,
  onOpenAddPegawai,
  totalAsn,
  totalKebutuhan,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Upper Brand & Top Bar Contract Zone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single element brand mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm border border-slate-800">
              <span className="tracking-tighter">SI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  SI-ITING
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Kab. Bandung Barat
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Informasi Bezetting — Bagian Organisasi Setda
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links (interactive tab buttons) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
              <span>Dashboard Eksekutif</span>
            </button>

            <button
              onClick={() => setActiveTab('peta')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'peta'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Peta Formasi & ABK</span>
            </button>

            <button
              onClick={() => setActiveTab('pegawai')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'pegawai'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Buku Pegawai ({totalAsn})</span>
            </button>

            <button
              onClick={() => setActiveTab('simulasi')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'simulasi'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-slate-500" />
              <span>Simulasi & Penataan</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenImport}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Import Data Bezetting dari Excel"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100/80 transition-colors shadow-2xs"
              title="Unduh Rekapitulasi Bezetting Lengkap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Export Bezetting</span>
              <span className="sm:hidden">Excel</span>
            </button>

            <button
              onClick={onOpenAddPegawai}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah ASN</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-slate-100 gap-1.5 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('peta')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'peta' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Peta Formasi
          </button>
          <button
            onClick={() => setActiveTab('pegawai')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'pegawai' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Buku Pegawai ({totalAsn})
          </button>
          <button
            onClick={() => setActiveTab('simulasi')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'simulasi' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Simulasi Penataan
          </button>
          <button
            onClick={onOpenImport}
            className="px-2.5 py-1 rounded-md whitespace-nowrap text-slate-600 bg-slate-100 flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            <span>Import</span>
          </button>
        </div>

      </div>
    </header>
  );
};
