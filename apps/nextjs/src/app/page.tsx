export default function HomePage() {
  const title = "Bring the Hype to Your Raffle Draws"
  const description =
    "Use Google RNG like always — then paste the result into our spinner to reveal the winner with flair."

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="text-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg sm:text-2xl mb-8 max-w-3xl mx-auto">{description}</p>
        <button className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition">
          Try The Demo
        </button>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-white text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl mb-4">🔢</div>
            <h3 className="font-semibold text-xl mb-2">Generate Number</h3>
            <p>Use Google’s trusted Random Number Generator just like you always do.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-semibold text-xl mb-2">Paste the Result</h3>
            <p>Enter the winning number into our Chrome extension's input box.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">🎡</div>
            <h3 className="font-semibold text-xl mb-2">Reveal with Style</h3>
            <p>The spinner lights up, spins, and lands on the winner’s name and ticket.</p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">See the Spinner in Action</h2>
        <div className="max-w-3xl mx-auto mb-8">
          <div className="w-full aspect-video bg-gray-300 rounded-xl overflow-hidden shadow-md">
            Video Placeholder
          </div>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
          Book a Live Demo
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">What Makes It Special</h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">🎨 Fully Customizable</h3>
            <p>Add your brand’s logo, colors, and sound effects for a unique experience.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">⚙️ Chrome Extension</h3>
            <p>Install it in seconds. Works seamlessly alongside your existing workflow.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">🧑‍🎤 Event-Ready Reveal</h3>
            <p>Turn a boring result into a stage-worthy performance on your live stream.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">💻 No Tech Headache</h3>
            <p>No spreadsheets, no scripts. Just plug in the number and let the magic happen.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">🌐 Stream-Friendly</h3>
            <p>Perfect for OBS and Streamlabs. Looks crisp in HD every time.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">🔒 Reliable & Transparent</h3>
            <p>Keep Google RNG for integrity — reveal the result with flair, not suspicion.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-tr from-purple-50 to-indigo-50 text-center">
        <h2 className="text-3xl font-bold mb-8">What Raffle Hosts Say</h2>
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">
          <blockquote className="bg-white p-6 rounded-xl shadow text-left">
            <p className="italic">
              “We used to fumble with sheets. Now, our viewers get hyped watching the winner spin
              in!”
            </p>
            <footer className="mt-4 font-semibold">– Sarah B., UK Raffles</footer>
          </blockquote>
          <blockquote className="bg-white p-6 rounded-xl shadow text-left">
            <p className="italic">
              “This made our streams look professional without changing how we draw numbers.”
            </p>
            <footer className="mt-4 font-semibold">– Chris J., SpinTix</footer>
          </blockquote>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-indigo-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Elevate Your Raffles?</h2>
        <p className="text-lg mb-8">
          You already use Google’s RNG. We make your reveals unforgettable. Let’s talk.
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
