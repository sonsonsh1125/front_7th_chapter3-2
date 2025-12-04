import { Logo } from "./Logo";
import { SearchInput } from "./SearchInput";
import { AdminToggleButton } from "./AdminToggleButton";
import { CartBadge } from "./CartBadge";

interface HeaderProps {
  isAdmin: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  searchTerm,
  onSearchChange,
  onToggleAdmin,
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <Logo />
            {!isAdmin && (
              <SearchInput value={searchTerm} onChange={onSearchChange} />
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <AdminToggleButton isAdmin={isAdmin} onClick={onToggleAdmin} />
            {!isAdmin && <CartBadge />}
          </nav>
        </div>
      </div>
    </header>
  );
};
