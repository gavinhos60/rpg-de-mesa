import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Campaigns } from "../pages/Campaigns";
import { Campaign } from "../pages/Campaign";
import { Characters } from "../pages/Characters";
import { MainLayout } from "../layouts/MainLayout";
import { CharacterSheet } from "../pages/CharacterSheet";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />

                {/* Rotas protegidas */}
                <Route element={<MainLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/campaigns"
                        element={<Campaigns />}
                    />

                    <Route
                        path="/campaign/:id"
                        element={<Campaign />}
                    />

                    <Route
                        path="/characters"
                        element={<Characters />}
                    />

                    <Route
                        path="/characters/:id"
                        element={<CharacterSheet />}
                    />

                </Route>

                {/* Rota padrão */}
                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>
        </BrowserRouter>
    );
}