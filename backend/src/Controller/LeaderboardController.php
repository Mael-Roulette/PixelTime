<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\LevelRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/leaderboard')]
class LeaderboardController extends AbstractController
{
    #[Route('', name: 'leaderboard_index', methods: ['GET'])]
    public function index(UserRepository $userRepository, LevelRepository $levelRepository, Request $request): JsonResponse
    {
        try {
            $levelId = $request->query->get('level');
            $limit = $request->query->get('limit', 50); // Limiter à 50 par défaut

            $queryBuilder = $userRepository->createQueryBuilder('u')
                ->orderBy('u.score', 'DESC')
                ->setMaxResults($limit);

            // Si un niveau spécifique est demandé, filtrer par le score minimum de ce niveau
            if ($levelId) {
                $level = $levelRepository->find($levelId);
                if (!$level) {
                    return $this->json(['error' => 'Niveau non trouvé'], Response::HTTP_NOT_FOUND);
                }

                // Filtrer les utilisateurs qui ont au moins le score minimum du niveau
                $queryBuilder->where('u.score >= :minScore')
                    ->setParameter('minScore', $level->getMinScore());
            }

            $users = $queryBuilder->getQuery()->getResult();

            $leaderboard = [];
            foreach ($users as $user) {
                $leaderboard[] = [
                    'id' => $user->getId(),
                    'user' => [
                        'username' => $user->getPseudo(),
                        'profile_image' => $user->getProfilePicture()
                    ],
                    'score' => $user->getScore(),
                    'level' => $this->getUserLevel($user, $levelRepository)
                ];
            }

            return $this->json($leaderboard);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération du classement: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/top/{limit}', name: 'leaderboard_top', methods: ['GET'])]
    public function top(int $limit, UserRepository $userRepository, LevelRepository $levelRepository): JsonResponse
    {
        try {
            if ($limit > 100) {
                $limit = 100; // Limiter à 100 maximum
            }

            $users = $userRepository->createQueryBuilder('u')
                ->orderBy('u.score', 'DESC')
                ->setMaxResults($limit)
                ->getQuery()
                ->getResult();

            $leaderboard = [];
            foreach ($users as $user) {
                $leaderboard[] = [
                    'id' => $user->getId(),
                    'user' => [
                        'username' => $user->getPseudo(),
                        'profile_image' => $user->getProfilePicture()
                    ],
                    'score' => $user->getScore(),
                    'level' => $this->getUserLevel($user, $levelRepository)
                ];
            }

            return $this->json($leaderboard);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération du top: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/user/{id}/rank', name: 'leaderboard_user_rank', methods: ['GET'])]
    public function getUserRank(User $user, UserRepository $userRepository): JsonResponse
    {
        try {
            // Compter combien d'utilisateurs ont un score supérieur
            $rank = $userRepository->createQueryBuilder('u')
                ->select('COUNT(u.id)')
                ->where('u.score > :userScore')
                ->setParameter('userScore', $user->getScore())
                ->getQuery()
                ->getSingleScalarResult();

            return $this->json([
                'user_id' => $user->getId(),
                'rank' => $rank + 1, // +1 car on compte à partir de 1
                'score' => $user->getScore()
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération du rang: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getUserLevel(User $user, LevelRepository $levelRepository): ?array
    {
        $level = $levelRepository->createQueryBuilder('l')
            ->where('l.minScore <= :score')
            ->orderBy('l.minScore', 'DESC')
            ->setParameter('score', $user->getScore())
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$level) {
            return null;
        }

        $translation = $level->getTranslation('fr'); // Vous pouvez adapter selon la langue

        return [
            'id' => $level->getId(),
            'name' => $translation ? $translation->getName() : 'Niveau inconnu',
            'minScore' => $level->getMinScore(),
            'image' => $level->getImage()
        ];
    }
}
