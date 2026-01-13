'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ActionProps,
  CombinatorSelectorProps,
  FieldSelectorProps,
  OperatorSelectorProps,
  ValueEditorProps,
} from 'react-querybuilder';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

const isNamedOption = (opt: unknown): opt is { name: string; label: string } => {
  return typeof opt === 'object' && opt !== null && 'name' in opt;
};

export const AddFilterAction = (props: ActionProps) => {
  const { handleOnClick, disabled } = props;

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-sm font-medium text-mp-text-secondary hover:text-mp-primary transition-colors py-2"
    >
      <Plus className="w-4 h-4" />
      <span>Filter</span>
    </button>
  );
};

export const RemoveRuleAction = (props: ActionProps) => {
  const { handleOnClick, disabled } = props;

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className="p-1.5 text-mp-text-secondary hover:text-red-500 hover:bg-red-50 rounded transition-colors"
      title="Remove rule"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

export const RemoveGroupAction = (props: ActionProps) => {
  const { handleOnClick, disabled } = props;

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className="p-1.5 text-mp-text-secondary hover:text-red-500 hover:bg-red-50 rounded transition-colors"
      title="Remove group"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

export const InlineCombinatorDropdown = (props: CombinatorSelectorProps) => {
  const { value, handleOnChange, options, disabled, path } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const pathKey = useMemo(() => path.join('-'), [path]);

  const flatOptions = useMemo(() => {
    const result: { name: string; label: string }[] = [];
    for (const opt of options) {
      if (isNamedOption(opt)) {
        result.push({ name: opt.name, label: opt.label.toLowerCase() });
      }
    }
    return result;
  }, [options]);

  const selectedOption = flatOptions.find((opt) => opt.name === value);
  const displayLabel = selectedOption?.label || (value ?? '').toLowerCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    
    setIsOpen((prev) => {
      if (!prev && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 4,
          left: rect.left,
        });
      }
      return !prev;
    });
  }, [disabled]);

  const handleSelect = useCallback((e: React.MouseEvent, optionName: string) => {
    e.stopPropagation();
    handleOnChange(optionName);
    setIsOpen(false);
  }, [handleOnChange]);

  return (
    <div className="inline-combinator-dropdown" ref={containerRef} data-path={pathKey}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="inline-combinator-button"
      >
        {displayLabel}
      </button>

      {isOpen && (
        <div 
          className="inline-combinator-menu"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {flatOptions.map((opt) => {
            const isSelected = opt.name === value;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={(e) => handleSelect(e, opt.name)}
                className={`inline-combinator-option ${isSelected ? 'selected' : ''}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const FieldSelector = (props: FieldSelectorProps) => {
  const { handleOnChange, options, value, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const flatOptions = options.flatMap((opt) => {
    if (typeof opt === 'string') return [];
    if ('options' in opt && Array.isArray(opt.options)) {
      return opt.options.filter(isNamedOption);
    }
    if (isNamedOption(opt)) return [opt];
    return [];
  });

  const selectedOption = flatOptions.find((opt) => opt.name === value);
  const displayLabel = selectedOption?.label || value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionName: string) => {
    handleOnChange(optionName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium transition-colors rounded-md border bg-white min-w-0 sm:min-w-[120px] flex-shrink justify-between cursor-pointer
          ${isOpen 
            ? 'text-mp-primary border-mp-primary' 
            : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-gray-400 hidden sm:inline">Aa</span>
          <span className="truncate">{displayLabel}</span>
        </div>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 sm:w-56 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150 max-h-64 overflow-y-auto">
          {flatOptions.map((opt) => {
            const isSelected = opt.name === value;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => handleSelect(opt.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isSelected 
                    ? 'bg-mp-primary text-white' 
                    : 'text-mp-text-primary hover:text-mp-primary hover:bg-mp-primary/5'
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const OperatorSelector = (props: OperatorSelectorProps) => {
  const { handleOnChange, options, value, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const flatOptions = options.flatMap((opt) => {
    if (typeof opt === 'string') return [];
    if ('options' in opt && Array.isArray(opt.options)) {
      return opt.options.filter(isNamedOption);
    }
    if (isNamedOption(opt)) return [opt];
    return [];
  });

  const selectedOption = flatOptions.find((opt) => opt.name === value);
  const displayLabel = selectedOption?.label || value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionName: string) => {
    handleOnChange(optionName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium transition-colors rounded-md border bg-white min-w-0 sm:min-w-[80px] flex-shrink justify-between cursor-pointer
          ${isOpen 
            ? 'text-mp-primary border-mp-primary' 
            : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 sm:w-48 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150 max-h-64 overflow-y-auto">
          {flatOptions.map((opt) => {
            const isSelected = opt.name === value;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => handleSelect(opt.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isSelected 
                    ? 'bg-mp-primary text-white' 
                    : 'text-mp-text-primary hover:text-mp-primary hover:bg-mp-primary/5'
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const VALUE_LESS_OPERATORS = ['null', 'notNull'];

const BOOLEAN_OPTIONS = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];

export const ValueEditor = (props: ValueEditorProps) => {
  const { handleOnChange, value, disabled, inputType, fieldData, operator } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isBoolean = fieldData?.datatype === 'boolean';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isBoolean) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isBoolean]);

  if (VALUE_LESS_OPERATORS.includes(operator)) {
    return null;
  }

  if (isBoolean) {
    const selectedOption = BOOLEAN_OPTIONS.find((opt) => opt.value === value);
    const displayLabel = selectedOption?.label || 'Select...';

    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium transition-colors rounded-md border bg-white min-w-0 sm:min-w-[100px] flex-shrink justify-between cursor-pointer
            ${isOpen 
              ? 'text-mp-primary border-mp-primary' 
              : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`truncate ${selectedOption ? '' : 'text-gray-400'}`}>{displayLabel}</span>
          <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-28 sm:w-32 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150">
            {BOOLEAN_OPTIONS.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    handleOnChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isSelected 
                      ? 'bg-mp-primary text-white' 
                      : 'text-mp-text-primary hover:text-mp-primary hover:bg-mp-primary/5'
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isDate = fieldData?.datatype === 'date' || fieldData?.datatype === 'datetime-local';

  if (isDate) {
    const getLocalDateTimeString = (isoString: string): string => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const displayValue = value ? getLocalDateTimeString(String(value)) : '';

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const localValue = e.target.value;
      if (localValue) {
        const isoValue = new Date(localValue).toISOString();
        handleOnChange(isoValue);
      } else {
        handleOnChange('');
      }
    };

    return (
      <input
        type="datetime-local"
        value={displayValue}
        onChange={handleDateChange}
        disabled={disabled}
        className="bg-white text-mp-text-primary px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium border border-mp-border min-w-0 w-full sm:w-auto sm:min-w-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mp-primary focus:border-mp-primary transition-colors"
      />
    );
  }

  return (
    <input
      type={inputType || 'text'}
      value={value as string}
      onChange={(e) => handleOnChange(e.target.value)}
      disabled={disabled}
      placeholder={fieldData?.placeholder || 'Value'}
      className="bg-white text-mp-text-primary px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium border border-mp-border min-w-0 flex-1 sm:flex-initial sm:min-w-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mp-primary focus:border-mp-primary transition-colors"
    />
  );
};

export const HiddenAddGroup = () => null;
