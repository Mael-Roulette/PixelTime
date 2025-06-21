<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api', name: 'api_')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private JWTTokenManagerInterface $jwtManager
    ) {
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            if (empty($data['email']) || empty($data['password']) || empty($data['pseudo'])) {
                return new JsonResponse([
                    'error' => 'Email, mot de passe et pseudo sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            if (strlen($data['password']) < 8) {
                return new JsonResponse([
                    'error' => 'Le mot de passe doit contenir au moins 8 caractères'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Vérifier si l'email existe déjà
            $existingUser = $this->entityManager->getRepository(User::class)
                ->findOneBy(['email' => $data['email']]);

            if ($existingUser) {
                return new JsonResponse([
                    'error' => 'Cet email est déjà utilisé'
                ], Response::HTTP_CONFLICT);
            }

            // Créer le nouvel utilisateur
            $user = new User();
            $user->setPseudo($data['pseudo']);
            $user->setEmail($data['email']);
            $user->setScore(0);
            $user->setMoney(0);

            // Hasher le mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return new JsonResponse([
                    'errors' => $errorMessages
                ], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Générer un token JWT pour l'utilisateur créé
            $token = $this->jwtManager->create($user);

            return new JsonResponse([
                'message' => 'Utilisateur créé avec succès',
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'pseudo' => $user->getPseudo(),
                    'score' => $user->getScore(),
                    'money' => $user->getMoney()
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Une erreur est survenue lors de l\'inscription'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/login', name: 'manual_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Validater des données
            if (empty($data['email']) || empty($data['password'])) {
                return new JsonResponse([
                    'error' => 'Email et mot de passe requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Trouver l'utilisateur
            $user = $this->entityManager->getRepository(User::class)
                ->findOneBy(['email' => $data['email']]);

            if (!$user || !$this->passwordHasher->isPasswordValid($user, $data['password'])) {
                return new JsonResponse([
                    'error' => 'Identifiants invalides'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Mettre à jour la dernière connexion
            $user->setLastLoginAt(new \DateTimeImmutable());
            $this->entityManager->flush();

            // Générer le token JWT
            $token = $this->jwtManager->create($user);

            return new JsonResponse([
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'pseudo' => $user->getPseudo(),
                    'score' => $user->getScore(),
                    'money' => $user->getMoney(),
                    'roles' => $user->getRoles()
                ]
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Une erreur est survenue lors de la connexion'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/user', name: 'current_user', methods: ['GET'])]
    public function getCurrentUser(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse([
                'error' => 'Utilisateur non authentifié'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $userScore = $user->getScore() ?? 0;
        $levelRepository = $this->entityManager->getRepository(\App\Entity\Level::class);

        $availableLevels = $levelRepository->createQueryBuilder('l')
            ->leftJoin('l.translations', 't')
            ->addSelect('t')
            ->where('l.minScore <= :score')
            ->orderBy('l.minScore', 'ASC')
            ->setParameter('score', $userScore)
            ->getQuery()
            ->getResult();

        $levels = [];
        foreach ($availableLevels as $level) {
            $translation = $level->getTranslation('fr');
            $levels[] = [
                'id' => $level->getId(),
                'minScore' => $level->getMinScore(),
                'image' => $level->getImage(),
                'name' => $translation ? $translation->getName() : "Niveau {$level->getId()}"
            ];
        }
        return new JsonResponse([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'pseudo' => $user->getPseudo(),
                'score' => $user->getScore(),
                'level' => $levels,
                'money' => $user->getMoney(),
                'profilePicture' => $user->getProfilePicture(),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
                'lastLoginAt' => $user->getLastLoginAt()?->format('Y-m-d H:i:s')
            ]
        ]);
    }

    #[Route('/user/role', name: 'get_role', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getRole(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse([
                'error' => 'Utilisateur non authentifié'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $roles = $user->getRoles();
        $isAdmin = in_array('ROLE_ADMIN', $roles);

        return new JsonResponse([
            'roles' => $roles,
            'isAdmin' => $isAdmin,
            'role' => $isAdmin ? 'admin' : 'user'
        ]);
    }

    #[Route('/refresh-token', name: 'refresh_token', methods: ['POST'])]
    public function refreshToken(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse([
                'error' => 'Token invalide'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Générer un nouveau token
        $token = $this->jwtManager->create($user);

        return new JsonResponse([
            'token' => $token
        ]);
    }
}
