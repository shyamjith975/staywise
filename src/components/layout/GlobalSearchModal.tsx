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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
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

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-24 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] my-auto">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#eeece5] bg-[#fbfbfa] gap-3">
          <Search className="h-5 w-5 text-[#274235]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeRole === 'tenant' ? 'Search your invoices, receipts, and maintenance...' : 'Search properties, tenants, units, tickets, payments, leads...'}
            className="flex-1 bg-transparent text-sm text-[#19251f] placeholder-[#95a099] focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#6e7972] hover:text-[#19251f]">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-[#f4f3ef] text-[#6e7972] hover:text-[#19251f] border border-[#e3e1d8]"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!q ? (
            <div className="text-center py-10 text-[#6e7972] space-y-2">
              <p className="text-xs">Type anything to quickly search Staywise.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {activeRole === 'tenant' ? (
                  <>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#f4f3ef] text-[#19251f] border border-[#e3e1d8]">Try &quot;Rent&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#f4f3ef] text-[#19251f] border border-[#e3e1d8]">Try &quot;AC&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#f4f3ef] text-[#19251f] border border-[#e3e1d8]">Try &quot;Receipt&quot;</span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#f4f3ef] text-[#19251f] border border-[#e3e1d8]">Try &quot;Beach Road&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#f4f3ef] text-[#19251f] border border-[#e3e1d8]">Try &quot;Shyam&quot;</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#f4f3ef] text-[#19251f] border border-[#e3e1d8]">Try &quot;Overdue&quot;</span>
                  </>
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-[#6e7972] text-xs">
              No matching records found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Properties */}
              {matchedProperties.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e7972] mb-2 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[#274235]" />
                    <span>Properties ({matchedProperties.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedProperties.map(p => (
                      <div
                        key={p.id}
                        onClick={() => { setActiveView('properties'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#f7f6f2] hover:bg-white border border-[#e3e1d8] hover:border-[#274235]/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#19251f]">{p.name}</div>
                          <div className="text-[11px] text-[#6e7972]">{p.portfolio} • {p.city} • {p.totalUnits} Units</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#95a099]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tenants */}
              {matchedTenants.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e7972] mb-2 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-600" />
                    <span>Tenants ({matchedTenants.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedTenants.map(t => (
                      <div
                        key={t.id}
                        onClick={() => { setActiveView('tenants'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#f7f6f2] hover:bg-white border border-[#e3e1d8] hover:border-blue-500/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#19251f]">{t.name} (Unit {t.unitNumber})</div>
                          <div className="text-[11px] text-[#6e7972]">{t.propertyName} • {t.phone} • ₹{t.monthlyRent.toLocaleString('en-IN')}/mo</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#95a099]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {matchedInvoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e7972] mb-2 flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5 text-amber-600" />
                    <span>Invoices ({matchedInvoices.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedInvoices.map(i => (
                      <div
                        key={i.id}
                        onClick={() => { setActiveView('rentflow'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#f7f6f2] hover:bg-white border border-[#e3e1d8] hover:border-amber-500/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#19251f]">{i.invoiceNumber} — {i.tenantName}</div>
                          <div className="text-[11px] text-[#6e7972]">₹{i.totalAmount.toLocaleString('en-IN')} • Status: {i.status}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#95a099]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets */}
              {matchedTickets.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e7972] mb-2 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-purple-600" />
                    <span>Maintenance Tickets ({matchedTickets.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedTickets.map(tk => (
                      <div
                        key={tk.id}
                        onClick={() => { setActiveView('maintenance'); setIsSearchOpen(false); }}
                        className="p-3 rounded-2xl bg-[#f7f6f2] hover:bg-white border border-[#e3e1d8] hover:border-purple-500/40 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#19251f]">{tk.ticketNumber}: {tk.title}</div>
                          <div className="text-[11px] text-[#6e7972]">Unit {tk.unitNumber} • Priority: {tk.priority} • Status: {tk.status}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#95a099]" />
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
