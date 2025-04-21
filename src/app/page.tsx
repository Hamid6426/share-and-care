import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center py-12 w-full">
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of our application with link to all page since its development.</p>
      <div className="flex flex-wrap text-center gap-4 max-w-2xl mt-4">
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/signup">SignUp</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/signin">SignIn</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/contact">Contact</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/demo">Demo</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/about">About</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/cookie-policy">Cookie Policy</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/privacy-policy">Privacy Policy</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/terms-and-conditions">Terms & Conditions</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/receiver">Receiver</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/donor">Donor</Link>
        <Link className="bg-green-500 text-white py-2 px-4  hover:bg-green-600" href="/admin">Admin</Link>
      </div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
    </div>
  );
}
