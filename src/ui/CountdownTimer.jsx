import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";

// Helper to calculate remaining time
const getTimeRemaining = (targetTime) => {
  const now = dayjs();
  const end = dayjs(targetTime);

  const years = end.diff(now, 'year');
  const nowPlusYears = now.add(years, 'year');

  const months = end.diff(nowPlusYears, 'month');
  const nowPlusMonths = nowPlusYears.add(months, 'month');

  const days = end.diff(nowPlusMonths, 'day');
  const nowPlusDays = nowPlusMonths.add(days, 'day');

  const hours = String(end.diff(nowPlusDays, 'hour') % 24).padStart(2, '0');
  const minutes = String(end.diff(nowPlusDays, 'minute') % 60).padStart(2, '0');
  const seconds = String(end.diff(nowPlusDays, 'second') % 60).padStart(2, '0');

  const total = end.diff(now);

  return { total, years, months, days, hours, minutes, seconds, };
};


export default function CountdownTimer({ targetTime, onComplete, playSound = false }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetTime));
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTime = getTimeRemaining(targetTime);
      setTimeLeft(updatedTime);

      if (updatedTime.total <= 0) {
        clearInterval(interval);
        if (onComplete) onComplete();
        if (playSound && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete, playSound]);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-primary/60 text-white rounded-xl shadow-xl px-6 py-2 w-full max-w-md animate-fadeIn">
      <div className="flex gap-x-4 text-3xl font-bold tracking-widest">
        {timeLeft.years > 0 && <TimeUnit label="Years" value={timeLeft.years} />}
        {timeLeft.months > 0 &&  <TimeUnit label="Months" value={timeLeft.months} /> }
        {timeLeft.days > 0 && <TimeUnit label="Days" value={timeLeft.days} /> }
        <TimeUnit label="Hours" value={timeLeft.hours} />
        <TimeUnit label="Minutes" value={timeLeft.minutes} />
        <TimeUnit label="Seconds" value={timeLeft.seconds} />
      </div>
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />
    </div>
  );
}


function TimeUnit({ label, value }) {
  return (
    <div className="text-center animate-pulse">
      <div className="text-4xl">{value}</div>
      <div className="text-xs tracking-wide text-gray-200 uppercase">{label}</div>
    </div>
  );
}
