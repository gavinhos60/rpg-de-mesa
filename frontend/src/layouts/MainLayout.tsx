import { Link, Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "⌂",
    },
    {
      label: "Campanhas",
      path: "/campaigns",
      icon: "📜",
    },
    {
      label: "Personagens",
      path: "/characters",
      icon: "⚔",
    },
    {
      label: "Mapas",
      path: "/maps",
      icon: "🗺",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* APP */}
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-900/80 lg:flex lg:flex-col">

          {/* Logo */}
          <div className="flex h-20 items-center border-b border-slate-800 px-6">

            <Link
              to="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl shadow-lg shadow-indigo-950">
                ⚔
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">
                  RPG Hub
                </p>

                <p className="text-xs text-slate-500">
                  Campaign Manager
                </p>
              </div>
            </Link>

          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1 p-4">

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Menu
            </p>

            {menuItems.map((item) => {

              const active =
                location.pathname === item.path ||
                (
                  item.path === "/campaigns" &&
                  location.pathname.startsWith("/campaign/")
                );

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }
                  `}
                >

                  <span
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-md text-base
                      ${
                        active
                          ? "bg-white/10"
                          : "bg-slate-800 group-hover:bg-slate-700"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>

                </Link>
              );
            })}

            {/* Separador */}
            <div className="my-6 border-t border-slate-800" />

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Sistema
            </p>

            <button
              className="
                group flex w-full items-center gap-3 rounded-lg
                px-3 py-3 text-sm font-medium
                text-slate-400 transition
                hover:bg-slate-800 hover:text-slate-100
              "
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800">
                ⚙
              </span>

              Configurações
            </button>

          </nav>

          {/* Usuário */}
          <div className="border-t border-slate-800 p-4">

            <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold">
                A
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  Administrador
                </p>

                <p className="truncate text-xs text-slate-500">
                  Mestre
                </p>
              </div>

              <button
                className="text-slate-500 transition hover:text-red-400"
                title="Sair"
              >
                ↪
              </button>

            </div>

          </div>

        </aside>

        {/* CONTEÚDO */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* HEADER */}
          <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur sm:px-6 lg:px-8">

            {/* Mobile logo */}
            <div className="flex items-center gap-3 lg:hidden">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                ⚔
              </div>

              <span className="font-bold">
                RPG Hub
              </span>

            </div>

            {/* Breadcrumb / título */}
            <div className="hidden lg:block">

              <p className="text-sm text-slate-500">
                RPG Hub
              </p>

              <p className="text-sm font-medium text-slate-200">
                {location.pathname === "/dashboard"
                  ? "Dashboard"
                  : location.pathname === "/campaigns"
                    ? "Campanhas"
                    : "Gerenciamento"}
              </p>

            </div>

            {/* Header actions */}
            <div className="ml-auto flex items-center gap-3">

              <button
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-lg border border-slate-800
                  bg-slate-900 text-slate-400
                  transition hover:bg-slate-800 hover:text-white
                "
                title="Notificações"
              >
                🔔
              </button>

              <div className="hidden h-6 w-px bg-slate-800 sm:block" />

              <div className="flex items-center gap-3">

                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">
                    Administrador
                  </p>

                  <p className="text-xs text-slate-500">
                    Mestre
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold">
                  A
                </div>

              </div>

            </div>

          </header>

          {/* MAIN */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>

          </main>

        </div>

      </div>

    </div>
  );
}