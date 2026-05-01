import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import ServiceLogo from '@/components/ServiceLogo';

// Backend: replace with API call to GET /api/subscriptions/upcoming?days=14
const renewals = [
  { id: 'renewal-001', name: 'Spotify', category: 'Entertainment', price: 9.99, daysUntil: 2, date: 'May 2', color: '#1DB954' },
  { id: 'renewal-002', name: 'Adobe Creative', category: 'Productivity', price: 54.99, daysUntil: 4, date: 'May 4', urgent: true, color: '#FF0000' },
  { id: 'renewal-003', name: 'Disney+', category: 'Entertainment', price: 2.99, daysUntil: 7, date: 'May 7', color: '#0063E5' },
  { id: 'renewal-004', name: 'Netflix', category: 'Entertainment', price: 16.00, daysUntil: 11, date: 'May 11', color: '#E50914' },
  { id: 'renewal-005', name: 'YouTube Premium', category: 'Entertainment', price: 13.99, daysUntil: 14, date: 'May 14', color: '#FF0000' },
];

export default function UpcomingRenewals() {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-700 text-foreground">Upcoming Renewals</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Next 14 days</p>
        </div>
        <Calendar size={16} className="text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {renewals?.map((item) => (
          <div
            key={item?.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-150 hover:bg-muted/60 ${item?.urgent ? 'bg-amber-50 border border-amber-200' : 'bg-muted/30'}`}
          >
            <div className="flex items-center gap-3">
              <ServiceLogo name={item?.name} color={item?.color} size={32} />
              <div>
                <p className="text-sm font-600 text-foreground flex items-center gap-1.5">
                  {item?.name}
                  {item?.urgent && <AlertCircle size={12} className="text-amber-500" />}
                </p>
                <p className="text-xs text-muted-foreground">{item?.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-700 text-foreground tabular-nums">${item?.price}</p>
              <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${item?.daysUntil <= 3 ? 'bg-red-50 text-red-600' : item?.daysUntil <= 7 ? 'bg-amber-50 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
                {item?.daysUntil}d
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}