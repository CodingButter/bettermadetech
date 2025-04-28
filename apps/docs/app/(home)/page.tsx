import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-16 sm:py-24 md:px-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Winner Spinner
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-fd-muted-foreground">
            A Chrome extension designed for raffle companies, providing a customizable spinning wheel with CSV import and seamless data management.
          </p>
          <div className="mt-8 flex gap-4">
            <Link 
              href="/docs" 
              className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Documentation
            </Link>
            <Link 
              href="/docs/onboarding" 
              className="rounded-md bg-white px-5 py-2.5 font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="relative mt-12 h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-blue-100">
          <Image
            src="/images/spinner-extension.png"
            alt="Winner Spinner Chrome Extension"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful Features for Raffle Management
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-fd-muted-foreground">
              Everything you need to run engaging raffles and prize draws with a professional touch
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-md border border-blue-100">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Customizable Spinner
              </h3>
              <p className="mt-2 text-fd-muted-foreground">
                Create visually appealing spinners with custom colors, sizes, and animations to match your brand.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-md border border-blue-100">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                CSV Import
              </h3>
              <p className="mt-2 text-fd-muted-foreground">
                Easily import participant data from CSV files with intelligent parsing and validation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-md border border-blue-100">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Directus Backend
              </h3>
              <p className="mt-2 text-fd-muted-foreground">
                Secure cloud storage for your raffle data with a powerful Directus backend integration.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-md border border-blue-100">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Cross-Platform
              </h3>
              <p className="mt-2 text-fd-muted-foreground">
                Use the Winner Spinner as a Chrome extension or embedded in your website for maximum flexibility.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-md border border-blue-100">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Accessibility First
              </h3>
              <p className="mt-2 text-fd-muted-foreground">
                Built with accessibility in mind, ensuring everyone can use and enjoy the spinner experience.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-md border border-blue-100">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Data Export
              </h3>
              <p className="mt-2 text-fd-muted-foreground">
                Export raffle results and winner information in multiple formats for record-keeping and follow-ups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="w-full py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Powerful Management Dashboard
              </h2>
              <p className="mt-4 text-fd-muted-foreground">
                Track raffle performance, manage participant data, and customize your spinner all from one intuitive dashboard.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Visualize participant data with powerful analytics</span>
                </li>
                <li className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Save and load spinner configurations</span>
                </li>
                <li className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Manage CSV data imports with validation</span>
                </li>
                <li className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Export results for follow-up and reporting</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl border border-blue-100">
              <Image
                src="/images/dashboard.png"
                alt="Winner Spinner Dashboard"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Design Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Works Everywhere
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-fd-muted-foreground">
              Winner Spinner adapts to any screen size for a consistent experience across all devices
            </p>
          </div>
          <div className="relative h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-2xl border border-blue-100">
            <Image
              src="/images/responsive-design.png"
              alt="Winner Spinner on multiple devices"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Join the Project?
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-blue-100">
                Winner Spinner is an open-source project looking for passionate developers and contributors. Get involved today!
              </p>
              <div className="mt-8 flex gap-4">
                <Link 
                  href="/docs/onboarding/contributing" 
                  className="rounded-md bg-white px-5 py-2.5 font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Contribute
                </Link>
                <Link 
                  href="/docs/onboarding/setup" 
                  className="rounded-md bg-blue-500 px-5 py-2.5 font-medium text-white border border-blue-400 hover:bg-blue-600 transition-colors"
                >
                  Developer Setup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-fd-muted-foreground">
              &copy; {new Date().getFullYear()} Winner Spinner Project. All rights reserved.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/docs" className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
                Documentation
              </Link>
              <Link href="/docs/onboarding/contributing" className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
                Contributing
              </Link>
              <a href="https://github.com/CodingButter/bettermadetech" target="_blank" rel="noopener noreferrer" className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}