import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArchiveRestore, EllipsisVertical, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {handleDeleteConversation} from "@/app/(main)/(chat)/conversations/actions";
import {handleUnarchiveConversation} from "@/app/(main)/(chat)/archives/actions";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type Props = {
    id: string;
    imageUrl: string;
    username: string;
    lastMessageContent: string;
    lastMessageSender: string;
    archivedAt: string;
    isChecked: boolean;
    onChange: () => void;
};

const ArchivesConversationItem = ({ id, imageUrl, username, lastMessageContent, lastMessageSender, archivedAt, isChecked, onChange }: Props) => {
    const formattedArchivedAt = new Date(archivedAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

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

    const handleRestoreClick = async () => {
        try {
            await handleUnarchiveConversation(id);
            toast({
                variant: "default",
                description: "Conversation restaurée !",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une conversation n'a pas pu être restaurée.",
            });
        }
    };

    return (
        <Link href={`/archives/${id}`} className="w-full">
            <Card className="p-3 flex flex-row items-center gap-3 bg-transparent hover:bg-neutral-800 transition">
                <Checkbox id={id} checked={isChecked} onChange={onChange} />
                <Avatar className="w-12 h-12">
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow overflow-hidden">
                    <h4 className="truncate font-semibold text-sm text-black">{username}</h4>
                    {lastMessageSender && lastMessageContent && (
                        <>
                            <span className="text-xs text-gray-400 truncate overflow-hidden max-w-[200px]">
                                <span>{lastMessageSender}: </span>
                                <span className="truncate">{lastMessageContent}</span>
                            </span>
                        </>
                    )}
                </div>
                <div className="ml-auto flex-shrink-0">
                <div className="flex items-center space-x-1">
                        {archivedAt && (
                            <span className="text-xs text-gray-400">
                                <Badge className="text-[10px] font-light p-0.5">{formattedArchivedAt}</Badge>
                            </span>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="text-xs cursor-pointer" onPointerDown={(event) => event.stopPropagation()}>
                                    <EllipsisVertical className="h-4 w-4" />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleRestoreClick}>
                                    Restaurer<ArchiveRestore className="h-4 w-4 ml-8" />
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDeleteClick}>
                                    Supprimer<Trash2 className="h-4 w-4 ml-7" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default ArchivesConversationItem;