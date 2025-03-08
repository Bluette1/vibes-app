import React, { useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleInstallPrompt = (e: Event) => {
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent; // Cast event to BeforeInstallPromptEvent
      beforeInstallPromptEvent.preventDefault(); // Prevent the default prompt
      deferredPrompt = beforeInstallPromptEvent; // Stash the event

      // Show your custom install button
      const installButton = document.getElementById('installButton');
      if (installButton) {
        installButton.style.display = 'block';

        installButton.addEventListener('click', () => {
          installButton.style.display = 'none'; // Hide the button
          deferredPrompt?.prompt(); // Show the prompt
          deferredPrompt?.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null; // Clear the prompt
          });
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt as EventListener); // Cast the handler

    // Cleanup the event listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt as EventListener);
    };
  }, []);

  return (
    <div>
      <button id="installButton" style={{ display: 'none' }}>
        Install App
      </button>
    </div>
  );
};

export default InstallPrompt;