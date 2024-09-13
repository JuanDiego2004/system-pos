// components/Header.js
import Link from 'next/link';

const Header = ({ title }) => {
  return (
    <header className="bg-white text-black p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">
                <p className="hover:underline">Home</p>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <p className="hover:underline">About</p>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">
                <p className="hover:underline">Dashboard</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
