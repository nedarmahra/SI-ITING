export type JenisPegawai = 'PNS' | 'PPPK' | 'PPPK Paruh Waktu';
export type JenisJabatan = 
  | 'Struktural/JPT' 
  | 'Administrator' 
  | 'Pengawas' 
  | 'Fungsional Tertentu' 
  | 'Fungsional Pelaksana';

export type StatusKepegawaian = 'Aktif' | 'Tugas Belajar' | 'Cuti Luar Tanggungan' | 'Masa Persiapan Pensiun';

export type KategoriOpd = 'Sekretariat' | 'Dinas' | 'Badan' | 'Inspektorat' | 'Kecamatan';

export interface Employee {
  id: string;
  nip: string;
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  tempatLahir: string;
  usia: number;
  pangkatGolongan: string;
  golonganKode: string; // e.g., 'IV/c', 'III/d', 'IX'
  jenisPegawai: JenisPegawai;
  jabatan: string;
  jenisJabatan: JenisJabatan;
  eselon: 'II.a' | 'II.b' | 'III.a' | 'III.b' | 'IV.a' | 'IV.b' | 'Non-Eselon';
  opdId: string;
  unitKerja: string;
  subUnitKerja: string;
  pendidikanTerakhir: 'S3' | 'S2' | 'S1' | 'D4' | 'D3' | 'SMA/SMK';
  jurusan: string;
  tmtPns: string;
  tmtJabatan: string;
  tahunPensiun: number;
  bulanPensiun: number;
  sisaMasaKerjaTahun: number;
  status: StatusKepegawaian;
}

export interface JabatanFormasi {
  id: string;
  opdId: string;
  opdNama: string;
  namaJabatan: string;
  jenisJabatan: JenisJabatan;
  kualifikasiPendidikan: string;
  kebutuhanABK: number;
  bezettingPns: number;
  bezettingPppk: number;
  bezettingTotal: number;
  selisih: number; // bezettingTotal - kebutuhanABK
  status: 'Kurang' | 'Lebih' | 'Sesuai';
  prioritasRekrutmen: 'Tinggi' | 'Sedang' | 'Rendah' | 'Cukup';
  keterangan: string;
}

export interface Opd {
  id: string;
  kode: string;
  nama: string;
  singkatan: string;
  kategori: KategoriOpd;
  kepalaOpd: string;
  totalKebutuhanABK: number;
  totalPns: number;
  totalPppk: number;
  totalBezetting: number;
  selisih: number;
}

export interface RekapitulasiStatistik {
  totalAsn: number;
  totalPns: number;
  totalPppk: number;
  totalKebutuhanAbk: number;
  totalKurang: number;
  totalLebih: number;
  totalSesuai: number;
  rasioKeterisian: number; // percentage
  pensiunTahunIni: number;
  pensiunTahunDepan: number;
  pensiunDuaTahun: number;
}
