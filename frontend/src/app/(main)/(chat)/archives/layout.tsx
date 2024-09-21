'use client';

import React, {useEffect, useState} from 'react';
import {Loader2} from 'lucide-react';
import ArchivesConversationItem from '@/app/(main)/(chat)/archives/components/ArchivesConversationItem';
import ItemList from '@/app/(main)/(chat)/components/item/ItemList';
import {fetchArchivedConversations, handleUnarchiveAllConversations} from '@/app/(main)/(chat)/archives/actions';
import {useAuthContext} from '@/context/authContext';
import {getLastMessageFromUser} from '@/app/(main)/(chat)/conversations/actions';
import SearchBar from '@/app/(main)/(chat)/components/item/ItemSearchBar';
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";
import {toast} from "@/components/ui/use-toast";

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
    archivedAt: string;
};

const ArchivesLayout = ({ children }: { children: React.ReactNode }) => {
    const [archivesConversation, setArchivesConversation] = useState<Conversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
    const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [lastMessages, setLastMessages] = useState<{
        [key: string]: {
            senderEmail: string;
            content: string;
            senderName: string;
            sentAt: string;
            isRead: boolean;
        };
    }>({});
    const { user } = useAuthContext();
    const userId = user?.userId;

    useEffect(() => {
        const loadArchivedConversations = async () => {
            try {
                const data = await fetchArchivedConversations(userId);
                setArchivesConversation(data);
                setFilteredConversations(data);

                const updatedLastMessages: {
                    [key: string]: {
                        content: string;
                        senderName: string;
                        senderEmail: string;
                        sentAt: string;
                        isRead: boolean;
                    };
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
            } catch (error) {
                console.error('Erreur lors du chargement des conversations archivées:', error);
                setArchivesConversation([]);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadArchivedConversations();
        }
    }, [userId]);

    const getOtherMember = (conversation: Conversation) => {
        return conversation.participants.find((participant) => participant.id !== userId);
    };

    const getLastMessageSenderName = (conversationId: string): string => {
        return lastMessages[conversationId]?.senderEmail === user.email ? "Vous " : lastMessages[conversationId]?.senderEmail || "Utilisateur inconnu";
    };
    const toggleSelectAll = (isChecked: CheckedState) => {
        if (isChecked) {
            const allIds = new Set(filteredConversations.map(conversation => conversation.id));
            setSelectedConversations(allIds);
        } else {
            setSelectedConversations(new Set());
        }
    };

    const toggleSelectConversation = (conversationId: string) => {
        const updatedSelection = new Set(selectedConversations);
        if (updatedSelection.has(conversationId)) {
            updatedSelection.delete(conversationId);
        } else {
            updatedSelection.add(conversationId);
        }
        setSelectedConversations(updatedSelection);
    };
    const handleUnarchiveSelected = async (userId: string) => {
        try {
            await handleUnarchiveAllConversations(userId);

            toast({
                variant: "default",
                description: "Toutes les conversations ont bien été archivées !"
            });
        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";

            toast({
                variant: "destructive",
                title: "Erreur",
                description: errorMessage
            })
        }
    };

    const handleSearch = (searchTerm: string) => {
        if (searchTerm) {
            const filtered = archivesConversation.filter(conversation => {
                const otherMember = getOtherMember(conversation);
                const lastMessageContent = lastMessages[conversation.id]?.content || "";
                return (
                    otherMember?.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lastMessageContent.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredConversations(filtered);
        } else {
            setFilteredConversations(archivesConversation);
        }
    };

    return (
        <div className="mt-16">
            <ItemList title="Archives">
                <SearchBar placeholder="Rechercher une conversation..." onSearch={handleSearch}/>
                <div className="grid grid-cols-3 items-center mt-2 text-xs">
                    <div className="flex mr-5 items-center">
                        <Checkbox
                            onCheckedChange={(isChecked) => toggleSelectAll(isChecked)}
                            checked={selectedConversations.size === filteredConversations.length && filteredConversations.length > 0}
                            className="mr-1"
                        />
                        <span>Tout sélectionner</span>
                    </div>
                    {selectedConversations.size > 0 && (
                        <a
                            href="#"
                            onClick={() => handleUnarchiveSelected(userId)}
                            className="text-blue-500 hover:underline ml-10 cursor-pointer col-start-3"
                        >
                            Désarchiver tout
                        </a>
                    )}
                </div>
                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin"/>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <p className="w-full h-full flex items-center justify-center">
                        Pas de conversation trouvée
                    </p>
                ) : (
                    filteredConversations.map((conversation) => {
                        const otherMember = getOtherMember(conversation);
                        const lastMessageContent = lastMessages[conversation.id]?.content || "";
                        const archivedAt = conversation.archivedAt;

                        return (
                            <ArchivesConversationItem
                                key={conversation.id}
                                id={conversation.id}
                                username={otherMember?.userName || 'Utilisateur inconnu'}
                                imageUrl={otherMember?.imageUrl || ''}
                                lastMessageContent={lastMessageContent}
                                lastMessageSender={getLastMessageSenderName(conversation.id)}
                                archivedAt={archivedAt}
                                isChecked={selectedConversations.has(conversation.id)}
                                onChange={() => toggleSelectConversation(conversation.id)}
                            />
                        );
                    })
                )}
            </ItemList>
            {children}
        </div>
    );
};

export default ArchivesLayout;