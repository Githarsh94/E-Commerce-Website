import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { Package, ShoppingCart, Users, TrendingUp, ArrowUp, Calendar, Activity } from 'lucide-react';
import './AdminDashboard.css';
import apiFetch from '../../utils/apiFetch';
import { showError } from '../../utils/alert';

export default function AdminDashboard() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const recentActivityRef = useRef<HTMLDivElement>(null);
  const setCardRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    cardsRef.current[idx] = el;
  }, []);

  useEffect(() => {
    // Simple, readable GSAP timeline using fromTo so start/end are explicit.
    // Avoid passing undefined as a position; use explicit branches.
    const listeners: Array<{ card: HTMLDivElement; onEnter: () => void; onLeave: () => void }> = [];
    const tl = gsap.timeline();

    const header = headerRef.current;
    if (header) {
      tl.fromTo(header, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    }

    const cardEls = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cardEls.length > 0) {
      const fromVars = { y: 50, opacity: 0 };
      const toVars = { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.2)' } as any;
      if (header) tl.fromTo(cardEls, fromVars, toVars, '-=0.3');
      else tl.fromTo(cardEls, fromVars, toVars);
    }

    if (recentActivityRef.current) {
      if (header) {
        tl.fromTo(recentActivityRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.25');
      } else {
        tl.fromTo(recentActivityRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      }
    }

    // Hover interactions
    cardEls.forEach((card) => {
      const onEnter = () => gsap.to(card, { y: -8, scale: 1.02, duration: 0.25, ease: 'power2.out' });
      const onLeave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      listeners.push({ card, onEnter, onLeave });
    });

    // Small fallback: if any card still computes to opacity 0 after 400ms,
    // force visibility. This protects against the timeline failing to run
    // (simple and safe).
    const fallback = setTimeout(() => {
      cardEls.forEach((el) => {
        try {
          if (window.getComputedStyle(el).opacity === '0') {
            el.style.opacity = '1';
            el.style.transform = '';
          }
        } catch (e) {
          // ignore
        }
      });
    }, 400);

    return () => {
      clearTimeout(fallback);
      try { tl.kill && tl.kill(); } catch (e) { /* ignore */ }
      listeners.forEach(({ card, onEnter, onLeave }) => {
        try { card.removeEventListener('mouseenter', onEnter); card.removeEventListener('mouseleave', onLeave); } catch (e) { /* ignore */ }
      });
    };
  }, []);

  // dynamic data
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [customersCount, setCustomersCount] = useState<number | null>(null);
  const [recentProducts, setRecentProducts] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stats: any = await apiFetch('/api/admin/stats');
        // Debug: log the received payload so we can confirm the frontend sees the same data
        // This is non-invasive and can be removed once verified.
        // eslint-disable-next-line no-console

        setProductsCount(typeof stats.productsCount === 'number' ? stats.productsCount : 0);
        setCategoriesCount(typeof stats.categoriesCount === 'number' ? stats.categoriesCount : 0);
        setOrdersCount(typeof stats.ordersCount === 'number' ? stats.ordersCount : 0);
        setRevenue(typeof stats.revenue === 'number' ? stats.revenue : 0);
        setCustomersCount(typeof stats.customersCount === 'number' ? stats.customersCount : 0);

        // be tolerant: recentProducts might be under different keys or be undefined
        const recent = stats.recentProducts || stats.recent || stats.latestProducts || [];
        if (Array.isArray(recent)) {
          setRecentProducts(recent.map((p: any) => ({ id: p.id, name: p.name || p.title || `Product ${p.id}` })));
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Failed to load dashboard data', err);
        try { await showError('Failed to load dashboard data', err?.message || 'Server error'); } catch (e) { /* ignore */ }
      }
    };
    load();
  }, []);

  const stats = [
    { icon: Package, label: 'Total Products', value: productsCount !== null ? String(productsCount) : '—', change: '+12%', color: '#3b82f6', bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: ShoppingCart, label: 'Total Orders', value: ordersCount !== null ? String(ordersCount) : '—', change: '+8%', color: '#10b981', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: Users, label: 'Categories', value: categoriesCount !== null ? String(categoriesCount) : '—', change: '+23%', color: '#f59e0b', bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { icon: TrendingUp, label: 'Revenue', value: revenue !== null ? `₹${Number(revenue).toLocaleString('en-IN')}` : '—', change: '+18%', color: '#8b5cf6', bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];

  // Use a stable but guaranteed-unique key for activity items. Previously we used `p.id + i` which
  // could collide (e.g. p.id=60,i=0 and p.id=59,i=1 both produce 60). Use a string composed of
  // product id and index so React keys are unique and warnings disappear.
  const recentActivity = recentProducts.length > 0 ? recentProducts.map((p, i) => ({ id: `${p.id}-${i}`, action: `Product added: ${p.name}`, time: 'recent', type: 'product' })) : [];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header" ref={headerRef}>
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Track your business performance</p>
        </div>
        <div className="dashboard-date">
          <Calendar size={20} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="dashboard-card"
              ref={(el) => setCardRef(el, index)}
            >
              <div className="card-background" style={{ background: stat.bgGradient }}></div>
              <div className="dashboard-card-content">
                <div className="card-top">
                  <div className="dashboard-card-icon">
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="stat-change">
                    <ArrowUp size={14} />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="dashboard-card-info">
                  <h2 className="dashboard-card-value">{stat.value}</h2>
                  <p className="dashboard-card-label">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recent-activity" ref={recentActivityRef}>
        <div className="activity-header">
          <div className="activity-title">
            <Activity size={24} />
            <h2>Recent Activity</h2>
          </div>
        </div>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-dot activity-${activity.type}`}></div>
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
