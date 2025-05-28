<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/users')]
class UserController extends AbstractController
{
    #[Route('', name: 'user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        return $this->json($users);
    }

    #[Route('/{id}', name: 'user_show', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json($user);
    }

    #[Route('', name: 'user_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entity_manager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();
        $user->setPseudo($data['pseudo']);
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);
        $user->setScore(0);
        $user->setMoney(0);

        $entity_manager->persist($user);
        $entity_manager->flush();

        return $this->json($user, 201);
    }

    #[Route('/{id}', name: 'user_update', methods: ['PUT'])]
    public function update(Request $request, User $user, EntityManagerInterface $entity_manager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user->setPseudo($data['pseudo'] ?? $user->getPseudo());
        $user->setEmail($data['email'] ?? $user->getEmail());
        $user->setPassword($data['password'] ?? $user->getPassword());

        $entity_manager->flush();

        return $this->json($user, 200);
    }

    #[Route('/{id}', name: 'user_delete', methods: ['DELETE'])]
    public function delete(User $user, EntityManagerInterface $entity_manager): JsonResponse
    {
        $entity_manager->remove($user);
        $entity_manager->flush();

        return $this->json(null, 204);
    }
}
