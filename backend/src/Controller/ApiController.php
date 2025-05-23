<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\User;
use App\Entity\Card;
use App\Entity\Level;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api', name: 'api_')]
class ApiController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    // Route de test de connexion
    #[Route('/ping', name: 'ping', methods: ['GET'])]
    public function ping(): JsonResponse
    {
        return $this->json([
            'message' => 'Connexion réussi',
            'timestamp' => new \DateTime(),
        ]);
    }

    /**
     * Route qui récupère tous les utilisateurs
     * @return JsonResponse
     */
    #[Route('/users', name: 'get_users', methods: ['GET'])]
    public function getUsers(): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)->findAll();

        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'pseudo' => $user->getPseudo(),
            ];
        }

        return $this->json($data);
    }

    /**
     * Route qui récupère un utilisateur par son ID
     * @param int $id
     * @return JsonResponse
     */
    #[Route('/users/{id}', name: 'get_user', methods: ['GET'])]
    public function getUserById(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
        ];

        return $this->json($data);
    }

    /**
     * Route qui récupère toutes les cartes
     * @return JsonResponse
     */
    #[Route('/cards', name: 'get_cards', methods: ['GET'])]
    public function getCards(): JsonResponse
    {
        $cards = $this->entityManager->getRepository(Card::class)->findAll();

        $data = [];
        foreach ($cards as $card) {
            $data[] = [
                'id' => $card->getId(),
                'title' => $card->getTitle(),
                'image' => $card->getImage(),
                'year' => $card->getYear(),
                'description' => $card->getDescription(),
                'score' => $card->getScore(),
                'hint' => $card->getHint(),
            ];
        }

        return $this->json($data);
    }

    /**
     * Route qui récupère une carte par son ID
     * @param int $id
     * @return JsonResponse
     */
    #[Route('/cards/{id}', name: 'get_card', methods: ['GET'])]
    public function getCardById(int $id): JsonResponse
    {
        $card = $this->entityManager->getRepository(Card::class)->find($id);

        if (!$card) {
            return $this->json(['error' => 'Card not found'], 404);
        }

        $data = [
            'id' => $card->getId(),
            'title' => $card->getTitle(),
            'image' => $card->getImage(),
            'year' => $card->getYear(),
            'description' => $card->getDescription(),
            'score' => $card->getScore(),
            'hint' => $card->getHint(),
        ];

        return $this->json($data);
    }

    /**
     * Route qui récupère tous les niveaux
     * @return JsonResponse
     */
    #[Route('/levels', name: 'get_levels', methods: ['GET'])]
    public function getLevels(): JsonResponse
    {
        $levels = $this->entityManager->getRepository(Level::class)->findAll();

        $data = [];
        foreach ($levels as $level) {
            $data[] = [
                'id' => $level->getId(),
                'name' => $level->getName(),
                'image' => $level->getImage(),
                'minScore' => $level->getMinScore(),
            ];
        }

        return $this->json($data);
    }

    /**
     * Route qui récupère un niveau par son ID
     * @param int $id
     * @return JsonResponse
     */
    #[Route('/levels/{id}', name: 'get_level', methods: ['GET'])]
    public function getLevelById(int $id): JsonResponse
    {
        $level = $this->entityManager->getRepository(Level::class)->find($id);

        if (!$level) {
            return $this->json(['error' => 'Level not found'], 404);
        }

        $data = [
            'id' => $level->getId(),
            'name' => $level->getName(),
            'image' => $level->getImage(),
            'minScore' => $level->getMinScore(),
        ];

        return $this->json($data);
    }
}
