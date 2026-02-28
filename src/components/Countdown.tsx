import { useState, useEffect } from 'react';

export const START_DATE = new Date('2026-02-27T17:50:00').getTime();
export const DISCOUNT_DEADLINE = new Date('2026-03-06T00:00:00').getTime();
const TOTAL_DURATION = DISCOUNT_DEADLINE - START_DATE;
const TOTAL_SPOTS = 50;

export function useDiscount() {
    const [isActive, setIsActive] = useState(Date.now() < DISCOUNT_DEADLINE);
    const [timeLeft, setTimeLeft] = useState('');
    const [spotsLeft, setSpotsLeft] = useState(TOTAL_SPOTS);

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const distance = DISCOUNT_DEADLINE - now;

            if (distance <= 0) {
                setIsActive(false);
                setTimeLeft('');
                setSpotsLeft(0);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

            const elapsed = Math.max(0, now - START_DATE);
            const ratio = Math.max(0, Math.min(1, 1 - (elapsed / TOTAL_DURATION)));

            // Unsynchronized drop (faster at first, slows down at the end)
            const calculatedSpots = Math.round(Math.pow(ratio, 1.5) * TOTAL_SPOTS);
            setSpotsLeft(calculatedSpots);

            setIsActive(true);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    return { isActive, timeLeft, spotsLeft };
}

export function CountdownTimer() {
    const { isActive, timeLeft } = useDiscount();

    if (!isActive) return null;

    return (
        <div className="text-red-500 text-xs font-bold tracking-widest uppercase flex items-center gap-2 animate-pulse mb-2">
            ⏳ Ends in: {timeLeft}
        </div>
    );
}

export function CountdownSpots({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
    const { isActive, spotsLeft } = useDiscount();

    if (!isActive) return null;

    const isLight = theme === 'light';

    return (
        <div className={`rounded-full px-3 py-1 flex items-center justify-between w-fit gap-3 h-fit ${isLight ? 'bg-black/5 border border-black/10' : 'bg-white/5 border border-white/10'}`}>
            <span className={`text-[10px] font-bold tracking-widest uppercase ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                SPOTS LEFT:
            </span>
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mt-[1px]" />
                <span className="text-red-500 font-extrabold text-xs">{spotsLeft}</span>
                <span className={`text-[10px] font-bold mt-[1px] ${isLight ? 'text-black/40' : 'text-white/40'}`}>/ 50</span>
            </div>
        </div>
    );
}
