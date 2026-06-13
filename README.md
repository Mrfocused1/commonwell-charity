# Commonwell

A multi-page website for **Commonwell**, a fictional community-wellbeing charity — *"where community grows."*

Static HTML / CSS / vanilla JS, with a warm forest-green & cream design system, scroll-driven motion, and sticky stacking-card layouts.

## Pages

- `index.html` — landing page (hero video, programmes, ways to give, get involved)
- `about.html` — story, values, impact
- `programmes.html` — the six programmes (sticky stacking deck)
- `events.html` — host a community event
- `partner.html` — schools & business partnerships
- `faqs.html` — questions, answered
- `voices.html` — community testimonials
- `ways-to-give.html` — donation tiers & ways to give

## Tech

- **Fonts:** Anton (display), Antonio (sub), DM Sans (body)
- **Motion:** [GSAP](https://gsap.com/) + ScrollTrigger, [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll, [Swiper](https://swiperjs.com/) carousel (all via CDN)
- Manual, dependency-free split-text heading reveals
- Logo wired as a `currentColor` CSS mask so it adapts to the header state

## Running locally

No build step. Serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Media

Photos and videos are from [Pexels](https://www.pexels.com/) (free to use). To refresh the imagery, set your Pexels API key and run the fetch script:

```bash
export PEXELS_API_KEY=your_key_here
./fetch-assets.sh
```

---

🤖 Built with [Claude Code](https://claude.com/claude-code)
