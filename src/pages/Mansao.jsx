const Mansao = () => {
  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop bg-surface min-h-screen">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-bold text-lime-goro tracking-widest block mb-4 uppercase">THE LEGEND</span>
            <h1 className="font-space text-6xl md:text-7xl uppercase text-primary font-bold leading-none mb-8">
              A Mansão <br />
              <span className="text-lime-goro italic">Maromba</span>
            </h1>
            <p className="text-xl text-on-surface-variant mb-8 leading-relaxed">
              O que começou como um sonho de "vencer o sistema" tornou-se o maior hub de entretenimento, lifestyle e performance do Brasil. Sob o comando do Toguro, a Mansão Maromba é onde o esforço encontra a recompensa.
            </p>
            <p className="text-xl text-on-surface-variant mb-8 leading-relaxed">
              O Goró da Mansão nasceu da necessidade de um drink que representasse essa energia. Sem os efeitos colaterais dos energéticos comuns, nosso mix é feito para quem vive intensamente cada segundo.
            </p>
            <div className="p-6 border-l-4 border-lime-goro bg-white/5 italic text-2xl font-space text-primary">
              "Não é só um drink, é um estado de espírito. É a prova de que a gente pode chegar no topo sem perder a essência." - Toguro
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-lime-goro/20 blur-3xl opacity-30"></div>
            <img
              className="relative w-full rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border border-white/10"
              src="/assets/toguro.png"
              alt="Toguro Mansão Maromba"
            />
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-5xl font-space font-bold text-lime-goro mb-2">10M+</h3>
            <p className="font-bold uppercase tracking-widest text-on-surface-variant">Seguidores</p>
          </div>
          <div>
            <h3 className="text-5xl font-space font-bold text-lime-goro mb-2">100%</h3>
            <p className="font-bold uppercase tracking-widest text-on-surface-variant">Independente</p>
          </div>
          <div>
            <h3 className="text-5xl font-space font-bold text-lime-goro mb-2">∞</h3>
            <p className="font-bold uppercase tracking-widest text-on-surface-variant">Vibração</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mansao;
