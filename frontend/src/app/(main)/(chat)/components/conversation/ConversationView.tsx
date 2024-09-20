'use client';

import React, {useEffect, useState, useRef} from "react";
import ConversationContainer from "@/app/(chat)/components/conversation/ConversationContainer";
import {Loader2} from "lucide-react";
import Header from "@/app/(chat)/conversations/[conversationId]/components/header/Header";
import ChatInput from "@/app/(chat)/conversations/[conversationId]/components/Input/Input";
import {
    fetchMarkMessagesAsRead,
    fetchMessagesFromConversationId,
    fetchOneConversationById
} from "@/app/(chat)/conversations/actions";
import Body from "@/app/(chat)/conversations/[conversationId]/components/body/Body";
import {useAuthContext} from "@/context/authContext";

type Props = {
    conversationId: string;
    context?: "archive" | "active";
};

type Message = {
    content: string;
    sent_by: string;
    send_at: string;
    sender_email: string;
    isRead: boolean;
};

type Participant = {
    id: string;
    userName: string;
    imageUrl?: string;
    email: string;
};

type FormattedMessage = {
    _id: string;
    content: string[];
    senderName: string;
    senderId: string;
    createdAt: number;
    isCurrentUser: boolean;
    type: string;
};

const ConversationView = ({conversationId, context = "active"}: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isMarkedAsRead, setIsMarkedAsRead] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const {user} = useAuthContext();
    const userEmail = user?.email;
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await fetchMessagesFromConversationId(conversationId);
                const sortedMessages = data.reverse();
                setMessages(sortedMessages);
            } catch (error) {
                console.error("Erreur lors du chargement des messages", error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchParticipants = async () => {
            try {
                const participantsData = await fetchOneConversationById(conversationId);
                setParticipants(participantsData);
            } catch (error) {
                console.error("Erreur lors du chargement des participants", error);
            }
        };

        fetchMessages();
        fetchParticipants();
    }, [conversationId]);

    const getOtherParticipant = () => {
        return participants.find(participant => participant.email !== userEmail);
    };

    useEffect(() => {
        if (messages.length > 0 && !isMarkedAsRead) {
            const markMessagesAsRead = async () => {
                try {
                    const otherUserEmail = messages.find(msg => msg.sender_email !== userEmail)?.sender_email;

                    if (!otherUserEmail) {
                        console.error('Impossible de trouver l\'email de l\'autre utilisateur.');
                        return;
                    }

                    const response = await fetchMarkMessagesAsRead(conversationId, otherUserEmail);

                    if (response.ok) {
                        setMessages((prevMessages) =>
                            prevMessages.map((message) => ({
                                ...message,
                                isRead: true,
                            }))
                        );
                        setIsMarkedAsRead(true);
                    } else {
                        console.error('Erreur lors de la mise à jour des messages comme lus :', response);
                    }
                } catch (error) {
                    console.error("Erreur lors de la mise à jour des messages comme lus", error);
                }
            };

            markMessagesAsRead();
        }
    }, [messages, userEmail, isMarkedAsRead, conversationId]);

    const handleNewMessage = (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        );
    }

    const otherParticipant = getOtherParticipant();
    const otherParticipantName = otherParticipant ? otherParticipant.userName : "";

    const formattedMessages: FormattedMessage[] = messages.map((msg, index) => ({
        _id: `${index}`,
        content: [msg.content],
        senderName: msg.sent_by,
        senderId: msg.sent_by,
        createdAt: new Date(msg.send_at).getTime(),
        isCurrentUser: msg.sender_email === userEmail,
        type: "text",
    }));

    return (
        <div className="ml-80">
            <ConversationContainer>
                <Header name={otherParticipantName} imageUrl={otherParticipant?.imageUrl}/>
                <div ref={messageContainerRef} className="flex-1 w-full overflow-y-auto flex flex-col-reverse">
                    <Body
                        messages={formattedMessages}
                        conversationId={conversationId}
                        setMessages={(newMessages) => setMessages(newMessages as unknown as Message[])}
                    />
                </div>
                <ChatInput conversationId={conversationId} onNewMessage={handleNewMessage}/>
            </ConversationContainer>
        </div>
    );
};

export default ConversationView;