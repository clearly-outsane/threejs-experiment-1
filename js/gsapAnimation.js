import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.utils.toArray('.screenshot').forEach((section, i) => {
    section.bg = section.querySelector('.screenshot-container')

    // Do the parallax effect on each section

    section.bg.style.backgroundPosition = `50% ${-innerHeight / 2}px`

    gsap.to(section.bg, {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            scrub: true,
        },
    })
})
