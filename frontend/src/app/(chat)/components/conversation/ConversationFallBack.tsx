import React from "react";
import {Card} from "@/components/ui/card";

const ConversationFallBack = () => {
    return (
        <Card className="fixed hidden lg:flex h-[calc(90svh)] w-[calc(135svh)] p-2 items-center justify-center bg-sky-100 text-secondary-foreground">Select a conversation to get started!</Card>
    );
};

export default ConversationFallBack;