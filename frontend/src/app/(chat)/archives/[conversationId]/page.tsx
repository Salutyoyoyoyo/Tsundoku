
'use client';

import React from "react";
import ConversationView from "@/app/(chat)/components/conversation/ConversationView";

type Props = {
    params: {
        conversationId: string;
    }
};

const ArchivedConversationPage = ({ params: { conversationId } }: Props) => {
    return (
        <div>
            <ConversationView conversationId={conversationId} context="archive" />
        </div>
    );
};

export default ArchivedConversationPage;