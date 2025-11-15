**full game design document** for each game you want to add to **Sentinel Digest**.
I designed **concept**, **rules**, **core logic**, **UI flow**, and **sample prototypes** 
---

# ✅ **1. SENTINEL WORDLE (Daily Wordle Clone)**

### **Concept**

A 5-letter daily word challenge. Users have 6 attempts to guess the hidden word.

### **Rules**

* Guess a 5-letter English word.
* After each guess, tiles change color:

  * **Green** → correct letter, correct spot
  * **Yellow** → correct letter, wrong spot
  * **Gray** → letter not in the word
* New word every 24 hours.

### **Logic**

1. Fetch today’s word using a daily seed (like date).
2. Compare guess vs target:

   * Loop through letters.
   * First pass → mark greens.
   * Second pass → mark yellows.
3. Track attempts.
4. Save progress in `localStorage`.

### **Prototype (Text Version)**

```
WORDLE - SENTINEL DIGEST  
_ _ _ _ _
Attempts: 0/6

Enter guess: BRAIN

Result:
B (gray)
R (yellow)
A (green)
I (gray)
N (green)
```

---

# ✅ **2. WORD HARVEST (Form Many Words From Random Letters)**

### **Concept**

You get **7–10 random letters**, and you must form as many valid dictionary words as possible within a timer.

### **Rules**

* Letters appear in a random circular grid.
* You can rearrange letters.
* Words must be 3+ letters.
* Each valid word earns points depending on length.

### **Scoring**

* 3 letters: 5 points
* 4 letters: 10 points
* 5 letters: 20 points
* 6+ letters: 40 points

### **Logic**

1. Generate letters using letter frequency (not equal probability).
2. When user submits a word:

   * Check if letters are available.
   * Check dictionary API or local word list.
3. Add to list of found words.
4. Prevent duplicates.

### **Prototype**

```
WORD HARVEST
Letters: A  T  R  E  P  N  L

Make as many words as possible!
> Enter word: LEARN  ✔ Valid (20 pts)
> Enter word: TEAR   ✔ Valid (10 pts)
> Enter word: APPLE  ✖ Invalid (letter missing)
```

---

# ✅ **3. WORD HUNT (Find Words in 12×12 Grid)**

### **Concept**

Classic word search. Words are hidden horizontally, vertically, diagonally.

### **Rules**

* Show a **12×12 letter grid**.
* Provide 5–10 target words.
* User highlights words by dragging.
* Words disappear or get highlighted when found.

### **Logic**

1. Place words in random directions.
2. Fill empty spaces with random letters.
3. On drag:

   * Detect continuous sequence.
   * Check if matches any target word.
4. Mark word as found.

### **Prototype Grid (Simplified)**

*(Not full size)*

```
T I G E R X Z L O P R  
A O W L B K R A I N M  
C R I M E S T O R Y E  
S E N T I N E L Z Q D  
F O O T B A L L R C T  
```

Words to find:

* TIGER
* CRIME
* FOOTBALL
* SENTINEL
* BRAIN

---

# ✅ **4. DAILY RIDDLE (New Riddle Every Day)**

### **Concept**

A simple text-based riddle where users guess the answer.

### **Rules**

* One riddle per day.
* Unlimited attempts.
* Answers ignore case and spacing.
* Show hints after 3 wrong tries.

### **Logic**

* Riddle generated from a list.
* Use date (yyyy-mm-dd) to select index.
* If user enters answer:

  * Normalize (`lower()`, remove punctuation)
  * Compare with stored answers array.

### **Prototype**

```
DAILY RIDDLE (15 Nov 2025)
I speak without a mouth and hear without ears. What am I?

Your answer: Shadow  ✖ Wrong  
Your answer: Wind    ✖ Wrong  
Hint: It is something that repeats sound.

Your answer: Echo ✔ Correct!
```

---

# ✅ **5. MATH RUSH (Reach Target Using Given Numbers)**

### **Concept**

Players combine numbers using **+ − × ÷** to reach a target (like the “24 Game,” but more advanced).

### **Rules**

* Given 4–6 random numbers.
* Target number (e.g., 24).
* Use any operation.
* Each number must be used exactly **once**.
* Countdown timer (30–60 seconds).

### **Logic**

1. Input parser evaluates expressions safely (use JS math parser).
2. Validate:

   * All numbers used exactly once.
   * No extra numbers.
3. If result == target → win.

### **Prototype**

```
MATH RUSH
Numbers: [2, 5, 7, 9]
Target: 24

Enter expression: (7 - 5) * (9 + 2)  = 22 ✖ Wrong
Enter expression: (9 - 7) * (5 + 2)  = 14 ✖ Wrong
Enter expression: (7 * 5) - (9 + 2) = 24 ✔ Correct!
```

---

# ✅ **6. GUESS THE PERSONALITY (Blurred Image)**

### **Concept**

A celebrity/politician/footballer image is blurred, and users guess who it is.

### **Rules**

* 3 levels of blur:

  * Level 3 (very blurred)
  * Level 2 (medium)
  * Level 1 (slightly blurred)
* Every wrong attempt reduces a blur level.
* 5 total attempts.

### **Logic**

1. Load high-quality picture.
2. Apply CSS blur filter (30px → 15px → 5px).
3. User types name:

   * Normalize text.
   * Compare with stored correct answer.
4. If answer correct:

   * Reveal image.

### **Prototype Flow**

```
GUESS THE PERSONALITY
(Image blurred at 30px)

Your guess: Cristiano Ronaldo ✖ Wrong
Blur reduced to 15px.

Your guess: Kylian Mbappé ✔ Correct!

(Image fully shown)
```

---

# 🎮 **Cross-Game Features for Sentinel Digest**

### Points / Streak System (optional)

* Completing daily games earns points.
* Streak increases if user logs in every day.
* Top leaderboard for daily challenge winners.

### Rewards
* Unlock badges:

  * “Word Master”
  * “Math Genius”
  * “Riddle King”
  * “Streak Champion”

### Monetization Ideas
* Add sponsored riddles.
* Add celebrity guess from your entertainment section.
* Display ads only between levels.