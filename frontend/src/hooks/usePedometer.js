import { useState, useEffect, useCallback, useRef } from 'react';

export const usePedometer = (initialSteps = 0) => {
    const [steps, setSteps] = useState(initialSteps);
    const [isTracking, setIsTracking] = useState(false);
    const [supported, setSupported] = useState(false);

    // Refs for motion detection logic
    const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
    const lastUpdate = useRef(0);
    const threshold = 12; // Acceleration threshold for a step

    useEffect(() => {
        if (window.DeviceMotionEvent) {
            setSupported(true);
        }
    }, []);

    const handleMotion = useCallback((event) => {
        const current = event.accelerationIncludingGravity;
        if (!current) return;

        const currentTime = Date.now();
        if ((currentTime - lastUpdate.current) > 100) {
            const diff = Math.abs(current.x + current.y + current.z - lastAcceleration.current.x - lastAcceleration.current.y - lastAcceleration.current.z);

            if (diff > threshold) {
                setSteps(prev => prev + 1);
            }

            lastUpdate.current = currentTime;
            lastAcceleration.current = { x: current.x, y: current.y, z: current.z };
        }
    }, []);

    const startTracking = () => {
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                        setIsTracking(true);
                    }
                })
                .catch(console.error);
        } else {
            // Non-iOS or older devices
            window.addEventListener('devicemotion', handleMotion);
            setIsTracking(true);
        }
    };

    const stopTracking = () => {
        window.removeEventListener('devicemotion', handleMotion);
        setIsTracking(false);
    };

    const simulateStep = () => {
        setSteps(prev => prev + 1);
    };

    return {
        steps,
        isTracking,
        supported,
        startTracking,
        stopTracking,
        simulateStep,
        setSteps // allow manual override/sync
    };
};
