import React from 'react';
import { 
  Users, 
  Target, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight,
  UserX,
  FileCheck2,
  Briefcase
} from 'lucide-react';
import { Employee, JabatanFormasi, Opd } from '../types/bezetting';

interface ExecutiveSummaryProps {
  employees: Employee[];
  jabatanList: JabatanFormasi[];
  opdList: Opd[];
  onSelectOpdFilter?: (opdId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'peta' | 'pegawai' | 'simulasi') => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  employees,
  jabatanList,
  opdList,
  onNavigateTab,
}) => {
  // Aggregate Calculations
  const totalPns = employees.filter((e) => e.jenisPegawai === 'PNS').length;
  const totalPppk = employees.filter((e) => e.jenisPegawai === 'PPPK').length;
  const totalAsn = employees.length;

  const totalKebutuhanAbk = opdList.reduce((acc, curr) => acc + curr.totalKebutuhanABK, 0);
  const totalBezettingRiil = opdList.reduce((acc, curr) => acc + curr.totalBezetting, 0);
  const netDefisit = totalBezettingRiil - totalKebutuhanAbk;

  const rasioKeterisian = totalKebutuhanAbk > 0 
    ? Math.round((totalBezettingRiil / totalKebutuhanAbk) * 100) 
    : 0;

  // Retirements
  const currentYear = new Date().getFullYear();
  const pensiun2026 = employees.filter((e) => e.tahunPensiun <= 2026);
  const pensiun2027 = employees.filter((e) => e.tahunPensiun === 2027);
  const pensiun2028 = employees.filter((e) => e.tahunPensiun === 2028);
  const totalPensiun3Tahun = pensiun2026.length + pensiun2027.length + pensiun2028.length;

  // Job Distribution
  const jptCount = employees.filter((e) => e.jenisJabatan === 'Struktural/JPT').length;
  const adminCount = employees.filter((e) => e.jenisJabatan === 'Administrator').length;
  const pengawasCount = employees.filter((e) => e.jenisJabatan === 'Pengawas').length;
  const fungsionalTertentuCount = employees.filter((e) => e.jenisJabatan === 'Fungsional Tertentu').length;
  const pelaksanaCount = employees.filter((e) => e.jenisJabatan === 'Fungsional Pelaksana').length;

  // Golongan distribution
  const golIV = employees.filter((e) => e.golonganKode.startsWith('IV')).length;
  const golIII = employees.filter((e) => e.golonganKode.startsWith('III')).length;
  const golII = employees.filter((e) => e.golonganKode.startsWith('II')).length;
  const golPppk = employees.filter((e) => ['VII', 'VIII', 'IX', 'X'].includes(e.golonganKode)).length;

  // Formasi status counts
  const countKurang = jabatanList.filter((j) => j.status === 'Kurang').length;
  const countLebih = jabatanList.filter((j) => j.status === 'Lebih').length;
  const countSesuai = jabatanList.filter((j) => j.status === 'Sesuai').length;

  return (
    <div className="space-y-6">
      
      {/* Editorial Title & Context Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <span>Sekretariat Daerah Kabupaten Bandung Barat</span>
              <span aria-hidden="true">·</span>
              <span>Bagian Organisasi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Analisis Bezetting & Formasi Pegawai ASN
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Pemantauan real-time ketersediaan personil ASN terhadap kebutuhan Analisis Beban Kerja (ABK) 
              guna mendukung kebijakan pengadaan CASN, redistribusi staf, dan antisipasi batas usia pensiun.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-right">
              <span className="block text-xs text-slate-500">Tingkat Keterisian ABK</span>
              <span className="font-mono tabular-nums text-lg font-bold text-slate-900">
                {rasioKeterisian}%
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('simulasi')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Rekomendasi Penataan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Card 1: Total ASN */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total ASN Riil</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900">
            {totalAsn}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-slate-700">{totalPns}</span> PNS
            <span>·</span>
            <span className="font-semibold text-slate-700">{totalPppk}</span> PPPK
          </div>
        </div>

        {/* Card 2: Kebutuhan ABK */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Kebutuhan (ABK)</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900">
            {totalKebutuhanAbk}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Standar formasi ideal se-KBB
          </div>
        </div>

        {/* Card 3: Defisit Formasi */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Defisit Formasi</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-rose-600">
            {netDefisit < 0 ? netDefisit : `+${netDefisit}`}
          </div>
          <div className="text-xs text-rose-600 font-medium mt-1">
            {countKurang} jabatan kurang orang
          </div>
        </div>

        {/* Card 4: Surplus / Lebih */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Surplus Formasi</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-amber-700">
            {countLebih}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Posisi dapat diredistribusi
          </div>
        </div>

        {/* Card 5: Proyeksi Pensiun */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Pensiun (2026-2028)</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900">
            {totalPensiun3Tahun}
          </div>
          <div className="text-xs text-purple-700 font-medium mt-1">
            {pensiun2026.length} ASN purna tugas thn ini
          </div>
        </div>

      </div>

      {/* Analytical Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Komposisi Jenis Jabatan & Pangkat */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Card: Komposisi Jenis Jabatan */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Distribusi Jenis Jabatan</span>
              <Briefcase className="w-4 h-4 text-slate-400" />
            </h2>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>JPT Pratama (Eselon II)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{jptCount} orang</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.max(5, (jptCount / totalAsn) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Administrator (Eselon III)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{adminCount} orang</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.max(5, (adminCount / totalAsn) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Fungsional Tertentu (JF Ahli)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{fungsionalTertentuCount} orang</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${Math.max(5, (fungsionalTertentuCount / totalAsn) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Pelaksana / Administrasi</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{pelaksanaCount} orang</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${Math.max(5, (pelaksanaCount / totalAsn) * 100)}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Perbandingan PNS : PPPK</span>
              <span className="font-mono font-medium text-slate-700">
                {Math.round((totalPns / totalAsn) * 100)}% : {Math.round((totalPppk / totalAsn) * 100)}%
              </span>
            </div>
          </div>

          {/* Card: Sebaran Golongan / Ruang */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Sebaran Golongan / Pangkat</span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </h2>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-xs text-slate-500 block">Golongan IV (Pembina)</span>
                <span className="font-mono tabular-nums text-lg font-bold text-slate-900">{golIV}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-xs text-slate-500 block">Golongan III (Penata)</span>
                <span className="font-mono tabular-nums text-lg font-bold text-slate-900">{golIII}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-xs text-slate-500 block">Golongan II (Pengatur)</span>
                <span className="font-mono tabular-nums text-lg font-bold text-slate-900">{golII}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-xs text-slate-500 block">PPPK (Gol. VII-X)</span>
                <span className="font-mono tabular-nums text-lg font-bold text-slate-900">{golPppk}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (2 cols): Status Bezetting Per OPD & Pensiun Early Warning */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Table: Status Bezetting Per OPD */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Rekapitulasi Keterisian Bezetting Per OPD
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar unit kerja dengan perbandingan Kebutuhan ABK vs Realisasi Bezetting
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('peta')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>Lihat Peta Lengkap</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Nama Perangkat Daerah</th>
                    <th className="py-2.5 px-3 text-right">Kebutuhan (ABK)</th>
                    <th className="py-2.5 px-3 text-right">PNS</th>
                    <th className="py-2.5 px-3 text-right">PPPK</th>
                    <th className="py-2.5 px-3 text-right">Riil</th>
                    <th className="py-2.5 px-4 text-center">Selisih</th>
                    <th className="py-2.5 px-4 text-center">Keterisian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opdList.slice(0, 7).map((opd) => {
                    const pct = Math.round((opd.totalBezetting / opd.totalKebutuhanABK) * 100);
                    return (
                      <tr key={opd.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          {opd.nama}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            Kepala: {opd.kepalaOpd}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                          {opd.totalKebutuhanABK}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                          {opd.totalPns}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                          {opd.totalPppk}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                          {opd.totalBezetting}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono tabular-nums">
                          {opd.selisih < 0 ? (
                            <span className="text-rose-600 font-semibold">{opd.selisih}</span>
                          ) : opd.selisih > 0 ? (
                            <span className="text-amber-600 font-semibold">+{opd.selisih}</span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">0</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-1.5 rounded-full ${pct >= 95 ? 'bg-emerald-500' : pct >= 80 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                            <span className="font-mono tabular-nums text-[11px] text-slate-600 w-8">
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
              Menampilkan 7 dari {opdList.length} Perangkat Daerah. Akses tab "Peta Formasi & ABK" untuk melihat rincian setiap jabatan.
            </div>
          </div>

          {/* Early Warning Pensiun Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Early Warning Pensiun ASN (2026 - 2028)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar personil menjelang Batas Usia Pensiun (BUP) yang menuntut persiapan formasi suksesi
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('pegawai')}
                className="text-xs text-slate-600 hover:text-slate-900 underline"
              >
                Lihat di Buku ASN
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {employees
                .filter((e) => e.tahunPensiun <= 2028)
                .sort((a, b) => a.tahunPensiun - b.tahunPensiun)
                .slice(0, 4)
                .map((emp) => (
                  <div key={emp.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{emp.nama}</span>
                      <span className="text-slate-500 block text-[11px]">
                        {emp.jabatan} · {emp.unitKerja}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono tabular-nums font-semibold px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                        Pensiun {emp.tahunPensiun}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {emp.sisaMasaKerjaTahun === 0 ? 'Tahun berjalan' : `${emp.sisaMasaKerjaTahun} tahun lagi`}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
