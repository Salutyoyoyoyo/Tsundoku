import React from "react";
import {Card} from "@/components/ui/card";

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({children}: Props) => {
    return (
        <Card className="fixed lg:flex h-[calc(90svh)] w-[calc(135svh)] p-2 flex flex-col gap-2">{children}</Card>
    );
};

export default ConversationContainer;