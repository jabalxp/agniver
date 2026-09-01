import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { auth } from '../lib/firebase';

const Navbar = () => {
  const { cartCount } = useCart();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
      setShowMenu(false);
      navigate('/');
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl text-lime-goro font-space uppercase tracking-tighter font-black border-b border-white/10 shadow-[0_0_20px_rgba(204,255,0,0.15)] flex justify-between items-center px-8 h-20">
      <Link to="/" className="text-2xl font-black italic tracking-tighter text-lime-goro">
        Goró da Mansão
      </Link>
      
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/collection" className="text-white/80 hover:text-lime-goro transition-colors transition-transform scale-95 active:scale-90">Shop</Link>
        <Link to="/harm-reduction" className="text-white/80 hover:text-lime-goro transition-colors transition-transform scale-95 active:scale-90">Redução de Danos</Link>
        <Link to="/mansao" className="text-white/80 hover:text-lime-goro transition-colors transition-transform scale-95 active:scale-90">Mansão</Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/checkout" className="relative text-white/80 hover:text-lime-goro transition-colors">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-error text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full border-2 border-lime-goro flex items-center justify-center text-lime-goro font-bold hover:bg-lime-goro hover:text-black transition-all"
            >
              {getInitials(user.name)}
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-4 w-48 glass-border bg-[#121212] py-2 shadow-2xl">
                <div className="px-4 py-2 border-b border-white/10 mb-2">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">Logado como</p>
                  <p className="text-white text-sm truncate font-bold">{user.name}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-white/5 transition-colors font-bold uppercase"
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-white/80 hover:text-lime-goro transition-colors">
            <User size={24} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
