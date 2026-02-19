import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { CalendarHeart, Bell, TrendingUp } from "lucide-react";

const PeriodTracker = () => (
  <PageLayout>
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Period Tracker</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">Track your menstrual cycle, get predictions and health reminders.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: CalendarHeart, title: "Cycle Tracking", desc: "Log your periods and get accurate predictions for upcoming cycles." },
            { icon: Bell, title: "Smart Reminders", desc: "Get notified before your expected date so you're always prepared." },
            { icon: TrendingUp, title: "Health Insights", desc: "Track symptoms, mood, and get personalized health tips." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-medical-purple-light flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-medical-purple" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-10 text-sm">
          Full tracking features coming soon. Enable Cloud to save your data securely.
        </p>
      </div>
    </section>
  </PageLayout>
);

export default PeriodTracker;
