import Link from "next/link";

export default function ReceiverDashboardOverview() {
  return (
    <div className="flex flex-col max-w-sm text-center font-bold justify-center mt-4">
      <Link href="/receiver/my-requests" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        My Requests
      </Link>
      <Link href="/receiver/claimed-items" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Claimed Items
      </Link>
      <Link href="/receiver/received-items" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Received Items
      </Link>

      <Link href="/receiver/chats" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Chats
      </Link>
      <Link href="/receiver/profile" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Profile
      </Link>
      <Link href="/receiver/settings" className="text-sm  mt-4 ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Settings
      </Link>
    </div>
  );
}
