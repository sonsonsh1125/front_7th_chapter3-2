interface AdminToggleButtonProps {
  isAdmin: boolean;
  onClick: () => void;
}

export const AdminToggleButton: React.FC<AdminToggleButtonProps> = ({
  isAdmin,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        isAdmin
          ? "bg-gray-800 text-white"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
    </button>
  );
};


