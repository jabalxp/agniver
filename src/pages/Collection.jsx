import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingCart, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Collection = () => {
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
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop bg-surface min-h-screen">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <span className="font-bold text-lime-goro tracking-widest block mb-4 uppercase">OS ENERGÉTICOS DA MANSÃO</span>
          <h1 className="font-space text-5xl md:text-6xl uppercase text-primary font-bold">Catálogo Goró</h1>
          <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto">
            A linha completa desenvolvida pelo Toguro. Performance, foco e o sabor que venceu o sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
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
                  <h4 className="text-lime-goro font-bold uppercase text-xs mb-4 tracking-widest">Fórmula e Ingredientes</h4>
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
    </div>
  );
};

export default Collection;
