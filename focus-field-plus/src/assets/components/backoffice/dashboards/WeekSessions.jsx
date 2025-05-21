import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Lun", sessioni: 12 },
  { name: "Mar", sessioni: 18 },
  { name: "Mer", sessioni: 9 },
  { name: "Gio", sessioni: 14 },
  { name: "Ven", sessioni: 20 },
  { name: "Sab", sessioni: 17 },
  { name: "Dom", sessioni: 10 },
];

const WeekSessions = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="sessioni" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

export default WeekSessions;
