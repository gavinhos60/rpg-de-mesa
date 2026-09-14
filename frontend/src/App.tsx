import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Campaigns } from "./pages/Campaigns";
import { Campaign } from "./pages/Campaign";
import { CreateCharacter } from "./pages/CreateCharacter";
import { Characters } from "./pages/Characters";
import { CharacterSheet } from "./pages/CharacterSheet";
import { AppLayout } from "./components/AppLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route element={<AppLayout />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/campaigns"
                        element={<Campaigns />}
                    />
                    <Route
                        path="/characters"
                        element={<Characters />}
                    />
                    <Route
                        path="/characters/new"
                        element={<CreateCharacter />}
                    />
                    <Route
                        path="/characters/:id"
                        element={<CharacterSheet />}
                    />
                    <Route
                        path="/campaigns/:id"
                        element={<Campaign />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;