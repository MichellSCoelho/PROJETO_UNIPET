import { useState, useEffect } from "react";
import api from "../api";

const cores = { URGENTE: "#ef4444", MODERADO: "#f59e0b", NORMAL: "#22c55e" };
const fundos = { URGENTE: "#fee2e2", MODERADO: "#fef3c7", NORMAL: "#dcfce7" };

// ── Impressão de Laudo PDF ────────────────────────────────────────────────────
function imprimirLaudo(t) {
    const html = `
    <html><head><title>Laudo UNIPET</title>
    <style>
      body{font-family:'Segoe UI',sans-serif;margin:40px;color:#1e293b}
      h1{color:#0d9488;font-size:22px;margin-bottom:4px}
      .sub{color:#64748b;font-size:12px;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      td{padding:8px 12px;border:1px solid #e2e8f0;font-size:13px}
      td:first-child{font-weight:600;background:#f8fafc;width:160px}
      .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
      .URGENTE{background:#fee2e2;color:#dc2626}
      .MODERADO{background:#fef3c7;color:#d97706}
      .NORMAL{background:#dcfce7;color:#16a34a}
      .box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:13px;line-height:1.6;margin-bottom:16px}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center}
    </style></head><body>
    <h1>🐾 UNIPET — Laudo de Triagem Veterinária</h1>
    <div class="sub">Gerado em ${new Date().toLocaleString("pt-BR")}</div>
    <table>
      <tr><td>Animal</td><td>${t.animal_nome} (${t.especie}${t.porte ? ", " + t.porte : ""})</td></tr>
      <tr><td>Tutor</td><td>${t.tutor_nome}${t.tutor_telefone ? " — " + t.tutor_telefone : ""}</td></tr>
      <tr><td>Data da Triagem</td><td>${new Date(t.criado_em).toLocaleString("pt-BR")}</td></tr>
      <tr><td>Temperatura</td><td>${t.temperatura ? t.temperatura + " °C" : "Não registrada"}</td></tr>
      <tr><td>Status</td><td>${t.status}</td></tr>
      <tr><td>Prioridade IA</td><td><span class="badge ${t.prioridade_ia}">${t.prioridade_ia}</span></td></tr>
    </table>
    <p style="font-weight:600;margin-bottom:8px">Sintomas Relatados</p>
    <div class="box">${t.sintomas}</div>
    <p style="font-weight:600;margin-bottom:8px">Avaliação da IA Veterinária</p>
    <div class="box">${t.justificativa_ia || "Sem justificativa registrada."}</div>
    <div class="footer">UNIPET — Sistema de Triagem Veterinária · Documento gerado automaticamente</div>
    </body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
}

// ── Modal Detalhes / Laudo ────────────────────────────────────────────────────
function ModalDetalhe({ triagem, onClose }) {
    if (!triagem) return null;
    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <div>
                        <div style={s.modalTitulo}>
                            {triagem.especie === "Gato" ? "🐱" : "🐾"} {triagem.animal_nome}
                        </div>
                        <div style={s.sub}>
                            {triagem.especie}{triagem.porte ? ` · ${triagem.porte}` : ""}
                        </div>
                    </div>
                    <button style={s.btnFechar} onClick={onClose}>✕</button>
                </div>
                <div style={s.modalBody}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                        {[
                            ["👤 Tutor", triagem.tutor_nome],
                            ["📞 Telefone", triagem.tutor_telefone || "—"],
                            ["📅 Data", new Date(triagem.criado_em).toLocaleString("pt-BR")],
                            ["🌡️ Temperatura", triagem.temperatura ? `${triagem.temperatura} °C` : "—"],
                        ].map(([k, v]) => (
                            <div key={k} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px" }}>
                                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>{k}</div>
                                <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 500 }}>{v}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <span style={{ ...s.badge, background: fundos[triagem.prioridade_ia], color: cores[triagem.prioridade_ia] }}>
                            {triagem.prioridade_ia}
                        </span>
                        <span style={{ ...s.badge, background: "#f1f5f9", color: "#475569" }}>
                            {triagem.status}
                        </span>
                    </div>
                    <div style={s.secao}>Sintomas Relatados</div>
                    <div style={s.boxTexto}>{triagem.sintomas}</div>
                    <div style={s.secao}>🤖 Avaliação da IA</div>
                    <div style={{ ...s.boxTexto, background: fundos[triagem.prioridade_ia] || "#f8fafc" }}>
                        {triagem.justificativa_ia || "Sem justificativa registrada."}
                    </div>
                    <button onClick={() => imprimirLaudo(triagem)} style={s.btnPDF}>
                        🖨️ Imprimir / Salvar como PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Modal Histórico do Animal ─────────────────────────────────────────────────
function ModalAnimal({ dados, onClose, onVerLaudo }) {
    if (!dados) return null;
    if (dados.loading) return (
        <div style={s.overlay} onClick={onClose}>
            <div style={{ ...s.modal, display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                <div style={{ color: "#64748b", fontSize: 15 }}>⏳ Carregando...</div>
            </div>
        </div>
    );
    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <div>
                        <div style={s.modalTitulo}>
                            {dados.animal?.especie === "Gato" ? "🐱" : "🐾"} {dados.animal?.nome}
                        </div>
                        <div style={s.sub}>
                            {dados.animal?.especie} · {dados.animal?.raca} · {dados.animal?.porte}
                            {dados.animal?.peso_kg ? ` · ${dados.animal.peso_kg}kg` : ""}
                        </div>
                        <div style={s.sub}>👤 {dados.animal?.tutor_nome} · {dados.animal?.tutor_telefone}</div>
                    </div>
                    <button style={s.btnFechar} onClick={onClose}>✕</button>
                </div>
                <div style={s.modalBody}>
                    <div style={s.secao}>📋 Histórico ({dados.triagens?.length || 0} registros)</div>
                    {dados.triagens?.length === 0 ? (
                        <div style={s.centro}>Nenhuma triagem registrada</div>
                    ) : dados.triagens?.map(t => (
                        <div key={t.id} style={{ ...s.item, borderLeft: `4px solid ${cores[t.prioridade_ia]}` }}>
                            <div style={s.itemTopo}>
                                <span style={{ ...s.badge, background: fundos[t.prioridade_ia], color: cores[t.prioridade_ia], fontSize: 11 }}>
                                    {t.prioridade_ia}
                                </span>
                                <span style={{ ...s.sub, marginLeft: "auto" }}>
                                    {new Date(t.criado_em).toLocaleString("pt-BR")}
                                </span>
                                <span style={{
                                    ...s.badge,
                                    background: t.status === "concluido" ? "#dcfce7" : "#fef3c7",
                                    color: t.status === "concluido" ? "#166534" : "#92400e", fontSize: 11
                                }}>
                                    {t.status}
                                </span>
                            </div>
                            <div style={{ fontSize: 14, color: "#334155", margin: "6px 0", lineHeight: 1.5 }}>{t.sintomas}</div>
                            <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", marginBottom: 8 }}>
                                🤖 {t.justificativa_ia}
                            </div>
                            {t.temperatura && (
                                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>🌡️ {t.temperatura}°C</div>
                            )}
                            <button
                                onClick={() => onVerLaudo({
                                    ...t,
                                    animal_nome: dados.animal?.nome,
                                    especie: dados.animal?.especie,
                                    porte: dados.animal?.porte,
                                    tutor_nome: dados.animal?.tutor_nome,
                                    tutor_telefone: dados.animal?.tutor_telefone,
                                })}
                                style={s.btnVerLaudo}>
                                📄 Ver Laudo / PDF
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Componente Principal ──────────────────────────────────────────────────────
export default function Historico() {
    const [triagens, setTriagens] = useState([]);
    const [total, setTotal] = useState(0);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({ busca: "", prioridade: "", dataInicio: "", dataFim: "" });
    const [animalModal, setAnimalModal] = useState(null);
    const [laudoModal, setLaudoModal] = useState(null);

    const carregar = async (p = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ pagina: p, limite: 20 });
            if (filtros.busca) params.append("busca", filtros.busca);
            if (filtros.prioridade) params.append("prioridade", filtros.prioridade);
            if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
            if (filtros.dataFim) params.append("dataFim", filtros.dataFim + "T23:59:59");
            const { data } = await api.get(`/triagens/historico?${params}`);
            setTriagens(data.triagens);
            setTotal(data.total);
            setTotalPaginas(data.totalPaginas);
            setPagina(p);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { carregar(); }, []);

    const verHistoricoAnimal = async (animalId) => {
        setAnimalModal({ loading: true });
        try {
            const { data } = await api.get(`/triagens/historico/animal/${animalId}`);
            setAnimalModal(data);
        } catch { setAnimalModal(null); }
    };

    const exportarCSV = () => {
        const header = "Animal,Espécie,Tutor,Telefone,Prioridade,Status,Temperatura,Sintomas,Data\n";
        const rows = triagens.map(t =>
            `"${t.animal_nome}","${t.especie}","${t.tutor_nome}","${t.tutor_telefone || ""}","${t.prioridade_ia}","${t.status}","${t.temperatura || ""}","${t.sintomas.replace(/"/g, '""')}","${new Date(t.criado_em).toLocaleString("pt-BR")}"`
        ).join("\n");
        const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `historico_unipet_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const limparFiltros = () => {
        const vazio = { busca: "", prioridade: "", dataInicio: "", dataFim: "" };
        setFiltros(vazio);
        carregar(1);
    };

    return (
        <div style={s.page}>
            {/* Modais — laudo tem prioridade sobre animal */}
            <ModalDetalhe triagem={laudoModal} onClose={() => setLaudoModal(null)} />
            {!laudoModal && (
                <ModalAnimal
                    dados={animalModal}
                    onClose={() => setAnimalModal(null)}
                    onVerLaudo={(t) => { setAnimalModal(null); setLaudoModal(t); }}
                />
            )}

            {/* Cabeçalho */}
            <div style={s.topBar}>
                <h2 style={s.titulo}>📁 Histórico de Atendimentos</h2>
                <button style={s.btnExportar} onClick={exportarCSV}>📥 Exportar CSV</button>
            </div>

            {/* Filtros */}
            <div style={s.filtros}>
                <input style={s.inputFiltro} placeholder="🔍 Buscar animal ou tutor..."
                    value={filtros.busca}
                    onChange={e => setFiltros({ ...filtros, busca: e.target.value })}
                    onKeyDown={e => e.key === "Enter" && carregar(1)} />
                <select style={s.inputFiltro} value={filtros.prioridade}
                    onChange={e => setFiltros({ ...filtros, prioridade: e.target.value })}>
                    <option value="">Todas as prioridades</option>
                    <option>URGENTE</option>
                    <option>MODERADO</option>
                    <option>NORMAL</option>
                </select>
                <input style={s.inputFiltro} type="date" value={filtros.dataInicio}
                    onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })} />
                <input style={s.inputFiltro} type="date" value={filtros.dataFim}
                    onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })} />
                <button style={s.btnFiltrar} onClick={() => carregar(1)}>Filtrar</button>
                <button style={s.btnLimpar} onClick={limparFiltros}>Limpar</button>
            </div>

            <div style={s.contador}>{total} atendimento(s) encontrado(s)</div>

            {/* Tabela */}
            <div style={s.card}>
                {loading ? (
                    <div style={s.centro}>⏳ Carregando...</div>
                ) : triagens.length === 0 ? (
                    <div style={s.centro}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>Nenhum atendimento concluído ainda</div>
                        <div style={{ fontSize: 13, marginTop: 4, color: "#94a3b8" }}>
                            Conclua atendimentos na Fila para vê-los aqui
                        </div>
                    </div>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                {["Animal", "Tutor", "Prioridade", "Sintomas", "Data", "Ações"].map(h => (
                                    <th key={h} style={s.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {triagens.map(t => (
                                <tr key={t.id} style={s.tr}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f0fdfa"}
                                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                                    <td style={s.td}>
                                        <div style={s.nome}>{t.animal_nome}</div>
                                        <div style={s.sub}>{t.especie}{t.porte ? ` · ${t.porte}` : ""}</div>
                                    </td>
                                    <td style={s.td}>
                                        <div style={{ fontSize: 14 }}>{t.tutor_nome}</div>
                                        <div style={s.sub}>{t.tutor_telefone}</div>
                                    </td>
                                    <td style={s.td}>
                                        <span style={{ ...s.badge, background: fundos[t.prioridade_ia], color: cores[t.prioridade_ia] }}>
                                            {t.prioridade_ia}
                                        </span>
                                    </td>
                                    <td style={{ ...s.td, maxWidth: 220 }}>
                                        <div style={s.sintomas}>{t.sintomas}</div>
                                    </td>
                                    <td style={s.td}>
                                        <div style={{ fontSize: 13 }}>{new Date(t.criado_em).toLocaleDateString("pt-BR")}</div>
                                        <div style={s.sub}>{new Date(t.criado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
                                    </td>
                                    <td style={s.td}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                            <button style={s.btnVer} onClick={() => setLaudoModal(t)}>
                                                📄 Laudo / PDF
                                            </button>
                                            <button style={s.btnAnimal} onClick={() => verHistoricoAnimal(t.animal_id)}>
                                                🐾 Ver Animal
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
                <div style={s.paginacao}>
                    <button style={s.btnPag} disabled={pagina === 1} onClick={() => carregar(pagina - 1)}>← Anterior</button>
                    <span style={{ fontSize: 14, color: "#475569" }}>Página {pagina} de {totalPaginas}</span>
                    <button style={s.btnPag} disabled={pagina === totalPaginas} onClick={() => carregar(pagina + 1)}>Próxima →</button>
                </div>
            )}
        </div>
    );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const s = {
    page: { padding: 24, fontFamily: "'Segoe UI',sans-serif" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    titulo: { color: "#0f172a", fontSize: 22, margin: 0, fontWeight: 700 },
    btnExportar: { padding: "9px 18px", background: "#0d9488", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 },
    filtros: { display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" },
    inputFiltro: { padding: "9px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", background: "white" },
    btnFiltrar: { padding: "9px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 },
    btnLimpar: { padding: "9px 18px", background: "#e2e8f0", color: "#475569", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 },
    contador: { fontSize: 13, color: "#64748b", marginBottom: 12 },
    card: { background: "white", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" },
    centro: { padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 15 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#64748b", textAlign: "left", borderBottom: "1px solid #e2e8f0" },
    tr: { borderBottom: "1px solid #f1f5f9", background: "white" },
    td: { padding: "14px 16px", verticalAlign: "top" },
    nome: { fontWeight: 700, fontSize: 14, color: "#0f172a" },
    sub: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
    badge: { padding: "3px 10px", borderRadius: 999, fontWeight: 700, fontSize: 12 },
    sintomas: { fontSize: 13, color: "#475569", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
    btnVer: { padding: "6px 12px", background: "#0d9488", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" },
    btnAnimal: { padding: "6px 12px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" },
    btnVerLaudo: { padding: "6px 14px", background: "#0d9488", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12 },
    paginacao: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 },
    btnPag: { padding: "8px 18px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 14 },
    overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
    modal: { background: "white", borderRadius: 20, width: "100%", maxWidth: 620, maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
    modalHeader: { padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "sticky", top: 0, background: "white", zIndex: 1 },
    modalTitulo: { fontSize: 20, fontWeight: 800, color: "#0f172a" },
    modalBody: { padding: "20px 24px" },
    btnFechar: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8", padding: 4 },
    secao: { fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 },
    boxTexto: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#334155", lineHeight: 1.6, marginBottom: 16 },
    item: { background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 10 },
    itemTopo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" },
    btnPDF: { width: "100%", background: "#0f172a", color: "white", border: "none", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 },
};
