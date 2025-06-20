<?php

namespace App\Controller;

use App\Entity\Level;
use App\Entity\LevelTranslation;
use App\Repository\LevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/levels')]
class LevelController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('', name: 'api_level_index', methods: ['GET'])]
    public function index(LevelRepository $levelRepository, Request $request): JsonResponse
    {
        try {
            $locale = $request->query->get('lang', 'fr');

            $levels = $levelRepository->createQueryBuilder('l')
                ->leftJoin('l.translations', 't')
                ->addSelect('t')
                ->orderBy('l.minScore', 'ASC')
                ->getQuery()
                ->getResult();

            $result = [];
            foreach ($levels as $level) {
                $translation = $level->getTranslation($locale);

                // Calculer le nombre d'utilisateurs pour ce niveau
                $nextLevelMinScore = $this->getNextLevelMinScore($levelRepository, $level->getMinScore());
                $isLastLevel = $this->isLastLevel($levelRepository, $level->getMinScore());

                $qb = $this->entityManager->createQueryBuilder()
                    ->select('COUNT(u.id)')
                    ->from('App\Entity\User', 'u')
                    ->where('u.score >= :minScore')
                    ->setParameter('minScore', $level->getMinScore());

                // Si ce n'est pas le dernier niveau, ajouter la condition de score maximum
                if (!$isLastLevel && $nextLevelMinScore !== null) {
                    $qb->andWhere('u.score < :nextMinScore')
                       ->setParameter('nextMinScore', $nextLevelMinScore);
                }

                $userCount = $qb->getQuery()->getSingleScalarResult();

                $result[] = [
                    'id' => $level->getId(),
                    'minScore' => $level->getMinScore(),
                    'image' => $level->getImage(),
                    'name' => $translation ? $translation->getName() : "Niveau {$level->getId()}",
                    'locale' => $locale,
                    'userCount' => (int) $userCount,
                ];
            }

            return $this->json($result);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération des niveaux: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'api_level_show', methods: ['GET'])]
    public function show(int $id, LevelRepository $levelRepository, Request $request): JsonResponse
    {
        try {
            $level = $levelRepository->find($id);

            if (!$level) {
                return $this->json([
                    'error' => 'Niveau non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            $locale = $request->query->get('lang', 'fr');
            $translation = $level->getTranslation($locale);

            $allTranslations = [];
            foreach ($level->getTranslations() as $t) {
                $allTranslations[] = [
                    'locale' => $t->getLocale(),
                    'name' => $t->getName()
                ];
            }

            return $this->json([
                'id' => $level->getId(),
                'minScore' => $level->getMinScore(),
                'image' => $level->getImage(),
                'name' => $translation ? $translation->getName() : "Niveau {$level->getId()}",
                'translations' => $allTranslations
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération du niveau: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('', name: 'api_level_create', methods: ['POST'])]
    public function create(Request $request, LevelRepository $levelRepository): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
            }

            // Validation des champs requis
            $requiredFields = ['minScore', 'translations'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    return $this->json([
                        'error' => "Le champ '{$field}' est requis"
                    ], Response::HTTP_BAD_REQUEST);
                }
            }

            // Validation du score minimum
            if (!is_numeric($data['minScore']) || $data['minScore'] < 0) {
                return $this->json([
                    'error' => 'Le score minimum doit être un nombre positif'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Vérifier l'unicité du score minimum
            $existingLevel = $levelRepository->findOneBy(['minScore' => $data['minScore']]);
            if ($existingLevel) {
                return $this->json([
                    'error' => 'Un niveau avec ce score minimum existe déjà'
                ], Response::HTTP_CONFLICT);
            }

            // Validation des traductions
            if (!is_array($data['translations']) || empty($data['translations'])) {
                return $this->json([
                    'error' => 'Au moins une traduction est requise'
                ], Response::HTTP_BAD_REQUEST);
            }

            $level = new Level();
            $level->setMinScore((int)$data['minScore']);
            $level->setImage($data['image'] ?? null);

            // Ajout des traductions
            foreach ($data['translations'] as $translationData) {
                if (!isset($translationData['locale']) || !isset($translationData['name'])) {
                    return $this->json([
                        'error' => 'Chaque traduction doit avoir un locale et un name'
                    ], Response::HTTP_BAD_REQUEST);
                }

                $translation = new LevelTranslation();
                $translation->setLocale($translationData['locale']);
                $translation->setName($translationData['name']);
                $translation->setLevel($level);

                $this->entityManager->persist($translation);
            }

            $this->entityManager->persist($level);
            $this->entityManager->flush();

            return $this->json([
                'id' => $level->getId(),
                'message' => 'Niveau créé avec succès',
                'data' => [
                    'id' => $level->getId(),
                    'minScore' => $level->getMinScore(),
                    'image' => $level->getImage()
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la création: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'api_level_update', methods: ['PUT'])]
    public function update(int $id, Request $request, LevelRepository $levelRepository): JsonResponse
    {
        try {
            $level = $levelRepository->find($id);

            if (!$level) {
                return $this->json([
                    'error' => 'Niveau non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
            }

            // Mise à jour du score minimum
            if (isset($data['minScore'])) {
                if (!is_numeric($data['minScore']) || $data['minScore'] < 0) {
                    return $this->json([
                        'error' => 'Le score minimum doit être un nombre positif'
                    ], Response::HTTP_BAD_REQUEST);
                }

                // Vérifier l'unicité (excluant le niveau actuel)
                $existingLevel = $levelRepository->createQueryBuilder('l')
                    ->where('l.minScore = :minScore AND l.id != :id')
                    ->setParameter('minScore', $data['minScore'])
                    ->setParameter('id', $level->getId())
                    ->getQuery()
                    ->getOneOrNullResult();

                if ($existingLevel) {
                    return $this->json([
                        'error' => 'Un autre niveau avec ce score minimum existe déjà'
                    ], Response::HTTP_CONFLICT);
                }

                $level->setMinScore((int)$data['minScore']);
            }

            // Mise à jour de l'image
            if (isset($data['image'])) {
                $level->setImage($data['image']);
            }

            // Mise à jour des traductions
            if (isset($data['translations']) && is_array($data['translations'])) {
                foreach ($data['translations'] as $translationData) {
                    if (!isset($translationData['locale'])) {
                        continue;
                    }

                    $translation = $level->getTranslation($translationData['locale']);
                    if (!$translation) {
                        // Créer une nouvelle traduction
                        $translation = new LevelTranslation();
                        $translation->setLocale($translationData['locale']);
                        $translation->setLevel($level);
                        $this->entityManager->persist($translation);
                    }

                    if (isset($translationData['name'])) {
                        $translation->setName($translationData['name']);
                    }
                }
            }

            $this->entityManager->flush();

            return $this->json([
                'id' => $level->getId(),
                'message' => 'Niveau mis à jour avec succès'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'api_level_delete', methods: ['DELETE'])]
    public function delete(int $id, LevelRepository $levelRepository): JsonResponse
    {
        try {
            $level = $levelRepository->find($id);

            if (!$level) {
                return $this->json([
                    'error' => 'Niveau non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            $this->entityManager->remove($level);
            $this->entityManager->flush();

            return $this->json([
                'message' => 'Niveau supprimé avec succès'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/by-score/{score}', name: 'api_level_by_score', methods: ['GET'])]
    public function getLevelByScore(int $score, LevelRepository $levelRepository, Request $request): JsonResponse
    {
        try {
            $locale = $request->query->get('lang', 'fr');

            $level = $levelRepository->createQueryBuilder('l')
                ->leftJoin('l.translations', 't')
                ->addSelect('t')
                ->where('l.minScore <= :score')
                ->orderBy('l.minScore', 'DESC')
                ->setParameter('score', $score)
                ->setMaxResults(1)
                ->getQuery()
                ->getOneOrNullResult();

            if (!$level) {
                return $this->json([
                    'error' => 'Aucun niveau trouvé pour ce score'
                ], Response::HTTP_NOT_FOUND);
            }

            $translation = $level->getTranslation($locale);

            return $this->json([
                'id' => $level->getId(),
                'minScore' => $level->getMinScore(),
                'image' => $level->getImage(),
                'name' => $translation ? $translation->getName() : "Niveau {$level->getId()}",
                'userScore' => $score
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération du niveau: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/user-level', name: 'api_user_current_level', methods: ['GET'])]
    public function getCurrentUserLevel(LevelRepository $levelRepository, Request $request): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user) {
                return $this->json([
                    'error' => 'Utilisateur non authentifié'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $locale = $request->query->get('lang', 'fr');
            $userScore = $user->getScore() ?? 0;

            $level = $levelRepository->createQueryBuilder('l')
                ->leftJoin('l.translations', 't')
                ->addSelect('t')
                ->where('l.minScore <= :score')
                ->orderBy('l.minScore', 'DESC')
                ->setParameter('score', $userScore)
                ->setMaxResults(1)
                ->getQuery()
                ->getOneOrNullResult();

            if (!$level) {
                return $this->json([
                    'message' => 'Aucun niveau atteint',
                    'userScore' => $userScore
                ]);
            }

            $translation = $level->getTranslation($locale);

            // Trouver le prochain niveau
            $nextLevel = $levelRepository->createQueryBuilder('l')
                ->where('l.minScore > :score')
                ->orderBy('l.minScore', 'ASC')
                ->setParameter('score', $userScore)
                ->setMaxResults(1)
                ->getQuery()
                ->getOneOrNullResult();

            $result = [
                'currentLevel' => [
                    'id' => $level->getId(),
                    'minScore' => $level->getMinScore(),
                    'image' => $level->getImage(),
                    'name' => $translation ? $translation->getName() : "Niveau {$level->getId()}"
                ],
                'userScore' => $userScore,
                'nextLevel' => null
            ];

            if ($nextLevel) {
                $nextTranslation = $nextLevel->getTranslation($locale);
                $result['nextLevel'] = [
                    'id' => $nextLevel->getId(),
                    'minScore' => $nextLevel->getMinScore(),
                    'image' => $nextLevel->getImage(),
                    'name' => $nextTranslation ? $nextTranslation->getName() : "Niveau {$nextLevel->getId()}",
                    'pointsNeeded' => $nextLevel->getMinScore() - $userScore
                ];
            }

            return $this->json($result);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération du niveau utilisateur: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getNextLevelMinScore(LevelRepository $levelRepository, int $currentMinScore): ?int
    {
        $nextLevel = $levelRepository->createQueryBuilder('l')
            ->where('l.minScore > :currentMinScore')
            ->orderBy('l.minScore', 'ASC')
            ->setParameter('currentMinScore', $currentMinScore)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        return $nextLevel ? $nextLevel->getMinScore() : null;
    }

    private function isLastLevel(LevelRepository $levelRepository, int $currentMinScore): bool
    {
        $nextLevel = $levelRepository->createQueryBuilder('l')
            ->where('l.minScore > :currentMinScore')
            ->setParameter('currentMinScore', $currentMinScore)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        return $nextLevel === null;
    }
}
