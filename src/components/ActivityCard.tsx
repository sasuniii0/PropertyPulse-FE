interface ActivityCardProps {
  activity: string;
  time: string;
  onClick?: () => void;
}

const ActivityCard = ({ activity, time, onClick }: ActivityCardProps) => (
  <div
    onClick={onClick}
    className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer"
  >
    <div>
      <h4 className="font-semibold text-gray-900 text-sm">{activity}</h4>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);


export default ActivityCard;