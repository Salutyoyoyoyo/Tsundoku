'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

interface Friend {
    id: string;
    userName: string;
    email: string;
    imageUrl?: string;
}

export async function fetchFriendsList(userId: number): Promise<Friend[]> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/chat-friendship/list/${userId}`, {
            method: 'GET',
        });

        if (response.ok && Array.isArray(response.data)) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}