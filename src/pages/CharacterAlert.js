import { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const CharacterAlert = ({ imageSrc, onClose, imageStyle = {} }) => {
    const [isClosing, setIsClosing] = useState(false);

    const animation = useSpring({
        opacity: isClosing ? 0 : 1,
        from: { opacity: 0 },
        config: { tension: 200, friction: 20 },
        onRest: () => {
            if (isClosing) {
                onClose(); 
            }
        },
    });

    const handleClick = () => {
        setIsClosing(true); 
    };

    return (
        <div className="overlay">
            <animated.div style={animation} className="character-alert">
                <img src={imageSrc} alt="Character" style={imageStyle} />
                <div className="button-wrapper">
                    <button onClick={handleClick}>확인</button>
                </div>
            </animated.div>
        </div>
    );
};

export default CharacterAlert;