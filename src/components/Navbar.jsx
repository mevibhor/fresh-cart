import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";
import { FiHome, FiShoppingBag, FiList } from "react-icons/fi";

import { CartContext } from "../context/Cart";

const navItems = [
  { to: "/", label: "Home", Icon: FiHome, end: true },
  { to: "/categories", label: "Categories", Icon: BiCategoryAlt },
  { to: "/bag", label: "Bag", Icon: FiShoppingBag },
  { to: "/orders", label: "Orders", Icon: FiList },
];

const Navbar = () => {
  const { cartItems } = useContext(CartContext);

  // Count all units, including multiple quantities of the same product.
  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 w-full border-b border-gray-100 bg-white shadow-sm">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full w-full max-w-7xl items-center justify-around px-4 font-default sm:px-6 lg:px-8"
      >
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex min-w-0 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? "text-[#3B82F6]"
                  : "text-gray-400 hover:text-gray-700"
              }`
            }
          >
            <span className="relative">
              <Icon className="text-2xl sm:text-3xl" aria-hidden="true" />

              {label === "Bag" && totalCartQuantity > 0 && (
                <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
                  {totalCartQuantity}
                </span>
              )}
            </span>

            <span className="text-[11px] sm:text-xs">{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
