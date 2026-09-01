'use client';

import { useState, useRef } from 'react';
import { Modal } from '@/components/Modal';
import { useBirthdayStore } from '@/store/useBirthdayStore';
import { parseCSV, ParsedBirthdayRow } from '@/utils/csvParser';
import { exportToCSV, exportToJSON, exportToVCard } from '@/utils/exporters';
import { toast } from '@/store/useToastStore';
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  Contact,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const { birthdays, importBirthdays } = useBirthdayStore();
  const [tab, setTab] = useState<'import' | 'export'>('import');
  const [parsedData, setParsedData] = useState<ParsedBirthdayRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;

        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            const formattedRows: ParsedBirthdayRow[] = json.map((item: any) => ({
              name: item.name || 'Sem nome',
              date: item.date || '2000-01-01',
              phone: item.phone || '',
              notes: item.notes || '',
              tags: item.tags || [],
              color: item.color || '#3b82f6',
              isValid: Boolean(item.name && item.date),
              isDuplicate: birthdays.some(
                (b) => b.name.toLowerCase() === (item.name || '').toLowerCase() && b.date === item.date
              ),
            }));
            setParsedData(formattedRows);
          } else {
            toast.error('Arquivo JSON deve conter um array de aniversários.');
          }
        } else {
          const rows = parseCSV(text, birthdays);
          setParsedData(rows);
        }
      } catch (err: any) {
        toast.error('Erro ao ler arquivo: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = async (skipDuplicates: boolean = false) => {
    const validRows = parsedData.filter((r) => r.isValid && (!skipDuplicates || !r.isDuplicate));

    if (validRows.length === 0) {
      toast.warning('Nenhum registro válido para importar.');
      return;
    }

    setIsLoading(true);
    try {
      const itemsToImport = validRows.map((r) => ({
        name: r.name,
        date: r.date,
        phone: r.phone || '',
        notes: r.notes || '',
        tags: r.tags || [],
        color: r.color || '#3b82f6',
      }));

      await importBirthdays(itemsToImport);
      toast.success(`${itemsToImport.length} aniversários importados com sucesso!`);
      setParsedData([]);
      setFileName(null);
      onClose();
    } catch (err: any) {
      toast.error('Erro ao importar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validCount = parsedData.filter((r) => r.isValid).length;
  const duplicateCount = parsedData.filter((r) => r.isDuplicate).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
            {tab === 'import' ? <Upload className="w-6 h-6" /> : <Download className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Backup & Sincronização</h2>
            <p className="text-sm text-foreground/60">Importe ou exporte seus dados de aniversários.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex bg-foreground/5 p-1 rounded-2xl border border-border/60">
          <button
            onClick={() => setTab('import')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              tab === 'import' ? 'bg-card text-foreground shadow-md' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Upload className="w-4 h-4" /> Importar Contatos
          </button>
          <button
            onClick={() => setTab('export')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              tab === 'export' ? 'bg-card text-foreground shadow-md' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Download className="w-4 h-4" /> Exportar Dados
          </button>
        </div>

        {tab === 'import' && (
          <div className="space-y-4">
            {parsedData.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-3xl p-8 text-center cursor-pointer transition-all bg-card/30 hover:bg-card/50 flex flex-col items-center justify-center"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.json,.txt"
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-1">Selecione um arquivo CSV ou JSON</h3>
                <p className="text-xs text-foreground/60 max-w-sm mb-4">
                  Aceitamos colunas com Nome, Data (AAAA-MM-DD ou DD/MM/AAAA), Celular e Notas.
                </p>
                <span className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md">
                  Procurar Arquivo no Dispositivo
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-card/50 p-4 rounded-2xl border border-border">
                  <div>
                    <p className="text-xs text-foreground/60 font-semibold uppercase">Arquivo carregado</p>
                    <p className="font-bold text-sm text-foreground truncate max-w-xs">{fileName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {validCount} válidos
                    </span>
                    {duplicateCount > 0 && (
                      <span className="text-amber-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {duplicateCount} duplicados
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setParsedData([]);
                        setFileName(null);
                      }}
                      className="p-1.5 text-foreground/40 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Remover arquivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-2xl border border-border/80 bg-background/50">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-card border-b border-border text-foreground/70">
                      <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Data</th>
                        <th className="p-3">Celular</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {parsedData.map((row, idx) => (
                        <tr key={idx} className={row.isValid ? '' : 'bg-rose-500/5'}>
                          <td className="p-3 font-semibold text-foreground">{row.name}</td>
                          <td className="p-3 text-foreground/70">{row.date}</td>
                          <td className="p-3 text-foreground/60">{row.phone || '-'}</td>
                          <td className="p-3">
                            {row.isDuplicate ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-bold text-[10px]">
                                Já existe
                              </span>
                            ) : row.isValid ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                                Novo
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 font-bold text-[10px]" title={row.error}>
                                Inválido
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {duplicateCount > 0 && (
                    <button
                      onClick={() => handleConfirmImport(true)}
                      disabled={isLoading}
                      className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 text-xs font-bold transition-all"
                    >
                      Pular Duplicados ({validCount - duplicateCount})
                    </button>
                  )}
                  <button
                    onClick={() => handleConfirmImport(false)}
                    disabled={isLoading || validCount === 0}
                    className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Confirmar Importação de {validCount} Aniversários
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'export' && (
          <div className="space-y-4">
            <p className="text-xs text-foreground/60">
              Você tem <strong>{birthdays.length} aniversários</strong> cadastrados prontos para exportação.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  exportToCSV(birthdays);
                  toast.success('Arquivo CSV exportado com sucesso!');
                }}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary transition-all flex flex-col items-center text-center gap-3 group hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Planilha Excel (CSV)</h4>
                  <p className="text-[11px] text-foreground/50 mt-0.5">Compatível com Excel e Google Sheets</p>
                </div>
              </button>

              <button
                onClick={() => {
                  exportToJSON(birthdays);
                  toast.success('Backup JSON exportado com sucesso!');
                }}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary transition-all flex flex-col items-center text-center gap-3 group hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Backup Completo (JSON)</h4>
                  <p className="text-[11px] text-foreground/50 mt-0.5">Restauração perfeita no Agniver</p>
                </div>
              </button>

              <button
                onClick={() => {
                  exportToVCard(birthdays);
                  toast.success('Contatos vCard (.vcf) exportados!');
                }}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary transition-all flex flex-col items-center text-center gap-3 group hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Contact className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Agenda de Contatos (vCard)</h4>
                  <p className="text-[11px] text-foreground/50 mt-0.5">Importe no iPhone, Android ou Google</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

