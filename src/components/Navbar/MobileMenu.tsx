import { X, Search, Megaphone, Bell, HelpCircle } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div className="fixed top-0 right-0 h-full w-64 bg-[#1D2125] z-50 shadow-2xl md:hidden transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3A3F44]">
          <span className="text-sm font-semibold text-gray-200">Menu</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2C2F33] rounded-md transition-colors"
          >
            <X size={20} className="text-gray-300" />
          </button>
        </div>

        {/* Search (Mobile) */}
        <div className="p-4">
          <div className="flex items-center bg-[#2C2F33] rounded-md px-3 py-2 border border-[#3A3F44]">
            <Search size={16} className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full text-sm text-gray-300 placeholder-gray-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2C2F33] transition-colors text-left">
            <Megaphone size={18} className="text-gray-300" />
            <span className="text-sm text-gray-200">Announcements</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2C2F33] transition-colors text-left">
            <Bell size={18} className="text-gray-300" />
            <span className="text-sm text-gray-200">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2C2F33] transition-colors text-left">
            <HelpCircle size={18} className="text-gray-300" />
            <span className="text-sm text-gray-200">Help</span>
          </button>
        </div>
      </div>
    </>
  );
}
