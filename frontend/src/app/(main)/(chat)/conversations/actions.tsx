'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

type Participant = {
    id: string;
    userName: string;
    imageUrl?: string;
    email: string;
};

type Conversation = {
    id: string;
    isGroup: boolean;
    lastMessage: {
        content: string;
        sender: {
            id: string;
            userName: string;
        };
    };
    participants: Participant[];
    isArchived: boolean;
    isMutedUntil: {
        date: string;
        timezone: string;
        timezone_type: number;
    } | null;
};

export const fetchUserConversations = async (userId: string): Promise<Conversation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/get-all/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.response) {
            throw new Error('Erreur lors de la récupération des conversations');
        }

        const data = response.data;

        if (data && data.conversations && Array.isArray(data.conversations)) {
            const flattenedConversations = data.conversations.flat();
            return flattenedConversations;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};

export const fetchOneConversationById = async (conversationId: string): Promise<Participant[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/get-one/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            throw new Error('Erreur lors de la récupération de la conversation');
        }

        const data = response.data;

        if (data && data.participants && Array.isArray(data.participants)) {
            return data.participants.map((participant: {
                id: any;
                userName: any;
                email: any;
                imageUrl: any;
            }) => ({
                id: participant.id,
                userName: participant.userName,
                email: participant.email,
                imageUrl: participant.imageUrl,
            }));
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};


export const fetchMessagesFromConversationId = async (conversationId: string, page = 1, limit = 20) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/message/get/${conversationId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            throw new Error('Erreur lors de la récupération des messages');
        }

        const messages = response.data;

        if (Array.isArray(messages)) {
            return messages.map(message => {
                if (message.image) {
                    message.imageUrl = `${symfonyUrl}${message.image}`;
                }

                return {
                    ...message,
                    hasImage: !!message.imageUrl,
                };
            });
        } else {
            console.error("La réponse des messages n'est pas au format attendu : ", messages);
            return [];
        }
    } catch (error) {
        console.error("Erreur lors du fetch des messages :", error);
        return [];
    }
};

export const getLastMessageFromUser = async (conversationId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/message/get-last-messages/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            throw new Error('Erreur lors de la récupération des derniers messages');
        }

        return response;
    } catch (error) {
        return null;
    }
};

export const sendMessage = async (payload: any, conversationId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/message/send/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.response) {
            throw new Error('Failed to send message');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchMarkMessagesAsRead = async (conversationId: string, userEmail: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/message/mark-messages-read/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userEmail}),
        });

        if (!response.response) {
            throw new Error(`Erreur : ${response.statusText}`);
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const startNewConversation = async (userEmail: string, friendId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: "Nouvelle conversation",
                participants: [friendId],
                email: userEmail
            })
        });

        if (response.response.success === false) {
            return {
                succes: false,
                status: response.status,
            }
        }

        const data = response.data;

        return {
            success: true,
            status: response.status,
            conversationId: data.conversationId,
        };
    } catch (error) {
        return {
            success: false,
            status: (error as any).status,
            error: (error as Error).message,
        };
    }
};

export const handleDeleteConversation = async (conversationId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/delete/${conversationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            throw new Error('Erreur lors de la suppression de la conversation.');
        }

    } catch (error) {
        throw error;
    }
};

export const handleArchiveConversation = async (conversationId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/archive/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.response) {
            throw new Error('Erreur lors de l\'archivage de la conversation.');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const handleMuteConversationDuration = async (conversationId: string, duration: any) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/mute/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({duration})
        })
        if (!response.response) {
            throw new Error('Erreur lors du mute de la conversation.');
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export const handleUnmuteConversation = async (conversationId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/unmute/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.response) {
            throw new Error('Erreur lors du unmute de la conversation.');
        }
        return response;
    } catch (error) {
        throw error;
    }
}