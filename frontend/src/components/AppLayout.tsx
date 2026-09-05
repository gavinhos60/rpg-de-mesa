import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#1A120B" }}>
            <Sidebar />

            <div className="ml-64">
                <Header />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}