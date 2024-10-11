import React, {useState, useEffect, useRef, useCallback} from "react";
import Message from "@/app/(main)/(chat)/conversations/[conversationId]/components/message/Message";
import {Loader2} from "lucide-react";
import {fetchMessagesFromConversationId} from "@/app/(main)/(chat)/conversations/actions";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";
import {useSocket} from "@/context/socketContext";

type Props = {
    messages: MessageType[];
    conversationId: string;
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
    userEmail: string;
};

type MessageType = {
    _id: string;
    content: string[];
    senderName: string;
    senderId: string;
    sent_at: string;
    isCurrentUser: boolean;
    type: string;
    isRead?: boolean;
};

const Body = ({messages, conversationId, setMessages, userEmail}: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const socket = useSocket();
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (socket && conversationId) {
            socket.emit('joinRoom', conversationId);

            socket.on('receive_msg', (data: any) => {
                const {roomId} = data;
                if (roomId === conversationId) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                }
            });

            socket.on('typing', ({userId}: { userId: string }) => {
                if (userId !== userEmail) {
                    setIsOtherUserTyping(true);
                }
            });

            socket.on('stopTyping', ({userId}: { userId: string }) => {
                if (userId !== userEmail) {
                    setIsOtherUserTyping(false);
                }
            });

            return () => {
                socket.off('receive_msg');
                socket.off('typing');
                socket.off('stopTyping');
            };
        }
    }, [socket, conversationId, userEmail, isAtBottom, setMessages]);

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
                const {scrollTop, scrollHeight, clientHeight} = messageContainerRef.current;

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

    const firstUnreadMessageIndex = messages.findIndex(
        (message) => message.senderId !== userEmail && !message.isRead
    );

    return (
        <div
            ref={messageContainerRef}
            className="flex-1 w-full flex overflow-y-scroll flex-col gap-2 p-3 no-scrollbar"
        >
            {loading && (
                <div className="flex justify-center mb-2">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                </div>
            )}

            {!isAtBottom && (
                <ScrollToBottomButton
                    onClick={() => {
                        if (messageContainerRef.current) {
                            messageContainerRef.current.scrollTo({
                                top: messageContainerRef.current.scrollHeight,
                                behavior: 'smooth'
                            });
                            setIsAtBottom(true);
                        }
                    }}
                />
            )}

            {messages.map((message, index) => {
                const isLastByUser = lastMessageByUser[message.senderId] === index;
                const isLastByMessages = index === messages.length - 1;
                const isRead = message.isRead;

                return (
                    <div key={message._id}>
                        {(index === firstUnreadMessageIndex && message.senderId !== userEmail) ? (
                            <div className="flex items-center py-2">
                                <div className="flex-grow border-t border-red-500"></div>
                                <div className="px-4 py-1 bg-red-500 text-white text-sm ">
                                    Nouveau message
                                </div>
                                <div className="flex-grow border-t border-red-500"></div>
                            </div>
                        ) : null}

                        <Message
                            fromCurrentUser={message.isCurrentUser}
                            lastByUser={isLastByUser}
                            content={message.content}
                            sent_at={message.sent_at}
                            type={message.type}
                            lastByMessages={isLastByMessages}
                            isRead={isRead}
                        />
                    </div>
                );
            })}

            {isOtherUserTyping && (
                <div className="px-2 text-gray-500 text-xs">est en train d'écrire...
                </div>
            )}
        </div>
    );
};

export default Body;