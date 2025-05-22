<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api', name: 'api_')]
class ApiController extends AbstractController
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    #[Route('/ping', name: 'ping', methods: ['GET'])]
    public function ping(): JsonResponse
    {
        return $this->json([
            'message' => 'API is working!',
            'timestamp' => new \DateTime(),
        ]);
    }

    #[Route('/test', name: 'test')]
    public function test() {
        $user = new User();
        $user->setEmail('email');
        $user->setPassword('password');
        $user->setPseudo('peusdo');

        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return new Response();
    }
}
