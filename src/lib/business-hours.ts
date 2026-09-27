export interface DayHours {
  day: string;
  time: string;
}

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Determine whether a business is currently open based on its hours array.
 * Returns { open: boolean } — true if open right now.
 */
export function getOpenStatus(hours?: DayHours[]): { open: boolean } {
  if (!hours || hours.length === 0) return { open: false };

  const now = new Date();
  const currentDayIdx = now.getDay();
  const todayName = Object.entries(DAY_INDEX).find(
    ([, idx]) => idx === currentDayIdx,
  )?.[0];
  if (!todayName) return { open: false };

  const todayHours = hours.find((h) => h.day === todayName);
  if (!todayHours || todayHours.time.trim().toLowerCase() === "closed")
    return { open: false };

  const parts = todayHours.time
    .split(/[–-]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2) return { open: false };

  const openTime = parseTimeToMinutes(parts[0]);
  const closeTime = parseTimeToMinutes(parts[1]);
  if (openTime == null || closeTime == null) return { open: false };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return { open: currentMinutes >= openTime && currentMinutes < closeTime };
}
