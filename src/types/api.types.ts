export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum ReasonType {
  ANNOUNCE = 'announce',
  COMMENT = 'comment',
  USER = 'user',
}

export enum ReasonCategory {
  USER_REQUEST = 'user_request',
  ACCOUNT_DELETION = 'account-deletion',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
  INAPPROPRIATE = 'inappropriate',
  SPAM = 'spam',
  OFFENSIVE = 'offensive',
  OTHER = 'other',
}

export enum ReportType {
  INAPPROPRIATE_CONTENT = 'Contenu inapproprié',
  INCORRECT_INFORMATION = 'Information incorrecte',
  SPAM = 'Spam',
  OTHER = 'Autre',
}

export enum NotificationType {
  NEW_JANAZA = 'new_janaza',
  LOCATION_JANAZA = 'location_janaza',
  ADMIN_MESSAGE = 'admin_message',
  ADMIN_BROADCAST = 'admin_broadcast',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  NEW_COMMENT = 'new_comment',
  ANNOUNCE_UPDATE = 'announce_update',
  SECURITY_ALERT = 'security_alert',
  ACCOUNT_UPDATE = 'account_update',
  MAINTENANCE = 'maintenance',
  SERVICE_UPDATE = 'service_update',
  CUSTOM = 'custom',
}

export interface User {
  id: string;
  email: string | null;
  roles: Role;
  firstName: string | null;
  lastName: string | null;
  gender: 'M' | 'F';
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deletionReasonId: number | null;
  rgpdDeletionRequested: boolean;
  rgpdDeletionRequestedAt: Date | null;
  ipHash?: string;
}

export interface Announce {
  id: string;
  firstName: string | null;
  lastName: string | null;
  gender: 'M' | 'F';
  dateOfBirth: Date | null;
  active: boolean;
  hasForum: boolean;
  remarks: string | null;
  addressPray: string;
  postCodePray: number;
  cityPray: string;
  countryPray: string;
  latitudePray: number;
  longitudePray: number;
  startDate: Date;
  startTime: Date;
  addressFuneral: string | null;
  postCodeFuneral: number | null;
  cityFuneral: string | null;
  countryFuneral: string | null;
  latitudeFuneral: number | null;
  longitudeFuneral: number | null;
  funeralDate: Date | null;
  funeralTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deletionReasonId: number | null;
  expired: boolean;
  expiredAt: Date | null;
  notificationSent: boolean;
  notificationSentAt: Date | null;
  locationNotificationSent: boolean;
  locationNotificationSentAt: Date | null;
  participantsCount?: number;
  user?: User;
}

export interface ReportAnnounce {
  id: string;
  type: ReportType;
  description: string | null;
  resolved: boolean;
  adminNotes: string | null;
  ipAddress: string | null;
  deviceId: string | null;
  createdAt: Date;
  updatedAt: Date;
  announce: Announce;
  reportedBy: User | null;
}

export interface CommentAnnounce {
  id: string;
  message: string;
  createdAt: Date;
  deletedAt: Date | null;
  deletionReasonId: number | null;
  parent: CommentAnnounce | null;
  announce: Announce;
  user: User;
  deletionReason?: Reason;
}

export interface Reason {
  id: number;
  code: string;
  label: string;
  description: string | null;
  type: ReasonType;
  category: ReasonCategory;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PushToken {
  deviceId: string;
  expoPushToken: string;
  userId: string | null;
  user?: User;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface CreateUserDto {
  email?: string | null;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  gender: 'M' | 'F';
  dateOfBirth: Date;
  roles: Role;
}

export interface UpdateUserDto {
  email?: string | null;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
  gender?: 'M' | 'F';
  dateOfBirth?: Date;
  roles?: Role;
}

export interface DeleteWithReasonDto {
  reasonId: number;
}

export interface CreateReasonDto {
  code: string;
  label: string;
  description?: string;
  type: ReasonType;
  category: ReasonCategory;
  active?: boolean;
  displayOrder?: number;
}

export interface UpdateReasonDto {
  code?: string;
  label?: string;
  description?: string;
  type?: ReasonType;
  category?: ReasonCategory;
  active?: boolean;
  displayOrder?: number;
}

export interface SendNotificationToUserDto {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, unknown>;
}

export interface SendNotificationToAllDto {
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, unknown>;
}

export interface ResolveReportDto {
  adminNotes?: string;
}
