"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutationState } from "@/hooks/useMutationState";
import { toast } from "@/components/ui/use-toast";
import { createFriendRequest } from "./actions";
import { useAuthContext } from "@/context/authContext";

const addFriendFormSchema = z.object({
    receiverEmail: z.string()
        .min(1, { message: "Ce champ ne peut être vide" })
        .email("Veuillez saisir un e-mail valide")
});

const AddFriends = () => {
    const { user } = useAuthContext();

    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            receiverEmail: ""
        },
    });

    const { mutate: createRequest, pending } = useMutationState(async ({ receiverEmail }: { receiverEmail: string }) => {
        if (!user || !user.email) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de récupérer l'email de l'utilisateur."
            });
            return;
        }

        try {

            const response = await createFriendRequest(user.email, receiverEmail);

            if (!response.success) {
                throw new Error(response.error || 'Erreur lors de la création de la demande d\'ami');
            }

            toast({
                variant: "default",
                description: "Demande d'ajout envoyée !"
            });

            form.reset();
        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";

            toast({
                variant: "destructive",
                title: "Erreur",
                description: errorMessage
            });
        }
    });

    const handleSubmit = form.handleSubmit((values) => {
        createRequest(values);
    });

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <UserPlus />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Ajouter un(e) ami(e)</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ajouter un(e) ami(e)
                    </DialogTitle>
                    <DialogDescription>
                        Envoyez une demande de connexion à vos amis !
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="receiverEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email de ton ami(e)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email de l'ami(e)..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={pending} type="submit">
                                {pending ? 'Envoi...' : 'Envoyer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriends;