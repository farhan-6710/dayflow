export type ActivityStatusRow = {
  name: string;
  pending: number;
  inProgress: number;
  completed: number;
};

export type ActivitiesByStatusChartProps = {
  rows: ActivityStatusRow[];
};

export type ProjectActivityRow = {
  id: string;
  name: string;
  color: string;
  open: number;
  completed: number;
};

export type ProjectActivityTableProps = {
  rows: ProjectActivityRow[];
};
