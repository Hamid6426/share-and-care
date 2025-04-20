import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of our application with link to all page since its development.</p>
      <Link href="/signup">SignUp</Link>
      <Link href="/signin">SignIn</Link>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
    </div>
  );
}
