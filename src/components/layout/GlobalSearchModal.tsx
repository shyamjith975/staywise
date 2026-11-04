'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Search, 
  Building, 
  Users, 
  Receipt, 
  Wrench, 
  Compass, 
  X,
  ArrowRight
} from 'lucide-react';

export default function GlobalSearchModal() {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    properties, 
    tenants, 
    invoices, 
    tickets, 
    leads,
    activeRole,
    setActiveView 
  } = useAppState();

  const [query, setQuery] = useState('');
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [showAllTenants, setShowAllTenants] = useState(false);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const PAGE_LIMIT = 3;

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setShowAllProperties(false);
      setShowAllTenants(false);
      setShowAllInvoices(false);
      setShowAllTickets(false);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // If tenant, limit search to their own data only
  const matchedProperties = activeRole !== 'tenant' && q 
    ? properties.filter(p => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.portfolio.toLowerCase().includes(q))
    : [];

  const matchedTenants = activeRole !== 'tenant' && q
    ? tenants.filter(t => t.name.toLowerCase().includes(q) || t.phone.includes(q) || t.unitNumber.includes(q))
    : [];

  const matchedInvoices = q
    ? invoices.filter(i => {
        if (activeRole === 'tenant' && i.unitNumber !== '302') return false;
        return i.invoiceNumber.toLowerCase().includes(q) || i.tenantName.toLowerCase().includes(q);
      })
    : [];

  const matchedTickets = q
    ? tickets.filter(t => {
        if (activeRole === 'tenant' && t.unitNumber !== '302') return false;
        return t.ticketNumber.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      })
    : [];

  const matchedLeads = activeRole !== 'tenant' && q
    ? leads.filter(l => l.name.toLowerCase().includes(q) || l.propertyInterest.toLowerCase().includes(q))
    : [];

  const totalResults = matchedProperties.length + matchedTenants.length + matchedInvoices.length + matchedTickets.length + matchedLeads.length;

  const paginatedProperties = showAllProperties ? matchedProperties : matchedProperties.slice(0, PAGE_LIMIT);
  const paginatedTenants = showAllTenants ? matchedTenants : matchedTenants.slice(0, PAGE_LIMIT);
  const paginatedInvoices = showAllInvoices ? matchedInvoices : matchedInvoices.slice(0, PAGE_LIMIT);
  const paginatedTickets = showAllTickets ? matchedTickets : matchedTickets.slice(0, PAGE_LIMIT);

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-24 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-white border border-[#D2DDD7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] my-auto">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#E0E0E0] bg-[#ffffff] gap-3">
          <Search className="h-5 w-5 text-[#171717]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeRole === 'tenant' ? 'Search your invoices, receipts, and maintenance...' : 'Search properties, tenants, units, tickets, payments, leads...'}
            className="flex-1 bg-transparent text-sm text-[#171717] placeholder-[#888888] focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#666666] hover:text-[#171717]">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-[#E8F0EC] text-[#666666] hover:text-[#171717] border border-[#D2DDD7]"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!q ? (
            <div className="text-center py-10 text-[#666666] space-y-2">
              <p className="text-xs">Type anything to quickly search Staywise.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {activeRole === 'tenant' ? (
                  <>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#E8F0EC] text-[#171717] border border-[#D2DDD7]">Try &quot;Rent&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#E8F0EC] text-[#171717] border border-[#D2DDD7]">Try &quot;AC&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#E8F0EC] text-[#171717] border border-[#D2DDD7]">Try &quot;Receipt&quot;</span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#E8F0EC] text-[#171717] border border-[#D2DDD7]">Try &quot;Beach Road&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#E8F0EC] text-[#171717] border border-[#D2DDD7]">Try &quot;Shyam&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#E8F0EC] text-[#171717] border border-[#D2DDD7]">Try &quot;Overdue&quot;</span>
                  </>
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-[#666666] text-xs">
              No matching records found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Properties */}
              {matchedProperties.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-[#171717]" />
                      <span>Properties ({matchedProperties.length})</span>
                    </div>
                    {matchedProperties.length > PAGE_LIMIT && (
                      <button 
                        onClick={() => setShowAllProperties(!showAllProperties)}
                        className="text-[10px] text-[#171717] font-bold underline cursor-pointer hover:opacity-80"
                      >
                        {showAllProperties ? 'Show Less' : `Show All (${matchedProperties.length})`}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {paginatedProperties.map(p => (
                      <div
                        key={p.id}
                        onClick={() => { setActiveView('properties'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#E8F0EC] hover:bg-white border border-[#D2DDD7] hover:border-[#171717]/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#171717]">{p.name}</div>
                          <div className="text-[11px] text-[#666666]">{p.portfolio} • {p.city} • {p.totalUnits} Units</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#888888]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tenants */}
              {matchedTenants.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                      <span>Tenants ({matchedTenants.length})</span>
                    </div>
                    {matchedTenants.length > PAGE_LIMIT && (
                      <button 
                        onClick={() => setShowAllTenants(!showAllTenants)}
                        className="text-[10px] text-blue-700 font-bold underline cursor-pointer hover:opacity-80"
                      >
                        {showAllTenants ? 'Show Less' : `Show All (${matchedTenants.length})`}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {paginatedTenants.map(t => (
                      <div
                        key={t.id}
                        onClick={() => { setActiveView('tenants'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#E8F0EC] hover:bg-white border border-[#D2DDD7] hover:border-blue-500/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#171717]">{t.name} (Unit {t.unitNumber})</div>
                          <div className="text-[11px] text-[#666666]">{t.propertyName} • {t.phone} • ₹{t.monthlyRent.toLocaleString('en-IN')}/mo</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#888888]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {matchedInvoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="h-3.5 w-3.5 text-amber-600" />
                      <span>Invoices ({matchedInvoices.length})</span>
                    </div>
                    {matchedInvoices.length > PAGE_LIMIT && (
                      <button 
                        onClick={() => setShowAllInvoices(!showAllInvoices)}
                        className="text-[10px] text-amber-700 font-bold underline cursor-pointer hover:opacity-80"
                      >
                        {showAllInvoices ? 'Show Less' : `Show All (${matchedInvoices.length})`}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {paginatedInvoices.map(i => (
                      <div
                        key={i.id}
                        onClick={() => { setActiveView('rentflow'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#E8F0EC] hover:bg-white border border-[#D2DDD7] hover:border-amber-500/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#171717]">{i.invoiceNumber} — {i.tenantName}</div>
                          <div className="text-[11px] text-[#666666]">₹{i.totalAmount.toLocaleString('en-IN')} • Status: {i.status}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#888888]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets */}
              {matchedTickets.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-purple-600" />
                      <span>Maintenance Tickets ({matchedTickets.length})</span>
                    </div>
                    {matchedTickets.length > PAGE_LIMIT && (
                      <button 
                        onClick={() => setShowAllTickets(!showAllTickets)}
                        className="text-[10px] text-purple-700 font-bold underline cursor-pointer hover:opacity-80"
                      >
                        {showAllTickets ? 'Show Less' : `Show All (${matchedTickets.length})`}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {paginatedTickets.map(tk => (
                      <div
                        key={tk.id}
                        onClick={() => { setActiveView('maintenance'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#E8F0EC] hover:bg-white border border-[#D2DDD7] hover:border-purple-500/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#171717]">{tk.ticketNumber}: {tk.title}</div>
                          <div className="text-[11px] text-[#666666]">Unit {tk.unitNumber} • Priority: {tk.priority} • Status: {tk.status}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#888888]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
