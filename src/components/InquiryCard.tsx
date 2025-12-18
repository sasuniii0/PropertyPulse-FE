interface InquiryCardProps {
  name: string;
  date: string;
  onView?: () => void;
}

const InquiryCard = ({ name, date, onView }: InquiryCardProps) => (
  <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-all">
    <div>
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-gray-500">Inquired {date}</p>
    </div>

    <button
      onClick={onView}
      className="text-sm font-medium text-teal-600 hover:underline"
    >
      View
    </button>
  </div>
);

export default InquiryCard;
