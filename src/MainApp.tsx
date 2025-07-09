import { useState } from 'react';
import { Input, Button, Typography, Card, CardBody, Navbar, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAuth } from "./contexts/useAuth";
import { useNavigate } from "react-router-dom";

interface Location {
  locationName: string;
  crs: string;
}

interface TrainService {
  origin: Location[];
  destination: Location[];
  std: string;
  etd: string;
  platform?: string | null;
  operator: string;
}

interface ApiResponse {
  locationName: string;
  filterLocationName: string;
  trainServices: TrainService[];
  crs: string;
}

export default function MainApp() {
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleApiCall = async () => {
    setError('');
    setApiResponse(null);

    if (!originCode || !destinationCode) {
      setError('Please enter both Origin and Destination codes.');
      return;
    }

    try {
      const url = `${import.meta.env.VITE_TRAIN_CHECKER_API_BASE_URL}/api/v1/trains/${originCode}/to/${destinationCode}`;
      
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

      // Debug logging to see what we're actually getting
      console.log('API Response:', data);
      console.log('Train Services:', data.trainServices);

      if (data.trainServices && data.trainServices.length > 0) {
        setApiResponse(data);
      } else {
        setError('No train services found for the given route');
        setApiResponse(null); // Clear previous results
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch train services: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
      setApiResponse(null); // Clear previous results on error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-gray-50 to-blue-gray-100 flex flex-col">
      <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 font-normal"
          >
            Train Checker
          </Typography>
          <div className="flex items-center gap-x-1">
            <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="flex items-center gap-x-1 py-2 pr-2 pl-2 lg:ml-auto"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal text-blue-gray-900"
                  >
                    {userEmail}
                  </Typography>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="p-1">
                <MenuItem onClick={handleLogout} className="flex items-center gap-2 rounded">
                  <Typography as="span" variant="small" className="font-normal">
                    Log Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </Navbar>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-2xl">
          <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
            Train Checker
          </Typography>

          <div className="space-y-4 mb-6">
            <Input
              label="Origin Code"
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value)}
              placeholder="e.g. KGX"
              crossOrigin={null}
            />
            <Input
              label="Destination Code"
              value={destinationCode}
              onChange={(e) => setDestinationCode(e.target.value)}
              placeholder="e.g. EDB"
              crossOrigin={null}
            />
            <Button
              color="blue"
              onClick={handleApiCall}
              className="w-full"
            >
              Search
            </Button>
          </div>

          {apiResponse && apiResponse.trainServices.length > 0 && (
            <div className="mt-6">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Train Services from {apiResponse.locationName} to {apiResponse.filterLocationName}:
              </Typography>
              <div className="space-y-3">
                {apiResponse.trainServices.map((service, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Typography variant="h6" color="blue-gray">
                          {service.operator}
                        </Typography>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.etd === 'On time' ? 'bg-green-100 text-green-800' :
                          service.etd === 'Delayed' ? 'bg-red-100 text-red-800' :
                          service.etd.includes('Cancelled') ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {service.etd}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <Typography variant="small" color="gray" className="font-medium mb-1">
                          Route
                        </Typography>
                        <Typography color="blue-gray">
                          {service.origin[0].locationName} ({service.origin[0].crs}) → {service.destination[0].locationName} ({service.destination[0].crs})
                        </Typography>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Scheduled Departure
                          </Typography>
                          <Typography color="blue-gray">
                            {service.std}
                            {service.platform && ` (Platform ${service.platform})`}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Expected Departure
                          </Typography>
                          <Typography color="blue-gray">
                            {service.etd}
                          </Typography>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {apiResponse && apiResponse.trainServices.length === 0 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Warning:</strong>
              <span className="block sm:inline"> No train services found for the given route.</span>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}