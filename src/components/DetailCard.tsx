const DetailCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-medium text-gray-900">{value}</p>
  </div>
);

export default DetailCard;