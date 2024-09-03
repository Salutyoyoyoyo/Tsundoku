import React from "react";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";

type Props = {
    imageUrl?: string;
    name: string;
}

const Header = ({ imageUrl, name}: Props) => {
    return (
        <Card className="w-full flex rounded-lg items-center p-2 justify-between">
            <div>
            <Avatar>
                <AvatarImage src={imageUrl}>
                    <AvatarFallback><User /></AvatarFallback>
                </AvatarImage>
            </Avatar>
            <h2 className="font-semibold">{name}</h2>
            </div>
        </Card>
    )
}

export default Header;