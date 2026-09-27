import React from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  Edit3,
  Award
} from 'lucide-react';
import { Employee } from '../types/bezetting';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onEdit,
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xl shrink-0">
              {employee.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {employee.jenisPegawai}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {employee.status}
                </span>
              </div>
              <h2 className="text-lg font-bold mt-1 text-white">
                {employee.nama}
              </h2>
              <p className="font-mono tabular-nums text-xs text-slate-400 mt-0.5">
                NIP. {employee.nip}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Jabatan & Kedudukan */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>Jabatan & Penempatan Kerja</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Nama Jabatan</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{employee.jabatan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Jenis Jabatan & Eselon</span>
                <span className="font-medium text-slate-900 mt-0.5 block">
                  {employee.jenisJabatan} ({employee.eselon})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Perangkat Daerah (OPD)</span>
                <span className="font-medium text-slate-900 mt-0.5 block">{employee.unitKerja}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sub Unit Kerja / Bidang</span>
                <span className="font-medium text-slate-900 mt-0.5 block">{employee.subUnitKerja}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">TMT Jabatan</span>
                <span className="font-mono font-medium text-slate-900 mt-0.5 block">{employee.tmtJabatan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">TMT CPNS / Pengangkatan</span>
                <span className="font-mono font-medium text-slate-900 mt-0.5 block">{employee.tmtPns}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Pangkat & Pendidikan */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-500" />
              <span>Pangkat, Golongan & Kualifikasi</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Pangkat / Golongan Ruang</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {employee.pangkatGolongan} ({employee.golonganKode})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Pendidikan Terakhir</span>
                <span className="font-medium text-slate-900 mt-0.5 block">
                  {employee.pendidikanTerakhir} — {employee.jurusan}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tempat, Tanggal Lahir</span>
                <span className="font-medium text-slate-900 mt-0.5 block">
                  {employee.tempatLahir}, {employee.tanggalLahir}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Usia Saat Ini</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {employee.usia} Tahun
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Proyeksi Batas Usia Pensiun (BUP) */}
          <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-purple-900 flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Proyeksi Batas Usia Pensiun (BUP)</span>
                </h4>
                <p className="text-purple-700 text-[11px] mt-1">
                  Berdasarkan regulasi UU ASN, batas usia pensiun untuk jabatan ini adalah 58 / 60 tahun.
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono tabular-nums text-lg font-bold text-purple-900">
                  Tahun {employee.tahunPensiun}
                </span>
                <span className="block text-[11px] text-purple-600">
                  {employee.sisaMasaKerjaTahun === 0 
                    ? 'Tahun ini memasuki masa pensiun' 
                    : `Sisa masa kerja ± ${employee.sisaMasaKerjaTahun} tahun`}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Terdaftar pada Database Bezetting SI-ITING Setda KBB
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(employee);
                onClose();
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Data ASN</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
