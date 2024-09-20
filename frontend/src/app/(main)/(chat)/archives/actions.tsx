"use server";

import { fetchWithAuth } from "@/services/fetchWithAuth";

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

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchArchivedConversations = async (userId: string): Promise<Conversation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/archived/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch archived conversations.');
        }

        const {data} = await response;

        if (data && data.conversations && Array.isArray(data.conversations)) {
            const flattenedConversations = data.conversations.flat();
            return flattenedConversations;
        } else {
            console.error("La réponse n'est pas au format attendu : ", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching archived conversations:", error);
        return [];
    }
};

export const handleUnarchiveConversation = async (conversationId: string) => {
    const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/unarchive/${conversationId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la désarchivage de la conversation.');
    }

    return response;
};

export const handleUnarchiveAllConversations = async (userId: string) => {
    try {
        const apiUrl = `${symfonyUrl}/api/conversation/unarchive-all/${userId}`;

        const response = await fetchWithAuth(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la désarchivage de toutes les conversations');
        }

        return response;

    } catch (error) {
        console.error('Erreur lors du désarchivage de toutes les conversations :', error);
        throw error;
    }
};