const createRipples = (event) => {

    const ripples = document.createElement("span")

    const x = event.clientX - event.offsetLeft
    const y = event.clientY - event.offsetTop

    ripples.style.left = `${x}px`
    ripples.style.top = `${y}px`

    this.appendChild(ripples)

    setTimeout(() => {
        ripples.remove()
    }, 1000)
}

export default createRipples;