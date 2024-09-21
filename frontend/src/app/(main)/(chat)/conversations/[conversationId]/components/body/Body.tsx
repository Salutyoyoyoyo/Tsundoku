import React, { useState, useEffect, useRef, useCallback } from "react";
import Message from "@/app/(main)/(chat)/conversations/[conversationId]/components/message/Message";
import { Loader2 } from "lucide-react";
import { fetchMessagesFromConversationId } from "@/app/(main)/(chat)/conversations/actions";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";

type Props = {
    messages: MessageType[];
    conversationId: string;
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

type MessageType = {
    _id: string;
    content: string[];
    senderName: string;
    senderId: string;
    createdAt: number;
    isCurrentUser: boolean;
    type: string;
};

const Body = ({ messages, conversationId, setMessages }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const loadMoreMessages = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        try {
            const newMessages = await fetchMessagesFromConversationId(conversationId, page + 1);
            if (newMessages.length > 0) {
                setMessages((prevMessages) => [...newMessages.reverse(), ...prevMessages]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Erreur lors du chargement de plus de messages :", error);
        } finally {
            setLoading(false);
        }
    }, [loading, conversationId, page, setMessages]);

    useEffect(() => {
        const handleScroll = async () => {
            if (messageContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;

                setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);

                if (scrollTop === 0 && !loading) {
                    await loadMoreMessages();
                }
            }
        };

        const containerRef = messageContainerRef.current;
        if (containerRef) {
            containerRef.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (containerRef) {
                containerRef.removeEventListener("scroll", handleScroll);
            }
        };
    }, [loading, loadMoreMessages]);

    useEffect(() => {
        if (messageContainerRef.current && messages.length > 0 && isAtBottom) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isAtBottom]);

    const lastMessageByUser: Record<string, number> = {};
    messages.forEach((message, index) => {
        lastMessageByUser[message.senderId] = index;
    });

    return (
        <div
            ref={messageContainerRef}
            className="flex-1 w-full flex overflow-y-scroll flex-col gap-2 p-3 no-scrollbar"
        >
            {loading && (
                <div className="flex justify-center mb-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            )}
            {!isAtBottom && (
                <ScrollToBottomButton
                    onClick={() => {
                        if (messageContainerRef.current) {
                            messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight, behavior: 'smooth' });
                            setIsAtBottom(true);
                        }
                    }}
                />
            )}
            {messages.map((message, index) => {
                const isLastByUser = lastMessageByUser[message.senderId] === index;

                return (
                    <Message
                        key={message._id}
                        fromCurrentUser={message.isCurrentUser}
                        senderName={message.senderName}
                        lastByUser={isLastByUser}
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