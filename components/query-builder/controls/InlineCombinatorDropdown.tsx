'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CombinatorSelectorProps } from 'react-querybuilder';

export const InlineCombinatorDropdown = (props: CombinatorSelectorProps) => {
    const { value, handleOnChange, options, disabled, path } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
  
    const pathKey = useMemo(() => path.join('-'), [path]);
  
    const flatOptions = useMemo(() => (options.filter((opt) => 'name' in opt)), [options]);
  
    const selectedOption = flatOptions.find((opt) => opt.name === value);
    const displayLabel = selectedOption?.label.toLowerCase() || (value ?? '').toLowerCase();
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
        const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
        
        if (isOutsideContainer && isOutsideMenu) {
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
  
        {isOpen && createPortal(
          <div 
            ref={menuRef}
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
                  {opt.label.toLowerCase()}
                </button>
              );
            })}
          </div>,
          document.body
        )}
      </div>
    );
  };