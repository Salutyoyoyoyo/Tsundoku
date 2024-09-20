import React from "react";
import {format, isToday, isYesterday} from "date-fns";
import {fr} from "date-fns/locale";
import {cn} from "@/lib/utils";

type Props = {
    fromCurrentUser: boolean;
    senderName: string;
    lastByUser: boolean;
    content: string[];
    createdAt: number;
    type: string;
};

const Message = ({fromCurrentUser, senderName, lastByUser, content, createdAt, type}: Props) => {
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);

        if (isToday(date)) {
            return format(date, "HH:mm");
        } else if (isYesterday(date)) {
            return `Hier à ${format(date, "HH:mm")}`;
        } else {
            return format(date, "d MMMM 'à' HH:mm", {locale: fr});
        }
    };

    return (
        <div className={cn("flex items-end mb-4", {
            'justify-end': fromCurrentUser,
            'justify-start': !fromCurrentUser
        })}>
            <div className={cn("flex w-full mx-2", {
                "order-1 justify-end": fromCurrentUser,
                "order-2 justify-start": !fromCurrentUser
            })}>
                <div className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
                    "bg-primary text-primary-foreground": fromCurrentUser,
                    "bg-secondary text-secondary-foreground": !fromCurrentUser,
                    "rounded-br-none": lastByUser && fromCurrentUser,
                    "rounded-bl-none": lastByUser && !fromCurrentUser
                })}>
                    {type === "text" ? (
                        <p className="text-wrap break-words whitespace-pre-wrap">
                            {content}
                        </p>
                    ) : null}
                </div>
                    <span className={cn("text-xs ml-4 mr-4 ", {
                        "text-gray-500": fromCurrentUser,
                        "text-gray-400": !fromCurrentUser,
                        "order-last": !fromCurrentUser,
                        "order-first": fromCurrentUser
                    })}>
                        {formatTime(createdAt)}
                    </span>
            </div>
        </div>
    );
};

export default Message;