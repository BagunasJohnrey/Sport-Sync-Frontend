import React from 'react';
import { Users, UserCheck, Shield, Wallet } from 'lucide-react';

export default function UserStatsCards() {
  const stats = [
    {
      title: 'Total Users',
      value: '3',
      icon: Users,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: '3',
      icon: UserCheck,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50'
    },
    {
      title: 'Administrators',
      value: '1',
      icon: Shield,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-50'
    },
    {
      title: 'Cashiers',
      value: '1',
      icon: Users,
      iconColor: 'text-gray-400',
      iconBg: 'bg-gray-50'
    }
  ];

  return (
    <div className="flex gap-4 p-8  flex-wrap">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 flex-1 min-w-[250px]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm font-medium">
                {stat.title}
              </span>
              <div className={`${stat.iconBg} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            
            <div className="text-4xl font-bold text-gray-900">
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}