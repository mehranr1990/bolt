import { useState, useEffect } from 'react';
import { Version } from '../types/version';
import { saveVersion, getVersions, restoreVersion } from '../db/version';

export const useVersionControl = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    const loadedVersions = await getVersions();
    setVersions(loadedVersions.sort((a, b) => b.timestamp - a.timestamp));
  };

  const createVersion = async (description: string) => {
    setLoading(true);
    try {
      const newVersion = await saveVersion(description);
      await loadVersions();
      return newVersion;
    } finally {
      setLoading(false);
    }
  };

  const restore = async (versionId: string) => {
    setLoading(true);
    try {
      await restoreVersion(versionId);
      // You might want to trigger a full app reload here
      // window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return {
    versions,
    loading,
    createVersion,
    restore
  };
};