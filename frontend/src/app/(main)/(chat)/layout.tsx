import React from "react";
import SidebarWrapper from "@/app/(main)/(chat)/components/sidebar/SidebarWrapper";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

type Props = React.PropsWithChildren<{}>;

const Layout = ({children}: Props) => {
    return (
        <>
            <SidebarWrapper>
                {children}
            </SidebarWrapper>
        </>
    );
};

export default Layout;