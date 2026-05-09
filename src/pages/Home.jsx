import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingCart, Zap, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [activeIngredients, setActiveIngredients] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="mt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden px-margin-mobile md:px-margin-desktop">
        <div className="absolute inset-0 hero-gradient -z-10"></div>
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center w-full">
          <div className="z-10 text-center lg:text-left">
            <h1 className="font-space text-7xl md:text-8xl uppercase mb-stack-md text-primary leading-none font-bold">
              ENERGIA QUE <br />
              <span className="text-lime-goro drop-shadow-[0_0_15px_rgba(204,255,0,0.4)]">VENCE O</span> <br />
              SISTEMA
            </h1>
            <p className="font-inter text-xl text-on-surface-variant max-w-xl mx-auto lg:mx-0 mb-stack-lg">
              Os energéticos oficiais da Mansão Maromba. Fórmulas potentes com ingredientes selecionados pelo Toguro para sua melhor performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-stack-md justify-center lg:justify-start">
              <Link to="/collection" className="bg-lime-goro text-black font-bold px-10 py-5 rounded-none uppercase transition-all glow-lime hover:scale-105 active:scale-95 text-center">
                Ver Catálogo
              </Link>
              <Link to="/mansao" className="border border-secondary-container text-secondary-container font-bold px-10 py-5 rounded-none uppercase hover:bg-secondary-container/10 transition-all active:scale-95 text-center">
                A Mansão
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center items-center h-[500px] lg:h-[700px]">
            <div className="absolute inset-0 bg-gradient-to-t from-lime-goro/20 to-transparent blur-3xl opacity-30"></div>
            <img 
              className="relative z-10 h-full w-auto object-contain drop-shadow-[0_0_50px_rgba(204,255,0,0.2)]" 
              src="https://acdn-us.mitiendanube.com/stores/004/048/852/products/img-20250113-wa0055-b81be437b87f0596c317367908684473-1024-1024.webp" 
              alt="Goró Original" 
            />
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="font-bold text-lime-goro tracking-widest block mb-4 uppercase">OS ORIGINAIS</span>
              <h2 className="font-space text-5xl uppercase text-primary font-bold">Energéticos Mansão</h2>
            </div>
            <Link to="/collection" className="font-bold text-lime-goro border-b border-lime-goro pb-1 hover:text-white hover:border-white transition-colors hidden md:block uppercase">Explorar tudo</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map(product => (
              <div key={product.id} className="group glass-border bg-white/5 p-6 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                <div className="aspect-square mb-6 overflow-hidden bg-surface-container-highest relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={product.image} 
                    alt={product.title} 
                  />
                  {product.tag && (
                    <div className="absolute top-4 right-4 bg-black text-lime-goro font-bold text-[10px] px-3 py-1 border border-lime-goro uppercase">
                      {product.tag}
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIngredients(activeIngredients === product.id ? null : product.id);
                    }}
                    className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-lime-goro hover:text-black transition-all"
                  >
                    <Info size={16} />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-space text-2xl uppercase mb-1 font-bold text-primary">{product.title}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2">{product.description}</p>
                </div>

                {activeIngredients === product.id && (
                  <div className="absolute inset-0 bg-black/95 p-8 flex flex-col justify-center animate-in fade-in duration-300">
                    <button 
                      onClick={() => setActiveIngredients(null)}
                      className="absolute top-4 right-4 text-lime-goro font-bold uppercase text-xs"
                    >
                      Fechar
                    </button>
                    <h4 className="text-lime-goro font-bold uppercase text-xs mb-4 tracking-widest">Ingredientes</h4>
                    <p className="text-white text-sm leading-relaxed font-inter">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="font-space text-2xl text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-lime-goro p-2 rounded-none hover:scale-110 transition-transform"
                  >
                    <ShoppingCart className="text-black" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
