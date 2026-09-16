import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { KenkuAtmosphere } from "./KenkuAtmosphere";

export function AppLayout() {
    const location = useLocation();
    const [navOpen, setNavOpen] = useState(false);
    const isPlayRoom = /\/campaigns\/[^/]+\/play\/?$/.test(location.pathname);

    useEffect(() => {
        setNavOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!navOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [navOpen]);

    return (
        <div className="kenku-shell relative min-h-screen overflow-x-hidden">
            {!isPlayRoom ? (
                <KenkuAtmosphere density="light" showArt={false} />
            ) : null}

            {navOpen ? (
                <button
                    type="button"
                    aria-label="Fechar menu"
                    className={`fixed inset-0 z-40 ${isPlayRoom ? "" : "lg:hidden"}`}
                    style={{ backgroundColor: "var(--color-overlay)" }}
                    onClick={() => setNavOpen(false)}
                />
            ) : null}

            <Sidebar
                open={navOpen}
                onClose={() => setNavOpen(false)}
                drawerOnly={isPlayRoom}
            />

            <div className={`relative z-10 min-w-0 ${isPlayRoom ? "" : "lg:ml-64"}`}>
                <Header
                    onMenuClick={() => setNavOpen(true)}
                    forceMenuButton={isPlayRoom}
                    compact={isPlayRoom}
                />

                <main className="min-w-0 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
