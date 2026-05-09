const Footer = () => {
  return (
    <footer className="bg-[#050505] w-full border-t border-white/5 py-12 border-t border-white/10 font-inter text-xs tracking-widest uppercase">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-black text-lime-goro mb-4">GORÓ DA MANSÃO</div>
          <p className="text-gray-500 normal-case tracking-normal mb-6">A Mansão é mais que um lugar, é um estado de espírito. Goró é o combustível para essa jornada. Beba com sabedoria.</p>
          <div className="flex gap-4">
            <a className="text-white hover:text-lime-goro transition-colors" href="#">Política de Privacidade</a>
            <a className="text-white hover:text-lime-goro transition-colors" href="#">Termos de Serviço</a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold mb-2">LINKS RÁPIDOS</h4>
          <a className="text-gray-500 hover:text-white transition-colors" href="#">Política de Privacidade</a>
          <a className="text-gray-500 hover:text-white transition-colors" href="#">Termos de Serviço</a>
          <a className="text-gray-500 hover:text-white transition-colors" href="#">Consumo Responsável</a>
          <a className="text-gray-500 hover:text-white transition-colors" href="#">Contato</a>
        </div>
        <div className="flex flex-col justify-end items-end">
          <div className="text-right text-gray-500 opacity-80 hover:opacity-100 transition-opacity">© 2024 GORÓ DA MANSÃO. BEBA COM MODERAÇÃO.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
