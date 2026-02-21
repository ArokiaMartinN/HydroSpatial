import React from 'react';
import { FileText, Shield, Scale, Clock, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms = () => {
  const handlePrint = () => window.print();

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-primary">Legal Document</span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>REF-2025-HS-TOS</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2"
            style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
            Terms of Service
          </h1>
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>Last updated: December 19, 2025</span>
            </div>
            <div className="w-1 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
            <div className="flex items-center gap-1.5">
              <Shield size={13} />
              <span>Enterprise Edition</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="btn-tech-ghost text-sm">
            <Download size={15} /> Download PDF
          </button>
          <button className="btn-tech-primary text-sm">
            Accept & Continue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* TOC Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-8">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 pl-1"
              style={{ color: 'var(--text-tertiary)' }}>
              Contents
            </h4>
            <nav className="space-y-1">
              {['Acceptance', 'Data Usage', 'Intellectual Property', 'Liability', 'Termination'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block px-3 py-2 text-sm rounded-xl transition-all font-medium"
                  style={{ color: 'var(--text-tertiary)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="mt-8 p-4 rounded-2xl border"
              style={{ background: 'var(--gradient-soft)', border: '1px solid var(--border-main)' }}>
              <h5 className="font-bold text-sm mb-2" style={{ color: 'var(--text-main)' }}>Need Help?</h5>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                Contact our legal team for clarifications.
              </p>
              <a href="mailto:legal@hydrospatial.com" className="text-xs font-bold"
                style={{ color: 'var(--primary)' }}>
                legal@hydrospatial.com
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">

          {/* Section 1 */}
          <motion.section
            id="acceptance"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl border"
            style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--border-main)' }}>
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-4 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <p>
                    By accessing and using the HydroSpatial Insight Platform ("The Service"), you accept and agree to be bound by
                    the terms and provision of this agreement. In addition, when using these particular services, you shall be
                    subject to any posted guidelines or rules applicable to such services.
                  </p>
                  <p>
                    If you are entering into this Agreement on behalf of a company or other legal entity, you represent that you
                    have the authority to bind such entity to these terms and conditions, in which case the terms "you" or "your"
                    shall refer to such entity.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section
            id="data-usage"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-8 rounded-2xl border"
            style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#ede9fe', color: '#7c3aed', border: '1px solid #c4b5fd' }}>
                <Scale size={18} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                  2. Data Usage & Privacy
                </h2>
                <p className="text-[0.95rem] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  All hydrological data processed through our neural engines is treated as rigorous scientific output. We adhere
                  to strict data governance protocols to ensure the integrity and confidentiality of your data.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Data Security', icon: Shield, color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0',
                      items: ['AES-256 encryption at rest', 'TLS 1.3 encryption in transit'],
                    },
                    {
                      title: 'Compliance', icon: CheckCircle, color: 'var(--primary)', bg: 'var(--bg-subtle)', border: 'var(--border-main)',
                      items: ['GDPR & CCPA Compliant', 'ISO 27001 Certified Datacenters'],
                    },
                  ].map(card => (
                    <div key={card.title} className="p-4 rounded-xl border"
                      style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                        <card.icon size={15} style={{ color: card.color }} />
                        {card.title}
                      </h4>
                      <ul className="space-y-2">
                        {card.items.map(item => (
                          <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: card.color }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section
            id="intellectual-property"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl border"
            style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}>
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                  3. Intellectual Property
                </h2>
                <div className="space-y-4 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <p>
                    The Service and its original content (excluding Content provided by users), features, and functionality are
                    and will remain the exclusive property of HydroSpatial Intelligence Ltd. and its licensors.
                  </p>
                  <div className="p-4 rounded-xl text-sm"
                    style={{ background: 'var(--primary-light)', border: '1px solid var(--border-main)', color: 'var(--primary)' }}>
                    <strong>Note:</strong> You retain all rights to the raw hydrological data you upload to the platform. We
                    claim no ownership over your source data.
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 text-center" style={{ borderTop: '1px solid var(--border-main)' }}>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          © 2025 HydroSpatial Intelligence Ltd. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          {['Privacy Policy', 'Cookie Policy', 'SLA'].map(link => (
            <a key={link} href="#"
              className="transition-colors font-medium"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
