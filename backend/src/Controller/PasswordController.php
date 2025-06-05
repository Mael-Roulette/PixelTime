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
        $email = $request->get('email');
        $user = $repo->findOneBy(['email' => $email]);

        if ($user) {
            $token = bin2hex(random_bytes(32));
            $user->setResetToken($token);
            $user->setResetTokenExpiresAt(new \DateTime('+1 hour'));
            $em->flush();

            $link = $this->generateUrl('reset_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);

            $email = (new TemplatedEmail())
                ->to($user->getEmail())
                ->subject('Réinitialisation de mot de passe')
                ->htmlTemplate('emails/reset_password.html.twig')
                ->context(['resetLink' => $link]);

            $mailer->send($email);
        }

        return new JsonResponse(['message' => 'Si un compte existe, un email a été envoyé.']);
    }

    #[Route('/reset-password/{token}', methods: ['POST'])]
    public function resetPassword(Request $request, string $token, UserRepository $repo, UserPasswordHasherInterface $hasher, EntityManagerInterface $em)
    {
        $user = $repo->findOneBy(['resetToken' => $token]);

        if (!$user || $user->getResetTokenExpiresAt() < new \DateTime()) {
            return new JsonResponse(['error' => 'Token invalide ou expiré'], 400);
        }

        $data = json_decode($request->getContent(), true);
        $plainPassword = $data['password'];

        $user->setPassword($hasher->hashPassword($user, $plainPassword));
        $user->setResetToken(null);
        $user->setResetTokenExpiresAt(null);
        $em->flush();

        return new JsonResponse(['message' => 'Mot de passe réinitialisé avec succès']);
    }

}
