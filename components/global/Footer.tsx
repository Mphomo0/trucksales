import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">A-Z Truck Sales</h2>
          <p className="text-sm">
            Trusted commercial vehicle specialists with over 25 years of
            experience. Proudly rated 4.1 for quality and service.
          </p>

          {/* Facebook Icon */}
          <div className="mt-4 flex space-x-4">
            <Link
              href="https://web.facebook.com/p/A-Z-TRUCK-SALES-100057330584780/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.85 7.94 9.8v-6.93H7.1V12h2.84V9.8c0-2.8 1.66-4.36 4.2-4.36 1.22 0 2.5.22 2.5.22v2.75h-1.41c-1.39 0-1.82.87-1.82 1.76V12h3.09l-.49 2.87h-2.6v6.93C18.56 20.85 22 16.84 22 12z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/inventory" className="hover:underline">
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/specials" className="hover:underline">
                Specials
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Branch 1 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Branch 1 – Alberton</h3>
          <p className="text-sm">
            9 Chrislou Cres
            <br />
            Alberton, 1449
            <br />
            Phone: 011 902 6071
            <br />
            Email: mi118@mweb.co.za
          </p>
        </div>

        {/* Branch 2 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Branch 2 – Boksburg</h3>
          <p className="text-sm">
            Cnr Trichardts and, Ravenswood St, Ravenswood
            <br />
            Boksburg, 1451
            <br />
            Phone: 083 234 5377
            <br />
            Email: aztruckboks@gmail.com
          </p>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-white">
        &copy; {new Date().getFullYear()} A-Z Truck Sales. All rights reserved.
      </div>
    </footer>
  )
}
