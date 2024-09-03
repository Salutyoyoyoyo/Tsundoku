"use client"

import React from "react";
import ConversationContainer from "@/app/(chat)/components/conversation/ConversationContainer";
import { Loader2 } from "lucide-react";
import Header from "@/app/(chat)/conversations/[conversationId]/components/header/Header";
import Body from "@/app/(chat)/conversations/[conversationId]/components/body/Body";
import ChatInput from "@/app/(chat)/conversations/[conversationId]/components/Input/Input";

type Props = {
    params: {
        conversationId: string;
    }
}

const ConversationPage = ({ params: { conversationId } }: Props) => {
    const conversation = null;

    if (conversation === undefined) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (conversation === null) {
        return (
            <p className="w-full h-full flex items-center justify-center">
                Aucune conversation trouvée
            </p>
        );
    }

    return (
        <div className="ml-80">
            <ConversationContainer>
                <Header
                    name={(conversation.isGroup ? conversation.name : conversation.otherMember.username) || ""}
                    imageUrl={conversation.isGroup ? undefined : conversation.otherMember.imageUrl}
                />
                <Body />
                <ChatInput />
            </ConversationContainer>
        </div>
    );
}

export default ConversationPage;