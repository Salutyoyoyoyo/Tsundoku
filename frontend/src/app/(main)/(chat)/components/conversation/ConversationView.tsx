'use client';

import React, {useEffect, useState, useRef, useCallback} from "react";
import ConversationContainer from "@/app/(main)/(chat)/components/conversation/ConversationContainer";
import {Loader2} from "lucide-react";
import Header from "@/app/(main)/(chat)/conversations/[conversationId]/components/header/Header";
import ChatInput from "@/app/(main)/(chat)/conversations/[conversationId]/components/Input/Input";
import {
    fetchMarkMessagesAsRead,
    fetchMessagesFromConversationId,
    fetchOneConversationById
} from "@/app/(main)/(chat)/conversations/actions";
import Body from "@/app/(main)/(chat)/conversations/[conversationId]/components/body/Body";
import {useAuthContext} from "@/context/authContext";
import {useSocket} from "@/context/socketContext";

type Props = {
    conversationId: string;
    context?: "archive" | "active";
};

type Message = {
    content: string;
    sent_by: string;
    sent_at: string;
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
    sent_at: string;
    isCurrentUser: boolean;
    type: string;
};

const ConversationView = ({conversationId, context = "active"}: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const {user} = useAuthContext();
    const socket = useSocket();
    const userEmail = user?.email;
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);

            try {
                const data = await fetchMessagesFromConversationId(conversationId);

                if (Array.isArray(data)) {
                    const sortedMessages = data.reverse();
                    setMessages(sortedMessages);
                } else {
                    setMessages([]);
                }

            } catch (error) {
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
                throw error;
            }
        };

        fetchMessages();
        fetchParticipants();
    }, [conversationId]);

    const getOtherParticipant = useCallback(() => {
        return participants.find(participant => participant.email !== userEmail);
    }, [participants, userEmail]);

    useEffect(() => {
        const markUnreadMessagesAsRead = async () => {

            const otherParticipant = getOtherParticipant();
            const otherUserEmail = otherParticipant?.email;

            if (!otherUserEmail) return;

            const unreadMessagesFromOtherUser = messages.filter(
                (message) => message.sender_email === otherUserEmail && !message.isRead
            );

            if (unreadMessagesFromOtherUser.length > 0) {

                const response = await fetchMarkMessagesAsRead(conversationId, otherUserEmail);
                if (response.response) {
                    setMessages((prevMessages) =>
                        prevMessages.map((message) =>
                            unreadMessagesFromOtherUser.includes(message)
                                ? {...message, isRead: true}
                                : message
                        )
                    );

                    if (socket) {
                        socket.emit('markAsRead', {
                            conversationId: conversationId,
                            userId: user?.userId
                        });
                    }

                } else {
                    console.error("Erreur lors de la mise à jour du message comme lu :", response);
                }
            }
        };

        markUnreadMessagesAsRead();
    }, [socket, messages, userEmail, conversationId, getOtherParticipant, user?.userId]);

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
        sent_at: msg.sent_at,
        isCurrentUser: msg.sender_email === userEmail,
        type: "text",
        isRead: msg.isRead,
    }));

    return (
        <div className="ml-80">
            <ConversationContainer>
                <Header name={otherParticipantName} imageUrl={otherParticipant?.imageUrl}/>
                <div ref={messageContainerRef} className="flex-1 w-full overflow-y-auto flex flex-col-reverse">
                    <Body
                        userEmail={userEmail}
                        messages={formattedMessages}
                        conversationId={conversationId}
                        setMessages={(newMessages) => setMessages(newMessages as unknown as Message[])}
                    />
                </div>
                <ChatInput conversationId={conversationId} />
            </ConversationContainer>
        </div>
    );
};

export default ConversationView;