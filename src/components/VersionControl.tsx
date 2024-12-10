import React, { useState } from 'react';
import { useVersionControl } from '../hooks/useVersionControl';
import { History, RotateCcw, Save } from 'lucide-react';

const VersionControl: React.FC = () => {
  const { versions, loading, createVersion, restore } = useVersionControl();
  const [description, setDescription] = useState('');
  const [showVersions, setShowVersions] = useState(false);

  const handleSave = async () => {
    if (!description) return;
    await createVersion(description);
    setDescription('');
    setShowVersions(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fa-IR');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowVersions(!showVersions)}
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        title="مدیریت نسخه‌ها"
      >
        <History className="w-6 h-6" />
      </button>

      {showVersions && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات نسخه جدید"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSave}
                disabled={!description || loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <div className="flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  ذخیره نسخه فعلی
                </div>
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                نسخه‌های قبلی
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="p-2 bg-gray-50 rounded-lg text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">{version.description}</span>
                      <button
                        onClick={() => restore(version.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="بازگشت به این نسخه"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(version.timestamp)}
                    </div>
                  </div>
                ))}
                {versions.length === 0 && (
                  <div className="text-center text-gray-500 py-2">
                    هنوز نسخه‌ای ذخیره نشده است
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionControl;