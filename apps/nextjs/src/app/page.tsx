export default function HomePage() {
  const title = "BetterMade Technology"
  const description = "Technology services that are better made"

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="text-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg sm:text-2xl mb-8 max-w-3xl mx-auto">{description}</p>
        <button className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition">
          Learn More
        </button>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">Web Development</h3>
            <p>Custom websites and web applications tailored to your needs.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">Mobile Apps</h3>
            <p>Native and cross-platform mobile application development.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">UI/UX Design</h3>
            <p>User-focused design that enhances the experience of your products.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-indigo-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to work with us?</h2>
        <p className="text-lg mb-8">
          Let's discuss how we can help bring your ideas to life.
        </p>
        <a
          href="mailto:contact@bettermade.tech"
          className="inline-block px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  )
}