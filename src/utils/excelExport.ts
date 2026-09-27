import * as XLSX from 'xlsx';
import { Employee, JabatanFormasi, Opd } from '../types/bezetting';

export function exportBukuBezettingExcel(
  employees: Employee[],
  jabatanList: JabatanFormasi[],
  opdList: Opd[],
  namaInstansi = 'Pemerintah Kabupaten Bandung Barat'
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Rekapitulasi Bezetting Per OPD
  const rekapRows = opdList.map((opd, idx) => ({
    'No': idx + 1,
    'Kode OPD': opd.kode,
    'Nama Perangkat Daerah / Unit Kerja': opd.nama,
    'Kategori': opd.kategori,
    'Kepala OPD': opd.kepalaOpd,
    'Kebutuhan ABK': opd.totalKebutuhanABK,
    'PNS Riil': opd.totalPns,
    'PPPK Riil': opd.totalPppk,
    'Total Bezetting Riil': opd.totalBezetting,
    'Selisih Formasi (+/-)': opd.selisih,
    'Status Keterisian': opd.selisih === 0 ? 'Sesuai (100%)' : opd.selisih > 0 ? `Lebih (+${opd.selisih})` : `Kurang (${opd.selisih})`,
  }));
  const wsRekap = XLSX.utils.json_to_sheet(rekapRows);
  XLSX.utils.book_append_sheet(wb, wsRekap, 'Rekapitulasi Bezetting OPD');

  // Sheet 2: Peta Jabatan & Kebutuhan Formasi ABK
  const jabatanRows = jabatanList.map((jab, idx) => ({
    'No': idx + 1,
    'Perangkat Daerah': jab.opdNama,
    'Nama Jabatan': jab.namaJabatan,
    'Jenis Jabatan': jab.jenisJabatan,
    'Kualifikasi Pendidikan': jab.kualifikasiPendidikan,
    'Kebutuhan (ABK)': jab.kebutuhanABK,
    'Bezetting PNS': jab.bezettingPns,
    'Bezetting PPPK': jab.bezettingPppk,
    'Total Bezetting Riil': jab.bezettingTotal,
    'Selisih (+/-)': jab.selisih,
    'Status Formasi': jab.status,
    'Prioritas Pemenuhan': jab.prioritasRekrutmen,
    'Keterangan & Catatan Analisis': jab.keterangan,
  }));
  const wsJabatan = XLSX.utils.json_to_sheet(jabatanRows);
  XLSX.utils.book_append_sheet(wb, wsJabatan, 'Peta Formasi & ABK');

  // Sheet 3: Buku Nominatif Pegawai ASN
  const pegawaiRows = employees.map((emp, idx) => ({
    'No': idx + 1,
    'NIP': emp.nip,
    'Nama Lengkap': emp.nama,
    'Jenis Kelamin': emp.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
    'Tanggal Lahir': emp.tanggalLahir,
    'Usia': emp.usia,
    'Pangkat / Golongan': emp.pangkatGolongan,
    'Jenis Pegawai': emp.jenisPegawai,
    'Nama Jabatan': emp.jabatan,
    'Jenis Jabatan': emp.jenisJabatan,
    'Eselon': emp.eselon,
    'Unit Kerja (OPD)': emp.unitKerja,
    'Sub Unit Kerja': emp.subUnitKerja,
    'Pendidikan Terakhir': emp.pendidikanTerakhir,
    'Jurusan': emp.jurusan,
    'TMT CPNS/PNS': emp.tmtPns,
    'TMT Jabatan': emp.tmtJabatan,
    'Tahun Pensiun': emp.tahunPensiun,
    'Sisa Masa Kerja (Tahun)': emp.sisaMasaKerjaTahun,
    'Status Pegawai': emp.status,
  }));
  const wsPegawai = XLSX.utils.json_to_sheet(pegawaiRows);
  XLSX.utils.book_append_sheet(wb, wsPegawai, 'Buku Pegawai Nominatif');

  const todayStr = new Date().toISOString().split('T')[0];
  const filename = `SI-ITING_Bezetting_KBB_${todayStr}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function generateTemplateExcel() {
  const wb = XLSX.utils.book_new();

  // Template Data Pegawai
  const templatePegawai = [
    {
      'NIP (18 Digit)': '19850101 201001 1 001',
      'Nama Lengkap (dengan gelar)': 'Fulan bin Fulan, S.STP., M.Si',
      'Jenis Kelamin (L/P)': 'L',
      'Tanggal Lahir (YYYY-MM-DD)': '1985-01-01',
      'Pangkat Golongan': 'Penata Tingkat I (III/d)',
      'Jenis Pegawai (PNS/PPPK)': 'PNS',
      'Nama Jabatan': 'Analis Kebijakan Ahli Muda',
      'Jenis Jabatan': 'Fungsional Tertentu',
      'Unit Kerja (OPD)': 'Bagian Organisasi Sekretariat Daerah',
      'Sub Unit Kerja': 'Sub-Bagian Kelembagaan dan Anjab',
      'Pendidikan Terakhir': 'S2',
      'Jurusan': 'Administrasi Publik',
      'TMT PNS (YYYY-MM-DD)': '2010-01-01',
      'TMT Jabatan (YYYY-MM-DD)': '2022-01-01',
      'Status (Aktif/Cuti/Tugas Belajar)': 'Aktif',
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templatePegawai);
  XLSX.utils.book_append_sheet(wb, ws, 'Template Input Pegawai');
  XLSX.writeFile(wb, 'Template_Input_Bezetting_KBB.xlsx');
}

export function parseExcelFile(
  file: File
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const wb = XLSX.read(buffer, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(ws);
        resolve({ success: true, data: json });
      } catch (err: any) {
        resolve({ success: false, error: err.message || 'Gagal membaca format file Excel' });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'Terjadi kesalahan saat membaca file' });
    };

    reader.readAsBinaryString(file);
  });
}
