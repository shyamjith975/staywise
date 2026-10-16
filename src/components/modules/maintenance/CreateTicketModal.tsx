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
  const { 
    isCreateTicketOpen, 
    setIsCreateTicketOpen, 
    createMaintenanceTicket,
    currentUser,
    tenants,
    properties
  } = useAppState();

  const isDemo = currentUser?.email === 'tenant@staywise.com';
  const myTenancy = tenants.find(t => 
    (currentUser?.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser?.id && (t.userId === currentUser.id || t.id === currentUser.id))
  );
  const myProperty = myTenancy ? properties.find(p => p.id === myTenancy.propertyId) : null;
  const unitNumber = myTenancy?.unitNumber || (isDemo ? '302' : 'General');
  const propertyName = myProperty?.name || myTenancy?.propertyName || (isDemo ? 'Beach Road Luxury Apartments' : 'My Residence');
  const tenantName = currentUser?.name || 'Resident';

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
      unitNumber,
      propertyName,
      tenantName
    });
    setIsCreateTicketOpen(false);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsCreateTicketOpen(false); }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-white border border-[#D2DDD7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto text-[#263238]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D2DDD7] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center border border-[#D2DDD7]">
              <Wrench className="h-4 w-4 text-[#163B36]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#263238]">Raise Maintenance Request</h2>
              <p className="text-[11px] text-[#263238]/70">{propertyName} {unitNumber ? `• Unit ${unitNumber}` : ''} • Instant Vendor Dispatch</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsCreateTicketOpen(false)} 
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#263238]/60 hover:text-[#263238] hover:bg-[#E8F0EC] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
          <div>
            <label className="block text-[#263238] font-semibold mb-1">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Bedroom AC cooling efficiency drop"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] text-[#263238] placeholder-[#263238]/50 focus:outline-none focus:border-[#163B36] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#263238] font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#163B36]"
              >
                <option value="AC">AC &amp; HVAC</option>
                <option value="Plumbing">Plumbing &amp; Seepage</option>
                <option value="Electrical">Electrical &amp; MCB</option>
                <option value="Appliance">Appliances</option>
                <option value="Cleaning">Deep Cleaning</option>
                <option value="Structural">Structural / Carpentry</option>
              </select>
            </div>

            <div>
              <label className="block text-[#263238] font-semibold mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#163B36]"
              >
                <option value="Low">Low (Within 72h)</option>
                <option value="Medium">Medium (Within 24h)</option>
                <option value="High">High (Within 6h)</option>
                <option value="Emergency">Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#263238] font-semibold mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the exact location and symptoms of the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] text-[#263238] placeholder-[#263238]/50 focus:outline-none focus:border-[#163B36] focus:bg-white resize-none"
            />
          </div>

          {/* Photo attachment simulation */}
          <div>
            <label className="block text-[#263238] font-semibold mb-1">Proof Photo (Optional)</label>
            <div
              onClick={() => setFormData({ ...formData, photoAttached: !formData.photoAttached })}
              className={`p-3.5 rounded-2xl border border-dashed cursor-pointer transition flex items-center justify-center gap-2 ${
                formData.photoAttached
                  ? 'border-[#163B36] bg-[#E8F0EC] text-[#163B36] font-bold'
                  : 'border-[#D2DDD7] bg-[#E8F0EC]/40 text-[#263238]/70 hover:bg-white'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>{formData.photoAttached ? '1 Photo Attached (ac_leak.jpg)' : 'Tap to attach or take photo'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs shadow-xl shadow-[#163B36]/20 transition flex items-center justify-center gap-2"
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
