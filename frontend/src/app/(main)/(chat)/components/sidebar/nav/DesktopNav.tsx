"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DesktopNav = () => {
    const paths = useNavigation();
    return (
        <Card className=" fixed hidden lg:flex lg:flex-col lg:items-center h-[calc(90svh)] lg:w-16 lg:px-2 lg:py-4 mt-16 lg:justify-start">
            <nav>
                <ul className="flex flex-col items-center gap-4">
                    {paths.map((path, id) => (
                        <li key={id} className="relative">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={path.href}>
                                        <Button
                                            size="icon"
                                            variant={path.active ? "default" : "outline"}
                                        >
                                            {path.icon}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{path.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </li>
                    ))}
                </ul>
            </nav>
        </Card>
    );
};

export default DesktopNav;