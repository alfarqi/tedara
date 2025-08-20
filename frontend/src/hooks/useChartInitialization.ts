import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    initDonutChart?: (selector: string) => void;
    initOrdersChart?: () => void;
    initWorldMap?: () => void;
  }
}

export const useChartInitialization = () => {
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Prevent multiple initializations
    if (initializedRef.current) return;
    
    // Wait for the DOM to be ready and then initialize charts
    const initializeCharts = () => {
      if (initializedRef.current) return;
      
      // Initialize donut charts
      const donutCharts = document.querySelectorAll('.donut-chart');
      if (donutCharts.length > 0 && window.initDonutChart) {
        donutCharts.forEach((chart) => {
          if (chart instanceof HTMLElement) {
            // Create a unique selector for this chart
            const chartId = chart.id || `chart-${Math.random().toString(36).substr(2, 9)}`;
            if (!chart.id) {
              chart.id = chartId;
            }
            window.initDonutChart!(`#${chartId}`);
          }
        });
      }

      // Initialize orders chart
      const ordersChart = document.getElementById('orders-chart');
      if (ordersChart && window.initOrdersChart) {
        window.initOrdersChart!();
      }

      // Initialize world map - only if not already initialized
      const worldMap = document.getElementById('map_1');
      if (worldMap && window.initWorldMap && !worldMap.hasAttribute('data-initialized')) {
        try {
          window.initWorldMap!();
          // Mark as initialized to prevent re-initialization
          worldMap.setAttribute('data-initialized', 'true');
        } catch (error) {
          console.error('Error initializing world map:', error);
        }
      }
      
      initializedRef.current = true;
    };

    // Try to initialize immediately
    initializeCharts();

    // Also try after a short delay to ensure all elements are rendered
    const timeoutId = setTimeout(initializeCharts, 100);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
};
