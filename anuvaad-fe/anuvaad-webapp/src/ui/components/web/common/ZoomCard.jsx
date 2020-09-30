// import React from 'react'
// import ReactDOM from 'react-dom'
// import { useSpring, animated } from 'react-spring'


// import AppCard from "../Card";


// const calc = (x, y) => [0, 0, 5.1]
// const trans = (x, y, s) => `perspective(600px) scale(${s})`
// const modifyHeight = (x, y, s) => `${s*50}px`
// const modifyWidth = (x, y, s) => `${s*100}%`

// console.log()

// function Card() {

//   const [props, set] = useSpring(() => ({ zIndex: 1, xys: [0, 0, 1.1], config: { mass: 5, tension: 350, friction: 40 } }))
//   return (
//     <animated.div
//       class="card"
//       onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y), zIndex: 99999999 })}
//       onMouseLeave={() => set({ xys: [0, 0, 1] })}
//       style={{ zIndex: props.zIndex.interpolate(() => { }), height: props.xys.interpolate(modifyHeight), width: props.xys.interpolate(modifyWidth) }}
//     >
//       <AppCard header={"test"} />
//     </animated.div>
//   )
// }


// export default Card;
