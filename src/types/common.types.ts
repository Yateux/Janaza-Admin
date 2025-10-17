export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams {
  search?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type TableParams = PaginationParams & SearchParams & SortParams;

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  deletedUsers: number;
  totalAnnounces: number;
  activeAnnounces: number;
  expiredAnnounces: number;
  deletedAnnounces: number;
  pendingReports: number;
}
