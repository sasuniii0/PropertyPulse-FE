interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  onClick?: () => void;
}

const ActionCard = ({ icon, title, desc, color, onClick }: ActionCardProps) => (
  <div
    className="bg-white p-3 rounded-lg shadow border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div
      className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <h3 className="font-semibold text-gray-800 text-sm mb-1">{title}</h3>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

export default ActionCard;
