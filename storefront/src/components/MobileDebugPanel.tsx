import React, { useState, useEffect } from 'react';
import { isMobile, getMobileInfo } from '../utils/mobileDebug';

interface DebugLog {
  id: string;
  timestamp: string;
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  data?: any;
}

interface MobileDebugPanelProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export const MobileDebugPanel: React.FC<MobileDebugPanelProps> = ({ 
  isVisible = false, 
  onToggle 
}) => {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Only show on mobile devices
  if (!isMobile()) {
    return null;
  }

  // Add log function
  const addLog = (level: DebugLog['level'], message: string, data?: any) => {
    const newLog: DebugLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      data
    };
    
    setLogs(prev => {
      const updated = [...prev, newLog].slice(-50); // Keep last 50 logs
      return updated;
    });
  };

  // Override console methods to capture logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      if (args[0]?.includes('[MOBILE DEBUG]') || args[0]?.includes('[DESKTOP DEBUG]')) {
        addLog('info', args.join(' '), args.slice(1));
      }
    };

    console.error = (...args) => {
      originalError(...args);
      if (args[0]?.includes('[MOBILE ERROR]') || args[0]?.includes('Error:')) {
        addLog('error', args.join(' '), args.slice(1));
      }
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args.join(' '), args.slice(1));
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logs.length > 0) {
      const panel = document.getElementById('mobile-debug-panel');
      if (panel) {
        panel.scrollTop = panel.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (level: DebugLog['level']) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLogIcon = (level: DebugLog['level']) => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Show Mobile Debug Panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700">📱 Mobile Debug</span>
            <span className="text-xs text-gray-500">({logs.length} logs)</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`p-1 rounded text-xs ${autoScroll ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              title="Auto-scroll"
            >
              📍
            </button>
            <button
              onClick={clearLogs}
              className="p-1 rounded text-xs bg-red-100 text-red-600 hover:bg-red-200"
              title="Clear logs"
            >
              🗑️
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? '📉' : '📈'}
            </button>
            <button
              onClick={onToggle}
              className="p-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Device Info */}
        <div className="p-2 bg-blue-50 border-b">
          <div className="text-xs text-blue-800">
            <div><strong>Device:</strong> {getMobileInfo().isMobile ? 'Mobile' : 'Desktop'}</div>
            <div><strong>URL:</strong> {window.location.pathname}</div>
            <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Logs */}
        <div 
          id="mobile-debug-panel"
          className={`bg-gray-50 overflow-y-auto ${isExpanded ? 'h-96' : 'h-48'}`}
        >
          {logs.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No debug logs yet. Navigate the app to see logs.
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {logs.map((log) => (
                <div key={log.id} className={`p-2 rounded text-xs ${getLogColor(log.level)}`}>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0">{getLogIcon(log.level)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-gray-500">{log.timestamp}</span>
                        <span className="text-xs font-semibold uppercase">{log.level}</span>
                      </div>
                      <div className="mt-1 break-words">{log.message}</div>
                      {log.data && log.data.length > 0 && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-xs text-gray-600">Data</summary>
                          <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-gray-100 rounded-b-lg">
          <div className="text-xs text-gray-600 text-center">
            Tap the debug button to toggle this panel
          </div>
        </div>
      </div>
    </div>
  );
};
