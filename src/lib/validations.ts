import { z } from 'zod';
import { NotificationType, ReasonCategory, ReasonType, Role } from '@/types/api.types';

export const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const userSchema = z.object({
  email: z.string().email('Email invalide').max(255).nullable().optional(),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Doit contenir majuscule, minuscule, chiffre et caractère spécial'
    )
    .optional(),
  firstName: z.string().max(30).nullable().optional(),
  lastName: z.string().max(30).nullable().optional(),
  gender: z.enum(['M', 'F'], { required_error: 'Genre requis' }),
  dateOfBirth: z.date({ required_error: 'Date de naissance requise' }),
  roles: z.nativeEnum(Role, { required_error: 'Rôle requis' }),
});

export const createUserSchema = userSchema.extend({
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Doit contenir majuscule, minuscule, chiffre et caractère spécial'
    ),
});

export const reasonSchema = z.object({
  code: z.string().min(1, 'Code requis').max(100),
  label: z.string().min(1, 'Libellé requis').max(255),
  description: z.string().optional(),
  type: z.nativeEnum(ReasonType, { required_error: 'Type requis' }),
  category: z.nativeEnum(ReasonCategory, { required_error: 'Catégorie requise' }),
  active: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const notificationSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(100, 'Maximum 100 caractères'),
  message: z.string().min(1, 'Message requis').max(500, 'Maximum 500 caractères'),
  type: z.nativeEnum(NotificationType, { required_error: 'Type requis' }),
  data: z.record(z.unknown()).optional(),
});

export const notificationToUserSchema = notificationSchema.extend({
  userId: z.string().uuid('ID utilisateur invalide'),
});

export const resolveReportSchema = z.object({
  adminNotes: z.string().optional(),
  deleteAnnounce: z.boolean().default(false),
});

export const deleteWithReasonSchema = z.object({
  reasonId: z.number().int().positive('Raison requise'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type ReasonFormValues = z.infer<typeof reasonSchema>;
export type NotificationFormValues = z.infer<typeof notificationSchema>;
export type NotificationToUserFormValues = z.infer<typeof notificationToUserSchema>;
export type ResolveReportFormValues = z.infer<typeof resolveReportSchema>;
export type DeleteWithReasonFormValues = z.infer<typeof deleteWithReasonSchema>;
