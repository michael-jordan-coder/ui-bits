import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { colors } from '../../../constants/colors';

const FullscreenButton = ({ targetSelector = '.demo-container' }) => {
  const buttonRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const handleClick = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    const target = buttonRef.current?.closest(targetSelector);
    if (target?.requestFullscreen) {
      target.requestFullscreen().catch(() => {
        /* user gesture missing or unsupported */
      });
    }
  }, [targetSelector]);

  return (
    <Button
      ref={buttonRef}
      transition="background-color 0.3s ease"
      _active={{ bg: colors.bgHover }}
      _hover={{ bg: colors.bgHover }}
      bg={colors.bgElevated}
      position="absolute"
      onClick={handleClick}
      border={`1px solid ${colors.borderSecondary}`}
      zIndex={2}
      color="white"
      rounded="10px"
      right={14}
      size="md"
      top={3}
      p={2}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      <Icon as={isFullscreen ? FiMinimize2 : FiMaximize2} boxSize={4} />
    </Button>
  );
};

export default FullscreenButton;
