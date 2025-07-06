import { useState } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";

function App() {
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleApiCall = async () => {
    setError('');
    setResponse('');

    if (!originCode || !destinationCode) {
      setError('Please enter both Origin and Destination codes.');
      return;
    }

    try {
      const url = `${import.meta.env.VITE_TRACK_TRACKER_API_BASE_URL}/api/v1/trains/${originCode}/to/${destinationCode}`;
      
      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-gray-50 to-blue-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <Typography variant="h4" color="blue-gray" className="mb-6 text-center"
          placeholder={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          TrainChecker API Client
        </Typography>

        <div className="space-y-4 mb-6">
          <Input
            label="Origin Code"
            value={originCode}
            onChange={(e) => setOriginCode(e.target.value)}
            placeholder="e.g., KGX"
            crossOrigin={null}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Input
            label="Destination Code"
            value={destinationCode}
            onChange={(e) => setDestinationCode(e.target.value)}
            placeholder="e.g., EDB"
            crossOrigin={null}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Button
            color="blue"
            onClick={handleApiCall}
            className="w-full"
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Make API Call
          </Button>
        </div>

        {response && (
          <div className="mt-6 p-4 bg-blue-gray-50 rounded-lg">
            <Typography variant="h6" color="blue-gray" className="mb-2"
              placeholder={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Response:
            </Typography>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto text-sm">
              <code>{response}</code>
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
