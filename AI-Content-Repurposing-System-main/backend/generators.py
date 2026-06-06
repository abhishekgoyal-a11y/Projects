from __future__ import annotations

from backend.analyzer import ContentInsights


def generate_all(insights: ContentInsights, tone: str = "educational") -> dict:
    return {
        "linkedin_post": linkedin_post(insights, tone),
        "twitter_thread": twitter_thread(insights, tone),
        "youtube_script": youtube_script(insights, tone),
        "email_newsletter": email_newsletter(insights, tone),
    }


def linkedin_post(insights: ContentInsights, tone: str) -> str:
    opener = _linkedin_opener(insights, tone)
    bullets = "\n".join(f"• {point}" for point in insights.key_points[:5])
    quote_block = f'\n\n💬 "{insights.quotes[0]}"' if insights.quotes else ""
    example_block = f"\n\nReal example: {insights.examples[0]}" if insights.examples else ""
    return (
        f"{opener}\n\n"
        f"{bullets}"
        f"{example_block}"
        f"{quote_block}\n\n"
        f"{insights.conclusion}\n\n"
        f"What's your take? Drop a comment below. 👇"
    ).strip()


def twitter_thread(insights: ContentInsights, tone: str) -> str:
    total = min(len(insights.key_points), 7) + 3
    tweets = [f"1/{total} {insights.hook}\n\n🧵 Thread:"]
    for i, point in enumerate(insights.key_points[:7], start=2):
        tweets.append(f"{i}/{total} {point}")
    n = len(tweets) + 1
    tweets.append(f"{n}/{total} Bottom line:\n\n{insights.conclusion}")
    n += 1
    tweets.append(f"{n}/{total} Found this useful? RT the first tweet so others can see it. 🙏\n\nFollow for more threads like this.")
    return "\n\n".join(tweets)


def youtube_script(insights: ContentInsights, tone: str) -> str:
    points = "\n\n".join(
        f"[Point {i}] {point}\n→ Why it matters: Connect this to what your audience struggles with daily."
        for i, point in enumerate(insights.key_points[:5], start=1)
    )
    example_block = f"\n\n[EXAMPLE]\n{insights.examples[0]}" if insights.examples else ""
    return (
        f"[HOOK — 0 to 10 seconds]\n{insights.hook}\n\n"
        f"[PROBLEM]\nHere's the thing — most people deal with this and never fix it. Today I'm going to walk you through exactly what you need to know about {insights.topic.lower()}.\n\n"
        f"[MAIN CONTENT]\n{points}"
        f"{example_block}\n\n"
        f"[SUMMARY]\nLet's recap the big ideas:\n"
        + "\n".join(f"• {pt}" for pt in insights.key_points[:3]) +
        f"\n\n[CTA]\n{insights.conclusion}\n\n"
        "If this was helpful, hit Like, drop your biggest takeaway in the comments, and subscribe — I post new videos every week."
    )


def email_newsletter(insights: ContentInsights, tone: str) -> str:
    takeaways = "\n".join(f"• {point}" for point in insights.key_points[:5])
    example_block = f"\n\nHere's a real example: {insights.examples[0]}" if insights.examples else ""
    return (
        f"Subject: {insights.title} — here's what you need to know\n\n"
        f"Hey [First Name],\n\n"
        f"{insights.hook}\n\n"
        f"This week I want to share something I found genuinely useful about {insights.topic.lower()}.\n\n"
        f"Here are the key takeaways:\n\n"
        f"{takeaways}"
        f"{example_block}\n\n"
        f"The bottom line:\n{insights.conclusion}\n\n"
        "Hope this gives you something to act on this week.\n\n"
        "Until next time,\n[Your Name]\n\n"
        "P.S. — Reply and let me know which takeaway hit hardest. I read every reply."
    )


def _linkedin_opener(insights: ContentInsights, tone: str) -> str:
    topic = insights.topic.lower()
    if tone == "viral":
        return f"Nobody talks about this side of {topic}.\n\n{insights.hook}"
    if tone == "formal":
        return f"A closer look at {topic} reveals an opportunity most teams overlook.\n\n{insights.main_idea}"
    if tone == "casual":
        return f"Real talk about {topic} — here's what actually matters:\n\n{insights.hook}"
    return f"{insights.hook}\n\nHere's what the research actually shows:"
