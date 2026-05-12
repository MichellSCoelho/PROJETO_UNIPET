import { useState, useEffect } from "react";
import api from "../api";

const cores = { URGENTE:"#ef4444", MODERADO:"#f59e0b", NORMAL:"#22c55e" };
const fundos = { URGENTE:"#fee2e2", MODERADO:"#fef3c7", NORMAL:"#dcfce7" };

export default function Fila() {
    const [fila, setFila] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregar = async () => {
        try {
            const { data } = await api.get("/triagens/fila");
            setFila(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        carregar();
        const interval = setInterval(carregar, 15000);
        return () => clearInterval(interval);
    }, []);

    const atualizarStatus = async (id, status) => {
        try {
            await api.put(`/triagens/${id}/status`, { status });
            carregar();
        } catch (err) {
            alert("Erro ao atualizar status.");
        }
    };

    if (loading) return <div style={styles.loading}>Carregando fila...</div>;

    return (
        <div style={styles.page}>
            <h2 style={styles.titulo}>📋 Fila de Atendimento</h2>
            {fila.length === 0 && (
                <div style={styles.vazio}>✨ Nenhum paciente na fila no momento</div>
            )}
            {fila.map((t, i) => (
                <div key={t.id} style={{...styles.card, borderLeft:`5px solid ${cores[t.prioridade]}`}}>
                    <div style={styles.topo}>
                        <span style={{...styles.badge, background:fundos[t.prioridade], color:cores[t.prioridade]}}>
                            {t.prioridade}
                        </span>
                        <span style={styles.pos}>#{i + 1}</span>
                    </div>
                    <div style={styles.animal}>{t.animal_nome}</div>
                    <div style={styles.info}>{t.especie} · {t.porte} · Tutor: {t.tutor_nome}</div>
                    <div style={styles.sintomas}>{t.sintomas}</div>
                    <div style={styles.justificativa}>🤖 {t.justificativa_ia}</div>
                    <div style={styles.acoes}>
                        {t.status === "aguardando" && (
                            <button style={styles.btnChamar}
                                onClick={() => atualizarStatus(t.id, "em_atendimento")}>
                                📢 Chamar
                            </button>
                        )}
                        {t.status === "em_atendimento" && (
                            <>
                                <span style={styles.emAtendimento}>● Em atendimento</span>
                                <button style={styles.btnConcluir}
                                    onClick={() => atualizarStatus(t.id, "concluido")}>
                                    ✅ Concluir
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

const styles = {
    page: { padding:24 },
    titulo: { color:"#0f172a", marginBottom:20, fontSize:22 },
    loading: { padding:40, textAlign:"center", color:"#94a3b8" },
    vazio: { textAlign:"center", padding:60, color:"#94a3b8", fontSize:16 },
    card: { background:"white", borderRadius:14, padding:20, marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
    topo: { display:"flex", justifyContent:"space-between", marginBottom:10 },
    badge: { padding:"4px 12px", borderRadius:999, fontWeight:700, fontSize:12 },
    pos: { color:"#94a3b8", fontWeight:700 },
    animal: { fontSize:18, fontWeight:800, color:"#0f172a", marginBottom:4 },
    info: { fontSize:13, color:"#64748b", marginBottom:8 },
    sintomas: { fontSize:14, color:"#334155", marginBottom:8, lineHeight:1.5 },
    justificativa: { fontSize:13, color:"#64748b", fontStyle:"italic", marginBottom:12 },
    acoes: { display:"flex", alignItems:"center", gap:10 },
    btnChamar: { padding:"8px 18px", background:"#0d9488", color:"white", border:"none", borderRadius:8, fontWeight:700, cursor:"pointer" },
    btnConcluir: { padding:"8px 18px", background:"#22c55e", color:"white", border:"none", borderRadius:8, fontWeight:700, cursor:"pointer" },
    emAtendimento: { color:"#0d9488", fontWeight:700, fontSize:13 },
};
