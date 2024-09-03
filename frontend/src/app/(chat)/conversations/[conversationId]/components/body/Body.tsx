import React from "react";
import Message from "@/app/(chat)/conversations/[conversationId]/components/message/Message";

type MessageType = {
    _id: string;
    content: string[];
    senderImage: string;
    senderName: string;
    senderId: string;
    createdAt: number;
    isCurrentUser: boolean;
    type: string;
};

type Props = {
    messages: MessageType[];
};

const Body = ({ messages }: Props) => {
    return (
        <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
            {messages?.map((message, index) => {
                const lastByUser = messages[index - 1]?.senderId === message.senderId;

                return (
                    <Message
                        key={message._id}
                        fromCurrentUser={message.isCurrentUser}
                        senderImage={message.senderImage}
                        senderName={message.senderName}
                        lastByUser={lastByUser}
                        content={message.content}
                        createdAt={message.createdAt}
                        type={message.type}
                    />
                );
            })}
        </div>
    );
};

export default Body;