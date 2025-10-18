import os
from typing import List, Tuple

from openai import OpenAI


OPENAI_MODEL = "gpt-4o-mini"


def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return OpenAI(api_key=api_key)


def summarize_text(text: str, max_words: int = 180) -> str:
    client = get_openai_client()
    
    # Detect language from text
    is_english = any(word in text.lower() for word in ['the', 'and', 'what', 'are', 'is', 'of', 'in', 'to', 'for', 'with', 'by'])
    
    if is_english:
        prompt = (
            "Summarize the content concisely. Provide a well-structured, bullet-pointed summary, "
            f"max {max_words} words. Use professional but accessible language.\n\n" + text
        )
    else:
        prompt = (
            "Foglaljad össze tömören a tananyagot. Adj jól tagolt, bulletpontos kivonatot, "
            f"max {max_words} szóban. Szakszerű, de közérthető nyelvezettel.\n\n" + text
        )
    
    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=600,
    )
    return resp.choices[0].message.content.strip()


def generate_quiz(text: str, num_questions: int = 6) -> List[Tuple[str, List[str], str, str]]:
    client = get_openai_client()
    
    # Detect language from text
    is_english = any(word in text.lower() for word in ['the', 'and', 'what', 'are', 'is', 'of', 'in', 'to', 'for', 'with', 'by'])
    
    if is_english:
        prompt = (
            f"Create {num_questions} multiple choice questions from the text. "
            "Each question should have 4 answer options (A, B, C, D). "
            "Make sure correct answers are varied (not always A). "
            "REQUIRED format for each question:\n\n"
            "1. What is law?\n"
            "A) Rules of the state\n"
            "B) Ethical guidelines\n"
            "C) Regulation of human coexistence\n"
            "D) All of the above\n"
            "Correct: D\n"
            "Explanation: Law includes all three elements\n\n"
            "2. What are the three fundamental elements of a state?\n"
            "A) Population, territory, sovereignty\n"
            "B) Government, parliament, courts\n"
            "C) Laws, regulations, rules\n"
            "D) Voters, representatives, ministers\n"
            "Correct: A\n"
            "Explanation: The three fundamental elements of a state are population, territory, and sovereignty\n\n" + text
        )
    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000,
    )
    content = resp.choices[0].message.content
    
    items: List[Tuple[str, List[str], str, str]] = []
    blocks = content.split("\n\n")
    
    for block in blocks:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if len(lines) < 6:  # Minimum: question + 4 options + correct answer
            continue
            
        # Extract question (first line, remove numbering)
        question = lines[0]
        if question[0].isdigit() and "." in question:
            question = question.split(".", 1)[1].strip()
        
        # Skip if it's a header or meaningless text
        if "###" in question or "kvíz" in question.lower() or len(question) < 10:
            continue
            
        options = []
        correct = "A"
        explanation = ""
        
        for line in lines[1:]:
            line_lower = line.lower()
            if line_lower.startswith("a)"):
                options.append(line[2:].strip())
            elif line_lower.startswith("b)"):
                options.append(line[2:].strip())
            elif line_lower.startswith("c)"):
                options.append(line[2:].strip())
            elif line_lower.startswith("d)"):
                options.append(line[2:].strip())
            elif line_lower.startswith("correct:"):
                correct = line.split(":", 1)[1].strip().upper()[:1]
            elif line_lower.startswith("explanation:"):
                explanation = line.split(":", 1)[1].strip()
        
        # Only add if we have all 4 options
        if len(options) == 4 and correct in {"A", "B", "C", "D"}:
            items.append((question, options, correct, explanation))
    
        # Fallback: if no proper questions found, create simple ones
        if not items:
            items = [
                ("What is law?", ["Rules of the state", "Ethical guidelines", "Regulation of human coexistence", "All of the above"], "D", "Law includes all three elements"),
                ("What are the three fundamental elements of a state?", ["Population, territory, sovereignty", "Government, parliament, courts", "Laws, regulations, rules", "Voters, representatives, ministers"], "A", "The three fundamental elements of a state are population, territory, and sovereignty"),
                ("What is the basis of legal logic?", ["If-then relationship", "Mathematical logic", "Philosophical principles", "Historical traditions"], "A", "The basis of legal logic is the if-then relationship, where certain facts lead to certain legal consequences")
            ]
    
    return items[:num_questions]


def generate_flashcards(text: str, num_cards: int = 8) -> List[Tuple[str, str]]:
    client = get_openai_client()
    
    # Detect language from text
    is_english = any(word in text.lower() for word in ['the', 'and', 'what', 'are', 'is', 'of', 'in', 'to', 'for', 'with', 'by'])
    
    if is_english:
        prompt = (
            f"Create {num_cards} flashcards from the text. "
            "Each card should have a key concept or question on the front, "
            "and the corresponding definition or answer on the back. "
            "Format:\n"
            "Front: Key concept or question\n"
            "Back: Detailed definition or answer\n\n" + text
        )
    else:
        prompt = (
            f"Készíts {num_cards} flashcard-ot a szövegből. "
            "Minden kártya legyen egy kulcsfogalom vagy kérdés a front oldalon, "
            "és a megfelelő definíció vagy válasz a back oldalon. "
            "Formátum:\n"
            "Front: Kulcsfogalom vagy kérdés\n"
            "Back: Részletes definíció vagy válasz\n\n" + text
        )
    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
        max_tokens=1000,
    )
    content = resp.choices[0].message.content
    cards: List[Tuple[str, str]] = []
    
    for block in content.split("\n\n"):
        front, back = "", ""
        for line in block.splitlines():
            line_lower = line.lower()
            if line_lower.startswith("front:"):
                front = line.split(":", 1)[1].strip()
            elif line_lower.startswith("back:"):
                back = line.split(":", 1)[1].strip()
        
        if front and back and len(front) > 3 and len(back) > 3:
            cards.append((front, back))
    
    return cards[:num_cards]

