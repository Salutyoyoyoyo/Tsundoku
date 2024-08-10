"use client"

import {useNavigation} from "@/hooks/useNavigation";
import {Card} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const DesktopNav = () => {
    const paths = useNavigation();
    return (
        <Card
            className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-80 mt-16">
            <nav>
                <ul className="flex flex-col items-center gap-4">
                    {
                        paths.map((path, id) => {
                            return (
                                <li key={id} className="relative">
                                    <Link href={path.href}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button size="icon"
                                                        variant={path.active ? "default" : "outline"}>{path.icon}</Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{path.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            </nav>
        </Card>
    );
}

export default DesktopNav;