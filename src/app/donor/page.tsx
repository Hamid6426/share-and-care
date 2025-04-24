import Link from "next/link";

export default function DonorDashboardOverview() {
  return (
      <div className="flex justify-center mt-4">
        <Link href="/donor/my-listing" className="text-sm mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          My Listings
        </Link>
        <Link href="/donor/accepted-items" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Accepted Items
        </Link>
        <Link href="/donor/rejected-items" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Rejected Items
        </Link>
        <Link href="/donor/inactive-items" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          In-Active Items
        </Link>
        <Link href="/donor/requested-items" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Requested Items
        </Link>
      </div>
  );
}
