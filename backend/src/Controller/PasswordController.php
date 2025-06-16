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
use App\Repository\UserRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class PasswordController extends AbstractController
{
    #[Route('/forgot-password', methods: ['POST'])]
    public function forgotPassword(Request $request, UserRepository $repo, MailerInterface $mailer, EntityManagerInterface $em)
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data || !isset($data['email'])) {
                return new JsonResponse(['error' => 'Email requis'], Response::HTTP_BAD_REQUEST);
            }

            $userEmail = $data['email'];
            $user = $repo->findOneBy(['email' => $userEmail]);

            if ($user) {
                $token = bin2hex(random_bytes(32));
                $user->setResetToken($token);
                $user->setResetTokenExpiresAt(new \DateTimeImmutable('+1 hour'));
                $em->flush();

                error_log("Token sauvegardé avec succès: " . $token);

                try {
                    $link = $this->generateUrl('reset_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);
                    error_log("URL générée: " . $link);
                } catch (\Exception $e) {
                    error_log("Erreur génération URL: " . $e->getMessage());
                    throw $e;
                }

                try {
                    $emailMessage = (new TemplatedEmail())
                        ->from('noreply@pixeltime.com')
                        ->to($user->getEmail())
                        ->subject('Réinitialisation de mot de passe')
                        ->htmlTemplate('emails/reset_password.html.twig')
                        ->context(['resetLink' => $link]);

                    error_log("Email préparé pour: " . $user->getEmail());

                    $mailer->send($emailMessage);
                    error_log("Email envoyé avec succès");

                } catch (\Exception $e) {
                    error_log("Erreur envoi email: " . $e->getMessage());
                    error_log("Type d'erreur: " . get_class($e));
                    throw $e;
                }
            }
        } catch (\Exception $error) {
            error_log('Erreur complète: ' . $error->getMessage());
            error_log('Fichier: ' . $error->getFile() . ' ligne: ' . $error->getLine());
            error_log('Stack trace: ' . $error->getTraceAsString());
            return new JsonResponse(['error' => 'Erreur interne du serveur'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['message' => 'Si un compte existe, un email a été envoyé.']);
    }

    // Route GET pour afficher le formulaire (quand l'utilisateur clique sur le lien)
    #[Route('/reset-password/{token}', name: 'reset_password', methods: ['GET'])]
    public function showResetPasswordForm(string $token, UserRepository $repo)
    {
        $user = $repo->findOneBy(['resetToken' => $token]);

        if (!$user || $user->getResetTokenExpiresAt() < new \DateTimeImmutable()) {
            return new JsonResponse(['error' => 'Token invalide ou expiré'], 400);
        }

        return $this->redirect('http://localhost:5173/newpassword?token=' . $token);
    }

    // Route POST pour traiter la réinitialisation
    #[Route('/reset-password/{token}', name: 'reset_password_process', methods: ['POST'])]
    public function resetPassword(Request $request, string $token, UserRepository $repo, UserPasswordHasherInterface $hasher, EntityManagerInterface $em)
    {
        $user = $repo->findOneBy(['resetToken' => $token]);

        if (!$user || $user->getResetTokenExpiresAt() < new \DateTimeImmutable()) {
            return new JsonResponse(['error' => 'Token invalide ou expiré'], 400);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Mot de passe requis'], Response::HTTP_BAD_REQUEST);
        }

        $plainPassword = $data['password'];

        $user->setPassword($hasher->hashPassword($user, $plainPassword));
        $user->setResetToken(null);
        $user->setResetTokenExpiresAt(null);
        $em->flush();

        return new JsonResponse(['message' => 'Mot de passe réinitialisé avec succès']);
    }

}
