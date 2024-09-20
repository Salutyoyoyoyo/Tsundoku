"use client"

import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/app/(chat)/conversations/actions";
import { useAuthContext } from "@/context/authContext";

const chatMessageSchema = z.object({
    content: z.string().min(1, {
        message: "Ce champ ne peut pas être vide"
    }),
});

type Props = {
    conversationId: string;
    onNewMessage: (message: any) => void;
};

const ChatInput = ({ conversationId, onNewMessage }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const { user } = useAuthContext();
    const userEmail = user?.email;

    const createMessage = async (payload: any) => {
        try {
            const response = await sendMessage(payload, conversationId);

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    const { mutate, pending } = useMutationState(createMessage);

    const form = useForm<z.infer<typeof chatMessageSchema>>({
        resolver: zodResolver(chatMessageSchema),
        defaultValues: {
            content: "",
        },
    });

    const handleInputChange = (event: any) => {
        const { value, selectionStart } = event.target;

        if (selectionStart !== null) {
            form.setValue("content", value);
        }
    };

    const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
        mutate({
            conversationId,
            userEmail,
            message: values.content,
        }).then(() => {
            const newMessage = {
                content: values.content,
                sent_by: userEmail,
                send_at: new Date().toISOString(),
                sender_email: userEmail,
            };

            onNewMessage(newMessage);

            form.reset();
        }).catch((error) => {
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
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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