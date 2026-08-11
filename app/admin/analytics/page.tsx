export default function AdminAnalyticsPage() {
  return (
    <div>

      <h1 className="text-4xl font-bold">
        Analytics
      </h1>


      <p className="mt-3 text-gray-600">
        Track event performance and revenue.
      </p>


      <div className="mt-10 grid md:grid-cols-3 gap-6">


        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="font-bold">
            Visitors
          </h2>

          <p className="text-3xl mt-3">
            0
          </p>
        </div>


        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="font-bold">
            Sales
          </h2>

          <p className="text-3xl mt-3">
            0
          </p>
        </div>


        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="font-bold">
            Revenue
          </h2>

          <p className="text-3xl mt-3">
            $0
          </p>
        </div>


      </div>

    </div>
  );
}