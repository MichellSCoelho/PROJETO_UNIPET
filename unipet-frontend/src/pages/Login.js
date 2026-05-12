import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", { email, senha });
            localStorage.setItem("unipet_token", data.token);
            localStorage.setItem("unipet_usuario", JSON.stringify(data.usuario));
            onLogin(data.usuario);
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao fazer login.");
        }
        setLoading(false);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logo}>🐾</div>
                <h1 style={styles.title}>UNIPET</h1>
                <p style={styles.sub}>Sistema de Triagem Veterinária</p>

                {erro && <div style={styles.erro}>{erro}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.grupo}>
                        <label style={styles.label}>E-mail</label>
                        <input style={styles.input} type="email"
                            value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="seu@email.com" required />
                    </div>
                    <div style={styles.grupo}>
                        <label style={styles.label}>Senha</label>
                        <input style={styles.input} type="password"
                            value={senha} onChange={e => setSenha(e.target.value)}
                            placeholder="••••••••" required />
                    </div>
                    <button style={styles.btn} type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "→ Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight:"100vh", background:"#0f172a", display:"flex", alignItems:"center", justifyContent:"center" },
    card: { background:"#1e293b", borderRadius:20, padding:"48px 40px", width:380, boxShadow:"0 20px 60px rgba(0,0,0,0.4)" },
    logo: { fontSize:48, textAlign:"center", marginBottom:8 },
    title: { color:"#14b8a6", textAlign:"center", fontSize:32, margin:0, fontFamily:"serif" },
    sub: { color:"#94a3b8", textAlign:"center", fontSize:14, marginBottom:32 },
    erro: { background:"#fee2e2", color:"#b91c1c", padding:"12px 16px", borderRadius:10, marginBottom:16, fontSize:14 },
    grupo: { marginBottom:16 },
    label: { display:"block", color:"#94a3b8", fontSize:13, fontWeight:600, marginBottom:6 },
    input: { width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #334155", background:"#0f172a", color:"white", fontSize:14, boxSizing:"border-box" },
    btn: { width:"100%", padding:"13px", background:"linear-gradient(135deg,#0d9488,#0f766e)", color:"white", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 },
};
