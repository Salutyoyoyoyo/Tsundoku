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
import { SendHorizontal } from "lucide-react";

const chatMessageSchema = z.object({
    content: z.string().min(1, {
        message: "Ce champ ne peut pas être vide"
    }),
});

const ChatInput = () => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const conversationId = "some-conversation-id";

    const createMessage = async (payload: any) => {
        try {
            const response = await fetch(`/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            return await response.json();
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
            type: "text",
            content: values.content,
        }).then(() => {
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
                        <Button disabled={pending} size="icon" type="submit">
                            <SendHorizontal />
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </Card>
    );
};
export default ChatInput;