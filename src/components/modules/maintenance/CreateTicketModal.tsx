'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  X, 
  Wrench, 
  Camera, 
  Send, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function CreateTicketModal() {
  const { isCreateTicketOpen, setIsCreateTicketOpen, createMaintenanceTicket } = useAppState();

  const [formData, setFormData] = useState({
    title: '',
    category: 'AC' as 'Electrical' | 'Plumbing' | 'AC' | 'Appliance' | 'Cleaning' | 'Structural' | 'Other',
    priority: 'Medium' as 'Emergency' | 'High' | 'Medium' | 'Low',
    description: '',
    estimatedCost: 1800,
    photoAttached: false
  });

  if (!isCreateTicketOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMaintenanceTicket({
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      description: formData.description,
      estimatedCost: Number(formData.estimatedCost),
      unitNumber: '302',
      propertyName: 'Beach Road Luxury Apartments',
      tenantName: 'Shyam Sundar'
    });
    setIsCreateTicketOpen(false);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsCreateTicketOpen(false); }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-white border border-[#B5B5B5] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-[#ffffff]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#f0f0f0] text-[#2a2a2a] flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#2a2a2a]">Raise Maintenance Request</h2>
              <p className="text-[11px] text-[#666666]">Apartment 302 • Instant Vendor Dispatch</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsCreateTicketOpen(false)} 
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#666666] hover:text-[#2a2a2a] hover:bg-[#f0f0f0] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
          <div>
            <label className="block text-[#2a2a2a] font-semibold mb-1">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Bedroom AC cooling efficiency drop"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] placeholder-[#888888] focus:outline-none focus:border-[#2a2a2a] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#2a2a2a] font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] focus:outline-none focus:border-[#2a2a2a]"
              >
                <option value="AC">AC & HVAC</option>
                <option value="Plumbing">Plumbing & Seepage</option>
                <option value="Electrical">Electrical & MCB</option>
                <option value="Appliance">Appliances</option>
                <option value="Cleaning">Deep Cleaning</option>
                <option value="Structural">Structural / Carpentry</option>
              </select>
            </div>

            <div>
              <label className="block text-[#2a2a2a] font-semibold mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] focus:outline-none focus:border-[#2a2a2a]"
              >
                <option value="Low">Low (Within 72h)</option>
                <option value="Medium">Medium (Within 24h)</option>
                <option value="High">High (Within 6h)</option>
                <option value="Emergency">Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#2a2a2a] font-semibold mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the exact location and symptoms of the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] placeholder-[#888888] focus:outline-none focus:border-[#2a2a2a] focus:bg-white resize-none"
            />
          </div>

          {/* Photo attachment simulation */}
          <div>
            <label className="block text-[#2a2a2a] font-semibold mb-1">Proof Photo (Optional)</label>
            <div
              onClick={() => setFormData({ ...formData, photoAttached: !formData.photoAttached })}
              className={`p-3.5 rounded-2xl border border-dashed cursor-pointer transition flex items-center justify-center gap-2 ${
                formData.photoAttached
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-[#B5B5B5] bg-[#f0f0f0] text-[#666666] hover:bg-white'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>{formData.photoAttached ? '1 Photo Attached (ac_leak.jpg)' : 'Tap to attach or take photo'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2a2a2a] hover:bg-[#2a2a2a] text-white font-bold text-xs shadow-xl shadow-[#2a2a2a]/20 transition flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Submit Service Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
