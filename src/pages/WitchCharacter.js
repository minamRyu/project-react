import { useSpring, animated } from 'react-spring';
import React, { useState } from 'react';

const WitchCharacter = ({ message, onClose }) => {
    const [isClicked, setIsClicked] = useState(false);

    const fadeIn = useSpring({ 
        opacity: 1, 
        from: { opacity: 0 }, 
        config: { tension: 200, friction: 20 }
    });
    const fadeOut = useSpring({ 
        opacity: 0, 
        from: { opacity: 1 }, 
        onRest: isClicked ? onClose : null
    });

    const handleClick = () => {
        setIsClicked(true); // 버튼 클릭 시 상태 변경
    };

    return (
        <animated.div style={fadeIn} className="witch-character">
            <img src="/assets/witch.png" alt="Witch" />
            <div className="speech-bubble">
                <span>{message}</span>
            </div>
            <animated.button style={fadeOut} onClick={onClose}>확인</animated.button>
        </animated.div>
    );
};
export default WitchCharacter;