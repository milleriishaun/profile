
let installPromptEvent;
let btnInstall = document.getElementById("addToHomescreen");

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome <= 67 from automatically showing the prompt
  event.preventDefault();
  // Stash the event so it can be triggered later.
  console.log('tried to stash event');
  installPromptEvent = event;
  // Update the install UI to notify the user app can be installed
  document.getElementById('addToHomescreen').disabled = false;
});

btnInstall.addEventListener('click', () => {
    // Update the install UI to remove the install button
    document.getElementById('addToHomescreen').disabled = true;
    console.log('just failed to stash event');
    // Show the modal add to home screen dialog
    installPromptEvent.prompt();
    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      // Clear the saved prompt since it can't be used again
      installPromptEvent = null;
    });
});