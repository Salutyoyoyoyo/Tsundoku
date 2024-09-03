import React from "react";
import {Card} from "@/components/ui/card";

type Props = React.PropsWithChildren<{
    title: string;
    action?: React.ReactNode;
}>

const ItemList = ({children, title, action: Action}: Props) => {
    return (
        <Card className="fixed h-[calc(90svh)] w-full lg:flex-none lg:w-72 p2">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2x1 font-semibold tracking-tight ml-3 mt-3">{title}</h1>
                {Action ? Action : null}
            </div>
            <div className="w-full h-full flex flex-col items-center justify-start gap-2">{children}</div>
        </Card>
    );
};

export default ItemList;