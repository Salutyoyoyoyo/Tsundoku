import React, {useState} from "react";
import {Card} from "@/components/ui/card";
import {z} from "zod";
import {useMutationState} from "@/hooks/useMutationState";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormProvider, useForm} from "react-hook-form";
import {toast} from "@/components/ui/use-toast";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import TextareaAutosize from "react-textarea-autosize";
import {Button} from "@/components/ui/button";
import {sendMessage} from "@/app/(main)/(chat)/conversations/actions";
import {useAuthContext} from "@/context/authContext";
import EmojiPicker, {EmojiClickData} from 'emoji-picker-react';
import {Smile} from "lucide-react";
import {useSocket} from "@/context/socketContext";

const chatMessageSchema = z.object({
    content: z.string().optional(),
});

type Props = {
    conversationId: string;
};

const ChatInput = ({conversationId}: Props) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const {user} = useAuthContext();
    const socket = useSocket();
    const userEmail = user?.email;
    const userId = user?.userId;

    const createMessage = async (payload: any) => {
        try {
            if (socket) {
                socket.emit('send_msg', {
                    roomId: conversationId,
                    isRead: true,
                    userId: user?.userId,
                    content: payload.message,
                    sender_email: userEmail,
                    sent_by: payload.userEmail,
                    sent_at: new Date().toISOString(),
                });

                socket.on('typing', (userId));

                socket.on('stopTyping', (userId));
            }

            return await sendMessage(payload, conversationId);
        } catch (error) {
            throw error;
        }
    };

    const {mutate, pending} = useMutationState(createMessage);

    const form = useForm<z.infer<typeof chatMessageSchema>>({
        resolver: zodResolver(chatMessageSchema),
        defaultValues: {
            content: "",
        },
    });

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        form.setValue("content", form.getValues("content") + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handleInputChange = (event: any) => {
        const {value, selectionStart} = event.target;

        if (selectionStart !== null) {
            form.setValue("content", value);
        }

        if (socket && value.trim() !== "") {

            if (!isTyping) {
                socket.emit("typing", {roomId: conversationId, userId});
                setIsTyping(true);
            }

            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            const timeoutId = setTimeout(() => {
                socket.emit("stopTyping", {roomId: conversationId, userId});
                setIsTyping(false);
            }, 3000);

            setTypingTimeout(timeoutId);
        }
    };

    const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
        mutate({
            message: values.content,
            userEmail: userEmail,
        }).then(() => {
            form.reset();
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Oh, oh ! Quelque chose a mal tourné.",
                description: "Il y a eu un problème avec votre demande."
            });
        });
    };

    return (
        <Card className="w-full p-2 rounded-lg relative">
            <div className="flex gap-2 items-end w-full">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2 items-end w-full">
                        <div className="flex items-center w-full gap-2">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({field}) => (
                                    <FormItem className="h-full w-full">
                                        <FormControl>
                                            <TextareaAutosize
                                                onKeyDown={async (e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        await form.handleSubmit(handleSubmit)();
                                                    }
                                                }}
                                                rows={1}
                                                maxRows={3}
                                                {...field}
                                                onChange={handleInputChange}
                                                onClick={handleInputChange}
                                                placeholder="Écrire un message..."
                                                className="min-h-full w-full resize-none border-0 outline-none bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="relative flex items-center">
                            <Button type="button" variant="ghost" size="sm"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                <Smile className="w-5 h-5"/>
                            </Button>

                            {showEmojiPicker && (
                                <div className="absolute bottom-10 right-0">
                                    <EmojiPicker onEmojiClick={handleEmojiClick}/>
                                </div>
                            )}
                        </div>
                        <Button disabled={pending} size="default" type="submit">
                            Envoyer
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </Card>
    );
};

export default ChatInput;