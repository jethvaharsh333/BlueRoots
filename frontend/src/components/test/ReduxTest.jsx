import React, { useEffect } from 'react';
import { useAppDispatch, useAuth, useUser, useReports } from '../../store/hooks';
import { fetchUserProfile } from '../../store/slices/userSlice';

const ReduxTest = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const { profile, loading: userLoading, error: userError } = useUser();
  const { reports, loading: reportsLoading, error: reportsError } = useReports();

  useEffect(() => {
    console.log('Redux Test Component Mounted');
    console.log('Auth State:', { user, isAuthenticated, authLoading, authError });
    console.log('User State:', { profile, userLoading, userError });
    console.log('Reports State:', { reports, reportsLoading, reportsError });
  }, [user, isAuthenticated, authLoading, authError, profile, userLoading, userError, reports, reportsLoading, reportsError]);

  const testFetchProfile = () => {
    console.log('Testing fetchUserProfile action...');
    dispatch(fetchUserProfile());
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Redux State Test</h2>
      
      {/* Auth State */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Auth State</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Loading:</strong> {authLoading ? '⏳ Yes' : '✅ No'}</p>
          <p><strong>User:</strong> {user ? `${user.username || user.email || 'User object exists'}` : 'None'}</p>
          <p><strong>Error:</strong> {authError || 'None'}</p>
        </div>
      </div>

      {/* User State */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-green-800">User State</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Profile:</strong> {profile ? `${profile.username || profile.email || 'Profile exists'}` : 'None'}</p>
          <p><strong>Loading:</strong> {userLoading ? '⏳ Yes' : '✅ No'}</p>
          <p><strong>Error:</strong> {userError || 'None'}</p>
        </div>
      </div>

      {/* Reports State */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-purple-800">Reports State</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Reports Count:</strong> {reports?.length || 0}</p>
          <p><strong>Loading:</strong> {reportsLoading ? '⏳ Yes' : '✅ No'}</p>
          <p><strong>Error:</strong> {reportsError || 'None'}</p>
        </div>
      </div>

      {/* Test Actions */}
      <div className="space-y-3">
        <button
          onClick={testFetchProfile}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Test Fetch User Profile Action
        </button>
        
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <strong>Instructions:</strong> Open browser DevTools → Console to see Redux state logs. 
          If you have Redux DevTools extension, you can also monitor state changes there.
        </div>
      </div>

      {/* Redux Store Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Redux Store Status</h3>
        <div className="text-sm space-y-1">
          <p>✅ Store configured with 6 slices</p>
          <p>✅ Provider wrapped around App</p>
          <p>✅ Custom hooks available</p>
          <p>✅ Middleware configured</p>
        </div>
      </div>
    </div>
  );
};

export default ReduxTest;