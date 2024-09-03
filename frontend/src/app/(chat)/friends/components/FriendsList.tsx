"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useFetchWithAuth } from "@/services/fetchWithAuth";
import {useAuthContext} from "@/context/authContext";

type Friend = {
    id: string;
    email: string;
    username?: string;
    imageUrl?: string;
};

const symfonyUrl = process.env.SYMFONY_URL;
const fetchWithAuth = useFetchWithAuth();

const FriendsList = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetchWithAuth(`${symfonyUrl}/api/friendship/list/${userId}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des amis");
                }

                const data: Friend[] = await response.json();
                setFriends(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    if (loading) {
        return <p>Chargement des amis...</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {friends.map((friend) => (
                <Card key={friend.id} className="w-full p-2 flex flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-4 truncate">
                        <Avatar>
                            <AvatarImage src={friend.imageUrl} />
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <h4 className="truncate">{friend.username}</h4>
                            <p className="text-xs text-muted-foreground truncate">{friend.email}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default FriendsList;