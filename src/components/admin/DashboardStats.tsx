"use client";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: string;
  color?: "blue" | "green" | "yellow" | "purple";
}

function StatsCard({ title, value, icon, color = "blue" }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        {icon && <span className="text-4xl opacity-50">{icon}</span>}
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  totalOrders: number;
  totalCustomers: number;
  totalFlavors: number;
  totalAdditionals: number;
  totalRevenue?: number;
}

export function DashboardStats({
  totalOrders,
  totalCustomers,
  totalFlavors,
  totalAdditionals,
  totalRevenue = 0,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Total de Pedidos"
        value={totalOrders}
        icon=""
        color="blue"
      />
      <StatsCard
        title="Clientes"
        value={totalCustomers}
        icon="👥"
        color="green"
      />
      <StatsCard
        title="Sabores"
        value={totalFlavors}
        icon=""
        color="yellow"
      />
      <StatsCard
        title="Adicionais"
        value={totalAdditionals}
        icon="🍓"
        color="purple"
      />
      {totalRevenue > 0 && (
        <div className="col-span-full">
          <StatsCard
            title="Receita Total"
            value={`R$ ${totalRevenue.toFixed(2)}`}
            icon="💰"
            color="green"
          />
        </div>
      )}
    </div>
  );
}
