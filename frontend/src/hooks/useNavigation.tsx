import {Archive, MessagesSquare, Users} from "lucide-react";
import {usePathname} from "next/navigation";
import {useMemo} from "react";

export const useNavigation = () => {
    const pathname = usePathname();

    return useMemo(() => [
        {
            name: "Conversations",
            href: "/conversations",
            icon: <MessagesSquare/>,
            active: pathname.startsWith("/conversations"),
        },
        {
            name: "Friends",
            href: "/friends",
            icon: <Users/>,
            active: pathname.startsWith("/friends"),
        },
        {
            name: "Archives",
            href: "/archives",
            icon: <Archive/>,
            active: pathname.startsWith("/archives"),
        }
    ], [pathname]);
};