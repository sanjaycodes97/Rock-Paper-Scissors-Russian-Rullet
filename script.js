document.addEventListener("DOMContentLoaded", () => {
  let round = 1;
  let bullets = 1;
  let rrTurn = "";
  let isRRActive = false;

  const roundDisplay = document.getElementById("round");
  const bulletDisplay = document.getElementById("bullets");
  const rpsResult = document.getElementById("rps-result");
  const rrResult = document.getElementById("rr-result");
  const proceedBtn = document.getElementById("proceed-btn");
  const restartBtn = document.getElementById("restart-btn");
  const slots = document.querySelectorAll(".slot");
  const choiceButtons = document.querySelectorAll(".choices button");

  const updateScore = () => {
    roundDisplay.textContent = round;
    bulletDisplay.textContent = bullets;
  };

  const disableButtons = () => {
    choiceButtons.forEach(btn => (btn.disabled = true));
  };

  const enableButtons = () => {
    choiceButtons.forEach(btn => (btn.disabled = false));
  };

  const updateChamber = (shot, bulletsIn) => {
    slots.forEach((slot, index) => {
      slot.classList.remove("bullet", "active");
      if (bulletsIn.includes(index)) slot.classList.add("bullet");
      if (index === shot) slot.classList.add("active");
    });
  };

  const animateChamber = (shot, bulletsIn, callback) => {
    slots.forEach(slot => slot.classList.remove("bullet", "active"));

    const radius = 70;
    slots.forEach((slot, i) => {
      const angle = (i / 6) * 2 * Math.PI;
      slot.style.left = `${80 + radius * Math.cos(angle) - 20}px`;
      slot.style.top = `${80 + radius * Math.sin(angle) - 20}px`;
    });

    let step = 0;
    const spinInterval = setInterval(() => {
      slots.forEach(s => s.classList.remove("active"));
      slots[step % 6].classList.add("active");
      step++;

      if (step > 18) {
        clearInterval(spinInterval);
        updateChamber(shot, bulletsIn);
        setTimeout(callback, 600);
      }
    }, 100);
  };

  const botPlaysRR = () => {
    proceedBtn.style.display = "none";
    rrResult.textContent = "Spinning the chamber...";

    const bulletsIn = [];
    while (bulletsIn.length < bullets) {
      const r = Math.floor(Math.random() * 6);
      if (!bulletsIn.includes(r)) bulletsIn.push(r);
    }

    const shot = Math.floor(Math.random() * 6);
    animateChamber(shot, bulletsIn, () => {
      if (bulletsIn.includes(shot)) {
        rrResult.textContent =
          rrTurn === "bot"
            ? "💥 BANG! Your opponent is dead. You win!"
            : "💀 BANG! You are dead. Game Over.";
        restartBtn.style.display = "inline-block";
      } else {
        rrResult.textContent =
          rrTurn === "bot"
            ? "😮 Click! Your opponent survived."
            : "😮 Click! You survived.";
        bullets = Math.min(bullets + 1, 6);
        round++;
        updateScore();
        enableButtons();
        rpsResult.textContent = "Make your move!"; // 👈 Your requested update
        isRRActive = false;
      }
    });
  };

  const playRPS = (player) => {
    if (isRRActive) return;

    const options = ["rock", "paper", "scissors"];
    const opponent = options[Math.floor(Math.random() * 3)];

    proceedBtn.style.display = "none";
    rrResult.textContent = "";

    if (player === opponent) {
      rpsResult.textContent = `🤝 It's a draw! You both chose ${player}`;
      return;
    }

    const win =
      (player === "rock" && opponent === "scissors") ||
      (player === "paper" && opponent === "rock") ||
      (player === "scissors" && opponent === "paper");

    if (win) {
      rpsResult.textContent = `✅ You win! Your opponent chose ${opponent}`;
      rrTurn = "bot";
    } else {
      rpsResult.textContent = `❌ You lose! Your opponent chose ${opponent}`;
      rrTurn = "player";
    }

    isRRActive = true;
    proceedBtn.style.display = "inline-block";
    disableButtons();
  };

  const restartGame = () => {
    round = 1;
    bullets = 1;
    rrTurn = "";
    isRRActive = false;
    updateScore();
    rpsResult.textContent = "Make your move!";
    rrResult.textContent = "";
    proceedBtn.style.display = "none";
    restartBtn.style.display = "none";
    slots.forEach(slot => slot.classList.remove("bullet", "active"));
    enableButtons();
  };

  document.getElementById("rock").addEventListener("click", () => playRPS("rock"));
  document.getElementById("paper").addEventListener("click", () => playRPS("paper"));
  document.getElementById("scissors").addEventListener("click", () => playRPS("scissors"));

  proceedBtn.addEventListener("click", botPlaysRR);
  restartBtn.addEventListener("click", restartGame);

  updateScore();
  proceedBtn.style.display = "none";
  restartBtn.style.display = "none";
});
