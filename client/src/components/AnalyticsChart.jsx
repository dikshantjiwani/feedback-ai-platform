import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ["#4f46e5", "#16a34a", "#f59e0b", "#dc2626", "#0ea5e9", "#9333ea"];

export default function AnalyticsChart({ question, data }) {
  const chartData = Object.entries(data).map(([option, count]) => ({ name: option, value: count }));

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>

      {chartData.length <= 5 ? (
        <PieChart width={300} height={250}>
          <Pie
            data={chartData}
            cx={150}
            cy={120}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      ) : (
        <BarChart width={500} height={250} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      )}
    </div>
  );
}
