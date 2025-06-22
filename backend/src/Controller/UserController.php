<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/users')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('', name: 'user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $levelRepository = $this->entityManager->getRepository(\App\Entity\Level::class);

        $userData = array_map(function ($user) use ($levelRepository) {
            $userScore = $user->getScore() ?? 0;

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

            return [
                'id' => $user->getId(),
                'pseudo' => $user->getPseudo(),
                'email' => $user->getEmail(),
                'role' => $user->getRoles(),
                'score' => $user->getScore(),
                'level' => $levels,
                'money' => $user->getMoney(),
                'profilePicture' => $user->getProfilePicture(),
                'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s')
            ];
        }, $users);

        return new JsonResponse($userData);
    }

    #[Route('/{id}', name: 'user_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(User $user): JsonResponse
    {
        return new JsonResponse([
            'id' => $user->getId(),
            'pseudo' => $user->getPseudo(),
            'email' => $user->getEmail(),
            'score' => $user->getScore(),
            'money' => $user->getMoney(),
            'profilePicture' => $user->getProfilePicture(),
            'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
            'lastLoginAt' => $user->getLastLoginAt()?->format('Y-m-d H:i:s')
        ]);
    }

    #[Route('/profile', name: 'user_update_profile', methods: ['PUT'])]
    public function updateProfile(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Mise à jour des champs autorisés
            if (isset($data['pseudo'])) {
                $user->setPseudo($data['pseudo']);
            }

            if (isset($data['email'])) {
                // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
                $existingUser = $this->entityManager->getRepository(User::class)
                    ->findOneBy(['email' => $data['email']]);

                if ($existingUser && $existingUser->getId() !== $user->getId()) {
                    return new JsonResponse([
                        'error' => 'Cet email est déjà utilisé'
                    ], Response::HTTP_CONFLICT);
                }

                $user->setEmail($data['email']);
            }

            if (isset($data['profilePicture'])) {
                $user->setProfilePicture($data['profilePicture']);
            }

            // Validation
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

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Profil mis à jour avec succès',
                'user' => [
                    'id' => $user->getId(),
                    'pseudo' => $user->getPseudo(),
                    'email' => $user->getEmail(),
                    'score' => $user->getScore(),
                    'money' => $user->getMoney(),
                    'profilePicture' => $user->getProfilePicture()
                ]
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Une erreur est survenue lors de la mise à jour'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/change-password', name: 'user_change_password', methods: ['PUT'])]
    public function changePassword(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (empty($data['currentPassword']) || empty($data['newPassword'])) {
                return new JsonResponse([
                    'error' => 'Mot de passe actuel et nouveau mot de passe requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Vérifier le mot de passe actuel
            if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
                return new JsonResponse([
                    'error' => 'Mot de passe actuel incorrect'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Validation du nouveau mot de passe
            if (strlen($data['newPassword']) < 8) {
                return new JsonResponse([
                    'error' => 'Le nouveau mot de passe doit contenir au moins 8 caractères'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Hasher et sauvegarder le nouveau mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['newPassword']);
            $user->setPassword($hashedPassword);

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Mot de passe modifié avec succès'
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Une erreur est survenue lors du changement de mot de passe'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'user_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(User $user): JsonResponse
    {
        try {
            $this->entityManager->remove($user);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Utilisateur supprimé avec succès'
            ], Response::HTTP_NO_CONTENT);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Une erreur est survenue lors de la suppression'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/add-score', name: 'user_add_score', methods: ['POST'])]
    public function addScore(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Validation des données
            if (!isset($data['score']) || !is_numeric($data['score']) || $data['score'] < 0) {
                return new JsonResponse([
                    'error' => 'Score invalide'
                ], Response::HTTP_BAD_REQUEST);
            }

            $scoreToAdd = (int) $data['score'];

            // Ajouter le score au score total de l'utilisateur
            $currentScore = $user->getScore();
            $user->setScore($currentScore + $scoreToAdd);

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Score ajouté avec succès',
                'scoreAdded' => $scoreToAdd,
                'totalScore' => $user->getScore()
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Une erreur est survenue lors de la sauvegarde du score'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
