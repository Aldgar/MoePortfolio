export default function ContactCardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Contact Mohamed Ibrahim
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          <strong>Email:</strong> aldgar1988@protonmail.com
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          <strong>Phone:</strong> +351 914 14 33 40
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/mohamed-ibrahim-539308180/"
            className="text-blue-500"
          >
            Visit Profile
          </a>
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          <strong>GitHub:</strong>{" "}
          <a href="https://github.com/Aldgar" className="text-blue-500">
            View Repositories
          </a>
        </p>
        <a
          href="/public/CV.pdf"
          download
          className="block mt-4 bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
        >
          Download CV
        </a>
      </div>
    </div>
  );
}
