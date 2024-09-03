"use client"

import React, { useState, useEffect } from "react";
import ItemList from "@/app/(chat)/components/item-list/ItemList";
import ConversationFallBack from "@/app/(chat)/components/conversation/ConversationFallBack";
import AddFriends from "@/app/(chat)/friends/components/AddFriends";
import { Loader2 } from "lucide-react";
import FriendsList from "@/app/(chat)/friends/components/FriendsList"; // Assurez-vous que le chemin est correct

type Friend = {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
};

const FriendsPage = () => {
    const [friendList, setFriendList] = useState<Friend[] | null>(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch('/api/friends');
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des amis');
                }
                const data: Friend[] = await response.json();
                setFriendList(data);
            } catch (error) {
                console.error(error);
                setFriendList([]);
            }
        };

        fetchFriends();
    }, []);

    return (
        <div className="flex mt-16 h-full">
            <div className="w-1/3">
                <ItemList title="Friends" action={<AddFriends />}>
                    {null === friendList ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    ) : friendList.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center text-center mb-20">
                            Ajoute des amis pour commencer à chatter
                        </p>
                    ) : (
                        friendList.map(friend => (
                            <FriendsList
                                key={friend.id}
                                id={friend.id}
                                imageUrl={friend.imageUrl}
                                username={friend.name}
                                email={friend.email}
                            />
                        ))
                    )}
                </ItemList>
            </div>
            <div className="ml-80 w-2/3">
                <ConversationFallBack />
            </div>
        </div>
    );
};

export default FriendsPage;