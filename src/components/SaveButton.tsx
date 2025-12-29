import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toggleSavePropertyAPI, checkIfSavedAPI } from '../services/SavedProperty';
import toast from 'react-hot-toast';

interface SaveButtonProps {
  listingId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onToggle?: (isSaved: boolean) => void;
}

export default function SaveButton({ 
  listingId, 
  size = 'md', 
  showLabel = false,
  onToggle 
}: SaveButtonProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Check if property is saved on mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user?.token || user.role !== 'CLIENT') {
        setChecking(false);
        return;
      }

      try {
        const response = await checkIfSavedAPI(user.token, listingId);
        setIsSaved(response.data.isSaved);
      } catch (error) {
        console.error('Failed to check saved status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkSavedStatus();
  }, [user, listingId]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to save properties');
      return;
    }

    // Check if user is a client
    if (user.role !== 'CLIENT') {
      toast.error('Only clients can save properties');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      const response = await toggleSavePropertyAPI(user.token, listingId);
      const newSavedState = response.data.isSaved;
      
      setIsSaved(newSavedState);
      
      if (newSavedState) {
        toast.success('Property saved to favorites');
      } else {
        toast.success('Property removed from favorites');
      }

      // Call parent callback if provided
      if (onToggle) {
        onToggle(newSavedState);
      }
    } catch (error: any) {
      console.error('Failed to toggle save:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please log in again');
      } else {
        toast.error('Failed to save property');
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if not a client or checking
  if (checking) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-100 animate-pulse`} />
    );
  }

  if (!user || user.role !== 'CLIENT') {
    return null;
  }

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center gap-2
        bg-white/90 hover:bg-white
        shadow-lg transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        ${showLabel ? 'px-4 w-auto' : ''}
      `}
      title={isSaved ? 'Remove from saved' : 'Save property'}
    >
      {loading ? (
        <svg className={`${iconSizes[size]} animate-spin text-gray-600`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          <svg 
            className={`
              ${iconSizes[size]} 
              transition-all duration-300
              ${isSaved ? 'text-red-500 scale-110' : 'text-gray-600 group-hover:text-red-500 group-hover:scale-110'}
            `} 
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isSaved ? 0 : 2}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {showLabel && (
            <span className="text-sm font-medium text-gray-700">
              {isSaved ? 'Saved' : 'Save'}
            </span>
          )}
        </>
      )}
    </button>
  );
}