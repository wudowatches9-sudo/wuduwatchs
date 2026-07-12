"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { AdminInput } from "./AdminInput";
import { Label } from "../ui/label";

interface ColorSwatch {
  name: string;
  hex: string;
}

interface ColorSwatchManagerProps {
  value: ColorSwatch[];
  onChange: (swatches: ColorSwatch[]) => void;
}

export function ColorSwatchManager({ value, onChange }: ColorSwatchManagerProps) {
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const handleAddColor = () => {
    if (!newColorName.trim()) {
      alert("Please enter a color name");
      return;
    }

    const newSwatch: ColorSwatch = {
      name: newColorName.trim(),
      hex: newColorHex,
    };

    onChange([...value, newSwatch]);
    
    // Reset inputs
    setNewColorName("");
    setNewColorHex("#000000");
  };

  const handleRemoveColor = (index: number) => {
    const updatedSwatches = value.filter((_, i) => i !== index);
    onChange(updatedSwatches);
  };

  return (
    <div className="space-y-4">
      <Label>Color Swatches</Label>
      
      {/* Display Current Swatches */}
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Colors:</p>
          <div className="grid grid-cols-1 gap-2">
            {value.map((swatch, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 border border-muted-gold/20 rounded-lg"
              >
                <div
                  className="w-10 h-10 rounded border-2 border-white/20"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{swatch.name}</p>
                  <p className="text-sm text-muted-foreground">{swatch.hex}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(index)}
                  className="px-3 py-1 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Color Section */}
      <div className="border border-muted-gold/20 rounded-lg p-4 space-y-4 bg-white/5">
        <p className="font-medium text-foreground">Add New Color</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newColorName">Color Name</Label>
            <AdminInput
              id="newColorName"
              type="text"
              value={newColorName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewColorName(e.target.value)}
              placeholder="e.g., Navy Blue"
            />
          </div>

          <div>
            <Label htmlFor="newColorHex">Hex Code</Label>
            <AdminInput
              id="newColorHex"
              type="text"
              value={newColorHex}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewColorHex(e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <Label>Visual Color Picker</Label>
          <div className="mt-2">
            <HexColorPicker color={newColorHex} onChange={setNewColorHex} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-16 h-16 rounded border-2 border-white/20"
            style={{ backgroundColor: newColorHex }}
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="px-6 py-2 bg-green-500 text-black hover:bg-green-600 rounded font-medium transition-colors"
          >
            Add Color
          </button>
        </div>
      </div>
    </div>
  );
}
