'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  PhoneCall, 
  Share2, 
  Zap, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  badges?: string[];
  actionPills?: { label: string; action: string }[];
  time: string;
}

export default function StaywiseAIPanel() {
  const { invoices, properties, tickets, leads, addNotification, setActiveView, currentUser, activeRole } = useAppState();

  const [filterPill, setFilterPill] = useState<'ALL' | 'VACANCIES' | 'REVENUE' | 'LEADS'>('ALL');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: activeRole === 'tenant'
        ? `Hi ${currentUser.name.split(' ')[0]}! Welcome to your resident copilot. Your October rent of ₹28,700 for Apartment 302 is scheduled for autopay on Oct 5th. How can I assist you with maintenance, gate passes, or rent receipts today?`
        : `Hi ${currentUser.name.split(' ')[0]}! Your Beach Road Apartments & Koramangala properties have 2 vacant units. Shall I push verified listings to 99acres & NoBroker and draft WhatsApp follow-ups for your 12 recent leads?`,
      actionPills: activeRole === 'tenant'
        ? [
            { label: 'Pay Rent Early (UPI)', action: 'VIEW_RENT' },
            { label: 'Request AC Service', action: 'MAINTENANCE' }
          ]
        : [
            { label: 'Push to 99acres & NoBroker', action: 'PORTALS' },
            { label: 'Draft 12 WhatsApp messages', action: 'WHATSAPP' }
          ],
      time: '10:04 AM'
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      let aiText = '';
      let badges: string[] | undefined;
      let actionPills: { label: string; action: string }[] | undefined;

      const q = query.toLowerCase();
      if (activeRole === 'tenant') {
        if (q.includes('rent') || q.includes('pay') || q.includes('due') || q.includes('invoice')) {
          aiText = 'Your October 2026 rent invoice is ₹28,700. Autopay is linked to Axis Bank •••• 4091 for Oct 5. You can also pay immediately via UPI to earn 150 Staywise Points.';
          badges = ['₹28,700 Due Oct 5', 'Autopay Active', '+150 SWP Reward'];
          actionPills = [{ label: 'Pay Now via UPI', action: 'VIEW_RENT' }];
        } else if (q.includes('repair') || q.includes('ac') || q.includes('leak') || q.includes('ticket')) {
          aiText = 'I have noted your service request. RapidCool HVAC is certified for your building and has technicians available today at 3:00 PM.';
          badges = ['Vendor Verified', 'Same-day slot 3:00 PM'];
          actionPills = [{ label: 'View Ticket Status', action: 'MAINTENANCE' }];
        } else {
          aiText = `Got it! I am synced with your Beach Road residency profile. All actions are logged to your digital ledger.`;
          badges = ['Apt 302 Synced', 'Resident Verified'];
        }
      } else {
        if (q.includes('vacan') || q.includes('room') || q.includes('unit')) {
          aiText = 'Found 2 vacant units: Beach Road #304 (₹26K/mo) and Infovision Suite 304 (₹45K/mo). 1 Hot Lead (Kavita Nambiar) is booked for a showing today at 5:00 PM.';
          badges = ['2 Vacant Units', '1 Showing Booked Today', '₹71K/mo Potential'];
          actionPills = [{ label: 'View Vacancy Engine', action: 'NAV_VACANCY' }];
        } else if (q.includes('rent') || q.includes('remind') || q.includes('collect') || q.includes('payment')) {
          aiText = 'RentFlow Status: ₹11.7L already cleared in Escrow. 1 tenant (Rahul Menon #101, ₹28,000) is 6 days overdue. Dispatched polite WhatsApp reminder with UPI QuickPay link.';
          badges = ['₹11.7L Cleared in Escrow', '1 Overdue Notified via WhatsApp'];
          actionPills = [{ label: 'Open Payments Tracker', action: 'VIEW_RENT' }];
        } else if (q.includes('lead') || q.includes('crm') || q.includes('call')) {
          aiText = 'AI Voice Bot completed 3 screening calls: 2 leads qualified as Hot (Budget ₹26K-₹45K, immediate move-in). Auto-scheduled physical showings in your calendar.';
          badges = ['3 Calls Completed', '2 Leads Auto-Qualified', 'Showings Synced'];
          actionPills = [{ label: 'Open Leads CRM', action: 'NAV_LEADS' }];
        } else {
          aiText = 'All 3 property portfolios are operational with double-entry ledger reconciled. I have scheduled statutory automated rent reminders for the upcoming cycle.';
          badges = ['Escrow Reconciled', '100% Tax Compliant'];
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        badges,
        actionPills,
        time: 'Just now'
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handlePillAction = (action: string) => {
    if (action === 'VIEW_RENT') setActiveView('rentflow');
    else if (action === 'NAV_VACANCY') setActiveView('vacancy');
    else if (action === 'NAV_LEADS') setActiveView('properties');
    else if (action === 'MAINTENANCE') setActiveView('maintenance');
    else if (action === 'PORTALS') {
      addNotification('Portals Syndicated', 'Published Unit 304 to 99acres, MagicBricks & NoBroker.', 'LEAD');
    } else if (action === 'WHATSAPP') {
      addNotification('WhatsApp Sent', '12 WhatsApp follow-up messages dispatched.', 'LEAD');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f] flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-[#274235]" />
            <span>Staywise Autonomous AI Assistant</span>
          </h1>
          <div className="text-xs text-[#6e7972] font-semibold uppercase tracking-wider mt-0.5">
            Real-Time Operations • Powered by Gemini & Staywise OS
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMessages(prev => prev.slice(0, 1))}
            className="p-2.5 rounded-2xl bg-white hover:bg-[#f4f3ef] text-[#19251f] border border-[#e3e1d8] transition shadow-sm"
            title="Refresh Conversation"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main AI Assistant Card */}
      <div className="organic-card overflow-hidden flex flex-col min-h-[580px]">
        {/* Card Sub-Header */}
        <div className="px-6 py-4 border-b border-[#eeece5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbfbfa]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#274235] text-white flex items-center justify-center shadow-md shadow-[#274235]/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#19251f] text-sm">Staywise Autonomous AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-[11px] text-[#6e7972]">Proactive alerts, tenant rent verification & instant property actions</p>
            </div>
          </div>

          {/* Quick Filter Pills */}
          {activeRole !== 'tenant' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ALL', label: 'All Operations' },
                { id: 'VACANCIES', label: 'Vacancies' },
                { id: 'REVENUE', label: 'Revenue' },
                { id: 'LEADS', label: 'Leads' }
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => {
                    setFilterPill(pill.id as any);
                    if (pill.id === 'VACANCIES') handleSend('Show vacant rooms and syndicate listings');
                    else if (pill.id === 'REVENUE') handleSend('Show revenue collection and pending rent');
                    else if (pill.id === 'LEADS') handleSend('Show recent 12 leads and call verification status');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    filterPill === pill.id 
                      ? 'bg-[#274235] text-white shadow-sm' 
                      : 'bg-[#f4f3ef] text-[#6e7972] hover:text-[#19251f]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-2xl bg-[#274235] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-3xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#274235] text-white font-medium rounded-tr-none shadow-md'
                        : 'bg-[#f7f6f2] text-[#19251f] border border-[#e3e1d8] rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line text-[13px]">{m.text}</p>

                    {/* Execution Badges */}
                    {m.badges && (
                      <div className="flex flex-wrap gap-2 pt-2.5 mt-2.5 border-t border-[#eeece5]">
                        {m.badges.map((b, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px]"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                            <span>{b}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 1-Click Action Pills inside AI messages */}
                  {m.actionPills && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.actionPills.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePillAction(p.action)}
                          className="px-3.5 py-1.5 rounded-2xl bg-[#eef3f0] hover:bg-[#274235] hover:text-white text-[#274235] border border-[#274235]/30 text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <span>{p.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[10px] text-[#95a099] ${isUser ? 'text-right' : 'text-left'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#fbfbfa] border-t border-[#eeece5]">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 rounded-2xl bg-white border border-[#e3e1d8] p-1.5 pl-4 shadow-sm focus-within:border-[#274235] transition"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeRole === 'tenant' ? 'Ask anything about rent, receipts, or maintenance...' : 'Ask anything about your properties or tenants...'}
              className="flex-1 bg-transparent text-xs text-[#19251f] placeholder-[#95a099] focus:outline-none"
            />

            <button
              type="submit"
              className="h-9 w-9 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white flex items-center justify-center shadow-md shadow-[#274235]/20 transition shrink-0"
              title="Send to Staywise AI"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </form>

          {/* Suggested Quick Inquiry Chips */}
          <div className="flex items-center gap-2 pt-2.5 overflow-x-auto text-[11px] text-[#6e7972]">
            <span className="font-bold text-[#19251f] shrink-0">Try asking:</span>
            {activeRole === 'tenant' ? (
              <>
                <button
                  onClick={() => handleSend('When is my October rent due and how to pay?')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#e3e1d8] hover:border-[#274235] text-[#19251f] shrink-0 transition"
                >
                  &quot;When is my rent due?&quot;
                </button>
                <button
                  onClick={() => handleSend('Download September paid rent receipt')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#e3e1d8] hover:border-[#274235] text-[#19251f] shrink-0 transition"
                >
                  &quot;Download September rent receipt&quot;
                </button>
                <button
                  onClick={() => handleSend('Request emergency AC servicing for Unit 302')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#e3e1d8] hover:border-[#274235] text-[#19251f] shrink-0 transition"
                >
                  &quot;Request AC repair&quot;
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSend('Push Unit 304 to 99acres and MagicBricks')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#e3e1d8] hover:border-[#274235] text-[#19251f] shrink-0 transition"
                >
                  &quot;Push Unit 304 to 99acres&quot;
                </button>
                <button
                  onClick={() => handleSend('Remind overdue tenants on WhatsApp')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#e3e1d8] hover:border-[#274235] text-[#19251f] shrink-0 transition"
                >
                  &quot;Remind overdue tenants on WhatsApp&quot;
                </button>
                <button
                  onClick={() => handleSend('Show me my net yield in Wayanad Estate')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#e3e1d8] hover:border-[#274235] text-[#19251f] shrink-0 transition"
                >
                  &quot;Show net yield in Wayanad&quot;
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
