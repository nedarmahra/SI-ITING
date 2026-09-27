import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { parseExcelFile, generateTemplateExcel } from '../utils/excelExport';
import { Employee, Opd } from '../types/bezetting';

interface ExcelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (newEmployees: Employee[]) => void;
  opdList: Opd[];
}

export const ExcelManagerModal: React.FC<ExcelManagerModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  opdList,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsParsing(true);
    setParseError(null);

    const result = await parseExcelFile(file);
    setIsParsing(false);

    if (result.success && result.data) {
      if (result.data.length === 0) {
        setParseError('File Excel tidak berisi data.');
      } else {
        setParsedRows(result.data);
      }
    } else {
      setParseError(result.error || 'Gagal memproses file Excel.');
    }
  };

  const handleApplyImport = () => {
    if (parsedRows.length === 0) return;

    // Convert parsed rows to Employee format
    const newEmployees: Employee[] = parsedRows.map((row, idx) => {
      // Handle flexible header naming
      const nipRaw = String(row['NIP (18 Digit)'] || row['NIP'] || row['nip'] || `19900101 202001 1 0${idx + 10}`);
      const nama = String(row['Nama Lengkap (dengan gelar)'] || row['Nama'] || row['nama'] || `Pegawai Baru ${idx + 1}`);
      const jabatan = String(row['Nama Jabatan'] || row['Jabatan'] || row['jabatan'] || 'Staf Pelaksana');
      const unitKerja = String(row['Unit Kerja (OPD)'] || row['Unit Kerja'] || row['opd'] || opdList[0]?.nama || 'Bagian Organisasi Setda');
      const jenisPegawai = String(row['Jenis Pegawai (PNS/PPPK)'] || row['Jenis Pegawai'] || (nipRaw.includes('PPPK') ? 'PPPK' : 'PNS')) as any;
      const pangkatGolongan = String(row['Pangkat Golongan'] || row['Golongan'] || 'Penata Muda (III/a)');

      // Extract birthyear & pension
      const cleanDigits = nipRaw.replace(/\D/g, '');
      let birthYear = 1990;
      if (cleanDigits.length >= 4) {
        const y = parseInt(cleanDigits.substring(0, 4), 10);
        if (y >= 1955 && y <= 2005) birthYear = y;
      }
      const currentYear = new Date().getFullYear();
      const usia = Math.max(20, currentYear - birthYear);
      const tahunPensiun = birthYear + 58;

      const matchedOpd = opdList.find((o) => o.nama.toLowerCase().includes(unitKerja.toLowerCase())) || opdList[0];

      return {
        id: `imported-${Date.now()}-${idx}`,
        nip: nipRaw,
        nama,
        jenisKelamin: 'L',
        tanggalLahir: `${birthYear}-01-01`,
        tempatLahir: 'Bandung Barat',
        usia,
        pangkatGolongan,
        golonganKode: pangkatGolongan.includes('IV') ? 'IV/a' : pangkatGolongan.includes('III') ? 'III/a' : 'II/c',
        jenisPegawai: jenisPegawai === 'PPPK' ? 'PPPK' : 'PNS',
        jabatan,
        jenisJabatan: 'Fungsional Pelaksana',
        eselon: 'Non-Eselon',
        opdId: matchedOpd.id,
        unitKerja: matchedOpd.nama,
        subUnitKerja: 'Unit Pelaksana',
        pendidikanTerakhir: 'S1',
        jurusan: 'Umum',
        tmtPns: '2020-01-01',
        tmtJabatan: '2022-01-01',
        tahunPensiun,
        bulanPensiun: 12,
        sisaMasaKerjaTahun: Math.max(0, tahunPensiun - currentYear),
        status: 'Aktif',
      };
    });

    onImportSuccess(newEmployees);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Import & Sinkronisasi Excel</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unggah format file Excel data bezetting pegawai dari Perangkat Daerah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-4 text-xs">
          
          {/* Step 1: Download Template */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">
                Unduh Format Standar Excel KBB
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Gunakan template resmi agar kolom NIP, nama, dan jabatan terpetakan presisi.
              </span>
            </div>
            <button
              onClick={generateTemplateExcel}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh Template</span>
            </button>
          </div>

          {/* Step 2: Upload Area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 transition-colors rounded-xl p-6 text-center">
            <input
              type="file"
              id="excel-file-input"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="excel-file-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 text-xs block">
                  {selectedFile ? selectedFile.name : 'Klik untuk memilih file Excel (.xlsx / .xls)'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Maksimal ukuran file 15 MB
                </span>
              </div>
            </label>
          </div>

          {/* Parsing States */}
          {isParsing && (
            <div className="text-center py-2 text-slate-500 text-xs">
              Membaca dan memvalidasi lembar kerja...
            </div>
          )}

          {parseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {parsedRows.length > 0 && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Berhasil membaca {parsedRows.length} baris pegawai</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Data siap diintegrasikan ke dalam Buku Bezetting aktif. Klik "Terapkan Import" di bawah ini.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={parsedRows.length === 0}
            onClick={handleApplyImport}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <span>Terapkan Import ({parsedRows.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
