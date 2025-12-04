interface LogoProps {
  text?: string;
}

export const Logo: React.FC<LogoProps> = ({ text = "SHOP" }) => {
  return <h1 className="text-xl font-semibold text-gray-800">{text}</h1>;
};


