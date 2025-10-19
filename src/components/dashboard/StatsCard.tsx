import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const gradientClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-green-600',
  orange: 'from-orange-500 to-amber-600',
  purple: 'from-purple-500 to-indigo-600',
  red: 'from-red-500 to-rose-600',
};

const bgClasses = {
  blue: 'bg-blue-50',
  green: 'bg-emerald-50',
  orange: 'bg-orange-50',
  purple: 'bg-purple-50',
  red: 'bg-red-50',
};

const iconClasses = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  red: 'text-red-600',
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  gradient = 'blue'
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Background Decoration */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl",
        gradientClasses[gradient]
      )} />

      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">{value}</h3>

            {description && (
              <p className="text-xs sm:text-sm text-slate-500 truncate">{description}</p>
            )}

            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold",
                    trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">vs mois dernier</span>
              </div>
            )}
          </div>

          <div className={cn(
            "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl flex-shrink-0",
            bgClasses[gradient]
          )}>
            <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", iconClasses[gradient])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
