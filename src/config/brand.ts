// Identidade visual do Marvin Atende.
export const brand = {
  name: "Marvin Atende",
  tagline: "Atendimento inteligente para WhatsApp",
  primary: "#F15A0A",
  primaryOklch: "0.66 0.19 42",
};

// Cada clone configura o próprio suporte sem herdar o número do projeto original.
export const supportWhatsapp = String(import.meta.env.VITE_SUPPORT_WHATSAPP || "").replace(/\D/g, "");
export const supportConfigured = supportWhatsapp.length >= 10;
export const supportWhatsappUrl = supportConfigured ? `https://wa.me/${supportWhatsapp}` : "/";
export const supportWhatsappDisplay = supportConfigured
  ? String(import.meta.env.VITE_SUPPORT_WHATSAPP_DISPLAY || supportWhatsapp)
  : "";
