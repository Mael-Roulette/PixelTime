<?php

namespace App\Controller;

use App\Entity\Card;
use App\Entity\CardTranslation;
use App\Repository\CardRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/cards')]
class CardController extends AbstractController
{
    #[Route('', name: 'card_index', methods: ['GET'])]
    public function index(CardRepository $cardRepository, Request $request): JsonResponse
    {
        $locale = $request->query->get('lang', 'fr');
        $cards = $cardRepository->findAll();

        $result = [];
        foreach ($cards as $card) {
            $translation = $card->getTranslation($locale);

            $result[] = [
                'id' => $card->getId(),
                'year' => $card->getYear(),
                'image' => $card->getImage(),
                'title' => $card->getTitle(),
                'description' => $translation ? $translation->getDescription() : '',
                'hint' => $translation ? $translation->getHint() : ''
            ];
        }

        return $this->json($result);
    }

    #[Route('/{id}', name: 'card_show', methods: ['GET'])]
    public function show(Card $card, Request $request): JsonResponse
    {
        $locale = $request->query->get('lang', 'fr');

        $translation = $card->getTranslation($locale);

        if (!$translation) {
            return $this->json(['error' => 'Traduction non trouvée'], 404);
        }

        return $this->json([
            'id' => $card->getId(),
            'year' => $card->getYear(),
            'image' => $card->getImage(),
            'title' => $card->getTitle(),
            'description' => $translation->getDescription(),
            'hint' => $translation->getHint()
        ]);
    }

    #[Route('', name: 'card_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
            }

            if (!isset($data['year']) || !isset($data['image']) || !isset($data['translations'])) {
                return $this->json(['error' => 'Champs requis manquants'], Response::HTTP_BAD_REQUEST);
            }

            $card = new Card();
            $card->setYear($data['year']);
            $card->setImage($data['image']);
            $card->setTitle($data['title']);

            foreach ($data['translations'] as $translationData) {
                if (!isset($translationData['locale']) || !isset($translationData['title'])) {
                    return $this->json(['error' => 'Données de traduction invalides'], Response::HTTP_BAD_REQUEST);
                }

                $translation = new CardTranslation();
                $translation->setLocale($translationData['locale']);
                $translation->setDescription($translationData['description'] ?? '');
                $translation->setHint($translationData['hint'] ?? '');
                $translation->setCard($card);

                $entityManager->persist($translation);
            }

            $entityManager->persist($card);
            $entityManager->flush();

            return $this->json([
                'id' => $card->getId(),
                'message' => 'Carte créée avec succès'
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur lors de la création: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'card_update', methods: ['PUT'])]
    public function update(Request $request, Card $card, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
            }

            if (isset($data['year'])) {
                $card->setYear($data['year']);
            }

            if (isset($data['image'])) {
                $card->setImage($data['image']);
            }

            if (isset($data['title'])) {
                $card->setTitle($data['title']);
            }

            if (isset($data['translations'])) {
                foreach ($data['translations'] as $translationData) {
                    if (!isset($translationData['locale'])) {
                        continue;
                    }

                    $translation = $card->getTranslation($translationData['locale']);
                    if (!$translation) {
                        $translation = new CardTranslation();
                        $translation->setLocale($translationData['locale']);
                        $translation->setCard($card);
                        $entityManager->persist($translation);
                    }

                    if (isset($translationData['description'])) {
                        $translation->setDescription($translationData['description']);
                    }
                    
                    if (isset($translationData['hint'])) {
                        $translation->setHint($translationData['hint']);
                    }
                }
            }

            $entityManager->flush();

            return $this->json(['message' => 'Carte mise à jour avec succès'], Response::HTTP_OK);

        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'card_delete', methods: ['DELETE'])]
    public function delete(Card $card, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($card);
        $entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
