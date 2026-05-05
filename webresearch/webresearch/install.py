from __future__ import annotations
import os
import shutil
from pathlib import Path


SKILL_SRC = Path(__file__).parent / "skill.md"
CLAUDE_SKILLS_DIR = Path.home() / ".claude" / "skills" / "webresearch"
CLAUDE_MD = Path.home() / ".claude" / "CLAUDE.md"

CLAUDE_MD_ENTRY = """
# webresearch
- **webresearch** (`~/.claude/skills/webresearch/SKILL.md`) - research any topic from multiple web sources. Trigger: `/webresearch`
When the user types `/webresearch`, invoke the Skill tool with `skill: "webresearch"` before doing anything else.
"""


def install() -> None:
    CLAUDE_SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    dst = CLAUDE_SKILLS_DIR / "SKILL.md"
    shutil.copy(SKILL_SRC, dst)
    print(f"Skill installed → {dst}")

    CLAUDE_MD.parent.mkdir(parents=True, exist_ok=True)
    existing = CLAUDE_MD.read_text() if CLAUDE_MD.exists() else ""
    if "webresearch" not in existing:
        with CLAUDE_MD.open("a") as f:
            f.write(CLAUDE_MD_ENTRY)
        print(f"Registered in {CLAUDE_MD}")
    else:
        print(f"Already registered in {CLAUDE_MD} (skipped)")

    version_file = CLAUDE_SKILLS_DIR / ".webresearch_version"
    from webresearch import __version__
    version_file.write_text(__version__)

    print(f"\nDone. Open Claude Code and type: /webresearch \"your topic\"")


def uninstall() -> None:
    if CLAUDE_SKILLS_DIR.exists():
        shutil.rmtree(CLAUDE_SKILLS_DIR)
        print(f"Removed {CLAUDE_SKILLS_DIR}")

    if CLAUDE_MD.exists():
        text = CLAUDE_MD.read_text()
        cleaned = text.replace(CLAUDE_MD_ENTRY, "")
        CLAUDE_MD.write_text(cleaned)
        print(f"Removed entry from {CLAUDE_MD}")
