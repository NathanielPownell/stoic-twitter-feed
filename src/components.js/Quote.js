import React, { useEffect, useState } from 'react'
import {
    useTransition,
    useSpring,
    useChain,
    config,
    animated,
    useSpringRef,
} from 'react-spring'
import VisibilitySensor from 'react-visibility-sensor'

import './Quote.css'
import { ChatBubble, Autorenew, Favorite, IosShare, MoreHoriz, Verified } from '@mui/icons-material'
import { Avatar } from '@mui/material'
const Quote = (props) => {
    const [isVisible, setIsVisible] = useState(true)
    const transitions = useTransition(isVisible, {
        from: { opacity: 0, transform: "translateX(30px)", scale: 0.5 },
        enter: { opacity: 1, transform: "translateX(0px)", scale: 1 },
        leave: { opacity: 0, transform: "translateX(-30px)", scale: 1 },
        reverse: isVisible,
        delay: 200,
        config: config.molasses,
    })

    return (
        <VisibilitySensor partialVisibility >
            {({ isVisible }) => {
                setIsVisible(true)
                return transitions(

                    (styles, item) => item &&
                        <animated.div className='quote' style={styles}
                        >
                            <div className='quoteTop'>
                                <div className='author'>
                                    <Avatar alt={props.quote.author} style={{ background: `hsl(${props.quote.author_id * 30}, 60%, 80%, 1)` }}>{props.quote.author.slice(0, 1)}</Avatar>
                                    {props.quote.author}
                                    <Verified />
                                </div>
                                <MoreHoriz />
                            </div>
                            <div>{props.quote.body}</div>
                            <div className='actions'>
                                <ChatBubble />
                                <Autorenew />
                                <Favorite />
                                <IosShare />
                            </div>
                        </animated.div>

                )
            }}
        </VisibilitySensor>
    )
}

export default Quote