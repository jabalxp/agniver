'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

interface DateInputProps {
  value: string; // Formato esperado: YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string; // Formato YYYY-MM-DD, padrão: 1910-01-01
  max?: string; // Formato YYYY-MM-DD, padrão: hoje
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  label?: string;
}

export const MIN_DATE = '1910-01-01';

export function DateInput({
  value,
  onChange,
  min = MIN_DATE,
  max,
  required = false,
  disabled = false,
  id,
  className = '',
}: DateInputProps) {
  const todayStr = max || new Date().toISOString().split('T')[0];
  const minYear = parseInt(min.split('-')[0], 10) || 1910;

  // Converte YYYY-MM-DD para DD/MM/AAAA
  const isoToDisplay = (iso: string): string => {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      if (y && m && d) {
        return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
      }
    }
    return '';
  };

  const [textValue, setTextValue] = useState<string>(() => isoToDisplay(value));
  const [error, setError] = useState<string | null>(null);
  const nativePickerRef = useRef<HTMLInputElement>(null);

  // Sincroniza quando o valor externo muda (ex: carregando edição)
  useEffect(() => {
    const formatted = isoToDisplay(value);
    setTextValue(formatted);
    if (value) {
      validateDate(value);
    } else {
      setError(null);
    }
  }, [value]);

  const validateDate = (isoDate: string): boolean => {
    const parts = isoDate.split('-');
    if (parts.length !== 3) {
      setError('Formato inválido');
      return false;
    }
    const [yStr, mStr, dStr] = parts;
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);
    const d = parseInt(dStr, 10);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      setError('Data inválida');
      return false;
    }

    if (y < minYear) {
      setError(`O ano mínimo permitido é ${minYear}`);
      return false;
    }

    if (isoDate > todayStr) {
      setError('A data não pode ser no futuro');
      return false;
    }

    // Verificar se a data é real (ex: 31 de abril, 29 de fev em ano não bissexto)
    const testDate = new Date(y, m - 1, d);
    if (
      testDate.getFullYear() !== y ||
      testDate.getMonth() !== m - 1 ||
      testDate.getDate() !== d
    ) {
      setError('Dia ou mês inválido no calendário');
      return false;
    }

    setError(null);
    return true;
  };

  // Formatação com máscara DD/MM/AAAA enquanto digita
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ''); // apenas dígitos

    let formatted = '';
    if (raw.length > 0) {
      formatted = raw.slice(0, 2);
      if (raw.length >= 3) {
        formatted += '/' + raw.slice(2, 4);
      }
      if (raw.length >= 5) {
        formatted += '/' + raw.slice(4, 8);
      }
    }

    setTextValue(formatted);

    // Se completou os 8 dígitos (DD/MM/AAAA = 10 chars com as barras)
    if (raw.length === 8) {
      const d = raw.slice(0, 2);
      const m = raw.slice(2, 4);
      const y = raw.slice(4, 8);
      const iso = `${y}-${m}-${d}`;

      const isValid = validateDate(iso);
      if (isValid) {
        onChange(iso);
      } else {
        // Notifica o formulário para não salvar data errada
        onChange('');
      }
    } else {
      if (raw.length === 0) {
        setError(null);
        onChange('');
      } else {
        setError(null);
      }
    }
  };

  const handleBlur = () => {
    const raw = textValue.replace(/\D/g, '');
    if (raw.length > 0 && raw.length < 8) {
      setError('Data incompleta (digite dia, mês e ano: DD/MM/AAAA)');
    }
  };

  // Quando o usuário seleciona via calendário nativo
  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedIso = e.target.value;
    if (!pickedIso) return;

    if (validateDate(pickedIso)) {
      setTextValue(isoToDisplay(pickedIso));
      onChange(pickedIso);
    }
  };

  // Aciona o seletor nativo
  const openCalendarPicker = () => {
    if (disabled) return;
    if (nativePickerRef.current) {
      try {
        if ('showPicker' in HTMLInputElement.prototype) {
          nativePickerRef.current.showPicker();
        } else {
          nativePickerRef.current.focus();
          nativePickerRef.current.click();
        }
      } catch {
        nativePickerRef.current.click();
      }
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="relative flex items-center">
        {/* Input de digitação amigável para celular e desktop */}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9/]*"
          maxLength={10}
          disabled={disabled}
          required={required}
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="DD/MM/AAAA"
          className={`w-full px-4 py-3 pr-12 bg-background/50 border rounded-2xl text-sm font-medium outline-none transition-all ${
            error
              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
              : 'border-border focus:ring-2 focus:ring-primary/50 focus:border-transparent'
          } ${className}`}
        />

        {/* Botão de calendário com input nativo sobreposto para toque seguro no celular */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          <button
            type="button"
            onClick={openCalendarPicker}
            disabled={disabled}
            title="Selecionar no calendário"
            className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors flex items-center justify-center relative group"
          >
            <CalendarIcon className="w-5 h-5 transition-transform group-hover:scale-110" />

            {/* Input nativo de data transparente para mobile picker */}
            <input
              ref={nativePickerRef}
              type="date"
              tabIndex={-1}
              min={min}
              max={todayStr}
              value={value || ''}
              onChange={handleNativePickerChange}
              disabled={disabled}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Abrir seletor de data"
            />
          </button>
        </div>
      </div>

      {/* Dica amigável e mensagens de validação */}
      <div className="flex items-center justify-between px-1 text-[11px]">
        {error ? (
          <span className="text-rose-500 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 inline" /> {error}
          </span>
        ) : (
          <span className="text-foreground/40 font-medium">
            Digite a data ou toque no 📅 calendário (Mín: {minYear})
          </span>
        )}
      </div>
    </div>
  );
}
