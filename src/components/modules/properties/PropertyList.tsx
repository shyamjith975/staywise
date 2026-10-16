'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { Property, PropertyUnit } from '../../../types';
import { 
  Building, 
  MapPin, 
  Layers, 
  CheckCircle, 
  Clock, 
  Plus, 
  UserPlus, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Pencil,
  Trash2
} from 'lucide-react';

export default function PropertyList() {
  const { 
    properties, 
    activePortfolio, 
    setActivePortfolio,
    setIsAddPropertyOpen, 
    setIsExistingTenantWizardOpen,
    setIsEditPropertyModalOpen,
    setPropertyToEdit,
    deleteProperty,
    activeRole,
    currentUser
  } = useAppState();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const ownerProperties = (currentUser.id && currentUser.id !== 'user-owner-vikram' && activeRole === 'owner')
    ? properties.filter(p => p.ownerId === currentUser.id)
    : properties;

  const baseProperties = ownerProperties;

  // Derive all distinct portfolios belonging to this owner
  const availablePortfolios = Array.from(new Set(baseProperties.map(p => p.portfolio).filter(Boolean)));

  // Filter properties by portfolio if selected, or fall back to all if no match
  const filteredProperties = (activePortfolio === 'all' || !activePortfolio)
    ? baseProperties
    : baseProperties.filter(p => p.portfolio && p.portfolio.toLowerCase().includes(activePortfolio.toLowerCase()));

  // Fallback: If portfolio filter yielded 0 results but owner has properties, show all properties so newly added assets are never hidden!
  const displayedProperties = (filteredProperties.length === 0 && baseProperties.length > 0)
    ? baseProperties
    : filteredProperties;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
              Properties & Unit Hierarchy
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#263238] font-bold border border-[#263238]/20">
              {displayedProperties.length} Properties
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Multi-tier Asset Hierarchy: Portfolio → Property → Building → Floor → Unit
          </p>
        </div>

        {activeRole !== 'admin' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsExistingTenantWizardOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#E8F0EC] text-[#263238] text-xs font-bold border border-[#D2DDD7] transition flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="h-4 w-4 text-[#263238]" />
              <span>Onboard Tenant</span>
            </button>
            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white font-bold text-xs shadow-md shadow-[#263238]/20 transition flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Property</span>
            </button>
          </div>
        )}
      </div>

      {/* Portfolio Filter Pills */}
      {availablePortfolios.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActivePortfolio('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition shrink-0 ${
              activePortfolio === 'all'
                ? 'bg-[#263238] text-white shadow-xs'
                : 'bg-white hover:bg-[#E8F0EC] text-[#666666] border border-[#D2DDD7]'
            }`}
          >
            All Portfolios ({baseProperties.length})
          </button>
          {availablePortfolios.map(port => {
            const count = baseProperties.filter(p => p.portfolio === port).length;
            const isSelected = activePortfolio.toLowerCase() === port.toLowerCase();
            return (
              <button
                key={port}
                type="button"
                onClick={() => setActivePortfolio(port)}
                className={`px-3 py-1.5 rounded-full font-bold transition shrink-0 ${
                  isSelected
                    ? 'bg-[#263238] text-white shadow-xs'
                    : 'bg-white hover:bg-[#E8F0EC] text-[#666666] border border-[#D2DDD7]'
                }`}
              >
                {port} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State when no properties found */}
      {displayedProperties.length === 0 && (
        <div className="bg-white rounded-3xl border border-[#D2DDD7] p-10 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-[#E8F0EC] flex items-center justify-center text-[#263238]">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#263238]">No Properties in This Portfolio Yet</h3>
            <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
              Add your first building, apartment complex, or commercial unit to start collecting rent and onboarding tenants.
            </p>
          </div>
          {activeRole !== 'admin' && (
            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#263238] text-white text-xs font-bold hover:bg-[#1a1a1a] transition inline-flex items-center gap-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Property</span>
            </button>
          )}
        </div>
      )}

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedProperties.map((prop) => {
          const occRate = prop.totalUnits > 0 ? Math.round((prop.occupiedUnits / prop.totalUnits) * 100) : 100;
          return (
            <div
              key={prop.id}
              className="organic-card overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Property Image Header with Badges */}
                <div className="relative h-44 w-full bg-[#D2DDD7] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prop.imageUrl}
                    alt={prop.name}
                    className="w-full h-full object-cover transition hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Status Tag */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#263238] border border-white/40">
                      {prop.type}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#263238] text-white">
                      {prop.status}
                    </span>
                    {prop.verificationStatus === 'PENDING' ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 border border-amber-300 shadow-sm">
                        ⏳ Doc Audit Pending
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-extrabold text-base drop-shadow-md">{prop.name}</h3>
                      <div className="flex items-center gap-1 text-[11px] text-white/80">
                        <MapPin className="h-3 w-3 text-emerald-300" />
                        <span>{prop.city}, {prop.state}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-white/80">Occupancy</div>
                      <span className="font-black text-emerald-300 text-sm">{occRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-[#666666]">
                    <span>Portfolio</span>
                    <span className="font-bold text-[#263238]">{prop.portfolio}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#666666]">
                    <span>Units</span>
                    <span className="font-bold text-[#263238]">{prop.occupiedUnits} / {prop.totalUnits} Occupied</span>
                  </div>
                  <div className="flex justify-between items-center text-[#666666]">
                    <span>Expected Monthly Rent</span>
                    <span className="font-black text-[#263238] font-tabular">₹{(prop.expectedMonthlyRent / 1000).toFixed(0)}K</span>
                  </div>

                  {/* Amenities Chips */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {prop.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#666666] border border-[#D2DDD7] font-medium">
                        {amenity}
                      </span>
                    ))}
                    {prop.amenities.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F0EC] text-[#666666]">
                        +{prop.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions: Edit, Delete, Explore Units */}
              <div className="p-5 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPropertyToEdit(prop);
                      setIsEditPropertyModalOpen(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#263238] hover:text-white text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove "${prop.name}" from your portfolio?`)) {
                        deleteProperty(prop.id);
                      }
                    }}
                    className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProperty(selectedProperty?.id === prop.id ? null : prop)}
                  className="w-full py-2.5 rounded-2xl bg-[#E8F0EC] hover:bg-[#263238] hover:text-white border border-[#D2DDD7] text-[#263238] font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{selectedProperty?.id === prop.id ? 'Hide Units Breakdown' : `Explore ${prop.units.length} Units`}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${selectedProperty?.id === prop.id ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Unit Hierarchy Breakdown Accordion */}
              {selectedProperty?.id === prop.id && (
                <div className="p-4 bg-[#ffffff] border-t border-[#E0E0E0] space-y-2.5 text-xs">
                  <div className="font-bold text-[#666666] text-[11px] uppercase tracking-wider">
                    Unit Level Hierarchy (Floor & Status)
                  </div>
                  <div className="space-y-2">
                    {prop.units.map(unit => (
                      <div
                        key={unit.id}
                        className="p-3 rounded-xl bg-white border border-[#D2DDD7] flex items-center justify-between text-xs shadow-sm"
                      >
                        <div>
                          <div className="font-bold text-[#263238] flex items-center gap-2">
                            <span>Unit {unit.unitNumber}</span>
                            <span className="text-[10px] text-[#666666]">({unit.type} • Floor {unit.floor})</span>
                          </div>
                          <div className="text-[11px] text-[#666666] mt-0.5">
                            {unit.currentTenantName ? `Resident: ${unit.currentTenantName}` : 'No active tenant'}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            unit.status === 'OCCUPIED' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {unit.status}
                          </span>
                          <div className="text-[11px] font-tabular font-black text-[#263238] mt-1">
                            ₹{unit.rentAmount.toLocaleString('en-IN')}/mo
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
