"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {Check, SquarePen} from "lucide-react";
import { useAuthContext } from "@/context/authContext";
import { toast } from "@/components/ui/use-toast";
import { fetchFriendsList } from "@/app/(main)/(chat)/friends/actions";
import { startNewConversation } from "@/app/(main)/(chat)/conversations/actions";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Friend = {
    id: string;
    userName: string;
    imageUrl?: string;
    email: string;
};

const StartNewConversation = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { user } = useAuthContext();
    const userId = user?.userId;
    const router = useRouter();

    useEffect(() => {
        const loadFriends = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const fetchedFriends = await fetchFriendsList(userId);
                setFriends(fetchedFriends);
                setFilteredFriends(fetchedFriends);
            } catch (error) {
                console.error("Erreur lors de la récupération des amis :", error);
            } finally {
                setLoading(false);
            }
        };

        loadFriends();
    }, [userId]);

    useEffect(() => {
        const filtered = friends.filter((friend) =>
            friend.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFriends(filtered);
    }, [searchTerm, friends]);

    const handleStartConversation = async () => {
        if (!selectedFriend) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez sélectionner un(e) ami(e) pour commencer une conversation.",
            });
            return;
        }

        try {
            const response = await startNewConversation(user.email, selectedFriend.id);

            if (response.success) {
                toast({
                    variant: "default",
                    description: "Nouvelle conversation démarrée !",
                });
                const conversationId = response?.conversationId;
                setIsDialogOpen(false);
                router.push(`/conversations/${conversationId}`);
            } else if (response.error === "Conversation already exists") {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Une conversation avec cet ami existe déjà.",
                });
            } else {
                throw new Error(response.error || "Erreur lors de la création de la conversation.");
            }
        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";
            toast({
                variant: "destructive",
                title: "Erreur",
                description: errorMessage,
            });
        }
    };

    const toggleFriendSelection = (friend: Friend) => {
        if (selectedFriend?.id === friend.id) {
            setSelectedFriend(null);
        } else {
            setSelectedFriend(friend);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <SquarePen />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Commencer une nouvelle conversation</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouvelle conversation</DialogTitle>
                    <DialogDescription>Choisissez un(e) ami(e) pour démarrer une conversation</DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Rechercher un(e) ami(e)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />

                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <div
                                    key={friend.id}
                                    onClick={() => toggleFriendSelection(friend)}
                                    className={`flex items-center p-2 cursor-pointer rounded-md ${
                                        selectedFriend?.id === friend.id ? "bg-blue-100" : ""
                                    }`}
                                >
                                    <Avatar className="w-8 h-8 mr-4">
                                        <AvatarImage src={friend.imageUrl || "/default-avatar.png"} alt={friend.userName} />
                                        <AvatarFallback>{friend.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{friend.userName}</span>
                                        <span className="text-xs text-gray-500">{friend.email}</span>
                                    </div>

                                    {selectedFriend?.id === friend.id && <Check className="ml-auto w-4 h-4 text-blue-500" />}
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Aucun ami trouvé.</p>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button onClick={handleStartConversation} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Commencer la conversation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default StartNewConversation;