'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { label: 'Boshqaruv paneli', href: '/dashboard', icon: 'dashboard' },

  {
    label: 'Buxgalteriya',
    icon: 'accounting',
    children: [
      { label: 'Hisoblar rejasi', href: '/accounts' },
      { label: 'Jurnal', href: '/journal' },
      { label: 'Yangi provodka', href: '/journal/new' },
      { label: 'Tranzaksiyalar', href: '/transactions' },
      { label: 'Yangi tranzaksiya', href: '/transactions/new' },
      { label: 'Balans', href: '/balance' },
    ],
  },

  { label: 'Kontragentlar', href: '/counterparties', icon: 'contacts' },

  {
    label: 'Schet-faktura',
    icon: 'invoice',
    children: [
      { label: 'Barcha schet-fakturalar', href: '/invoices' },
      { label: 'Yangi schet-faktura', href: '/invoices/new' },
    ],
  },

  {
    label: 'Soliq hisobi',
    icon: 'tax',
    children: [
      { label: 'Soliqlar', href: '/tax' },
      { label: 'QQS (VAT)', href: '/tax/vat' },
      { label: 'Foyda solig\'i', href: '/tax/profit' },
      { label: 'INPS', href: '/tax/inps' },
      { label: 'NDFL', href: '/tax/ndfl' },
      { label: 'Soliq kalendari', href: '/tax/calendar' },
    ],
  },

  {
    label: 'Didox',
    icon: 'document',
    children: [
      { label: 'Hujjatlar', href: '/didox' },
      { label: 'Hujjat yuborish', href: '/didox/send' },
      { label: 'Sozlamalar', href: '/didox/settings' },
    ],
  },

  {
    label: 'Soliq.uz',
    icon: 'government',
    children: [
      { label: 'Hisobotlar', href: '/soliq' },
      { label: 'Hisobot yuborish', href: '/soliq/submit' },
      { label: 'Sozlamalar', href: '/soliq/settings' },
    ],
  },

  {
    label: 'Kadrlar (HR)',
    icon: 'people',
    children: [
      { label: 'Xodimlar', href: '/employees' },
      { label: 'Yangi xodim', href: '/employees/new' },
      { label: 'Ish haqi', href: '/payroll' },
      { label: 'Yangi hisob-kitob', href: '/payroll/new' },
      { label: 'Tabel', href: '/timesheet' },
      { label: 'Bo\'limlar', href: '/departments' },
      { label: 'Kadrlar hujjatlari', href: '/hr-documents' },
      { label: 'Yangi hujjat', href: '/hr-documents/new' },
    ],
  },

  {
    label: 'Ombor',
    icon: 'warehouse',
    children: [
      { label: 'Mahsulotlar', href: '/products' },
      { label: 'Yangi mahsulot', href: '/products/new' },
      { label: 'Kirim (qabul)', href: '/warehouse/receive' },
      { label: 'Yangi kirim', href: '/warehouse/receive/new' },
      { label: 'Sotish (chiqim)', href: '/warehouse/sales' },
      { label: 'Yangi sotish', href: '/warehouse/sales/new' },
      { label: 'Inventarizatsiya', href: '/warehouse/inventory' },
      { label: 'Yangi inventarizatsiya', href: '/warehouse/inventory/new' },
      { label: 'Xom ashyo', href: '/warehouse/raw-materials' },
    ],
  },

  {
    label: 'Shartnomalar',
    icon: 'contract',
    children: [
      { label: 'Barcha shartnomalar', href: '/contracts' },
      { label: 'Yangi shartnoma', href: '/contracts/new' },
    ],
  },

  {
    label: 'Debitor/Kreditor',
    icon: 'money',
    children: [
      { label: 'Debitorlar', href: '/receivables' },
      { label: 'Kreditorlar', href: '/payables' },
    ],
  },

  {
    label: 'Bank',
    icon: 'bank',
    children: [
      { label: 'Bank hisoblar', href: '/bank' },
      { label: 'Ko\'chirmalar', href: '/bank/statements' },
      { label: 'Import', href: '/bank/statements/import' },
      { label: 'Taqsimlash', href: '/bank/reconciliation' },
      { label: 'To\'lov topshiriqnomasi', href: '/bank/payment-order' },
    ],
  },

  {
    label: 'Online to\'lovlar',
    icon: 'payment',
    children: [
      { label: 'Barcha to\'lovlar', href: '/payments' },
      { label: 'Payme', href: '/payments/payme' },
      { label: 'Click', href: '/payments/click' },
      { label: 'Uzum', href: '/payments/uzum' },
      { label: 'Yangi to\'lov', href: '/payments/create' },
    ],
  },

  {
    label: 'Kassa',
    icon: 'cash',
    children: [
      { label: 'Kassa', href: '/cash' },
      { label: 'Kirim orderi (PKO)', href: '/cash/income' },
      { label: 'Chiqim orderi (RKO)', href: '/cash/expense' },
      { label: 'Kassa kitobi', href: '/cash/book' },
    ],
  },

  { label: 'To\'lov kalendari', href: '/payment-calendar', icon: 'calendar' },

  {
    label: 'Hisobotlar',
    icon: 'reports',
    children: [
      { label: 'Moliyaviy hisobotlar', href: '/reports/financial' },
      { label: 'Pul oqimi', href: '/reports/cash-flow' },
      { label: 'KPI va tahlil', href: '/reports/kpi' },
      { label: 'KPI maqsadlar', href: '/reports/kpi/targets' },
      { label: 'Amortizatsiya', href: '/reports/depreciation' },
      { label: 'Asosiy vositalar', href: '/reports/depreciation/assets' },
      { label: 'Konsolidatsiya', href: '/reports/consolidation' },
    ],
  },

  {
    label: 'Valyuta',
    icon: 'currency',
    children: [
      { label: 'Kurslar', href: '/currency' },
      { label: 'Kalkulyator', href: '/currency/calculator' },
    ],
  },

  {
    label: 'Eksport',
    icon: 'export',
    children: [
      { label: 'Eksport qilish', href: '/export' },
      { label: 'Tarix', href: '/export/history' },
    ],
  },

  {
    label: 'AI Yordamchi',
    icon: 'ai',
    children: [
      { label: 'Tavsiyalar', href: '/ai/suggestions' },
      { label: 'Qoidalar', href: '/ai/rules' },
    ],
  },

  { label: 'Prognoz', href: '/forecast', icon: 'forecast' },

  {
    label: 'Fraud aniqlash',
    icon: 'shield',
    children: [
      { label: 'Ogohlantirishlar', href: '/fraud/alerts' },
      { label: 'Qoidalar', href: '/fraud/rules' },
    ],
  },

  { label: 'Lokalizatsiya', href: '/localization', icon: 'globe' },
  { label: 'Bildirishnomalar', href: '/notifications', icon: 'bell' },
  { label: 'Audit jurnali', href: '/audit', icon: 'audit' },

  {
    label: 'Xavfsizlik',
    icon: 'security',
    children: [
      { label: 'Ikki bosqichli autentifikatsiya', href: '/security/2fa' },
      { label: 'Sessiyalar', href: '/security/sessions' },
      { label: 'API kalitlari', href: '/security/api-keys' },
    ],
  },

  { label: 'Sozlamalar', href: '/settings', icon: 'settings' },
];

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const isChildActive = item.children?.some((child) =>
    child.href ? pathname === child.href || pathname.startsWith(child.href + '/') : false,
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
            isChildActive
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          )}
        >
          <span>{item.label}</span>
          <svg
            className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-600 pl-3">
            {item.children!.map((child, index) => (
              <NavItemComponent key={index} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'block px-3 py-2 text-sm rounded-md transition-colors',
        isActive
          ? 'bg-primary text-white font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
      )}
    >
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto flex-shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Uz</span>
          </div>
          <span className="text-xl font-bold">UzERP</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">ERP/Buxgalteriya tizimi</p>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navigation.map((item, index) => (
          <NavItemComponent key={index} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <p className="text-xs text-muted-foreground text-center">
          UzERP v1.0.0
        </p>
      </div>
    </aside>
  );
}
