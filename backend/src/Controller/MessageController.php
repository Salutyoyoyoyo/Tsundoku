<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Conversation;
use App\Services\ConfRedisService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api/message')]
class MessageController extends AbstractController
{
    private $confRedisService;
    private $entityManager;

    public function __construct(ConfRedisService $redisChatService, EntityManagerInterface $entityManager)
    {
        $this->confRedisService = $redisChatService;
        $this->entityManager = $entityManager;
    }

    #[Route('/send/{conversationId}', name: 'send_message', methods: ['POST'])]
    public function sendMessage(int $conversationId, Request $request): Response
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$conversationId || empty($data['message'])) {
                return new Response('Missing conversation ID or message content.', Response::HTTP_BAD_REQUEST);
            }

            $messageContent = $data['message'];

            $userEmail = $data['userEmail'] ?? null;
            $createdBy = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userEmail]);

            if (!$createdBy) {
                return new Response('User not found.', Response::HTTP_NOT_FOUND);
            }

            $conversation = $this->entityManager->getRepository(Conversation::class)->find($conversationId);

            if (!$conversation) {
                return new Response('Conversation not found.', Response::HTTP_NOT_FOUND);
            }

            $userName = $this->entityManager->getRepository(User::class)->findUsernameByUser($createdBy);

            if (!$userName) {
                return new Response('Username not found for the provided user.', Response::HTTP_NOT_FOUND);
            }

            if (!$conversation->getParticipants()->contains($createdBy)) {
                return new JsonResponse('User is not a participant in this conversation.', Response::HTTP_FORBIDDEN);
            }

            $messageData = [
                'content' => $messageContent,
                'sent_by' => $userName,
                'send_at' => (new \DateTime('now', new \DateTimeZone('UTC')))->format('Y-m-d H:i:s')
            ];

            $this->confRedisService->addMessageToConversation($conversationId, $messageData);

            return new Response('Message sent to conversation.', Response::HTTP_OK);
        } catch (\Exception $e) {
            return new Response('An error occurred: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/get/{conversationId}', name: 'get_messages', methods: ['GET'])]
    public function getMessages(int $conversationId, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conversation = $this->entityManager->getRepository(Conversation::class)->find($conversationId);

            //test postman
            $userEmail = $data['userEmail'] ?? null;
            $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userEmail]);

            //test front
            //$userEmail = $request->headers->get('userEmail');
            //$user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userEmail]);

            if (!$userEmail) {
                return new JsonResponse('User email not provided.', Response::HTTP_BAD_REQUEST);
            }

            if (!$conversation) {
                return new JsonResponse('Conversation not found.', Response::HTTP_NOT_FOUND);
            }

            if (!$conversation->getParticipants()->contains($user)) {
                return new JsonResponse('User is not a participant in this conversation.', Response::HTTP_FORBIDDEN);
            }
            $messages = $this->confRedisService->getMessagesFromConversation($conversationId);

            return $this->json($messages, Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse('An error occurred: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/get-last-messages/{userId}', name: 'get_last_messages', methods: ['GET'])]
    public function getLastMessages(int $userId): JsonResponse
    {
        try {
            $user = $this->entityManager->getRepository(User::class)->find($userId);

            if (!$user) {
                return new JsonResponse('User not found', Response::HTTP_NOT_FOUND);
            }

            $conversations = $this->entityManager->getRepository(Conversation::class)->createQueryBuilder('c')
                ->innerJoin('c.participants', 'p')
                ->where('p.id = :userId')
                ->setParameter('userId', $userId)
                ->getQuery()
                ->getResult();

            $lastMessages = [];
            foreach ($conversations as $conversation) {
                $conversationId = $conversation->getId();
                $messages = $this->confRedisService->getMessagesFromConversation($conversationId);
                $lastMessage = end($messages);
                $lastMessages[] = [
                    'conversationId' => $conversationId,
                    'lastMessage' => $lastMessage,
                ];
            }

            return new JsonResponse($lastMessages);
        } catch (\Exception $e) {
            return new JsonResponse('An error occurred: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
