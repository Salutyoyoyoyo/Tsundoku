'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export async function createFriendRequest(requesterEmail: string, receiverEmail: string) {
    const symfonyUrl = process.env.SYMFONY_URL;

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/chat-friendship/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'requester-email': requesterEmail,
                'receiver-email': receiverEmail,
            }
        });

        if (201 === response.status) {
            return { success: true };
        } else if (409 === response.status) {
            return { success: false, error: "ChatFriendship already exists or request already sent." };
        } else {
            return { success: false, error: "Erreur lors de la création de la demande d'ami" };
        }

    } catch (error) {
        return { success: false, error: "Erreur lors de la création de la demande d'ami" };
    }
}