import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { CommentAnnounce } from '@/types/api.types';

interface CommentWithAnnounceInfo extends Omit<CommentAnnounce, 'announce'> {
  announce: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
}

// Hook pour récupérer les derniers commentaires de toutes les annonces
export const useRecentComments = (limit: number = 10) => {
  return useQuery({
    queryKey: ['comments', 'recent', limit],
    queryFn: async () => {
      // Récupérer tous les commentaires via l'endpoint /announce (on doit faire plusieurs requêtes)
      // Pour l'instant, on va créer une solution basée sur les annonces récentes
      const { data: announces } = await apiClient.get('/announce/admin/all');

      // Récupérer les commentaires des 20 dernières annonces
      const recentAnnounces = announces
        .sort((a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 20);

      const allComments: CommentWithAnnounceInfo[] = [];

      // Récupérer les commentaires de chaque annonce
      for (const announce of recentAnnounces) {
        try {
          const { data: comments } = await apiClient.get(`/announce/${announce.id}/comment`);
          if (Array.isArray(comments) && comments.length > 0) {
            // Ajouter les informations de l'annonce à chaque commentaire
            comments.forEach((comment: CommentAnnounce) => {
              allComments.push({
                ...comment,
                announce: {
                  id: announce.id as string,
                  firstName: announce.firstName as string | null,
                  lastName: announce.lastName as string | null,
                },
              });
            });
          }
        } catch (error) {
          // Ignorer les erreurs pour les annonces individuelles
          console.error(`Failed to fetch comments for announce ${announce.id}`, error);
        }
      }

      // Trier par date de création et limiter
      return allComments
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
