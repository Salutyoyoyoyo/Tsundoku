import React, {useState} from "react";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArchiveRestore, BellOff, EllipsisVertical, Trash2, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {formatDistanceToNow, parseISO} from "date-fns";
import {fr} from "date-fns/locale";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    handleArchiveConversation,
    handleDeleteConversation, handleMuteConversationDuration, handleUnmuteConversation,
} from "@/app/(chat)/conversations/actions";
import {toast} from "@/components/ui/use-toast";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";

type Props = {
    id: string;
    imageUrl: string;
    username: string;
    lastMessageContent: string;
    lastMessageSender: string;
    sentAt: string;
    isRead: boolean;
    isMutedUntil: {
        date: string;
        timezone: string;
        timezone_type: number;
    } | null;
};

const DMConversationItem = ({
                                id,
                                imageUrl,
                                username,
                                lastMessageContent,
                                lastMessageSender,
                                sentAt,
                                isRead,
                                isMutedUntil
                            }: Props) => {
    const parsedDate = sentAt ? parseISO(sentAt) : null;
    const timeAgo = parsedDate ? formatDistanceToNow(parsedDate, {addSuffix: true, locale: fr}) : "";

    const isLastMessageFromCurrentUser = lastMessageSender === "Vous : ";
    const displayReadStatus = isLastMessageFromCurrentUser ? true : isRead;

    const [openMuteDialog, setOpenMuteDialog] = useState(false);
    const isMuted = isMutedUntil && new Date(isMutedUntil.date) > new Date();
    const muteDuration = isMutedUntil ? new Date(isMutedUntil.date).toLocaleString() : "Inconnue";

    const handleMutedClick = () => {
        setOpenMuteDialog(true);
    };

    const handleMuteDurationSelect = async (duration: any) => {
        try {
            await handleMuteConversationDuration(id, duration);
            toast({
                variant: "default",
                description: "Conversation mise en sourdine !"
            })
            setOpenMuteDialog(false);

        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";

            toast({
                variant: "destructive",
                title: "Erreur",
                description: errorMessage
            });
        }
    };

    const handleUnmute = async () => {
        try {
            await handleUnmuteConversation(id);
            toast({
                variant: "default",
                description: "Cette conversation n'est plus en sourdine !"
            })
            setOpenMuteDialog(false);
        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";

            toast({
                variant: "destructive",
                title: "Erreur",
                description: errorMessage
            });
        }
    }

    const handleDeleteClick = async () => {
        try {
            await handleDeleteConversation(id);
            toast({
                variant: "default",
                description: "Conversation supprimée !",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une conversation n'a pas pu être supprimée.",
            });
        }
    };

    const handleArchiveClick = async () => {
        try {
            await handleArchiveConversation(id);
            toast({
                variant: "default",
                description: "Conversation archivée !",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une conversation n'a pas pu être archivée.",
            });
        }
    };

    return (
        <Link href={`/conversations/${id}`} className="w-full">
            <Card className="p-3 flex flex-row items-center gap-3 bg-transparent hover:bg-neutral-800 transition">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={imageUrl}/>
                    <AvatarFallback>
                        <User/>
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow overflow-hidden">
                    {lastMessageSender && lastMessageContent ? (
                        <>
                            <h4 className={`truncate font-semibold text-sm ${isMuted ? 'text-black' : displayReadStatus ? 'text-black' : 'text-red-500'}`}>
                                {username}
                            </h4>
                            <span className={`text-xs ${isMuted ? 'text-gray-400' : 'text-gray-400'} truncate overflow-hidden max-w-[200px]`}>
                                {isLastMessageFromCurrentUser ? (
                                    <span className="font-semibold">{lastMessageSender}</span>
                                ) : (
                                    <span>{lastMessageSender}: </span>
                                )}
                                <span className="truncate">{lastMessageContent}</span>
                            </span>
                        </>
                    ) : (
                        <>
                            <h4 className="truncate font-semibold text-sm text-black">{username}</h4>
                            <span className="text-xs text-gray-400 truncate overflow-hidden max-w-[200px]">
                                Envoie un message !
                            </span>
                        </>
                    )}
                </div>
                <div className="ml-auto flex-shrink-0">
                    <div className="flex items-center space-x-1">
                        {isMuted && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <span className="text-gray-400 cursor-pointer">
                                            <BellOff className="items-center w-5 h-5 mr-2 font-light p-0.5"/>
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-xs">
                                    Sourdine jusqu'au : {new Date(muteDuration).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                        {lastMessageContent && (
                            <span className="text-xs text-gray-400">
                                <Badge className="text-[10px] font-light p-0.5">{timeAgo}</Badge>
                            </span>
                        )}
                        {!isMuted && !displayReadStatus && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="text-xs cursor-pointer" onClick={(event) => event.stopPropagation()}>
                                    <EllipsisVertical className="h-4 w-4"/>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleMutedClick}>
                                    Sourdine<BellOff className="h-4 w-4 ml-7"/>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleArchiveClick}>
                                    Archives<ArchiveRestore className="h-4 w-4 ml-8"/>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDeleteClick}>
                                    Supprimer<Trash2 className="h-4 w-4 ml-5"/>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Dialog open={openMuteDialog} onOpenChange={setOpenMuteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Choisir la durée de la sourdine</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Button onClick={() => handleMuteDurationSelect(1)}>1 heure</Button>
                                <Button onClick={() => handleMuteDurationSelect(3)}>3 heure</Button>
                                <Button onClick={() => handleMuteDurationSelect(8)}>8 heures</Button>
                                <Button onClick={() => handleMuteDurationSelect(24)}>24 heures</Button>
                                <Button onClick={() => handleMuteDurationSelect('eternal')}>Jusqu&apos;à ce que je le
                                    change</Button>
                            </div>
                            {isMuted && (
                                <Button onClick={handleUnmute} variant="secondary">
                                    Annuler la sourdine
                                </Button>
                            )}
                            <DialogFooter>
                                <Button onClick={() => setOpenMuteDialog(false)}>Annuler</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </Card>
        </Link>
    );
};

export default DMConversationItem;