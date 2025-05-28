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

#[Route('/levels')]
class LevelController extends AbstractController
{
    #[Route('', name: 'level_index', methods: ['GET'])]
    public function index(LevelRepository $levelRepository, Request $request): JsonResponse
    {
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

            $result[] = [
                'id' => $level->getId(),
                'minScore' => $level->getMinScore(),
                'image' => $level->getImage(),
                'name' => $translation ? $translation->getName() : 'Nom non disponible'
            ];
        }

        return $this->json($result);
    }

    #[Route('/{id}', name: 'level_show', methods: ['GET'])]
    public function show(Level $level, Request $request): JsonResponse
    {
        $locale = $request->query->get('lang', 'fr');
        $translation = $level->getTranslation($locale);

        if (!$translation) {
            return $this->json([
                'error' => 'Traduction non trouvée pour la langue: ' . $locale
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $level->getId(),
            'minScore' => $level->getMinScore(),
            'image' => $level->getImage(),
            'name' => $translation->getName(),
            'translations' => array_map(function ($t) {
                return [
                    'locale' => $t->getLocale(),
                    'name' => $t->getName()
                ];
            }, $level->getTranslations()->toArray())
        ]);
    }

    #[Route('', name: 'level_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
            }

            if (!isset($data['minScore']) || !isset($data['image']) || !isset($data['translations'])) {
                return $this->json(['error' => 'Champs requis manquants (minScore, image, translations)'], Response::HTTP_BAD_REQUEST);
            }

            if (!is_numeric($data['minScore']) || $data['minScore'] < 0) {
                return $this->json(['error' => 'Le score minimum doit être un nombre positif'], Response::HTTP_BAD_REQUEST);
            }

            $existingLevel = $entityManager->getRepository(Level::class)
                ->findOneBy(['minScore' => $data['minScore']]);

            if ($existingLevel) {
                return $this->json(['error' => 'Un niveau avec ce score minimum existe déjà'], Response::HTTP_CONFLICT);
            }

            $level = new Level();
            $level->setMinScore($data['minScore']);
            $level->setImage($data['image']);

            // Traitement des traductions
            foreach ($data['translations'] as $translationData) {
                if (!isset($translationData['locale']) || !isset($translationData['name'])) {
                    return $this->json(['error' => 'Données de traduction invalides (locale et name requis)'], Response::HTTP_BAD_REQUEST);
                }

                $translation = new LevelTranslation();
                $translation->setLocale($translationData['locale']);
                $translation->setName($translationData['name']);
                $translation->setLevel($level);

                $entityManager->persist($translation);
            }

            $entityManager->persist($level);
            $entityManager->flush();

            return $this->json([
                'id' => $level->getId(),
                'message' => 'Niveau créé avec succès'
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la création: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'level_update', methods: ['PUT'])]
    public function update(Request $request, Level $level, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
            }

            if (isset($data['minScore'])) {
                if (!is_numeric($data['minScore']) || $data['minScore'] < 0) {
                    return $this->json(['error' => 'Le score minimum doit être un nombre positif'], Response::HTTP_BAD_REQUEST);
                }

                $existingLevel = $entityManager->getRepository(Level::class)
                    ->createQueryBuilder('l')
                    ->where('l.minScore = :minScore AND l.id != :id')
                    ->setParameter('minScore', $data['minScore'])
                    ->setParameter('id', $level->getId())
                    ->getQuery()
                    ->getOneOrNullResult();

                if ($existingLevel) {
                    return $this->json(['error' => 'Un autre niveau avec ce score minimum existe déjà'], Response::HTTP_CONFLICT);
                }

                $level->setMinScore($data['minScore']);
            }

            if (isset($data['image'])) {
                $level->setImage($data['image']);
            }

            if (isset($data['translations'])) {
                foreach ($data['translations'] as $translationData) {
                    if (!isset($translationData['locale'])) {
                        continue;
                    }

                    $translation = $level->getTranslation($translationData['locale']);
                    if (!$translation) {
                        $translation = new LevelTranslation();
                        $translation->setLocale($translationData['locale']);
                        $translation->setLevel($level);
                        $entityManager->persist($translation);
                    }

                    if (isset($translationData['name'])) {
                        $translation->setName($translationData['name']);
                    }
                }
            }

            $entityManager->flush();

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

    #[Route('/{id}', name: 'level_delete', methods: ['DELETE'])]
    public function delete(Level $level, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $entityManager->remove($level);
            $entityManager->flush();

            return $this->json([
                'message' => 'Niveau supprimé avec succès'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/by-score/{score}', name: 'level_by_score', methods: ['GET'])]
    public function getLevelByScore(int $score, LevelRepository $levelRepository, Request $request): JsonResponse
    {
        $locale = $request->query->get('lang', 'fr');

        $level = $levelRepository->createQueryBuilder('l')
            ->where('l.minScore <= :score')
            ->orderBy('l.minScore', 'DESC')
            ->setParameter('score', $score)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$level) {
            return $this->json(['error' => 'Aucun niveau trouvé pour ce score'], Response::HTTP_NOT_FOUND);
        }

        $translation = $level->getTranslation($locale);

        return $this->json([
            'id' => $level->getId(),
            'minScore' => $level->getMinScore(),
            'image' => $level->getImage(),
            'name' => $translation ? $translation->getName() : 'Nom non disponible'
        ]);
    }
}
