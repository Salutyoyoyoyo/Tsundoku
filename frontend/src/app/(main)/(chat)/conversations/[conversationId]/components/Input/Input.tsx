import React, {useState} from "react";
import {Card} from "@/components/ui/card";
import {z} from "zod";
import {useMutationState} from "@/hooks/useMutationState";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, FormProvider} from "react-hook-form";
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
    onNewMessage: (message: any) => void;
};

const ChatInput = ({conversationId, onNewMessage}: Props) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const {user} = useAuthContext();
    const socket = useSocket();
    const userEmail = user?.email;

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
            }
            const response = await sendMessage(payload, conversationId);

            return response;
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
    };

    const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
        mutate({
            message: values.content,
            userEmail: userEmail,
        }).then(() => {
            form.reset();
        }).catch((err) => {
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