import PageLayout from "@/components/PageLayout";
import { Truck, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

/* ---------------- 12 Ambulances ---------------- */

const ambulanceData = [
  { id: "AMB-001", location: "Sector 4", distanceKm: 0.8, type: "Ventilator" },
  { id: "AMB-002", location: "Sector 12", distanceKm: 1.2, type: "ICU" },
  { id: "AMB-003", location: "Model Town", distanceKm: 1.8, type: "Normal" },
  { id: "AMB-004", location: "Civil Hospital", distanceKm: 2.0, type: "Ventilator" },
  { id: "AMB-005", location: "Railway Road", distanceKm: 2.5, type: "ICU" },
  { id: "AMB-006", location: "Green Park", distanceKm: 3.1, type: "Normal" },
  { id: "AMB-007", location: "Bus Stand Area", distanceKm: 3.8, type: "ICU" },
  { id: "AMB-008", location: "Old City Chowk", distanceKm: 4.2, type: "Normal" },
  { id: "AMB-009", location: "District Hospital", distanceKm: 4.5, type: "Ventilator" },
  { id: "AMB-010", location: "Main Bazaar", distanceKm: 4.8, type: "ICU" },
  { id: "AMB-011", location: "Housing Board Colony", distanceKm: 5.0, type: "Normal" },
  { id: "AMB-012", location: "New Bus Terminal", distanceKm: 5.5, type: "Ventilator" },
];

const speed = 40; // km/h city speed

const Ambulance = () => {
  const [userArea, setUserArea] = useState("Detecting location...");
  const [ambulances, setAmbulances] = useState([]);
  const [bookedAmbulanceId, setBookedAmbulanceId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  /* ---------------- LIVE LOCATION UPDATE ---------------- */

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserArea("Geolocation Not Supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );

          const data = await response.json();

          const area =
            data.address.suburb ||
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Your Area";

          setUserArea(area);
        } catch {
          setUserArea("Location Found");
        }
      },
      () => setUserArea("Location Permission Needed"),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ---------------- SORT NEAREST FIRST ---------------- */

  useEffect(() => {
    const sorted = [...ambulanceData].sort(
      (a, b) => a.distanceKm - b.distanceKm
    );
    setAmbulances(sorted);
  }, []);

  /* ---------------- TIME FORMAT ---------------- */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;
  };

  /* ---------------- BOOKING ---------------- */

  const handleBooking = (amb) => {
    setBookedAmbulanceId(amb.id);

    const totalSeconds = Math.ceil((amb.distanceKm / speed) * 3600);
    setTimeLeft(totalSeconds);

    let countdown = totalSeconds;

    timerRef.current = setInterval(() => {
      countdown--;
      setTimeLeft(countdown);

      if (countdown <= 0) {
        clearInterval(timerRef.current);
        alert("🚑 Ambulance Arrived!");
        setBookedAmbulanceId(null);
        setTimeLeft(null);
      }
    }, 1000);
  };

  const cancelBooking = () => {
    clearInterval(timerRef.current);
    setBookedAmbulanceId(null);
    setTimeLeft(null);
  };

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">🚑 Ambulance Services</h1>
            <p className="text-blue-600 font-semibold mt-2">
              📍 Your Location: {userArea}
            </p>
          </div>

          {/* CALL 108 */}
          <div className="max-w-md mx-auto mb-10">
            <a href="tel:108">
              <Button className="w-full bg-red-600 text-white py-6 text-lg font-bold">
                <Phone className="w-5 h-5 mr-2" />
                Call 108 — Emergency
              </Button>
            </a>
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {ambulances.map((amb, index) => {
              const isBooked = bookedAmbulanceId === amb.id;

              return (
                <div
                  key={amb.id}
                  className={`p-5 rounded-xl shadow-lg border ${bookedAmbulanceId && !isBooked ? "opacity-40" : ""
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold">{index + 1}.</span>
                    <Truck className="w-5 h-5 text-red-500" />
                    <span className="font-semibold">{amb.id}</span>
                  </div>

                  <p className="text-sm flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {amb.location}
                  </p>

                  <p className="text-sm font-semibold text-green-600 mt-2">
                    📍 {amb.distanceKm} km away
                  </p>

                  {!isBooked ? (
                    <Button
                      className="w-full mt-3"
                      disabled={bookedAmbulanceId}
                      onClick={() => handleBooking(amb)}
                    >
                      Book Ambulance
                    </Button>
                  ) : (
                    <div className="mt-4 text-center">
                      <p className="font-semibold text-green-600">
                        🚑 On The Way
                      </p>

                      {timeLeft !== null && (
                        <p className="text-red-600 text-xl font-bold mt-2">
                          {formatTime(timeLeft)}
                        </p>
                      )}

                      <Button
                        variant="destructive"
                        className="mt-3"
                        onClick={cancelBooking}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Ambulance;