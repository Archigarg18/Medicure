import React, { useState, useEffect } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "../lib/browser";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";

const PeriodTracker = () => {
  const [lastPeriod, setLastPeriod] = useState("");
  // default cycle and luteal lengths (user can modify later if needed)
  const [cycleLength] = useState(28);
  const [lutealLength] = useState(14);
  const [prediction, setPrediction] = useState<{
    nextPeriod?: string;
    ovulation?: string;
    fertileWindow?: string;
    tips?: string;
  }>({});

  const tipOptions = [
    "Stay hydrated and eat a balanced diet during your cycle.",
    "Light exercise can help ease cramps in the days before your period.",
    "Track your mood to spot patterns and plan self-care.",
    "Use a warm compress on lower abdomen for relaxation.",
    "Rest well – sleep impacts hormonal balance dramatically.",
  ];

  function randomTip() {
    return tipOptions[Math.floor(Math.random() * tipOptions.length)];
  }

  // ensure logged in user
  const user = JSON.parse(safeLocalStorageGet("loggedUser") || "{}");
  useEffect(() => {
    if (!user?.email) {
      // redirect if needed
    }
    // load existing data
    const data = JSON.parse(safeLocalStorageGet(`period_${user.email}`) || "null");
    if (data) {
      setLastPeriod(data.lastPeriod);
      // cycleLength and lutealLength are constant defaults for now
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastPeriod) return;
    const start = new Date(lastPeriod);
    const next = new Date(start);
    next.setDate(start.getDate() + cycleLength);

    const ovulation = new Date(next);
    ovulation.setDate(next.getDate() - lutealLength);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);

    const toISO = (d: Date) => d.toISOString().split("T")[0];
    const tips = randomTip();

    setPrediction({
      nextPeriod: toISO(next),
      ovulation: toISO(ovulation),
      fertileWindow: `${toISO(fertileStart)} - ${toISO(fertileEnd)}`,
      tips,
    });

    safeLocalStorageSet(
      `period_${user.email}`,
      JSON.stringify({ lastPeriod, cycleLength, lutealLength })
    );
  };

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Period Tracker</span></h1>
            <p className="text-muted-foreground max-w-md mx-auto">Track your menstrual cycle, get predictions and health reminders.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-pink-50 p-6 rounded-lg shadow-lg border border-pink-200">
            <div>
              <label className="block mb-1 font-medium text-pink-700">Date of last period</label>
              <input
                type="date"
                required
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:border-pink-500"
              />
            </div>

            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg w-full hover:bg-pink-700">
              Calculate
            </button>
          </form>

          {prediction.nextPeriod && (
            <div className="mt-8 bg-pink-100 p-4 rounded-md border border-pink-200">
              <h2 className="font-semibold text-pink-800">Your Predictions</h2>
              <p>Next period: <strong>{prediction.nextPeriod}</strong></p>
              <p>Ovulation date: <strong>{prediction.ovulation}</strong></p>
              <p>Fertile window: <strong>{prediction.fertileWindow}</strong></p>
              <p className="mt-2 text-sm text-pink-600">{prediction.tips}</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default PeriodTracker;
