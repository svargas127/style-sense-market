
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X 
} from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const navbarClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled 
      ? "bg-white shadow-md py-2" 
      : "bg-transparent py-4"
  }`;

  return (
    <>
      <div className="h-20"></div>
      <nav className={navbarClasses}>
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            StyleSense
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Home
            </Link>
            <Link to="/products?gender=men" className="hover:text-gray-600 transition-colors">
              Men
            </Link>
            <Link to="/products?gender=women" className="hover:text-gray-600 transition-colors">
              Women
            </Link>
            <Link to="/products" className="hover:text-gray-600 transition-colors">
              Shop All
            </Link>
          </div>

          {/* Search, Cart, and User */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search..."
                className="w-40 lg:w-60 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </form>

            <Link to="/cart" className="relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </div>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={handleProfileClick} className="p-2">
                <User size={24} />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </div>
              )}
            </Link>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-50">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </form>

              <Link to="/" className="py-2 border-b border-gray-100">
                Home
              </Link>
              <Link to="/products?gender=men" className="py-2 border-b border-gray-100">
                Men
              </Link>
              <Link to="/products?gender=women" className="py-2 border-b border-gray-100">
                Women
              </Link>
              <Link to="/products" className="py-2 border-b border-gray-100">
                Shop All
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="py-2 border-b border-gray-100">
                    Profile
                  </Link>
                  <Link to="/orders" className="py-2 border-b border-gray-100">
                    Orders
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={logout} 
                    className="py-2 text-left w-full justify-start"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" className="py-2">
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
