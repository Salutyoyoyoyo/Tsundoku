<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\User;
use App\Repository\ConversationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/conversation')]
class ConversationController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ConversationRepository $conversationRepository;
    private UserRepository $userRepository;

    public function __construct(EntityManagerInterface $entityManager, ConversationRepository $conversationRepository, UserRepository $userRepository)
    {
        $this->entityManager = $entityManager;
        $this->conversationRepository = $conversationRepository;
        $this->userRepository = $userRepository;
    }

    #[Route('/create', name: 'create_conversation', methods: 'POST')]
    public function createConversation(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'], $data['participants'])) {
            return new Response('Invalid input', Response::HTTP_BAD_REQUEST);
        }

        $userEmail = $data['email'] ?? null;
        $createdBy = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userEmail]);

        if (!$createdBy) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }

        $title = $data['title'];
        $participantsIds = $data['participants'];

        if (!in_array($createdBy->getId(), $participantsIds)) {
            $participantsIds[] = $createdBy->getId();
        }

        $participants = [];
        foreach ($participantsIds as $participantId) {
            $participant = $this->entityManager->getRepository(User::class)->find($participantId);
            if ($participant) {
                $participants[] = $participant;
            }
        }

        $conversation = new Conversation();
        $conversation->setTitle($title);
        $conversation->setCreatedBy($createdBy);
        $conversation->setCreatedAt(new \DateTime());

        foreach ($participants as $participant) {
            $conversation->addParticipant($participant);
        }

        $isGroup = count($participants) > 2;
        $conversation->setIsGroup($isGroup);

        $this->entityManager->persist($conversation);
        $this->entityManager->flush();

        return new Response('Conversation created', Response::HTTP_CREATED);
    }

    #[Route('/get/{id}', name: 'get_conversation', methods: ['GET'])]
    public function getConversationById(int $id): JsonResponse
    {
        $conversation = $this->entityManager->getRepository(Conversation::class)->find($id);

        if (!$conversation) {
            return new JsonResponse('Conversation not found', Response::HTTP_NOT_FOUND);
        }

        $conversationData = [
            'id' => $conversation->getId(),
            'title' => $conversation->getTitle(),
            'createdAt' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
            'createdBy' => [
                'id' => $conversation->getCreatedBy()->getId(),
                'email' => $conversation->getCreatedBy()->getEmail(),
                'userName' => $this->userRepository->findUsernameByUser($conversation->getCreatedBy()),
            ],
            'participants' => array_map(function ($participant) {
                return [
                    'id' => $participant->getId(),
                    'email' => $participant->getEmail(),
                    'userName' => $this->userRepository->findUsernameByUser($participant)
                ];
            }, $conversation->getParticipants()->toArray())
        ];

        return new JsonResponse($conversationData);
    }

    #[Route('/get-user/{id}', name: 'get_user_conversations', methods: ['GET'])]
    public function getUserConversations(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse('User not found', Response::HTTP_NOT_FOUND);
        }

        $conversations = $this->entityManager->getRepository(Conversation::class)->findByUser($user);

        $conversationsData = array_map(function ($conversation) {
            return [
                'id' => $conversation->getId(),
                'title' => $conversation->getTitle(),
                'createdAt' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
                'createdBy' => [
                    'id' => $conversation->getCreatedBy()->getId(),
                    'email' => $conversation->getCreatedBy()->getEmail(),
                    'userName' => $this->userRepository->findUsernameByUser($conversation->getCreatedBy())
                ],
                'participants' => array_map(function ($participant) {
                    return [
                        'id' => $participant->getId(),
                        'email' => $participant->getEmail(),
                        'userName' => $this->userRepository->findUsernameByUser($participant)
                    ];
                }, $conversation->getParticipants()->toArray())
            ];
        }, $conversations);

        return new JsonResponse($conversationsData);
    }

    #[Route('/add-participants/{id}', name: 'add_participants', methods: ['POST'])]
    public function addParticipantsById(int $id, Request $request): Response
    {
        $conversation = $this->entityManager->getRepository(Conversation::class)->find($id);

        if (!$conversation) {
            return new Response('Conversation not found', Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['participant_ids']) || !is_array($data['participant_ids'])) {
            return new Response('Participant IDs not provided or invalid format', Response::HTTP_BAD_REQUEST);
        }

        $participantsAdded = [];
        $participantsAlreadyInConversation = [];
        foreach ($data['participant_ids'] as $participantId) {
            $participant = $this->entityManager->getRepository(User::class)->find($participantId);
            if (!$participant) {
                return new Response("User with ID {$participantId} not found", Response::HTTP_BAD_REQUEST);
            }
            if ($conversation->getParticipants()->contains($participant)) {
                $participantsAlreadyInConversation[] = $participant;
            } else {
                $conversation->addParticipant($participant);
                $participantsAdded[] = $participant;
            }
        }

        $this->entityManager->persist($conversation);
        $this->entityManager->flush();

        $responseMessage = '';
        if (!empty($participantsAlreadyInConversation)) {
            $participantsIds = array_map(function ($participant) {
                return $participant->getId();
            }, $participantsAlreadyInConversation);
            $responseMessage .= 'Participants already in conversation: ' . implode(', ', $participantsIds) . '. ';
        }
        if (!empty($participantsAdded)) {
            $participantsIds = array_map(function ($participant) {
                return $participant->getId();
            }, $participantsAdded);
            $responseMessage .= 'Participants added to conversation: ' . implode(', ', $participantsIds);
        }

        return new Response($responseMessage, Response::HTTP_OK);
    }

    #[Route('/update-participant/{id}', name: 'update_participant', methods: ['PUT'])]
    public function updateParticipantById(int $id, Request $request): Response
    {
        $conversation = $this->entityManager->getRepository(Conversation::class)->find($id);

        if (!$conversation) {
            return new Response('Conversation not found', Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['participants']) && is_array($data['participants'])) {
            $existingParticipants = $conversation->getParticipants()->toArray();
            $participantIds = array_map(function ($participant) {
                return $participant->getId();
            }, $existingParticipants);

            foreach ($data['participants'] as $participantId) {
                if (!in_array($participantId, $participantIds)) {
                    $participant = $this->entityManager->getRepository(User::class)->find($participantId);
                    if (!$participant) {
                        return new Response("User with ID {$participantId} not found", Response::HTTP_BAD_REQUEST);
                    }
                    $conversation->addParticipant($participant);
                }
            }

            foreach ($existingParticipants as $participant) {
                if (!in_array($participant->getId(), $data['participants'])) {
                    $conversation->removeParticipant($participant);
                }
            }
        }
        $conversation->setUpdatedAt(new \DateTime());

        $this->entityManager->flush();

        return new JsonResponse(['success' => 'Conversation updated successfully']);
    }

    #[Route('/remove-participants/{id}', name: 'remove_participants', methods: ['DELETE'])]
    public function removeParticipantsById(int $id, Request $request): Response
    {
        $conversation = $this->entityManager->getRepository(Conversation::class)->find($id);

        if (!$conversation) {
            return new Response('Conversation not found', Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['participant_ids']) || !is_array($data['participant_ids'])) {
            return new Response('Participant IDs not provided or invalid format', Response::HTTP_BAD_REQUEST);
        }

        $participantsRemoved = [];
        $participantsNotInConversation = [];
        foreach ($data['participant_ids'] as $participantId) {
            $participant = $this->entityManager->getRepository(User::class)->find($participantId);
            if (!$participant) {
                return new Response("User with ID {$participantId} not found", Response::HTTP_BAD_REQUEST);
            }
            if (!$conversation->getParticipants()->contains($participant)) {
                $participantsNotInConversation[] = $participant;
            } else {
                $conversation->removeParticipant($participant);
                $participantsRemoved[] = $participant;
            }
        }

        $this->entityManager->persist($conversation);
        $this->entityManager->flush();

        $responseMessage = '';
        if (!empty($participantsNotInConversation)) {
            $participantsIds = array_map(function ($participant) {
                return $participant->getId();
            }, $participantsNotInConversation);
            $responseMessage .= 'Participants not in conversation: ' . implode(', ', $participantsIds) . '. ';
        }
        if (!empty($participantsRemoved)) {
            $participantsIds = array_map(function ($participant) {
                return $participant->getId();
            }, $participantsRemoved);
            $responseMessage .= 'Participants removed from conversation: ' . implode(', ', $participantsIds);
        }

        return new Response($responseMessage, Response::HTTP_OK);
    }


    #[Route('/delete/{id}', name: 'delete_conversation', methods: ['DELETE'])]
    public function deleteConversationById(int $id): Response
    {
        $conversation = $this->entityManager->getRepository(Conversation::class)->find($id);

        if (!$conversation) {
            return new Response('Conversation not found', Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($conversation);
        $this->entityManager->flush();

        return new Response('Conversation deleted', Response::HTTP_OK);
    }
}
