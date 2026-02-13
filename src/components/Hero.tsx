export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Ace Your Interviews with AI
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Practice interviews with our AI assistant. Get real-time feedback, improve your answers, and land your dream job with confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#pricing"
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
