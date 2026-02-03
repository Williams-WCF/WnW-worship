import { useState } from 'react';
import { supabase } from '../supabaseClient';

export const useAdminRoles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setAdminByEmail = async (email) => {
    setLoading(true);
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    const { data, error: updateError } = await supabase
      .rpc('set_admin_by_email', { p_email: normalizedEmail });

    if (updateError) {
      setError(updateError);
      setLoading(false);
      return { error: updateError };
    }

    if (!data) {
      const noMatchError = new Error(
        'No matching user found. Make sure the user has signed in at least once.'
      );
      setError(noMatchError);
      setLoading(false);
      return { error: noMatchError };
    }

    setLoading(false);
    return { data };
  };

  return { setAdminByEmail, loading, error };
};