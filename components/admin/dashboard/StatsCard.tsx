export default function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">

      <div>
        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          {value}
        </h2>
      </div>


      <div className="text-4xl">
        {icon}
      </div>

    </div>
  );
}