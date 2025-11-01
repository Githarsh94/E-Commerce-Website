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
    // Debug: log refs to help track visibility issues in the browser console
    // If any GSAP call throws due to null targets it could abort animations and leave elements hidden.
    // Make GSAP calls defensive so we don't break rendering.
    // eslint-disable-next-line no-console
    // console.log('AdminDashboard mounted', {
    //   header: headerRef.current,
    //   cardsCount: cardsRef.current.length,
    //   cards: cardsRef.current,
    //   recentActivity: recentActivityRef.current
    // });

    const tl = gsap.timeline();

    // header animation
    if (headerRef.current) {
      tl.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // cards animation: only target actual elements
    const cardEls = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cardEls.length > 0) {
      tl.from(cardEls, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.2)'
      }, headerRef.current ? '-=0.4' : undefined);
    }

    if (recentActivityRef.current) {
      tl.from(recentActivityRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3');
    }

    // attach hover animations safely and ensure cleanup on unmount
    const listeners: Array<{ card: HTMLDivElement; onEnter: () => void; onLeave: () => void }> = [];
    cardEls.forEach((card) => {
      const onEnter = () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const onLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      listeners.push({ card, onEnter, onLeave });
    });

    return () => {
      listeners.forEach(({ card, onEnter, onLeave }) => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // dynamic data
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);
  const [recentProducts, setRecentProducts] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stats: any = await apiFetch('/api/admin/stats');
        setProductsCount(typeof stats.productsCount === 'number' ? stats.productsCount : 0);
        setCategoriesCount(typeof stats.categoriesCount === 'number' ? stats.categoriesCount : 0);
        if (Array.isArray(stats.recentProducts)) {
          setRecentProducts(stats.recentProducts.map((p: any) => ({ id: p.id, name: p.name || p.title || `Product ${p.id}` })));
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
    { icon: ShoppingCart, label: 'Total Orders', value: '—', change: '+8%', color: '#10b981', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: Users, label: 'Categories', value: categoriesCount !== null ? String(categoriesCount) : '—', change: '+23%', color: '#f59e0b', bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { icon: TrendingUp, label: 'Revenue', value: '$—', change: '+18%', color: '#8b5cf6', bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];

  const recentActivity = recentProducts.length > 0 ? recentProducts.map((p, i) => ({ id: p.id + i, action: `Product added: ${p.name}`, time: 'recent', type: 'product' })) : [];

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
