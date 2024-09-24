'use client';

import React from "react";
import ConversationView from "@/app/(main)/(chat)/components/conversation/ConversationView";

type Props = {
    params: {
        conversationId: string;
    }
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
    return (
        <div>
            <ConversationView conversationId={conversationId} context="active" />
        </div>
    );
};

export default ConversationPage;