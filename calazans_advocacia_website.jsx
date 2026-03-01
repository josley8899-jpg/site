import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Scale } from "lucide-react";
import { motion } from "framer-motion";

export default function CalazansAdvocacia() {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    mensagem: "",
    consentimento: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consentimento) return;
    const mensagem = encodeURIComponent(
      `Olá, meu nome é ${form.nome}. Telefone: ${form.telefone}. ${form.mensagem}`
    );
    window.open(`https://wa.me/5581973175993?text=${mensagem}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#081420] text-white font-light tracking-wide">
      <section className="relative py-32 px-6 text-center bg-gradient-to-br from-[#081420] via-[#0B1C2D] to-[#102A43] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="flex justify-center mb-8 text-[#D4AF37]">
            <Scale className="w-16 h-16" />
          </div>
          <h1 className="text-6xl font-semibold mb-6 text-[#D4AF37] tracking-widest">
            CALAZANS ADVOCACIA
          </h1>
          <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mb-8" />
          <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-300 leading-relaxed">
            Excelência técnica, postura estratégica e atendimento personalizado
            para clientes que exigem segurança jurídica e discrição profissional.
          </p>
          <a
            href="https://wa.me/5581973175993?text=Olá,%20gostaria%20de%20agendar%20um%20atendimento%20com%20a%20Calazans%20Advocacia."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="rounded-none px-12 py-6 text-base bg-[#D4AF37] text-[#081420] hover:bg-[#c9a227] transition-all duration-300 shadow-2xl">
              Agendar Atendimento
            </Button>
          </a>
        </motion.div>
      </section>

      <section className="py-28 px-6 bg-[#0B1C2D] border-t border-[#D4AF37]/20">
        <h2 className="text-5xl font-semibold text-center mb-20 text-[#D4AF37] tracking-wide">
          Áreas de Atuação
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {[
            {
              title: "Direito Trabalhista",
              desc:
                "Atuação estratégica em reclamações trabalhistas, verbas rescisórias e defesa empresarial de alta complexidade.",
            },
            {
              title: "Direito Previdenciário",
              desc:
                "Planejamento previdenciário, concessão e revisão de aposentadorias e benefícios por incapacidade.",
            },
            {
              title: "Direito de Família",
              desc:
                "Condução técnica e sigilosa em divórcios, guarda, pensão e inventários.",
            },
          ].map((area) => (
            <Card
              key={area.title}
              className="rounded-none bg-gradient-to-b from-[#0E2236] to-[#0B1C2D] border border-[#D4AF37]/30 shadow-2xl hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-all duration-500"
            >
              <CardContent className="p-10">
                <h3 className="text-2xl font-semibold mb-6 text-[#D4AF37] tracking-wide">
                  {area.title}
                </h3>
                <div className="w-12 h-[2px] bg-[#D4AF37] mb-6" />
                <p className="text-gray-300 leading-relaxed">{area.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-28 px-6 bg-[#081420] border-t border-[#D4AF37]/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-semibold mb-12 text-[#D4AF37] tracking-wide">
            Sobre o Escritório
          </h2>
          <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mb-12" />
          <p className="text-xl text-gray-300 leading-loose">
            A Calazans Advocacia é estruturada sob padrões de excelência,
            priorizando análise estratégica, atuação técnica rigorosa e
            relacionamento pautado na confiança. Cada demanda é tratada com
            confidencialidade e dedicação integral.
          </p>
        </div>
      </section>

      <section className="py-28 px-6 bg-[#0B1C2D] border-t border-[#D4AF37]/20">
        <h2 className="text-5xl font-semibold text-center mb-20 text-[#D4AF37] tracking-wide">
          Contato
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto grid gap-8 bg-gradient-to-b from-[#0E2236] to-[#0B1C2D] p-12 border border-[#D4AF37]/30 shadow-2xl"
        >
          <Input
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            required
            className="bg-white text-black rounded-none"
          />
          <Input
            name="telefone"
            placeholder="Telefone / WhatsApp"
            value={form.telefone}
            onChange={handleChange}
            required
            className="bg-white text-black rounded-none"
          />
          <Input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-white text-black rounded-none"
          />
          <Textarea
            name="mensagem"
            placeholder="Descreva brevemente seu caso"
            rows={5}
            value={form.mensagem}
            onChange={handleChange}
            required
            className="bg-white text-black rounded-none"
          />
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <input
              type="checkbox"
              name="consentimento"
              checked={form.consentimento}
              onChange={handleChange}
              required
              className="mt-1 accent-[#D4AF37]"
            />
            <p>
              Autorizo o tratamento de meus dados pessoais para contato e
              análise preliminar do caso, nos termos da Lei 13.709/2018.
            </p>
          </div>
          <Button
            type="submit"
            className="rounded-none py-6 text-base bg-[#D4AF37] text-[#081420] hover:bg-[#c9a227] transition-all duration-300"
          >
            Enviar Solicitação
          </Button>
        </form>

        <div className="mt-20 text-center space-y-6 text-gray-400">
          <div className="flex justify-center items-center gap-3">
            <Phone className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-lg">(81) 97317-5993</span>
          </div>
          <div className="flex justify-center items-center gap-3">
            <Mail className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-lg">contato@calazansadvocacia.com.br</span>
          </div>
          <p className="text-lg">Av. Exemplo, 123 - Boa Viagem, Recife - PE</p>
        </div>

        <div className="mt-20 max-w-5xl mx-auto border border-[#D4AF37]/30 shadow-2xl">
          <iframe
            title="Mapa Calazans Advocacia"
            src="https://www.google.com/maps?q=Boa+Viagem,+Recife,+PE&output=embed"
            className="w-full h-[450px]"
            loading="lazy"
          />
        </div>
      </section>

      <a
        href="https://wa.me/5581973175993?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informações."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50"
      >
        <Button className="rounded-none px-8 py-6 shadow-2xl bg-[#D4AF37] text-[#081420] hover:bg-[#c9a227] transition-all duration-300">
          WhatsApp
        </Button>
      </a>

      <footer className="bg-[#050D16] py-10 text-center text-sm text-gray-500 border-t border-[#D4AF37]/20 tracking-wider">
        © {new Date().getFullYear()} Calazans Advocacia — Todos os direitos reservados.
      </footer>
    </div>
  );
}
