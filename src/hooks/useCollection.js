import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient.js';

export function useCollection(collection, initialData = []) {
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await apiClient.list(collection));
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'Unable to load records.');
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => { reload(); }, [reload]);

  const create = useCallback(async (item) => {
    const created = await apiClient.create(collection, item);
    setItems((current) => [...current, created]);
    return created;
  }, [collection]);

  const update = useCallback(async (id, changes) => {
    const updated = await apiClient.update(collection, id, changes);
    setItems((current) => current.map((item) => String(item.id) === String(id) ? { ...item, ...updated } : item));
    return updated;
  }, [collection]);

  const remove = useCallback(async (id) => {
    await apiClient.remove(collection, id);
    setItems((current) => current.filter((item) => String(item.id) !== String(id)));
  }, [collection]);

  return { items, setItems, loading, error, reload, create, update, remove };
}