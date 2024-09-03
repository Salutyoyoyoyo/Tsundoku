<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserProviderInterface $userProvider, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];
        $password = $data['password'];

        $user = $userProvider->loadUserByUsername($email);

        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid credentials'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $token = $jwtManager->create($user);

        return new JsonResponse([
            'token' => $token,
            'isVerified' => $user->isVerified(),
        ]);
    }
}