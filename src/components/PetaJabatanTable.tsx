import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Building,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { JabatanFormasi, Opd, JenisJabatan } from '../types/bezetting';

interface PetaJabatanTableProps {
  jabatanList: JabatanFormasi[];
  opdList: Opd[];
  onUpdateJabatan: (updated: JabatanFormasi) => void;
  onAddJabatan: (newJabatan: Omit<JabatanFormasi, 'id' | 'bezettingTotal' | 'selisih' | 'status'>) => void;
}

export const PetaJabatanTable: React.FC<PetaJabatanTableProps> = ({
  jabatanList,
  opdList,
  onUpdateJabatan,
  onAddJabatan,
}) => {
  const [selectedOpd, setSelectedOpd] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedJenisJabatan, setSelectedJenisJabatan] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State for new Jabatan
  const [formOpdId, setFormOpdId] = useState<string>(opdList[0]?.id || '');
  const [formNamaJabatan, setFormNamaJabatan] = useState<string>('');
  const [formJenisJabatan, setFormJenisJabatan] = useState<JenisJabatan>('Fungsional Tertentu');
  const [formKualifikasi, setFormKualifikasi] = useState<string>('');
  const [formKebutuhanAbk, setFormKebutuhanAbk] = useState<number>(2);
  const [formBezettingPns, setFormBezettingPns] = useState<number>(1);
  const [formBezettingPppk, setFormBezettingPppk] = useState<number>(0);
  const [formPrioritas, setFormPrioritas] = useState<'Tinggi' | 'Sedang' | 'Rendah' | 'Cukup'>('Sedang');
  const [formKeterangan, setFormKeterangan] = useState<string>('');

  // Filtered List
  const filteredJabatan = useMemo(() => {
    return jabatanList.filter((item) => {
      if (selectedOpd !== 'ALL' && item.opdId !== selectedOpd) return false;
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
      if (selectedJenisJabatan !== 'ALL' && item.jenisJabatan !== selectedJenisJabatan) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNama = item.namaJabatan.toLowerCase().includes(query);
        const matchOpd = item.opdNama.toLowerCase().includes(query);
        const matchKet = item.keterangan.toLowerCase().includes(query);
        if (!matchNama && !matchOpd && !matchKet) return false;
      }
      return true;
    });
  }, [jabatanList, selectedOpd, selectedStatus, selectedJenisJabatan, searchQuery]);

  // Adjust ABK In-Place (simulation)
  const handleAdjustAbk = (jab: JabatanFormasi, delta: number) => {
    const newKebutuhan = Math.max(0, jab.kebutuhanABK + delta);
    const newSelisih = jab.bezettingTotal - newKebutuhan;
    const newStatus = newSelisih === 0 ? 'Sesuai' : newSelisih > 0 ? 'Lebih' : 'Kurang';

    onUpdateJabatan({
      ...jab,
      kebutuhanABK: newKebutuhan,
      selisih: newSelisih,
      status: newStatus,
    });
  };

  const handleAdjustBezetting = (jab: JabatanFormasi, type: 'pns' | 'pppk', delta: number) => {
    const newPns = type === 'pns' ? Math.max(0, jab.bezettingPns + delta) : jab.bezettingPns;
    const newPppk = type === 'pppk' ? Math.max(0, jab.bezettingPppk + delta) : jab.bezettingPppk;
    const newTotal = newPns + newPppk;
    const newSelisih = newTotal - jab.kebutuhanABK;
    const newStatus = newSelisih === 0 ? 'Sesuai' : newSelisih > 0 ? 'Lebih' : 'Kurang';

    onUpdateJabatan({
      ...jab,
      bezettingPns: newPns,
      bezettingPppk: newPppk,
      bezettingTotal: newTotal,
      selisih: newSelisih,
      status: newStatus,
    });
  };

  const handleCreateJabatan = (e: React.FormEvent) => {
    e.preventDefault();
    const opd = opdList.find((o) => o.id === formOpdId);
    if (!opd || !formNamaJabatan.trim()) return;

    onAddJabatan({
      opdId: opd.id,
      opdNama: opd.nama,
      namaJabatan: formNamaJabatan.trim(),
      jenisJabatan: formJenisJabatan,
      kualifikasiPendidikan: formKualifikasi.trim() || 'S1 Sesuai Bidang Tugas',
      kebutuhanABK: Number(formKebutuhanAbk),
      bezettingPns: Number(formBezettingPns),
      bezettingPppk: Number(formBezettingPppk),
      prioritasRekrutmen: formPrioritas,
      keterangan: formKeterangan.trim() || 'Formasi usulan baru',
    });

    setShowAddModal(false);
    setFormNamaJabatan('');
    setFormKualifikasi('');
    setFormKeterangan('');
  };

  return (
    <div className="space-y-4">
      {/* Control Bar & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama jabatan, tugas, atau perangkat daerah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jabatan Formasi</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
          
          {/* OPD Selector */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Perangkat Daerah (OPD)
            </label>
            <select
              value={selectedOpd}
              onChange={(e) => setSelectedOpd(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Semua Perangkat Daerah ({opdList.length})</option>
              {opdList.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.singkatan || opd.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Status Formasi Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Status Keterisian
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Semua Status Formasi</option>
              <option value="Kurang">Kurang Formasi / Defisit (-)</option>
              <option value="Lebih">Lebih Formasi / Surplus (+)</option>
              <option value="Sesuai">Sesuai Kebutuhan (0)</option>
            </select>
          </div>

          {/* Jenis Jabatan Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Jenis Jabatan
            </label>
            <select
              value={selectedJenisJabatan}
              onChange={(e) => setSelectedJenisJabatan(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Semua Jenis Jabatan</option>
              <option value="Struktural/JPT">JPT Pratama</option>
              <option value="Administrator">Administrator (Eselon III)</option>
              <option value="Pengawas">Pengawas (Eselon IV)</option>
              <option value="Fungsional Tertentu">Fungsional Tertentu (JF Ahli)</option>
              <option value="Fungsional Pelaksana">Fungsional Pelaksana / Staf</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table Notice & Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Menampilkan <span className="font-semibold text-slate-900">{filteredJabatan.length}</span> posisi jabatan 
          berdasarkan kriteria pencarian.
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Kurang
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Lebih
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sesuai
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 min-w-[220px]">Nama Jabatan & Unit Kerja</th>
                <th className="py-3 px-3">Jenis Jabatan</th>
                <th className="py-3 px-3 text-center min-w-[110px]">
                  Kebutuhan (ABK)
                </th>
                <th className="py-3 px-3 text-center min-w-[130px]">
                  Bezetting (PNS + PPPK)
                </th>
                <th className="py-3 px-3 text-center">Selisih</th>
                <th className="py-3 px-3 text-center">Prioritas</th>
                <th className="py-3 px-4 min-w-[240px]">Keterangan & Catatan Analisis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJabatan.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">Tidak ada data jabatan yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba ganti filter atau kata kunci pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredJabatan.map((jab, index) => {
                  return (
                    <tr key={jab.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-400">
                        {index + 1}
                      </td>

                      {/* Jabatan & OPD */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-[13px]">
                          {jab.namaJabatan}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {jab.opdNama}
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5 italic">
                          Syarat: {jab.kualifikasiPendidikan}
                        </div>
                      </td>

                      {/* Jenis Jabatan */}
                      <td className="py-3 px-3">
                        <span className="text-slate-700 font-medium">
                          {jab.jenisJabatan}
                        </span>
                      </td>

                      {/* Kebutuhan ABK with In-Place Adjustments */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                          <button
                            onClick={() => handleAdjustAbk(jab, -1)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 font-bold"
                            title="Kurangi Kebutuhan ABK"
                          >
                            -
                          </button>
                          <span className="font-mono tabular-nums font-bold text-slate-900 min-w-[18px]">
                            {jab.kebutuhanABK}
                          </span>
                          <button
                            onClick={() => handleAdjustAbk(jab, 1)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 font-bold"
                            title="Tambah Kebutuhan ABK"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Bezetting Riil (PNS & PPPK) with Fast Steppers */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                          {jab.bezettingTotal} orang
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                          <span title="PNS">PNS: {jab.bezettingPns}</span>
                          <span>·</span>
                          <span title="PPPK">PPPK: {jab.bezettingPppk}</span>
                        </div>
                      </td>

                      {/* Selisih */}
                      <td className="py-3 px-3 text-center">
                        {jab.status === 'Kurang' ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono tabular-nums font-bold text-rose-600 px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                              {jab.selisih}
                            </span>
                            <span className="text-[10px] text-rose-500 mt-0.5 font-medium">
                              Kurang
                            </span>
                          </div>
                        ) : jab.status === 'Lebih' ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono tabular-nums font-bold text-amber-700 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                              +{jab.selisih}
                            </span>
                            <span className="text-[10px] text-amber-600 mt-0.5 font-medium">
                              Surplus
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono tabular-nums font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                              0
                            </span>
                            <span className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                              Sesuai
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Prioritas Pemenuhan Formasi */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          jab.prioritasRekrutmen === 'Tinggi'
                            ? 'text-rose-700 bg-rose-50 border border-rose-200'
                            : jab.prioritasRekrutmen === 'Sedang'
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : 'text-slate-600 bg-slate-100 border border-slate-200'
                        }`}>
                          {jab.prioritasRekrutmen}
                        </span>
                      </td>

                      {/* Keterangan */}
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        <p className="line-clamp-2 leading-relaxed">
                          {jab.keterangan}
                        </p>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Jabatan Formasi */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tambah Formasi Jabatan Baru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Daftarkan formasi peta jabatan baru berdasarkan hasil Analisis Beban Kerja (ABK).
            </p>

            <form onSubmit={handleCreateJabatan} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Perangkat Daerah (OPD) *
                </label>
                <select
                  value={formOpdId}
                  onChange={(e) => setFormOpdId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  required
                >
                  {opdList.map((opd) => (
                    <option key={opd.id} value={opd.id}>
                      {opd.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Jabatan *
                </label>
                <input
                  type="text"
                  placeholder="Misal: Analis Kebijakan Ahli Pertama"
                  value={formNamaJabatan}
                  onChange={(e) => setFormNamaJabatan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Jabatan
                  </label>
                  <select
                    value={formJenisJabatan}
                    onChange={(e) => setFormJenisJabatan(e.target.value as JenisJabatan)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Struktural/JPT">JPT Pratama</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Pengawas">Pengawas</option>
                    <option value="Fungsional Tertentu">Fungsional Tertentu</option>
                    <option value="Fungsional Pelaksana">Fungsional Pelaksana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prioritas Pemenuhan
                  </label>
                  <select
                    value={formPrioritas}
                    onChange={(e) => setFormPrioritas(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Tinggi">Tinggi (Kritis)</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                    <option value="Cukup">Cukup (Terpenuhi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kebutuhan (ABK)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formKebutuhanAbk}
                    onChange={(e) => setFormKebutuhanAbk(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PNS Riil
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formBezettingPns}
                    onChange={(e) => setFormBezettingPns(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PPPK Riil
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formBezettingPppk}
                    onChange={(e) => setFormBezettingPppk(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kualifikasi Pendidikan
                </label>
                <input
                  type="text"
                  placeholder="Misal: S1 Ilmu Pemerintahan / Administrasi Negara"
                  value={formKualifikasi}
                  onChange={(e) => setFormKualifikasi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan / Analisis
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan usulan penambahan formasi..."
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Simpan Formasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
