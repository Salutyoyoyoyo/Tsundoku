"use client"

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {UserPlus} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useMutationState} from "@/hooks/useMutationState";
import {toast} from "@/components/ui/use-toast";
import {useFetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

const addFriendFormSchema = z.object({
    requesterEmail: z.string()
        .min(1, {message: "Ce champ ne peut être vide"})
        .email("Veuillez saisir un e-mail valide"),
    receiverEmail: z.string()
        .min(1, {message: "Ce champ ne peut être vide"})
        .email("Veuillez saisir un e-mail valide")
});

const AddFriends = () => {
    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            requesterEmail: "",
            receiverEmail: ""
        },
    });
    const fetchWithAuth = useFetchWithAuth();

    const createFriendRequest = async ({requesterEmail, receiverEmail}: {
        requesterEmail: string,
        receiverEmail: string
    }) => {
        const response = await fetchWithAuth(`${symfonyUrl}/api/friendship/request`, {
            method: 'POST',
            body: JSON.stringify({requesterEmail, receiverEmail}),
        });
        console.log('salut')

        if (!response.ok) {
            throw new Error('Erreur lors de la création de la demande d\'ami');
        }

        return response.json();
    };

    const {mutate: createRequest, pending} = useMutationState(createFriendRequest);

    const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
        await createRequest(values).then(() => {
            form.reset();
            toast({
                variant: "default",
                description: "Demande d'ajout envoyée !"
            });
        }).catch(error => {
            toast({
                variant: "destructive",
                title: "Oh, oh ! Quelque chose a mal tourné.",
                description: "Il y a eu un problème avec votre demande."
            });
        });
    };

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                        <UserPlus/>
                    </Button>
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
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="requesterEmail"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Ton Email</FormLabel>
                                    <FormControl><Input placeholder="Email..." {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="receiverEmail"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email de ton ami(e)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email de l'ami(e)..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
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