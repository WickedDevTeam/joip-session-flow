
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AgeVerification = () => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const hasVerifiedAge = localStorage.getItem('ageVerified');
    if (!hasVerifiedAge) {
      setShowDialog(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('ageVerified', 'true');
    setShowDialog(false);
  };

  const handleCancel = () => {
    // Redirect to a safe site if user is underage
    window.location.href = 'https://google.com';
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Age Verification</AlertDialogTitle>
          <AlertDialogDescription>
            This site contains adult content. You must be at least 18 years old to enter.
            <br /><br />
            By clicking "I am 18 or older", you confirm that you are at least 18 years old and agree to view adult content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>I am under 18</AlertDialogCancel>
          <AlertDialogAction onClick={handleVerify}>I am 18 or older</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgeVerification;
