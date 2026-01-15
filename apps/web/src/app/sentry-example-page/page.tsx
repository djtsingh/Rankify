import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  const handleTestError = () => {
    // Create a transaction/span to measure performance
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Error Button Click",
      },
      (span) => {
        span.setAttribute("test", "error_trigger");

        // Trigger a test error
        throw new Error("This is a test error from Sentry integration!");
      },
    );
  };

  const handleTestSpan = () => {
    // Create a transaction/span to measure performance
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Span Button Click",
      },
      (span) => {
        const value = "test_config";
        const metric = "test_metric";

        // Metrics can be added to the span
        span.setAttribute("config", value);
        span.setAttribute("metric", metric);

        // Simulate some work
        console.log("Test span executed with config:", value);
      },
    );
  };

  const handleTestLog = () => {
    const { logger } = Sentry;

    logger.trace("Starting test operation", { component: "sentry-example" });
    logger.debug("Test debug message");
    logger.info("Test info message", { userId: "test_user" });
    logger.warn("Test warning message", { endpoint: "/sentry-example" });
    logger.error("Test error message", { errorCode: "TEST_ERROR" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sentry Integration Test
        </h1>

        <div className="space-y-4">
          <button
            onClick={handleTestError}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Trigger Test Error
          </button>

          <button
            onClick={handleTestSpan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Test Performance Span
          </button>

          <button
            onClick={handleTestLog}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Test Logging
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click "Trigger Test Error" to send an exception to Sentry</li>
            <li>• Click "Test Performance Span" to create a performance span</li>
            <li>• Click "Test Logging" to send structured logs to Sentry</li>
          </ul>
        </div>
      </div>
    </div>
  );
}