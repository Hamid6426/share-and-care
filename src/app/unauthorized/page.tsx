import Link from "next/link";

// app/unauthorized/page.tsx
export default function Unauthorized() {
  return (
    <div className="absolute top-0 w-full h-screen flex flex-col gap-3 items-center justify-center bg-green-50 font-bold">
        <h1 className="text-3xl text-red-600 ">Access Denied</h1>
        <p className="text-gray-700 mt-4">You are not authorized to view this page.</p>
        <Link className="bg-green-500 text-white py-2 px-4 hover:bg-green-600" href="/">
          Home
        </Link>
        <p className="text-gray-700 mt-4">If you are not Logged in Yet</p>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/signin">
          Click Here
        </Link>
    </div>
  );
}
