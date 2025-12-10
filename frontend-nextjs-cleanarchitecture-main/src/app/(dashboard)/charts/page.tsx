'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CodeBlock } from '@/shared/components/ui';

// Code snippets
const lineChartCode = `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
    <XAxis dataKey="name" className="text-xs" />
    <YAxis className="text-xs" />
    <Tooltip
      contentStyle={{
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
      }}
    />
    <Line
      type="monotone"
      dataKey="value"
      stroke="hsl(var(--primary))"
      strokeWidth={2}
      dot={{ fill: 'hsl(var(--primary))' }}
    />
  </LineChart>
</ResponsiveContainer>`;

const barChartCode = `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, orders: 2400 },
  { name: 'Tue', sales: 3000, orders: 1398 },
  { name: 'Wed', sales: 2000, orders: 9800 },
  // ...
];

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
    <XAxis dataKey="name" className="text-xs" />
    <YAxis className="text-xs" />
    <Tooltip contentStyle={{...}} />
    <Legend />
    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
    <Bar dataKey="orders" fill="hsl(210, 100%, 50%)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>`;

const pieChartCode = `import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Desktop', value: 400, color: 'hsl(var(--primary))' },
  { name: 'Mobile', value: 300, color: 'hsl(210, 100%, 50%)' },
  { name: 'Tablet', value: 200, color: 'hsl(150, 100%, 40%)' },
  { name: 'Other', value: 100, color: 'hsl(45, 100%, 50%)' },
];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={100}
      paddingAngle={5}
      dataKey="value"
      label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
    >
      {data.map((entry, index) => (
        <Cell key={\`cell-\${index}\`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip contentStyle={{...}} />
  </PieChart>
</ResponsiveContainer>`;

const areaChartCode = `import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  // ...
];

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
    <XAxis dataKey="name" className="text-xs" />
    <YAxis className="text-xs" />
    <Tooltip contentStyle={{...}} />
    <Legend />
    <Area
      type="monotone"
      dataKey="revenue"
      stackId="1"
      stroke="hsl(var(--primary))"
      fill="hsl(var(--primary))"
      fillOpacity={0.3}
    />
    <Area
      type="monotone"
      dataKey="profit"
      stackId="2"
      stroke="hsl(150, 100%, 40%)"
      fill="hsl(150, 100%, 40%)"
      fillOpacity={0.3}
    />
  </AreaChart>
</ResponsiveContainer>`;

// Sample data
const lineData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const barData = [
  { name: 'Mon', sales: 4000, orders: 2400 },
  { name: 'Tue', sales: 3000, orders: 1398 },
  { name: 'Wed', sales: 2000, orders: 9800 },
  { name: 'Thu', sales: 2780, orders: 3908 },
  { name: 'Fri', sales: 1890, orders: 4800 },
  { name: 'Sat', sales: 2390, orders: 3800 },
  { name: 'Sun', sales: 3490, orders: 4300 },
];

const pieData = [
  { name: 'Desktop', value: 400, color: 'hsl(var(--primary))' },
  { name: 'Mobile', value: 300, color: 'hsl(210, 100%, 50%)' },
  { name: 'Tablet', value: 200, color: 'hsl(150, 100%, 40%)' },
  { name: 'Other', value: 100, color: 'hsl(45, 100%, 50%)' },
];

const areaData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
];

export default function ChartsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Charts</h1>
        <p className="text-muted-foreground">
          Visualisasi data menggunakan Recharts library
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
            <CardDescription>Trend data over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
            <CodeBlock code={lineChartCode} title="Line Chart Usage" />
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>Comparison of sales and orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="hsl(210, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <CodeBlock code={barChartCode} title="Bar Chart Usage" />
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <CodeBlock code={pieChartCode} title="Pie Chart Usage" />
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Area Chart</CardTitle>
            <CardDescription>Revenue vs Profit over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="2"
                  stroke="hsl(150, 100%, 40%)"
                  fill="hsl(150, 100%, 40%)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
            <CodeBlock code={areaChartCode} title="Area Chart Usage" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
