import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { Employee, Opd, JenisPegawai, JenisJabatan, StatusKepegawaian } from '../types/bezetting';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employeeToEdit?: Employee | null;
  opdList: Opd[];
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeToEdit,
  opdList,
}) => {
  const [nip, setNip] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [tanggalLahir, setTanggalLahir] = useState<string>('1985-05-15');
  const [tempatLahir, setTempatLahir] = useState<string>('Bandung Barat');
  const [pangkatGolongan, setPangkatGolongan] = useState<string>('Penata Tingkat I (III/d)');
  const [golonganKode, setGolonganKode] = useState<string>('III/d');
  const [jenisPegawai, setJenisPegawai] = useState<JenisPegawai>('PNS');
  const [jabatan, setJabatan] = useState<string>('');
  const [jenisJabatan, setJenisJabatan] = useState<JenisJabatan>('Fungsional Tertentu');
  const [eselon, setEselon] = useState<'II.a' | 'II.b' | 'III.a' | 'III.b' | 'IV.a' | 'IV.b' | 'Non-Eselon'>('Non-Eselon');
  const [opdId, setOpdId] = useState<string>(opdList[0]?.id || '');
  const [subUnitKerja, setSubUnitKerja] = useState<string>('');
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState<'S3' | 'S2' | 'S1' | 'D4' | 'D3' | 'SMA/SMK'>('S1');
  const [jurusan, setJurusan] = useState<string>('Administrasi Publik');
  const [tmtPns, setTmtPns] = useState<string>('2010-01-01');
  const [tmtJabatan, setTmtJabatan] = useState<string>('2022-01-01');
  const [status, setStatus] = useState<StatusKepegawaian>('Aktif');

  useEffect(() => {
    if (employeeToEdit) {
      setNip(employeeToEdit.nip);
      setNama(employeeToEdit.nama);
      setJenisKelamin(employeeToEdit.jenisKelamin);
      setTanggalLahir(employeeToEdit.tanggalLahir);
      setTempatLahir(employeeToEdit.tempatLahir);
      setPangkatGolongan(employeeToEdit.pangkatGolongan);
      setGolonganKode(employeeToEdit.golonganKode);
      setJenisPegawai(employeeToEdit.jenisPegawai);
      setJabatan(employeeToEdit.jabatan);
      setJenisJabatan(employeeToEdit.jenisJabatan);
      setEselon(employeeToEdit.eselon);
      setOpdId(employeeToEdit.opdId);
      setSubUnitKerja(employeeToEdit.subUnitKerja);
      setPendidikanTerakhir(employeeToEdit.pendidikanTerakhir);
      setJurusan(employeeToEdit.jurusan);
      setTmtPns(employeeToEdit.tmtPns);
      setTmtJabatan(employeeToEdit.tmtJabatan);
      setStatus(employeeToEdit.status);
    } else {
      // Reset form
      setNip('19900101 201501 1 001');
      setNama('');
      setJenisKelamin('L');
      setTanggalLahir('1990-01-01');
      setTempatLahir('Bandung Barat');
      setPangkatGolongan('Penata Muda Tingkat I (III/b)');
      setGolonganKode('III/b');
      setJenisPegawai('PNS');
      setJabatan('');
      setJenisJabatan('Fungsional Tertentu');
      setEselon('Non-Eselon');
      setOpdId(opdList[0]?.id || '');
      setSubUnitKerja('');
      setPendidikanTerakhir('S1');
      setJurusan('');
      setTmtPns('2015-01-01');
      setTmtJabatan('2022-01-01');
      setStatus('Aktif');
    }
  }, [employeeToEdit, isOpen, opdList]);

  if (!isOpen) return null;

  // Auto NIP parsing: if valid 18 digits (YYYYMMDD YYYYMM G NNN)
  const handleNipChange = (val: string) => {
    setNip(val);
    const cleanDigits = val.replace(/\D/g, '');
    if (cleanDigits.length >= 8) {
      const year = cleanDigits.substring(0, 4);
      const month = cleanDigits.substring(4, 6);
      const day = cleanDigits.substring(6, 8);
      const numYear = parseInt(year, 10);
      const numMonth = parseInt(month, 10);
      const numDay = parseInt(day, 10);

      if (numYear >= 1950 && numYear <= 2010 && numMonth >= 1 && numMonth <= 12 && numDay >= 1 && numDay <= 31) {
        setTanggalLahir(`${year}-${month}-${day}`);
      }
    }
    if (cleanDigits.length >= 15) {
      const genderDigit = cleanDigits.charAt(14);
      if (genderDigit === '1') setJenisKelamin('L');
      if (genderDigit === '2') setJenisKelamin('P');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nip.trim() || !jabatan.trim()) return;

    const birthYear = new Date(tanggalLahir).getFullYear() || 1985;
    const currentYear = new Date().getFullYear();
    const usia = Math.max(20, currentYear - birthYear);

    // Batas Usia Pensiun: 58 untuk Pelaksana/Pengawas, 60 untuk JPT/Fungsional Madya/Utama
    const bupAge = ['Struktural/JPT', 'Fungsional Tertentu'].includes(jenisJabatan) ? 60 : 58;
    const tahunPensiun = birthYear + bupAge;
    const sisaMasaKerjaTahun = Math.max(0, tahunPensiun - currentYear);

    const selectedOpdObj = opdList.find((o) => o.id === opdId);

    const newEmployee: Employee = {
      id: employeeToEdit?.id || `emp-${Date.now()}`,
      nip: nip.trim(),
      nama: nama.trim(),
      jenisKelamin,
      tanggalLahir,
      tempatLahir: tempatLahir.trim(),
      usia,
      pangkatGolongan,
      golonganKode,
      jenisPegawai,
      jabatan: jabatan.trim(),
      jenisJabatan,
      eselon,
      opdId,
      unitKerja: selectedOpdObj?.nama || 'Pemerintah Kabupaten Bandung Barat',
      subUnitKerja: subUnitKerja.trim() || 'Unit Pelaksana',
      pendidikanTerakhir,
      jurusan: jurusan.trim() || 'Umum',
      tmtPns,
      tmtJabatan,
      tahunPensiun,
      bulanPensiun: 12,
      sisaMasaKerjaTahun,
      status,
    };

    onSave(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {employeeToEdit ? 'Edit Data Pegawai ASN' : 'Perekaman Pegawai ASN Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Integrasi Buku Bezetting Bagian Organisasi Setda Kab. Bandung Barat
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4 max-h-[72vh] overflow-y-auto pr-1">
          
          {/* Row 1: NIP & Nama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP (18 Digit) *
              </label>
              <input
                type="text"
                placeholder="19850101 201001 1 001"
                value={nip}
                onChange={(e) => handleNipChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap (dengan gelar) *
              </label>
              <input
                type="text"
                placeholder="Nama lengkap..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium"
                required
              />
            </div>
          </div>

          {/* Row 2: Jenis Pegawai, Pangkat, Golongan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Kepegawaian *
              </label>
              <select
                value={jenisPegawai}
                onChange={(e) => setJenisPegawai(e.target.value as JenisPegawai)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                <option value="PPPK">PPPK (Pegawai Perjanjian Kerja)</option>
                <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Golongan Ruang
              </label>
              <select
                value={golonganKode}
                onChange={(e) => {
                  setGolonganKode(e.target.value);
                  const pMap: Record<string, string> = {
                    'IV/e': 'Pembina Utama (IV/e)',
                    'IV/d': 'Pembina Utama Madya (IV/d)',
                    'IV/c': 'Pembina Utama Muda (IV/c)',
                    'IV/b': 'Pembina Tingkat I (IV/b)',
                    'IV/a': 'Pembina (IV/a)',
                    'III/d': 'Penata Tingkat I (III/d)',
                    'III/c': 'Penata (III/c)',
                    'III/b': 'Penata Muda Tingkat I (III/b)',
                    'III/a': 'Penata Muda (III/a)',
                    'II/d': 'Pengatur Tingkat I (II/d)',
                    'II/c': 'Pengatur (II/c)',
                    'IX': 'Ahli Pertama (Gol. IX PPPK)',
                    'VII': 'Terampil (Gol. VII PPPK)',
                  };
                  setPangkatGolongan(pMap[e.target.value] || e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
              >
                <option value="IV/d">IV/d (Pembina Utama Madya)</option>
                <option value="IV/c">IV/c (Pembina Utama Muda)</option>
                <option value="IV/b">IV/b (Pembina Tingkat I)</option>
                <option value="IV/a">IV/a (Pembina)</option>
                <option value="III/d">III/d (Penata Tingkat I)</option>
                <option value="III/c">III/c (Penata)</option>
                <option value="III/b">III/b (Penata Muda Tingkat I)</option>
                <option value="III/a">III/a (Penata Muda)</option>
                <option value="II/d">II/d (Pengatur Tingkat I)</option>
                <option value="II/c">II/c (Pengatur)</option>
                <option value="IX">IX (PPPK Ahli Pertama)</option>
                <option value="VII">VII (PPPK Terampil)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Row 3: Jabatan & Jenis Jabatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Jabatan *
              </label>
              <input
                type="text"
                placeholder="Misal: Analis Kebijakan Ahli Muda"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Jabatan
              </label>
              <select
                value={jenisJabatan}
                onChange={(e) => setJenisJabatan(e.target.value as JenisJabatan)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Struktural/JPT">JPT Pratama</option>
                <option value="Administrator">Administrator (Eselon III)</option>
                <option value="Pengawas">Pengawas (Eselon IV)</option>
                <option value="Fungsional Tertentu">Fungsional Tertentu (JF Ahli)</option>
                <option value="Fungsional Pelaksana">Fungsional Pelaksana / Staf</option>
              </select>
            </div>
          </div>

          {/* Row 4: Perangkat Daerah (OPD) & Sub Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Perangkat Daerah (OPD) *
              </label>
              <select
                value={opdId}
                onChange={(e) => setOpdId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
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
                Sub-Unit Kerja / Bidang / Seksi
              </label>
              <input
                type="text"
                placeholder="Misal: Sub-Bagian Kelembagaan dan Anjab"
                value={subUnitKerja}
                onChange={(e) => setSubUnitKerja(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Row 5: Pendidikan & Jurusan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenjang Pendidikan
              </label>
              <select
                value={pendidikanTerakhir}
                onChange={(e) => setPendidikanTerakhir(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="S3">S3 (Doktor)</option>
                <option value="S2">S2 (Magister)</option>
                <option value="S1">S1 (Sarjana)</option>
                <option value="D4">D4 (Diploma IV)</option>
                <option value="D3">D3 (Diploma III)</option>
                <option value="SMA/SMK">SMA / SMK</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Program Studi / Jurusan
              </label>
              <input
                type="text"
                placeholder="Misal: Ilmu Pemerintahan, Manajemen Informatika"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Row 6: Tanggal Lahir & TMT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                TMT Pengangkatan
              </label>
              <input
                type="date"
                value={tmtPns}
                onChange={(e) => setTmtPns(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Keaktifan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusKepegawaian)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Aktif">Aktif Bekerja</option>
                <option value="Tugas Belajar">Tugas Belajar</option>
                <option value="Cuti Luar Tanggungan">Cuti Luar Tanggungan</option>
                <option value="Masa Persiapan Pensiun">Masa Persiapan Pensiun (MPP)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Data ASN</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
