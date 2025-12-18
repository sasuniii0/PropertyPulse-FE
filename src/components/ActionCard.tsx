interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  onClick?: () => void;
}

const ActionCard = ({ icon, title, desc, color, onClick }: ActionCardProps) => (
  <div
    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

export default ActionCard;
