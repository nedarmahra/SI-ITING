import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert,
  ArrowDownRight,
  Send
} from 'lucide-react';
import { Employee, JabatanFormasi, Opd } from '../types/bezetting';

interface SimulasiRedistribusiProps {
  employees: Employee[];
  jabatanList: JabatanFormasi[];
  opdList: Opd[];
}

export const SimulasiRedistribusi: React.FC<SimulasiRedistribusiProps> = ({
  employees,
  jabatanList,
  opdList,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Identify surplus positions and deficit positions
  const surplusJabatan = jabatanList.filter((j) => j.status === 'Lebih');
  const deficitJabatan = jabatanList.filter((j) => j.status === 'Kurang');

  const totalSurplus = surplusJabatan.reduce((acc, curr) => acc + curr.selisih, 0);
  const totalDefisit = deficitJabatan.reduce((acc, curr) => acc + Math.abs(curr.selisih), 0);

  // Upcoming retirements count
  const retirements2026_2028 = employees.filter((e) => e.tahunPensiun <= 2028).length;

  // CASN Net Need calculation
  const netCasnNeed = Math.max(0, totalDefisit - totalSurplus + retirements2026_2028);

  // Recommended Matchings
  const matchingRecommendations = [
    {
      id: 'match-1',
      dariOpd: 'Dinas Kesehatan',
      jabatanAsal: 'Pengadministrasi Keuangan (Surplus +2)',
      tujuanOpd: 'Bagian Organisasi Sekretariat Daerah',
      jabatanTujuan: 'Pengadministrasi Perkantoran (Defisit -1)',
      keterangan: 'Redistribusi 1 personil staf administrasi untuk perkuatan dukungan ketatausahaan Bagian Organisasi Setda.',
      dampak: 'Menutup 100% kekosongan staf tata usaha di Bagian Organisasi.',
    },
    {
      id: 'match-2',
      dariOpd: 'Kecamatan Lembang',
      jabatanAsal: 'Pengadministrasi Pelayanan Umum (Surplus +2)',
      tujuanOpd: 'Kecamatan Ngamprah',
      jabatanTujuan: 'Pengadministrasi Pelayanan Umum (Defisit -2)',
      keterangan: 'Pemerataan personil antar-kecamatan untuk menyeimbangkan beban pelayanan publik di ibukota kabupaten.',
      dampak: 'Mengurangi defisit personil pelayanan kependudukan Kec. Ngamprah sebesar 50%.',
    },
    {
      id: 'match-3',
      dariOpd: 'Badan Kepegawaian dan Pengembangan SDM (BKPSDM)',
      jabatanAsal: 'Pengelola Mutasi dan Promosi Pegawai (Surplus +1)',
      tujuanOpd: 'Bagian Organisasi Sekretariat Daerah',
      jabatanTujuan: 'Analis Kelembagaan (Defisit -1)',
      keterangan: 'Alih tugas kepegawaian internal dengan latar belakang kesesuaian kualifikasi administrasi publik.',
      dampak: 'Membantu percepatan evaluasi struktur organisasi UPTD se-Kabupaten.',
    },
  ];

  // Official Nota Dinas Text Generator
  const generateNotaDinasText = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return `NOTA DINAS
Nomor: 800.1.1/       /Org/2026
Kepada       : Yth. Bapak Sekretaris Daerah Kabupaten Bandung Barat
Dari         : Kepala Bagian Organisasi Sekretariat Daerah
Tanggal      : ${today}
Perihal      : Laporan Rekomendasi Penataan Bezetting & Kebutuhan Formasi ASN Kabupaten Bandung Barat

1. DASAR HUKUM:
   a. Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara;
   b. PermenPAN-RB Nomor 1 Tahun 2020 tentang Pedoman Analisis Jabatan dan Analisis Beban Kerja;
   c. Data Hasil Pemetaan SI-ITING Bagian Organisasi Setda Kab. Bandung Barat.

2. FAKTA DATA & KONDISI BEZETTING:
   a. Total Pegawai ASN Terdata : ${employees.length} orang (PNS: ${employees.filter(e => e.jenisPegawai === 'PNS').length}, PPPK: ${employees.filter(e => e.jenisPegawai === 'PPPK').length})
   b. Total Kebutuhan Sesuai ABK : ${opdList.reduce((acc, o) => acc + o.totalKebutuhanABK, 0)} formasi
   c. Defisit / Kekurangan Riil   : ${totalDefisit} jabatan mengalami kekurangan staf
   d. Surplus / Kelebihan Posisi  : ${totalSurplus} staf pada unit kerja tertentu
   e. Proyeksi Pensiun (2026-2028): ${retirements2026_2028} orang ASN memasuki Batas Usia Pensiun (BUP)

3. REKOMENDASI KEBIJAKAN STRATEGIS:
   a. Melakukan REDISTRIBUSI INTERNAL untuk ${matchingRecommendations.length} jabatan surplus ke unit kerja yang mengalami defisit kritis, tanpa membebani penambahan belanja pegawai (Zero Growth Budget).
   b. Mengusulkan FORMASI PENGADAAN CASN (CPNS & PPPK) TA 2026/2027 sejumlah ${netCasnNeed} formasi prioritas teknis (terutama Auditor APIP, Pranata Komputer/SPBE, dan Tenaga Kesehatan/Epidemiolog).
   c. Mempersiapkan Manajemen Talenta & Suksesi dini untuk ${employees.filter(e => e.tahunPensiun <= 2026).length} posisi pejabat yang purna tugas pada tahun 2026.

Demikian laporan rekomendasi ini disampaikan untuk menjadi periksa dan bahan pertimbangan Bapak Sekretaris Daerah.

KEPALA BAGIAN ORGANISASI
SEKRETARIAT DAERAH KABUPATEN BANDUNG BARAT`;
  };

  const handleCopyNotaDinas = () => {
    navigator.clipboard.writeText(generateNotaDinasText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <span>Bagian Organisasi Setda</span>
          <span aria-hidden="true">·</span>
          <span>Simulasi Kebutuhan & Penataan Personil</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Simulasi Redistribusi & Perencanaan Formasi CASN
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Pemanfaatan data bezetting untuk mitigasi ketimpangan beban kerja antar-OPD melalui skema 
          redistribusi personil surplus dan kalkulasi riil usulan formasi seleksi CPNS/PPPK.
        </p>
      </div>

      {/* KPI Simulation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Total Defisit Formasi</span>
          <div className="font-mono tabular-nums text-2xl font-bold text-rose-600">
            -{totalDefisit}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Kekurangan personil di {deficitJabatan.length} jabatan
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Potensi Staf Surplus</span>
          <div className="font-mono tabular-nums text-2xl font-bold text-amber-600">
            +{totalSurplus}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Staf pelaksana di {surplusJabatan.length} unit berlebih
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Proyeksi BUP (3 Thn)</span>
          <div className="font-mono tabular-nums text-2xl font-bold text-purple-600">
            {retirements2026_2028}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Pensiun periode 2026 s.d 2028
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs bg-linear-to-br from-white to-blue-50/50">
          <span className="text-xs text-blue-700 font-semibold block mb-1">Usulan Bersih CASN</span>
          <div className="font-mono tabular-nums text-2xl font-bold text-blue-900">
            {netCasnNeed} formasi
          </div>
          <span className="text-[11px] text-blue-600 mt-1 block">
            Kebutuhan rekrutmen pasca-redistribusi
          </span>
        </div>

      </div>

      {/* Matching Matrix & Plan */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-600" />
              <span>Peta Rekomendasi Redistribusi Internal (Tanpa Beban Belanja Tambahan)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulasi pergeseran staf dari unit berlebih ke unit yang mengalami kekurangan mendesak
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {matchingRecommendations.map((item, idx) => (
            <div key={item.id} className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                
                {/* Asal */}
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    Sumber Staf (Unit Surplus)
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{item.dariOpd}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{item.jabatanAsal}</div>
                </div>

                {/* Arrow */}
                <div className="hidden lg:flex items-center justify-center px-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                {/* Tujuan */}
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                    Target Penempatan (Unit Defisit)
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{item.tujuanOpd}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{item.jabatanTujuan}</div>
                </div>

              </div>

              {/* Justifikasi & Dampak */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Analisis Beban Kerja: </span>
                  <span className="text-slate-600">{item.keterangan}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Dampak Efektivitas: </span>
                  <span className="text-emerald-700">{item.dampak}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Nota Dinas Generator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Draf Nota Dinas Rekomendasi Pimpinan</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Format draf resmi untuk pelaporan kepada Sekretaris Daerah & Bupati Bandung Barat
            </p>
          </div>
          <button
            onClick={handleCopyNotaDinas}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Draf Nota Dinas'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96 select-all">
          {generateNotaDinasText()}
        </div>
      </div>

    </div>
  );
};
