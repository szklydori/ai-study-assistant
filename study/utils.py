from pathlib import Path
from typing import Optional

from PyPDF2 import PdfReader


def extract_text_from_pdf(file_path: Path) -> str:
    text_parts = []
    with open(file_path, "rb") as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts)


def coalesce_note_text(original_text: str, uploaded_file_path: Optional[str]) -> str:
    if uploaded_file_path:
        p = Path(uploaded_file_path)
        if p.suffix.lower() == ".pdf" and p.exists():
            try:
                return extract_text_from_pdf(p)
            except Exception:
                pass
        try:
            return p.read_text(encoding="utf-8")
        except Exception:
            return original_text
    return original_text

