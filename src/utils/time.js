export const displayTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

export const displayTimeUntil = (dateStr) => {
    const targetTime = new Date(dateStr);
    const currentTime = new Date();

    const diff = targetTime - currentTime;
    if (diff <= 0) {
        return "0:00";
    }

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (hours >= 1) {
        return "1 hr+";
    } else if (minutes >= 10) {
        return `${minutes} min`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
