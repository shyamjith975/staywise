'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { Property, PropertyType, PropertyStatus } from '../../../types';
import { 
  X, 
  Building2, 
  MapPin, 
  Layers, 
  IndianRupee, 
  Trash2, 
  Save, 
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const PRESET_PROPERTY_IMAGES = [
  { label: 'Beach Road Luxury', url: '/images/properties/beach-road.jpg' },
  { label: 'Serene Estate Villa', url: '/images/properties/estate-villa.jpg' },
  { label: 'Commercial Tech Park', url: '/images/properties/tech-park.jpg' },
  { label: 'Modern Highrise', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
  { label: 'Co-Living PG', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' }
];

export default function EditPropertyModal() {
  const { 
    isEditPropertyModalOpen, 
    setIsEditPropertyModalOpen, 
    propertyToEdit, 
    setPropertyToEdit,
    updateProperty, 
    deleteProperty 
  } = useAppState();

  const [formData, setFormData] = useState<Partial<Property>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        name: propertyToEdit.name,
        type: propertyToEdit.type,
        portfolio: propertyToEdit.portfolio,
        address: propertyToEdit.address,
        city: propertyToEdit.city,
        state: propertyToEdit.state,
        pincode: propertyToEdit.pincode,
        totalUnits: propertyToEdit.totalUnits,
        occupiedUnits: propertyToEdit.occupiedUnits,
        expectedMonthlyRent: propertyToEdit.expectedMonthlyRent,
        status: propertyToEdit.status,
        healthScore: propertyToEdit.healthScore,
        imageUrl: propertyToEdit.imageUrl || '/images/properties/beach-road.jpg'
      });
      setConfirmDelete(false);
    }
  }, [propertyToEdit]);

  if (!isEditPropertyModalOpen || !propertyToEdit) return null;

  const handleClose = () => {
    setIsEditPropertyModalOpen(false);
    setPropertyToEdit(null);
    setConfirmDelete(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    updateProperty(propertyToEdit.id, {
      ...formData,
      totalUnits: Number(formData.totalUnits) || 1,
      occupiedUnits: Number(formData.occupiedUnits) || 0,
      expectedMonthlyRent: Number(formData.expectedMonthlyRent) || 0,
      healthScore: Number(formData.healthScore) || 90,
      imageUrl: formData.imageUrl || propertyToEdit.imageUrl
    });

    handleClose();
  };

  const handleDelete = () => {
    deleteProperty(propertyToEdit.id);
    handleClose();
  };

  const propertyTypes: PropertyType[] = [
    'Apartment',
    'Independent House',
    'Villa',
    'Duplex',
    'Studio',
    'Holiday Home',
    'PG',
    'Hostel',
    'Co-living',
    'Commercial Building',
    'Office',
    'Shop',
    'Retail Space',
    'Warehouse',
    'Industrial Property',
    'Villa Estate'
  ];

  const propertyStatuses: PropertyStatus[] = [
    'ACTIVE',
    'OCCUPIED',
    'PARTIALLY_OCCUPIED',
    'VACANT',
    'LISTED',
    'UNDER_MAINTENANCE'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-3xl border border-[#e3e1d8] shadow-2xl max-w-2xl w-full overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#19251f] to-[#274235] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Edit Property
                </span>
                <span className="text-xs text-slate-300 truncate max-w-[200px]">{propertyToEdit.portfolio}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                {formData.name || propertyToEdit.name}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Property Picture & Cover Section */}
          <div className="p-3.5 rounded-2xl bg-[#fbfbfa] border border-[#e8e6de] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#274235] flex items-center gap-1.5 uppercase tracking-wider">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
                <span>Property Cover Picture</span>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-xl bg-white border border-slate-300 hover:border-[#274235] text-slate-700 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Upload className="h-3.5 w-3.5 text-[#274235]" />
                <span>Upload New Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative h-20 w-32 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shrink-0 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.imageUrl || propertyToEdit.imageUrl}
                  alt={formData.name || 'Property'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Or paste an image URL..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#274235] bg-white"
                />
                
                {/* Preset image pills */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400 font-bold">Presets:</span>
                  {PRESET_PROPERTY_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border font-semibold transition ${
                        formData.imageUrl === img.url 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Property Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Property / Building Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#274235] focus:ring-1 focus:ring-[#274235]"
                placeholder="e.g. Beach Road Luxury Apartments"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Asset Universe Type *
              </label>
              <select
                value={formData.type || 'Apartment'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#274235] focus:ring-1 focus:ring-[#274235] bg-white"
              >
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Portfolio & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Portfolio Group
              </label>
              <input
                type="text"
                value={formData.portfolio || ''}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#274235] focus:ring-1 focus:ring-[#274235]"
                placeholder="e.g. Kozhikode Coastal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Operational Status
              </label>
              <select
                value={formData.status || 'ACTIVE'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#274235] focus:ring-1 focus:ring-[#274235] bg-white"
              >
                {propertyStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Fields */}
          <div className="p-3.5 rounded-2xl bg-[#fbfbfa] border border-[#e8e6de] space-y-3">
            <span className="text-[11px] font-extrabold text-[#274235] flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Location Details</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#274235] bg-white"
                  placeholder="Street / Area Address"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#274235] bg-white"
                  placeholder="City"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#274235] bg-white"
                  placeholder="State"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.pincode || ''}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#274235] bg-white"
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          {/* Financials & Capacity */}
          <div className="p-3.5 rounded-2xl bg-[#fbfbfa] border border-[#e8e6de] space-y-3">
            <span className="text-[11px] font-extrabold text-[#274235] flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-teal-600" />
              <span>Units &amp; Revenue Metrics</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Expected Monthly Rent (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.expectedMonthlyRent ?? 0}
                    onChange={(e) => setFormData({ ...formData, expectedMonthlyRent: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-black focus:outline-none focus:border-[#274235] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Total Units / Keys
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalUnits ?? 1}
                  onChange={(e) => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#274235] bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Occupied Units
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalUnits || 999}
                  value={formData.occupiedUnits ?? 0}
                  onChange={(e) => setFormData({ ...formData, occupiedUnits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#274235] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Delete Danger Zone */}
          {confirmDelete ? (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2.5 text-xs text-rose-900 animate-in fade-in">
              <div className="flex items-center gap-2 font-black text-rose-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Confirm Property Removal</span>
              </div>
              <p className="text-[11px] text-rose-700">
                Are you sure you want to permanently remove <strong>{propertyToEdit.name}</strong>? All unit configurations and revenue associations in this session will be deleted.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition"
                >
                  Yes, Remove Property
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-rose-50 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Property</span>
              </button>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#274235] hover:bg-[#19251f] text-white text-xs font-black shadow-lg shadow-[#274235]/20 flex items-center gap-2 transition hover:scale-[1.02] active:scale-95"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
