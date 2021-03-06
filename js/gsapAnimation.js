import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

//don't have smooth scroll on mobile (idk its buggy - i think phones have smooth scrolling of some sort inbuilt already)
if (window.matchMedia('(min-width: 768px)').matches) {
    smoothScroll('#content')
}

// Do the parallax image effect on each section
gsap.utils.toArray('.screenshot').forEach((section, i) => {
    section.bg = section.querySelector('.screenshot-container')

    section.bg.style.backgroundPosition = `50% ${-window.innerWidth / 5.5}px`

    gsap.to(section.bg, {
        backgroundPosition: `50% ${window.innerWidth / 5.5}px`,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            scrub: true,
        },
    })
})

//magnetic cursor
// don't have this on mobile because there's no cursor to follow!
if (window.matchMedia('(min-width: 768px)').matches) {
    gsap.utils.toArray('.brief-link-item').forEach((container, i) => {
        const text = container.querySelector('.brief-link-text')

        // gsap.set(text, {
        //     xPercent: -50,
        //     yPercent: -50,
        // })

        container.addEventListener('mousemove', onMove)
        container.addEventListener('mouseleave', onLeave)

        function onMove(e) {
            const { left, top, width, height } =
                container.getBoundingClientRect()

            const halfW = width / 2
            const halfH = height / 2
            const mouseX = e.x - left
            const mouseY = e.y - top

            const x = gsap.utils.interpolate(-halfW, halfW, mouseX / width)
            const y = gsap.utils.interpolate(-halfH, halfH, mouseY / height)
            console.log(x)

            gsap.to(text, {
                x: x / 4,
                y: y / 4,
                duration: 0.1,
                ease: 'none',
                overwrite: true,
            })
        }

        function onLeave(e) {
            gsap.to(text, {
                x: 0,
                y: 0,
                ease: 'power3',
                duration: 0.4,
                overwrite: true,
            })
        }
    })
}

// this is the helper function that sets it all up. Pass in the content <div> and then the wrapping viewport <div> (can be the elements or selector text). It also sets the default "scroller" to the content so you don't have to do that on all your ScrollTriggers.
function smoothScroll(content, viewport, smoothness) {
    content = gsap.utils.toArray(content)[0]
    smoothness = smoothness || 0.7

    gsap.set(viewport || content.parentNode, {
        overflow: 'hidden',
        position: 'fixed',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    })
    gsap.set(content, { overflow: 'visible', width: '100%' })

    let getProp = gsap.getProperty(content),
        setProp = gsap.quickSetter(content, 'y', 'px'),
        setScroll = ScrollTrigger.getScrollFunc(window),
        removeScroll = () => (content.style.overflow = 'visible'),
        killScrub = (trigger) => {
            let scrub = trigger.getTween
                ? trigger.getTween()
                : gsap.getTweensOf(trigger.animation)[0] // getTween() was added in 3.6.2
            scrub && scrub.kill()
            trigger.animation.progress(trigger.progress)
        },
        height,
        isProxyScrolling

    function onResize() {
        height = content.clientHeight
        content.style.overflow = 'visible'
        document.body.style.height = height + 'px'
    }
    onResize()
    ScrollTrigger.addEventListener('refreshInit', onResize)
    ScrollTrigger.addEventListener('refresh', () => {
        removeScroll()
        requestAnimationFrame(removeScroll)
    })
    ScrollTrigger.defaults({ scroller: content })
    ScrollTrigger.prototype.update = (p) => p // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)

    ScrollTrigger.scrollerProxy(content, {
        scrollTop(value) {
            if (arguments.length) {
                isProxyScrolling = true // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
                setProp(-value)
                setScroll(value)
                return
            }
            return -getProp('y')
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            }
        },
    })

    return ScrollTrigger.create({
        animation: gsap.fromTo(
            content,
            { y: 0 },
            {
                y: () => document.documentElement.clientHeight - height,
                ease: 'none',
                onUpdate: ScrollTrigger.update,
            }
        ),
        scroller: window,
        invalidateOnRefresh: true,
        start: 0,
        end: () => height - document.documentElement.clientHeight,
        scrub: smoothness,
        onUpdate: (self) => {
            if (isProxyScrolling) {
                killScrub(self)
                isProxyScrolling = false
            }
        },
        onRefresh: killScrub, // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
    })
}
