import { useAudioPlayer } from 'expo-audio';

export function useSound() {
  // Create audio player with the completion sound
  const player = useAudioPlayer(require('../assets/sounds/task-done-sound.mp3'));

  const playCompletionSound = () => {
    try {
      // Seek to beginning and play
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return { playCompletionSound };
}
