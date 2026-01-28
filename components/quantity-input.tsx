'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
}

export function QuantityInput({ 
  value, 
  onChange, 
  min = 0, 
  max = 999,
  disabled = false,
  label = 'Qty:'
}: QuantityInputProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>}
      <div className="flex items-center border border-border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 border-r border-border rounded-none"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled || value <= min}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || min;
            if (newValue >= min && newValue <= max) {
              onChange(newValue);
            }
          }}
          className="w-14 h-9 text-center border-0 p-0"
          min={min}
          max={max}
          disabled={disabled}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 border-l border-border rounded-none"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled || value >= max}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
