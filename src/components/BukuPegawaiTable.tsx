import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Eye, 
  Edit3, 
  UserCheck, 
  AlertCircle, 
  Clock, 
  GraduationCap, 
  Calendar 
} from 'lucide-react';
import { Employee, Opd } from '../types/bezetting';

interface BukuPegawaiTableProps {
  employees: Employee[];
  opdList: Opd[];
  onSelectEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onOpenAddModal: () => void;
}

export const BukuPegawaiTable: React.FC<BukuPegawaiTableProps> = ({
  employees,
  opdList,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOpd, setSelectedOpd] = useState<string>('ALL');
  const [selectedJenisPegawai, setSelectedJenisPegawai] = useState<string>('ALL');
  const [selectedGolongan, setSelectedGolongan] = useState<string>('ALL');
  const [filterPensiunDekat, setFilterPensiunDekat] = useState<boolean>(false);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedOpd !== 'ALL' && emp.opdId !== selectedOpd) return false;
      if (selectedJenisPegawai !== 'ALL' && emp.jenisPegawai !== selectedJenisPegawai) return false;
      if (selectedGolongan !== 'ALL' && !emp.golonganKode.startsWith(selectedGolongan)) return false;
      if (filterPensiunDekat && emp.tahunPensiun > 2028) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().replace(/\s+/g, '');
        const cleanNip = emp.nip.replace(/\s+/g, '').toLowerCase();
        const cleanNama = emp.nama.toLowerCase();
        const cleanJabatan = emp.jabatan.toLowerCase();
        const cleanUnit = emp.unitKerja.toLowerCase();

        if (
          !cleanNip.includes(query) &&
          !cleanNama.includes(query) &&
          !cleanJabatan.includes(query) &&
          !cleanUnit.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [employees, selectedOpd, selectedJenisPegawai, selectedGolongan, filterPensiunDekat, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Control & Filter Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari NIP (18 digit), Nama lengkap, Jabatan, atau OPD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilterPensiunDekat(!filterPensiunDekat)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                filterPensiunDekat 
                  ? 'bg-amber-500 text-white border-amber-600' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pensiun &le; 2028</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pegawai</span>
            </button>
          </div>

        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
          
          {/* OPD */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Perangkat Daerah (OPD)
            </label>
            <select
              value={selectedOpd}
              onChange={(e) => setSelectedOpd(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Semua Perangkat Daerah</option>
              {opdList.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.singkatan || opd.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Pegawai */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Jenis Kepegawaian
            </label>
            <select
              value={selectedJenisPegawai}
              onChange={(e) => setSelectedJenisPegawai(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Semua (PNS & PPPK)</option>
              <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
              <option value="PPPK">PPPK (Pegawai Pemerintah dg Perjanjian Kerja)</option>
            </select>
          </div>

          {/* Golongan */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Tingkat Golongan
            </label>
            <select
              value={selectedGolongan}
              onChange={(e) => setSelectedGolongan(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Semua Golongan</option>
              <option value="IV">Golongan IV (Pembina)</option>
              <option value="III">Golongan III (Penata)</option>
              <option value="II">Golongan II (Pengatur)</option>
              <option value="IX">Golongan IX (PPPK Ahli Pertama)</option>
              <option value="VII">Golongan VII (PPPK Terampil)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Counter bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Menampilkan <span className="font-semibold text-slate-900">{filteredEmployees.length}</span> dari {employees.length} Pegawai ASN
        </div>
        <div className="text-slate-400">
          Klik baris pegawai untuk melihat rekam jejak lengkap.
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10 text-center">No</th>
                <th className="py-3 px-4 min-w-[210px]">Identitas & NIP Pegawai</th>
                <th className="py-3 px-3 min-w-[130px]">Pangkat / Gol.</th>
                <th className="py-3 px-4 min-w-[220px]">Jabatan & Unit Kerja</th>
                <th className="py-3 px-3 text-center">Pendidikan</th>
                <th className="py-3 px-3 text-center">Usia / Pensiun</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">Tidak ada pegawai yang sesuai filter</p>
                    <p className="text-xs text-slate-400 mt-1">Silakan sesuaikan filter atau kata kunci Anda.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => {
                  const isNearPensiun = emp.tahunPensiun <= 2028;

                  return (
                    <tr 
                      key={emp.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => onSelectEmployee(emp)}
                    >
                      {/* Index */}
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-400">
                        {index + 1}
                      </td>

                      {/* Name & NIP */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-[13px] group-hover:text-blue-600 transition-colors">
                          {emp.nama}
                        </div>
                        <div className="font-mono tabular-nums text-slate-500 text-[11px] mt-0.5">
                          NIP. {emp.nip}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          TMT: {emp.tmtPns} · {emp.jenisKelamin === 'L' ? 'Pria' : 'Wanita'}
                        </div>
                      </td>

                      {/* Pangkat & Golongan */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">
                          {emp.golonganKode}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[140px]" title={emp.pangkatGolongan}>
                          {emp.pangkatGolongan}
                        </span>
                        <span className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded mt-0.5 ${
                          emp.jenisPegawai === 'PNS' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {emp.jenisPegawai}
                        </span>
                      </td>

                      {/* Jabatan & Unit Kerja */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 text-[12px]">
                          {emp.jabatan}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {emp.unitKerja}
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          {emp.subUnitKerja}
                        </div>
                      </td>

                      {/* Pendidikan */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold text-slate-800 block">
                          {emp.pendidikanTerakhir}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[120px] mx-auto" title={emp.jurusan}>
                          {emp.jurusan}
                        </span>
                      </td>

                      {/* Usia & Pensiun */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono tabular-nums text-slate-900 font-semibold block">
                          {emp.usia} thn
                        </span>
                        <span className={`font-mono tabular-nums text-[10px] font-semibold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                          isNearPensiun 
                            ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                            : 'text-slate-500'
                        }`}>
                          BUP {emp.tahunPensiun}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          emp.status === 'Aktif' 
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                            : emp.status === 'Masa Persiapan Pensiun'
                            ? 'text-purple-700 bg-purple-50 border border-purple-200'
                            : 'text-amber-700 bg-amber-50 border border-amber-200'
                        }`}>
                          {emp.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="Lihat Profil Pegawai"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Data Pegawai"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus data pegawai: ${emp.nama}?`)) {
                                onDeleteEmployee(emp.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Hapus Pegawai"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
