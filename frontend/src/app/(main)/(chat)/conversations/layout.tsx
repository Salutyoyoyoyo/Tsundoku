'use client';

import React, {useEffect, useState} from "react";
import ItemList from "@/app/(main)/(chat)/components/item/ItemList";
import {Loader2} from "lucide-react";
import DMConversationItem from "@/app/(main)/(chat)/conversations/components/DMConversationItem";
import {useAuthContext} from "@/context/authContext";
import {fetchUserConversations, getLastMessageFromUser} from "@/app/(main)/(chat)/conversations/actions";
import StartNewConversation from "@/app/(main)/(chat)/conversations/components/StartNewConversation";
import SearchBar from '@/app/(main)/(chat)/components/item/ItemSearchBar';
import {useSocket} from "@/context/socketContext";

type Conversation = {
    id: string;
    isGroup: boolean;
    lastMessage?: {
        content: string;
        sender: {
            id: string;
            userName: string;
        };
    };
    participants: Array<{
        id: string;
        userName: string;
        imageUrl?: string;
    }>;
    isArchived: boolean;
    isMutedUntil: {
        date: string;
        timezone: string;
        timezone_type: number;
    } | null;
};

const ConversationLayout = ({ children }: { children: React.ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
    const [lastMessages, setLastMessages] = useState<{
        [key: string]: {
            senderEmail: string;
            content: string;
            senderName: string;
            sentAt: string;
            isRead: boolean;
        }
    }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuthContext();
    const socket = useSocket();
    const userId = user?.userId;

    useEffect(() => {
        const fetchConversationsData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const data = await fetchUserConversations(userId);

                setConversations(data);
                setFilteredConversations(data);

                const updatedLastMessages: {
                    [key: string]: {
                        content: string;
                        senderName: string,
                        senderEmail: string,
                        sentAt: string,
                        isRead: boolean
                    }
                } = {};
                await Promise.all(
                    data.map(async (conversation) => {
                        const lastMessageData = await getLastMessageFromUser(conversation.id);
                        if (lastMessageData && lastMessageData.data?.lastMessage) {
                            updatedLastMessages[conversation.id] = {
                                content: lastMessageData.data?.lastMessage.content,
                                senderName: lastMessageData.data?.lastMessage.sent_by,
                                senderEmail: lastMessageData.data?.lastMessage.sender_email,
                                sentAt: lastMessageData.data?.lastMessage.send_at,
                                isRead: lastMessageData.data?.lastMessage.isRead,
                            };
                        }
                    })
                );

                setLastMessages(updatedLastMessages);
                if (socket) {
                    data.forEach((conversation) => {
                        socket.emit('joinRoom', conversation.id);
                        console.log(`Utilisateur rejoint la room ${conversation.id}`);
                    });
                }
            } catch (error) {
                console.error("Erreur lors du chargement des conversations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversationsData();
    }, [userId]);

    const getOtherMember = (conversation: Conversation) => {
        if (Array.isArray(conversation.participants)) {
            return conversation.participants.find(participant => participant.id !== userId);
        }
        return undefined;
    };

    const getLastMessageSenderName = (conversationId: string): string => {
        return lastMessages[conversationId]?.senderEmail === user.email ? "Vous : " : lastMessages[conversationId]?.senderEmail || "Utilisateur inconnu";
    };

    const handleSearch = (searchTerm: string) => {
        if (searchTerm) {
            const filtered = conversations.filter(conversation => {
                const otherMember = getOtherMember(conversation);
                const lastMessageContent = lastMessages[conversation.id]?.content || "";
                return (
                    otherMember?.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lastMessageContent.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredConversations(filtered);
        } else {
            setFilteredConversations(conversations);
        }
    };

    return (
        <div className="mt-16">
            <ItemList title="Conversations" action={<StartNewConversation />}>
                <SearchBar placeholder="Rechercher une conversation..." onSearch={handleSearch} />
                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <p className="w-full h-full flex items-center justify-center">
                        Pas de conversation trouvée
                    </p>
                ) : (
                    filteredConversations
                        .filter(conversation => !conversation.isArchived)
                        .map(conversation => {
                            const otherMember = getOtherMember(conversation);
                            const lastMessageContent = lastMessages[conversation.id]?.content || "";
                            const sentAt = lastMessages[conversation.id]?.sentAt;
                            const isRead = lastMessages[conversation.id]?.isRead;

                            return (
                                <DMConversationItem
                                    key={conversation.id}
                                    id={conversation.id}
                                    username={otherMember?.userName || "Utilisateur inconnu"}
                                    imageUrl={otherMember?.imageUrl || ""}
                                    lastMessageContent={lastMessageContent}
                                    lastMessageSender={getLastMessageSenderName(conversation.id)}
                                    sentAt={sentAt}
                                    isRead={isRead || false}
                                    isMutedUntil={conversation.isMutedUntil}
                                />
                            );
                        })
                )}
            </ItemList>
            {children}
        </div>
    );
};

export default ConversationLayout;