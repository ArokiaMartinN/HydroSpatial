import { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  CloudRain, Droplets, Zap, Sun, Filter, Download,
  ArrowUpRight, ArrowDownRight, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TechStatProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  trend?: number;
  data?: number[];
  accentColor: string;
  glowColor: string;
}

const Sparkline = ({ data, color }: { data: number[], color: string }) => (
  <div className="h-10 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((val, i) => ({ i, val }))}>
        <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const TechStat = ({ title, value, unit, icon: Icon, trend, data, accentColor, glowColor }: TechStatProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 flex flex-col justify-between rounded-2xl border transition-all group cursor-default"
    style={{
      background: 'white',
      border: '1px solid var(--border-main)',
      boxShadow: 'var(--shadow-sm)',
    }}
    whileHover={{
      y: -4,
      boxShadow: `0 10px 30px -5px ${glowColor}25`,
    }}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="p-2.5 rounded-xl"
        style={{ background: `${accentColor}18` }}>
        <Icon size={18} style={{ color: accentColor }} />
      </div>
      {data && (
        <Sparkline data={data} color={trend && trend > 0 ? '#10b981' : '#f43f5e'} />
      )}
    </div>
    <div>
      <div className="flex items-end gap-1.5">
        <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
          {value}{' '}
          <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>{unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        {trend !== undefined && trend !== 0 && (
          <div className={`flex items-center gap-0.5 text-xs font-bold ${trend > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          {title}
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [data] = useState({ rainfall: 1240, recharge: 8500, extraction: 6200 });

  const chartData = [
    { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }, { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 }, { name: 'May', value: 189 }, { name: 'Jun', value: 239 },
    { name: 'Jul', value: 349 }, { name: 'Aug', value: 400 }, { name: 'Sep', value: 450 },
    { name: 'Oct', value: 380 }, { name: 'Nov', value: 300 }, { name: 'Dec', value: 250 },
  ];

  const stats = [
    {
      title: 'Extraction', value: (data.extraction / 1000).toFixed(1), unit: 'k Ham',
      icon: Droplets, trend: 2.4, data: [10, 15, 13, 17, 18, 20, 19, 22],
      accentColor: '#6366f1', glowColor: '#6366f1',
    },
    {
      title: 'Rainfall', value: data.rainfall, unit: 'mm/yr',
      icon: CloudRain, trend: -1.2, data: [50, 40, 35, 45, 30, 25, 30, 28],
      accentColor: '#38bdf8', glowColor: '#38bdf8',
    },
    {
      title: 'Recharge', value: (data.recharge / 1000).toFixed(1), unit: 'k Ham',
      icon: Zap, trend: 5.8, data: [60, 65, 62, 70, 75, 78, 80, 85],
      accentColor: '#8b5cf6', glowColor: '#8b5cf6',
    },
    {
      title: 'Avg Temp', value: '28', unit: '°C',
      icon: Sun, trend: 0.5, data: [22, 24, 26, 28, 29, 28, 27, 28],
      accentColor: '#f59e0b', glowColor: '#f59e0b',
    },
  ];

  const consumptionBars = [
    { label: 'Agriculture', val: 85, color: '#6366f1' },
    { label: 'Domestic', val: 10, color: '#38bdf8' },
    { label: 'Industry', val: 5, color: '#8b5cf6' },
  ];

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
            Hydrological Overview
          </h1>
          <p className="mt-1.5 text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sensor Data Stream
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
            style={{
              background: 'white',
              border: '1px solid var(--border-main)',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-xs)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
              (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-main)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            <Filter size={15} />
            Filter
          </button>
          <button className="btn-tech-primary px-5 py-2 text-sm flex items-center gap-2">
            <Download size={15} />
            Export Report
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <TechStat {...s} />
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl border p-6 flex flex-col h-[400px]"
            style={{
              background: 'white',
              border: '1px solid var(--border-main)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold" style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                  Groundwater Level
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full badge-primary">
                  Yearly
                </span>
              </div>
              <div className="flex gap-0.5 rounded-xl p-1"
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                {['1D', '1W', '1M', '1Y'].map((t, i) => (
                  <button
                    key={t}
                    className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    style={i === 2
                      ? { background: 'white', color: 'var(--primary)', boxShadow: 'var(--shadow-xs)' }
                      : { color: 'var(--text-tertiary)' }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorViolet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gridLines" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e0e7ff" />
                      <stop offset="100%" stopColor="#f5f3ff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" vertical={false} />
                  <XAxis dataKey="name" stroke="#a5b4fc" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#a5b4fc" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #c7d2fe',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px -5px rgba(99,102,241,0.15)',
                      color: '#1e1b4b',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                    labelStyle={{ color: '#818cf8', fontSize: '11px', marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViolet)"
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Extraction Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border p-6 flex flex-col h-[400px]"
            style={{
              background: 'white',
              border: '1px solid var(--border-main)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 className="text-base font-bold mb-6 flex items-center gap-2"
              style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              Extraction Metrics
            </h3>
            <div className="flex-1 flex flex-col justify-center gap-7">
              {consumptionBars.map(m => (
                <div key={m.label} className="group cursor-default">
                  <div className="flex justify-between text-xs mb-2 font-medium">
                    <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                    <span className="font-bold" style={{ color: m.color }}>{m.val}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.val}%` }}
                      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${m.color} 0%, ${m.color}99 100%)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'var(--gradient-soft)',
                border: '1px solid var(--border-main)',
                color: 'var(--primary)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--gradient-main)';
                (e.currentTarget as HTMLElement).style.color = 'white';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-violet)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--gradient-soft)';
                (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              View Detailed Report
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;