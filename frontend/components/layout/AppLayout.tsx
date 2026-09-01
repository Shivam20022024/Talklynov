'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  CircleHelp,
  Command,
  Home,
  Menu,
  Phone,
  Search,
  Settings2,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

const navGroups = [
  { label: 'MAIN', items: [['Dashboard', Home, '/dashboard'], ['Leads', Users, '/leads'], ['Campaigns', Target, '/campaigns'], ['Calls', Phone, '/calls'], ['AI Prompt', Bot, '/prompt'], ['Voice Intelligence', Activity, '/voice-intelligence'], ['Analytics', BarChart3, '/analytics']] },
  { label: 'MANAGEMENT', items: [['Team', Users, '/team'], ['Billing & Usage', TrendingUp, '/billing'], ['Settings', Settings2, '/settings']] },
] as const;

function SearchModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      setQuery('');
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const results = navGroups.flatMap(g => g.items).filter(([label]) => 
    (label as string).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm p-4 pt-[10vh]">
      {/* Overlay click handler */}
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search size={18} className="text-muted-foreground mr-3" />
          <input 
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search leads, campaigns, calls..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted">ESC</button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map(([label, Icon, href]) => (
              <Link 
                key={href as string} 
                href={href as string} 
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Icon size={16} className="text-muted-foreground" />
                <span>{label as string}</span>
              </Link>
            ))
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ open, onClose, user }: { open: boolean; onClose: () => void; user: any; }) {
  const pathname = usePathname();
  
  return <>
    <aside className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-40 w-60 flex-col border-r border-border bg-card lg:static lg:flex`}>
      <div className="flex h-[76px] items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="brand-mark"><Bot size={20} /></div>
          <span className="text-[17px] font-bold tracking-tight">TalklyAI</span>
        </div>
        <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground lg:hidden" aria-label="Close navigation"><X size={17} /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-7">
        <p className="eyebrow px-3">Workspace</p>
        {navGroups.map((group) => (
          <div key={group.label} className="mt-6">
            <p className="eyebrow px-3">{group.label}</p>
            <nav className="mt-2 space-y-1" aria-label={`${group.label} navigation`}>
              {group.items.map(([label, Icon, href]) => {
                const isActive = pathname?.startsWith(href as string);
                return (
                  <Link key={label as string} href={href as string} onClick={() => onClose()} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium tracking-wide transition-colors ${isActive ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    <Icon size={18} strokeWidth={2.5} />
                    <span>{label as string}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted cursor-pointer">
          <div className="avatar avatar-blue">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'SK'}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{user?.name || 'User'}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user?.email || 'user@talkly.ai'}</p>
          </div>
          <ChevronDown size={15} className="text-muted-foreground" />
        </div>
      </div>
    </aside>
    {open && <button onClick={onClose} className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" aria-label="Close navigation overlay" />}
  </>;
}

import { useAuth } from '../providers/AuthProvider';

export default function AppLayout({ children, title = "Dashboard" }: { children: React.ReactNode, title?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} user={user} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur lg:px-8">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg border border-border p-2 text-muted-foreground lg:hidden" aria-label="Open navigation"><Menu size={19} /></button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-[11px] text-muted-foreground">TalklyAI workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground sm:flex hover:bg-muted transition-colors">
              <Search size={14} />Search leads, campaigns, calls...
            </button>
            <div className="avatar avatar-blue ml-1">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'SK'}</div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] space-y-6 px-5 py-7 lg:px-8 lg:py-9">
          {children}
        </main>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

