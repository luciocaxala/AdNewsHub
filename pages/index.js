import React from "react";

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        color: "#222",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#0070f3" }}>
        AdNewsHub
      </h1>

      <p style={{ maxWidth: "600px", fontSize: "1.2rem", marginBottom: "2rem" }}>
        Plataforma global de anúncios digitais. Promova serviços, alcance novos
        públicos e gere receita com tecnologia e automação em tempo real.
      </p>

      <a
        href="/admin.jsx"
        style={{
          backgroundColor: "#0070f3",
          color: "#fff",
          padding: "0.8rem 1.6rem",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          transition: "background 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "#005bb5")
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = "#0070f3")
        }
      >
        Acessar Painel Administrativo
      </a>

      <footer
        style={{ marginTop: "3rem", fontSize: "0.9rem", color: "#555" }}
      >
        © {new Date().getFullYear()} AdNewsHub — Todos os direitos reservados
      </footer>
    </div>
  );
}
