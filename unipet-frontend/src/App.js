import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Fila from "./pages/Fila";
import NovaTriagem from "./pages/NovaTriagem";
import Cadastro from "./pages/Cadastro";
import PainelTV from "./pages/PainelTV";
import Historico from "./pages/Historico";

export default function App() {
    const [usuario, setUsuario] = useState(null);
    const [pagina, setPagina] = useState("fila");

    useEffect(() => {
        const u = localStorage.getItem("unipet_usuario");
        if (u) setUsuario(JSON.parse(u));
    }, []);

    const logout = () => {
        localStorage.removeItem("unipet_token");
        localStorage.removeItem("unipet_usuario");
        setUsuario(null);
    };

    if (pagina === "painel") return (
        <div>
            <div style={{ position: "fixed", top: 12, right: 16, zIndex: 999 }}>
                <button onClick={() => setPagina("fila")}
                    style={{ background: "#1e293b", color: "#94a3b8", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
                    ← Voltar
                </button>
            </div>
            <PainelTV />
        </div>
    );

    if (!usuario) return <Login onLogin={setUsuario} />;

    return (
        <div style={s.shell}>
            <div style={s.sidebar}>
                <div style={s.logoWrap}>
                    <div style={s.logoIcon}>🐾</div>
                    <div style={s.logoText}>UNIPET</div>
                    <div style={s.logoSub}>Triagem Veterinária</div>
                </div>
                {[
                    { id: "fila", icon: "📋", label: "Fila de Atendimento" },
                    { id: "nova", icon: "➕", label: "Nova Triagem" },
                    { id: "cadastro", icon: "📝", label: "Cadastros" },
                    { id: "historico", icon: "📁", label: "Histórico" },
                    { id: "painel", icon: "📺", label: "Painel TV" },
                ].map(n => (
                    <div key={n.id} style={{ ...s.navItem, ...(pagina === n.id ? s.navAtivo : {}) }}
                        onClick={() => setPagina(n.id)}>
                        {n.icon} {n.label}
                    </div>
                ))}
                <div style={s.userCard}>
                    <div style={s.avatar}>{usuario.nome?.charAt(0)}</div>
                    <div>
                        <div style={s.userName}>{usuario.nome}</div>
                        <div style={s.userRole}>{usuario.perfil}</div>
                    </div>
                    <button onClick={logout} style={s.btnLogout} title="Sair">↩</button>
                </div>
            </div>
            <div style={s.main}>
                {pagina === "fila" && <Fila />}
                {pagina === "nova" && <NovaTriagem />}
                {pagina === "cadastro" && <Cadastro />}
                {pagina === "historico" && <Historico />}
            </div>
        </div>
    );
}

const s = {
    shell: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI',sans-serif" },
    sidebar: { width: 240, background: "#0f172a", display: "flex", flexDirection: "column", padding: 0, position: "fixed", height: "100vh" },
    logoWrap: { padding: "28px 20px 20px", borderBottom: "1px solid #1e293b" },
    logoIcon: { fontSize: 32, marginBottom: 4 },
    logoText: { color: "white", fontSize: 22, fontWeight: 800, fontFamily: "serif" },
    logoSub: { color: "#475569", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" },
    navItem: { display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", color: "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: 500 },
    navAtivo: { background: "rgba(13,148,136,0.15)", color: "#14b8a6" },
    userCard: { marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 },
    avatar: { width: 34, height: 34, borderRadius: "50%", background: "#0d9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 },
    userName: { color: "white", fontSize: 13, fontWeight: 600 },
    userRole: { color: "#475569", fontSize: 11 },
    btnLogout: { background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, marginLeft: "auto" },
    main: { marginLeft: 240, flex: 1, background: "#f1f5f9", minHeight: "100vh" },
};
