import React from "react";
import SidebarWrapper from "@/app/(chat)/components/sidebar/SidebarWrapper";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

type Props = React.PropsWithChildren<{}>;

const Layout = ({children}: Props) => {
    return (
        <>
            <aside>
                <Navbar />
                <Sidebar />
            </aside>
            <SidebarWrapper>
                {children}
            </SidebarWrapper>
        </>
    );
};

export default Layout;