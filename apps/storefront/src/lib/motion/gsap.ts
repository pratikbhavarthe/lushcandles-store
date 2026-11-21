"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register once for the whole client bundle. Importing GSAP through this
// module guarantees the plugins exist before any component animates.
gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Media query every scroll animation runs under. Visitors who ask for
 * reduced motion keep the content static and fully visible.
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

/** The shared entrance: a short rise and fade. */
export const REVEAL_FROM = { autoAlpha: 0, y: 28 }
export const REVEAL_TO = { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }

export { gsap, ScrollTrigger, useGSAP }
