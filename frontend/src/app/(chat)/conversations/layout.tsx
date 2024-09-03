import React from "react";
import ItemList from "@/app/(chat)/components/item-list/ItemList";
import { Loader2 } from "lucide-react";
import DMConversationItem from "@/app/(chat)/conversations/components/DMConversationItem";

type Conversation = {
    id: string;
    isGroup: boolean;
    otherMember: {
        username: string;
        imageUrl?: string;
    };
};

type Props = {
    children: React.ReactNode;
    conversations?: Conversation[];
    isLoading?: boolean;
};

const ConversationLayout = ({ children, conversations, isLoading }: Props) => {
    return (
        <div className="mt-16">
            <ItemList title="Conversations">
                {isLoading ? (
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : conversations ? (
                    conversations.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center">
                            Pas de conversation trouvée
                        </p>
                    ) : (
                        conversations.map((conversation) => {
                            return conversation.isGroup ? null : (
                                <DMConversationItem
                                    key={conversation.id}
                                    id={conversation.id}
                                    username={conversation.otherMember?.username || ""}
                                    imageUrl={conversation.otherMember?.imageUrl || ""}
                                    lastMessageContent={conversation.lastMessage?.content}
                                    lastMessageSender={conversation.lastMessage?.sender}
                                />
                            );
                        })
                    )
                ) : (
                    <p className="w-full h-full flex items-center justify-center text-center mb-20">
                        Erreur lors du chargement des conversations
                    </p>
                )}
            </ItemList>
            {children}
        </div>
    );
};

export default ConversationLayout;