import { useCart } from '../context/CartContext';
import { Trash2, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="pt-48 pb-24 text-center min-h-screen bg-surface">
        <h1 className="font-space text-4xl uppercase text-primary font-bold mb-8">Seu carrinho está vazio</h1>
        <Link to="/collection" className="bg-lime-goro text-black font-bold px-10 py-4 uppercase glow-lime">
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop bg-surface min-h-screen">
      <div className="max-w-container-max mx-auto">
        <h1 className="font-space text-5xl uppercase text-primary font-bold mb-12">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="glass-border p-6 bg-white/5 flex items-center gap-6">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover" />
                <div className="flex-1">
                  <h3 className="font-space text-xl uppercase font-bold text-primary">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-space text-xl font-bold text-primary mb-2">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-error hover:text-error/80 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
              <div className="text-center p-6 border border-white/10 rounded-xl">
                <Truck className="mx-auto text-lime-goro mb-4" size={32} />
                <p className="text-xs uppercase font-bold text-on-surface-variant">Frete Grátis</p>
              </div>
              <div className="text-center p-6 border border-white/10 rounded-xl">
                <CreditCard className="mx-auto text-lime-goro mb-4" size={32} />
                <p className="text-xs uppercase font-bold text-on-surface-variant">Parcelamento</p>
              </div>
              <div className="text-center p-6 border border-white/10 rounded-xl">
                <ShieldCheck className="mx-auto text-lime-goro mb-4" size={32} />
                <p className="text-xs uppercase font-bold text-on-surface-variant">Compra Segura</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass-border p-8 bg-surface-container h-fit sticky top-32">
            <h2 className="font-space text-2xl uppercase font-bold text-primary mb-8 border-b border-white/10 pb-4">Resumo do Pedido</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-primary font-bold">R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Frete</span>
                <span className="text-lime-goro font-bold">GRÁTIS</span>
              </div>
              <div className="flex justify-between text-2xl font-space font-bold border-t border-white/10 pt-4 mt-4">
                <span className="text-primary">TOTAL</span>
                <span className="text-lime-goro">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-lime-goro text-black font-bold py-5 uppercase glow-lime hover:scale-[1.02] active:scale-95 transition-all mb-4">
              Pagar com Cartão / PIX
            </button>
            <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">
              Ambiente criptografado e seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
