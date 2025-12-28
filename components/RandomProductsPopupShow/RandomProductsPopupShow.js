import { isValidArray } from '@/utils/func';
import { useEffect, useState } from 'react';

function getRandomProducts(products, excludeIds = []) {
    const excludeProductIds = isValidArray(excludeIds) ? excludeIds : [];
    if (!isValidArray(products)) return [];
    const filteredProducts = products.filter(product => !excludeProductIds.includes(product?._id));

    for (let i = filteredProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
    }

    return filteredProducts.slice(0, 3);
}

function Popup({ products, onClose }) {
    return (
        <div className="popup">
            <h2>New Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product._id}>{product.name}</li>
                ))}
            </ul>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

function RandomNewProductsPopupShow() {
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupProducts, setPopupProducts] = useState([]);
    const [lastShowingNewProductsInfo, setLastShowingNewProductsInfo] = useState({
        periodTimes: [5, 10, 20],
        excludeIds: [],
        lastPopupTimestamp: 0
    });

    useEffect(() => {
        const storedInfo = localStorage.getItem('lastShowingNewProductsInfo');
        if (storedInfo) {
            try {
                setLastShowingNewProductsInfo(JSON.parse(storedInfo));
            } catch (error) {
                console.error("Error parsing lastShowingNewProductsInfo:", error);
            }
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('lastShowingNewProductsInfo', JSON.stringify(lastShowingNewProductsInfo));
        } catch (error) {
            console.error("Error storing lastShowingNewProductsInfo:", error);
        }
    }, [lastShowingNewProductsInfo]);

    useEffect(() => {
        try {
            const lastPopupTimestamp = lastShowingNewProductsInfo.lastPopupTimestamp;
            const timeSinceLastPopup = Date.now() - lastPopupTimestamp;
            const lastPeriodTime = getLastPeriodTime();

            const nextPopupInterval = getNextPopupInterval(lastPeriodTime);

            if (!lastPopupTimestamp || timeSinceLastPopup >= nextPopupInterval) {
                showPopup();
            } else {
                const timeout = setTimeout(() => {
                    showPopup();
                }, nextPopupInterval - timeSinceLastPopup);
                return () => clearTimeout(timeout);
            }
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    }, []);

    function getLastPeriodTime() {
        try {
            const lastPopupTimestamp = lastShowingNewProductsInfo.lastPopupTimestamp;
            const timeSinceLastPopup = Date.now() - lastPopupTimestamp;

            for (let i = lastShowingNewProductsInfo.periodTimes.length - 1; i >= 0; i--) {
                if (timeSinceLastPopup >= lastShowingNewProductsInfo.periodTimes[i] * 60 * 1000) {
                    return lastShowingNewProductsInfo.periodTimes[i];
                }
            }
            return lastShowingNewProductsInfo.periodTimes[0];
        } catch (error) {
            console.error("Error in getLastPeriodTime:", error);
            return lastShowingNewProductsInfo.periodTimes[0];
        }
    }

    function getNextPopupInterval(lastPeriodTime) {
        try {
            const lastIntervalIndex = lastShowingNewProductsInfo.periodTimes.indexOf(lastPeriodTime);
            if (lastIntervalIndex !== -1 && lastIntervalIndex < lastShowingNewProductsInfo.periodTimes.length - 1) {
                return lastShowingNewProductsInfo.periodTimes[lastIntervalIndex + 1] * 60 * 1000; // Convert minutes to milliseconds
            }
            return lastShowingNewProductsInfo.periodTimes[lastShowingNewProductsInfo.periodTimes.length - 1] * 60 * 1000; // Use the last period time if the index is out of range
        } catch (error) {
            console.error("Error in getNextPopupInterval:", error);
            return lastShowingNewProductsInfo.periodTimes[lastShowingNewProductsInfo.periodTimes.length - 1] * 60 * 1000;
        }
    }

    function showPopup() {
        try {
            const randomProducts = getRandomProducts(products, lastShowingNewProductsInfo.excludeIds);
            setPopupProducts(randomProducts);
            setPopupVisible(true);
            const updatedInfo = { ...lastShowingNewProductsInfo, lastPopupTimestamp: Date.now() };
            setLastShowingNewProductsInfo(updatedInfo);
        } catch (error) {
            console.error("Error in showPopup:", error);
        }
    }

    const handlePopupClose = () => {
        setPopupVisible(false);
    };

    const handleButtonClick = () => {
        // Simulate user browsing by clicking a button
        console.log("User clicked a button, simulating browsing.");
        showPopup();
    };

    return (
        <div className="app">
            <h1>Welcome to Our Website</h1>
            <button onClick={handleButtonClick}>Simulate Browsing</button>
            {popupVisible && <Popup products={popupProducts} onClose={handlePopupClose} />}
        </div>
    );
}

export default RandomNewProductsPopupShow;
