"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Send, User} from "lucide-react";
import {Button} from "@/components/ui/button";

type Props = {
    friends: {
        id: string;
        imageUrl?: string;
        username?: string;
        email: string;
    }[];
    loading: boolean;
    onStartConversation: (friendId: string) => void;
};

const FriendsList = ({ friends, loading, onStartConversation }: Props) => {
    if (loading) {
        return <p>Chargement des amis...</p>;
    }

    return (
        <div className="flex flex-col gap-2 w-full">
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
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onStartConversation(friend.id)}
                            size="icon"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default FriendsList;