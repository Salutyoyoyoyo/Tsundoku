import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type Props = {
    imageUrl?: string;
    name: string;
};

const Header = ({ imageUrl, name }: Props) => {
    return (
        <Card className="w-full flex items-center p-4 justify-start gap-3 bg-transparent border-none shadow-none">
            <Avatar className="w-10 h-10">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
                <h1 className="font-semibold text-black">{name}</h1>
                <span className="text-sm text-green-500">En ligne</span>
            </div>
        </Card>
    );
};

export default Header;