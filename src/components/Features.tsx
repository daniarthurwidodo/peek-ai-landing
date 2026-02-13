const features = [
  {
    name: 'AI-Powered Mock Interviews',
    description: 'Practice with realistic interview scenarios tailored to your industry and role.',
    icon: '🎯',
  },
  {
    name: 'Real-Time Feedback',
    description: 'Get instant analysis on your answers, body language, and communication skills.',
    icon: '⚡',
  },
  {
    name: 'Personalized Improvement',
    description: 'Track your progress and receive customized tips to enhance your performance.',
    icon: '📈',
  },
  {
    name: 'Industry-Specific Questions',
    description: 'Access thousands of questions across tech, finance, healthcare, and more.',
    icon: '💼',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white dark:bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our AI assistant helps you prepare for any interview with confidence
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-start">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <dt className="font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
