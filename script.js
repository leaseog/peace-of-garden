// ---------- 데이터 설정 ----------

const positiveWords = [
  "kindness",
  "patience",
  "understanding",
  "empathy",
  "calm",
  "gentleness",
  "listening",
  "harmony",
  "compassion",
  "warmth",
  "gratitude",
  "forgiveness",
  "balance",
  "trust",
  "love",
  "acceptance",
  "mindfulness",
  "serenity",
  "hope",
  "respect",
  "clarity",
  "opnenness",
  "ternderness",
  "appreciation",
  "generosity",
  "honesty",
  "stillness",
  "unity",
  "contentment",
  "joy",
  "peace",
];

const negativeWords = [
  "anger",
  "fear",
  "blame",
  "rush",
  "chaos",
  "noise",
  "judgment",
  "harshness",
  "stress",
  "conflit",
  "impatience",
  "resentment",
  "greed",
  "envy",
  "hatred",
  "selfishness",
  "arrogance",
  "doubt",
  "anxiety",
  "frustration",
];

// ★ 여기에 넣기
const stageImages = [
  "seed.png",     // stage 0
  "sprout.png",   // stage 1
  "leaves.png",   // stage 2
  "bud.png",      // stage 3
  "bloom.png",    // stage 4
  "garden.png"    // stage 5
];

let growthStage = 0;
const maxStage = 5; 
const minStage = 0;


const stageData = [
  {
    label: "Seed · Inner Calm",
    phrase:
      "A quiet seed rests beneath the surface, waiting for gentle words.",
  },
  {
    label: "Sprout · First Response",
    phrase:
      "A single kind word helps the seed stretch toward the light.",
  },
  {
    label: "Leaves · Listening",
    phrase:
      "As patience and listening arrive, the plant gathers its strength.",
  },
  {
    label: "Bud · Almost There",
    phrase:
      "Understanding and compassion shape a bud that is ready to open.",
  },
  {
    label: "Bloom · Shared Peace",
    phrase:
      "Peace within has bloomed outward, offering warmth to its surroundings.",
  },
  {
    label: "Garden · Consistent Peace",
    phrase:
      "Peace has reached its fullest bloom, inviting soft wings to dance through the air.",
  },
];

const plantDropZone = document.getElementById("plantDropZone");
const stageLabelEl = document.getElementById("stageLabel");
const stagePhraseEl = document.getElementById("stagePhrase");
const messageBanner = document.getElementById("messageBanner");

const wordListEl = document.getElementById("wordList");
const wordChips = Array.from(
  wordListEl.querySelectorAll(".word-chip")
);

// ---------- 드래그 & 드롭 세팅 ----------

wordChips.forEach((chip) => {
  chip.addEventListener("dragstart", (e) => {
    const word = chip.dataset.word;
    e.dataTransfer.setData("text/plain", word);
    chip.classList.add("dragging");
  });

  chip.addEventListener("dragend", () => {
    chip.classList.remove("dragging");
  });
});

plantDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  plantDropZone.classList.add("drag-over");
});

plantDropZone.addEventListener("dragleave", () => {
  plantDropZone.classList.remove("drag-over");
});

plantDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  plantDropZone.classList.remove("drag-over");

  const droppedWord = e.dataTransfer.getData("text/plain");
  if (!droppedWord) return;

  handleWordDrop(droppedWord);
  markChipUsed(droppedWord);
});

// ---------- 로직 ----------

function handleWordDrop(word) {
  let isPositive = positiveWords.includes(word);
  let isNegative = negativeWords.includes(word);

  if (!isPositive && !isNegative) {
    showMessage("This word feels neutral. Not much changes.", "neutral");
    return;
  }

  if (isPositive) {
    if (growthStage < maxStage) {
      growthStage += 1;
    }
    showMessage(`"${word}" gently nourishes the garden.`, "positive");
  } else if (isNegative) {
    if (growthStage > minStage) {
      growthStage -= 1;
    }
    showMessage(`"${word}" makes the plant hesitate for a moment.`, "negative");
  }

  updateStageVisuals();
}

function updateStageVisuals() {
  const plantImage = document.getElementById("plantImage");

  // ★ 이미지 교체
  plantImage.src = "images/" + stageImages[growthStage];

  // 기존 class 업데이트 (그대로 두면 됨)
  for (let i = minStage; i <= maxStage; i++) {
    plantDropZone.classList.remove(`stage-${i}`);
  }
  plantDropZone.classList.add(`stage-${growthStage}`);

  // 텍스트 업데이트
  const data = stageData[growthStage];
  stageLabelEl.textContent = data.label;
  stagePhraseEl.textContent = data.phrase;
}


function showMessage(text, type) {
  messageBanner.textContent = text;
  messageBanner.classList.remove("positive", "negative");

  if (type === "positive") {
    messageBanner.classList.add("positive");
  } else if (type === "negative") {
    messageBanner.classList.add("negative");
  }
}

function markChipUsed(word) {
  const chip = wordChips.find(
    (c) => c.dataset.word === word
  );
  if (chip) {
    chip.classList.add("used-once");
  }
}

// 초기 상태 세팅
updateStageVisuals();
