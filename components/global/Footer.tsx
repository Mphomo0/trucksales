/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import Link from 'next/link'

/* <h1>A-Z Truck Sales Components</h1> */ export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">A-Z Truck Sales</h3>
          <p className="text-sm">
            A-Z Truck Sales helps buyers find used rigid trucks in Gauteng,
            including Isuzu, Hino, Mercedes-Benz, Fuso, MAN and other
            commercial vehicles. The stronger reason to choose A-Z is not only
            stock availability, but local branches, workshop preparation, spares
            support and truck-buying guidance.
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
                Truck Inventory
              </Link>
            </li>
            <li>
              <Link href="/spares" className="hover:underline">
                Truck Spares
              </Link>
            </li>
            <li>
              <Link href="/specials" className="hover:underline">
                Specials
              </Link>
            </li>
            <li>
              <Link href="/sell-your-truck" className="hover:underline">
                Sell Your Truck
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hover:underline">
                Brands
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:underline">
                Guides
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/locations" className="hover:underline">
                Branches
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
          <address className="text-sm not-italic">
            9 Chrislou Cres
            <br />
            Alberton North, 1449
            <br />
            <a href="tel:+27119026071" className="hover:underline">Phone: 011 902 6071</a>
            <br />
            <a href="mailto:aztrucksales@mweb.co.za" className="hover:underline">aztrucksales@mweb.co.za</a>
          </address>
        </div>

        {/* Branch 2 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Branch 2 – Boksburg</h3>
          <address className="text-sm not-italic">
            Cnr Trichardts and, Ravenswood St, Ravenswood
            <br />
            Boksburg, 1451
            <br />
            <a href="tel:+27832345377" className="hover:underline">Phone: 083 234 5377</a>
            <br />
            <a href="mailto:aztruckboks@gmail.com" className="hover:underline">aztruckboks@gmail.com</a>
          </address>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-white">
        &copy; {new Date().getFullYear()} A-Z Truck Sales. All rights reserved.
        Designed by{' '}
        <a
          href="https://nostalgic-studio.co.za"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nostalgic Studio
        </a>
        .
      </div>
    </footer>
  )
}
