import React from "react";

export default function Admin() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#222",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#0070f3" }}>
        Painel Administrativo
      </h1>

      <p style={{ maxWidth: "600px", fontSize: "1.1rem", marginTop: "1rem" }}>
        Bem-vindo ao painel administrativo do <b>AdNewsHub</b>!  
        Aqui você poderá gerenciar anúncios, acompanhar estatísticas e realizar configurações da plataforma.
      </p>

      <a
        href="/"
        style={{
          marginTop: "2rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          padding: "0.8rem 1.6rem",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Voltar à Página Inicial
      </a>
    </div>
  );
}
