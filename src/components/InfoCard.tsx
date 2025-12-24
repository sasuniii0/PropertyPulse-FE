// Reusable InfoCard component
const InfoCard = ({ label, value }: { label: string; value: string | number | string[] }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    {Array.isArray(value) ? (
      <div className="flex flex-wrap gap-2">
        {value.map((v, i) => (
          <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-xs">{v}</span>
        ))}
      </div>
    ) : (
      <p className="text-lg font-medium text-gray-900">{value}</p>
    )}
  </div>
);

export default InfoCard