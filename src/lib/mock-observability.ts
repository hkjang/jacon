export interface MetricPoint {
  time: string;
  value: number;
}

export interface MetricSeries {
  id: string;
  label: string;
  color: string;
  data: MetricPoint[];
}

export const MOCK_CPU_METRICS: MetricSeries[] = [
  {
    id: 'cpu-cluster-1',
    label: 'production-us-east',
    color: '#3b82f6', // blue-500
    data: [
      { time: '10:00', value: 45 }, { time: '10:05', value: 48 }, { time: '10:10', value: 52 },
      { time: '10:15', value: 49 }, { time: '10:20', value: 55 }, { time: '10:25', value: 60 },
      { time: '10:30', value: 58 }, { time: '10:35', value: 52 }, { time: '10:40', value: 48 },
      { time: '10:45', value: 45 }, { time: '10:50', value: 47 }, { time: '10:55', value: 50 },
    ]
  },
  {
    id: 'cpu-cluster-2',
    label: 'staging-eu-west',
    color: '#10b981', // emerald-500
    data: [
      { time: '10:00', value: 12 }, { time: '10:05', value: 15 }, { time: '10:10', value: 14 },
      { time: '10:15', value: 18 }, { time: '10:20', value: 16 }, { time: '10:25', value: 15 },
      { time: '10:30', value: 14 }, { time: '10:35', value: 12 }, { time: '10:40', value: 10 },
      { time: '10:45', value: 11 }, { time: '10:50', value: 13 }, { time: '10:55', value: 14 },
    ]
  }
];

export const MOCK_MEMORY_METRICS: MetricSeries[] = [
   {
    id: 'mem-cluster-1',
    label: 'production-us-east',
    color: '#8b5cf6', // violet-500
    data: [
       { time: '10:00', value: 70 }, { time: '10:05', value: 72 }, { time: '10:10', value: 75 },
       { time: '10:15', value: 78 }, { time: '10:20', value: 80 }, { time: '10:25', value: 82 },
       { time: '10:30', value: 81 }, { time: '10:35', value: 79 }, { time: '10:40', value: 77 },
       { time: '10:45', value: 75 }, { time: '10:50', value: 76 }, { time: '10:55', value: 75 },
    ]
   }
];
