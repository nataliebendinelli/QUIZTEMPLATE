import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#4a90e2', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];

export default function QuizAnalytics({ quizId }) {
  const [analyticsData, setAnalyticsData] = useState({
    completionRate: [],
    dropOffPoints: [],
    averageScores: [],
    timeSpent: [],
    leadQuality: []
  });

  useEffect(() => {
    // Fetch analytics data from your backend
    fetchAnalytics();
  }, [quizId]);

  const fetchAnalytics = async () => {
    // Mock data - replace with actual API call
    setAnalyticsData({
      completionRate: [
        { date: 'Mon', rate: 65 },
        { date: 'Tue', rate: 72 },
        { date: 'Wed', rate: 78 },
        { date: 'Thu', rate: 82 },
        { date: 'Fri', rate: 88 },
        { date: 'Sat', rate: 85 },
        { date: 'Sun', rate: 90 }
      ],
      dropOffPoints: [
        { question: 'Q1', dropOff: 5 },
        { question: 'Q2', dropOff: 8 },
        { question: 'Q3', dropOff: 15 },
        { question: 'Q4', dropOff: 12 },
        { question: 'Email', dropOff: 25 }
      ],
      averageScores: [
        { range: '0-20%', count: 15 },
        { range: '21-40%', count: 25 },
        { range: '41-60%', count: 35 },
        { range: '61-80%', count: 45 },
        { range: '81-100%', count: 30 }
      ],
      timeSpent: [
        { time: '<1min', users: 10 },
        { time: '1-2min', users: 35 },
        { time: '2-3min', users: 45 },
        { time: '3-5min', users: 25 },
        { time: '>5min', users: 15 }
      ],
      leadQuality: [
        { quality: 'Hot', value: 35 },
        { quality: 'Warm', value: 45 },
        { quality: 'Cold', value: 20 }
      ]
    });
  };

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Quiz Analytics Dashboard</h2>

      {/* Completion Rate Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Completion Rate Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.completionRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#4a90e2" 
              strokeWidth={3}
              name="Completion Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Drop-off Points */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Drop-off Points</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.dropOffPoints}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="question" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="dropOff" fill="#e74c3c" name="Drop-off (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.averageScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2ecc71" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Quality */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Lead Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.leadQuality}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ quality, value }) => `${quality}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.leadQuality.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-600">Total Responses</h4>
          <p className="text-2xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-600">Avg Completion Rate</h4>
          <p className="text-2xl font-bold text-green-600">78%</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-600">Avg Time Spent</h4>
          <p className="text-2xl font-bold text-yellow-600">2m 45s</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-600">Lead Conversion</h4>
          <p className="text-2xl font-bold text-purple-600">23%</p>
        </div>
      </div>
    </div>
  );
}