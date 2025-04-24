import Link from "next/link";

// app/unauthorized/page.tsx
export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-3xl text-red-600 font-bold">Access Denied</h1>
        <p className="text-gray-700 mt-2">You are not authorized to view this page.</p>
        <p className="text-gray-700 mt-2">You are not Logged in Yet</p>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/signin">
          SignIn
        </Link>
      </div>
    </div>
  );
}
