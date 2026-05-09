import { ShieldCheck, Droplets, Utensils, ZapOff } from 'lucide-react';

const HarmReduction = () => {
  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop bg-surface min-h-screen">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <span className="font-bold text-lime-goro tracking-widest block mb-4 uppercase">RESPONSIBLE PARTYING</span>
          <h1 className="font-space text-5xl md:text-6xl uppercase text-primary font-bold">Redução de Danos</h1>
          <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto">
            Na Mansão Maromba, a festa é séria, mas a saúde é prioridade. Aprenda a curtir o Goró com consciência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-border p-8 bg-white/5 backdrop-blur-xl">
            <Droplets className="text-lime-goro mb-6" size={48} />
            <h3 className="font-space text-3xl text-primary uppercase mb-4 font-bold">Intercale com Água</h3>
            <p className="text-on-surface-variant">
              O segredo do Toguro para aguentar o sistema: para cada Goró, beba 500ml de água. Isso mantém seu corpo hidratado e evita o "crash" no dia seguinte.
            </p>
          </div>

          <div className="glass-border p-8 bg-white/5 backdrop-blur-xl">
            <Utensils className="text-lime-goro mb-6" size={48} />
            <h3 className="font-space text-3xl text-primary uppercase mb-4 font-bold">Não Beba em Jejum</h3>
            <p className="text-on-surface-variant">
              A alimentação é a base de tudo. Coma algo sólido antes de começar a festa. O Goró bate melhor e seu estômago agradece.
            </p>
          </div>

          <div className="glass-border p-8 bg-white/5 backdrop-blur-xl">
            <ZapOff className="text-lime-goro mb-6" size={48} />
            <h3 className="font-space text-3xl text-primary uppercase mb-4 font-bold">Respeite seu Limite</h3>
            <p className="text-on-surface-variant">
              Conheça seu corpo. Se sentir cansaço ou qualquer desconforto, pare, descanse e foque na hidratação. A Mansão valoriza a longevidade.
            </p>
          </div>

          <div className="glass-border p-8 bg-white/5 backdrop-blur-xl">
            <ShieldCheck className="text-lime-goro mb-6" size={48} />
            <h3 className="font-space text-3xl text-primary uppercase mb-4 font-bold">Fórmula Segura</h3>
            <p className="text-on-surface-variant">
              Nosso Goró é desenvolvido para satisfazer sem os danos dos estimulantes sintéticos pesados. É a evolução da diversão.
            </p>
          </div>
        </div>

        <div className="mt-20 p-8 bg-lime-goro text-black text-center">
          <h2 className="font-space text-4xl font-bold uppercase mb-4">"Venceu o Sistema quem bebe água!"</h2>
          <p className="font-bold">#MansãoMaromba #Responsabilidade</p>
        </div>
      </div>
    </div>
  );
};

export default HarmReduction;
