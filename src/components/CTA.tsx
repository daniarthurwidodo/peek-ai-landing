export default function CTA() {
  return (
    <section className="bg-blue-600 dark:bg-blue-700 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to ace your next interview?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Join thousands of professionals who have improved their interview skills with our AI assistant
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#pricing"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-100 transition-colors"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
