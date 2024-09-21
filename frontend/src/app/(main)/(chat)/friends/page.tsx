"use client";

import React, { useState, useEffect } from "react";
import ItemList from "../components/item/ItemList";
import ConversationFallBack from "../components/conversation/ConversationFallBack";
import AddFriends from "./components/AddFriends";
import { Loader2 } from "lucide-react";
import FriendsList from "@/app/(main)/(chat)/friends/components/FriendsList";
import { fetchFriendsList } from "./actions";
import { useAuthContext } from "@/context/authContext";
import SearchBar from "@/app/(main)/(chat)/components/item/ItemSearchBar";
import {useRouter} from "next/navigation";
import {startNewConversation} from "@/app/(main)/(chat)/conversations/actions";
import {toast} from "@/components/ui/use-toast";

type Friend = {
    id: string;
    userName: string;
    email: string;
    imageUrl?: string;
};

const FriendsPage = () => {
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const router = useRouter();
    const { user } = useAuthContext();
    const userId = user?.userId;

    useEffect(() => {
        const fetchFriendsData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const data = await fetchFriendsList(userId);
                setFriendList(data);
                setFilteredFriends(data);
            } catch (error) {
                console.error("Erreur lors du chargement des amis", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendsData();
    }, [userId]);

    const onStartConversation = async (friendId: string) => {
        const friend = friendList.find((f) => f.id === friendId);
        if (friend) {
            setSelectedFriend(friend);
            try {
                const response = await startNewConversation(user.email, friendId);

                if (response.success) {
                    const newConversationId = response.conversationId;
                    toast({
                        variant: "default",
                        description: "Conversation créée !"
                    })
                    router.push(`/conversations/${newConversationId}`);
                } else {
                    if (409 === response.status) {
                        toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: "Une conversation existe déjà avec cet(te) ami(e)...",
                        });
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: "Erreur lors de la création de la conversation. Veuillez essayer ultérieurement..",
                        });
                    }
                }
            } catch (error) {
                console.error("Erreur lors du démarrage de la conversation :", error);
            }
        } else {
            console.error("Ami non trouvé pour l'ID :", friendId);
        }
    };

    const handleSearch = (searchTerm: string) => {
        if (searchTerm) {
            const filtered = friendList.filter(friend =>
                friend.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                friend.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFriends(filtered);
        } else {
            setFilteredFriends(friendList);
        }
    };

    return (
        <div className="flex mt-16 h-full">
            <div className="w-1/3">
                <ItemList title="Friends" action={<AddFriends />}>
                    <SearchBar placeholder="Rechercher un(e) ami(e)..." onSearch={handleSearch} />
                    {loading ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    ) : filteredFriends.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center text-center mb-20">
                            Ajoute des amis pour commencer à chatter
                        </p>
                    ) : (
                        <FriendsList friends={filteredFriends} loading={loading} onStartConversation={onStartConversation} />
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