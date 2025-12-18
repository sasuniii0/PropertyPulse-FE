interface StatCardProps {
  label: string;
  value: string | number;
  onClick?: () => void;
}

const StatCard = ({ label, value, onClick }: StatCardProps) => (
  <div
    onClick={onClick}
    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
  >
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
  </div>
);

export default StatCard;
