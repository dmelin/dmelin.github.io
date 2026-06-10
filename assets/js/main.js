console.log('Why are you looking here? There wont be any errors etc to see...');
console.error('Well, that was a lie');

document.addEventListener('DOMContentLoaded', () => {
    const iconsContainer = document.getElementById('icons');
    const iconButtons = Array.from(document.querySelectorAll('.icon-button'));
    const modals = document.querySelectorAll('.modal');

    const ICON_SIZE = 64;
    const ICON_GAP = 16;
    const STACK_OFFSET = 3; // px nudge per layer in stack
    const DEAL_STAGGER = 80; // ms between each card being dealt

    // Current assigned positions (index → {x, y})
    let positions = [];

    // Logical stack order — stackOrder[0] is the button index on top
    let stackOrder = [];

    // ─── Disable / enable interactions ───────────────────────────────────────

    function disableButtons() {
        iconButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.style.cursor = 'default';
        });
    }

    function enableButtons() {
        iconButtons.forEach(btn => {
            btn.style.pointerEvents = '';
            btn.style.cursor = '';
        });
    }

    // ─── Position calculation ─────────────────────────────────────────────────

    function calcGridPositions() {
        const containerWidth = iconsContainer.offsetWidth;
        const cols = Math.max(1, Math.floor((containerWidth + ICON_GAP) / (ICON_SIZE + ICON_GAP)));

        return iconButtons.map((_, i) => ({
            x: (i % cols) * (ICON_SIZE + ICON_GAP),
            y: Math.floor(i / cols) * (ICON_SIZE + ICON_GAP),
        }));
    }

    function updateContainerHeight() {
        const containerWidth = iconsContainer.offsetWidth;
        const cols = Math.max(1, Math.floor((containerWidth + ICON_GAP) / (ICON_SIZE + ICON_GAP)));
        const rows = Math.ceil(iconButtons.length / cols);
        iconsContainer.style.height = (rows * (ICON_SIZE + ICON_GAP) - ICON_GAP) + 'px';
    }

    // ─── Apply stack visual based on stackOrder ───────────────────────────────

    function applyStack(animate = false) {
        const total = stackOrder.length;
        stackOrder.forEach((btnIndex, depth) => {
            const btn = iconButtons[btnIndex];

            if (!animate) {
                btn.style.transition = 'none';
                btn.getBoundingClientRect();
            }

            btn.style.left = -(depth * STACK_OFFSET) + 'px';
            btn.style.top = -(depth * STACK_OFFSET) + 'px';
            btn.style.zIndex = total - depth;
            btn.style.opacity = depth === 0 ? '1'
                : depth < 5 ? String(Math.max(0.1, 1 - depth * 0.18))
                    : '0';
            btn.style.transform = 'none';

            if (!animate) {
                btn.getBoundingClientRect();
                btn.style.transition = '';
            }
        });
    }

    // ─── Stack all cards (randomized order) ──────────────────────────────────

    function stackCards() {
        // Random button on top each load
        stackOrder = [...Array(iconButtons.length).keys()]
            .sort(() => Math.random() - 0.5);

        applyStack(false);
    }

    // ─── Shuffle: pull card from middle, arc over, drop on top ───────────────

    async function shuffle(times = 5) {
        const total = stackOrder.length;

        for (let s = 0; s < times; s++) {
            // Pick a card from somewhere in the middle (not the very top)
            const pickDepth = 1 + Math.floor(Math.random() * Math.min(total - 1, 4));
            const pickedBtnIndex = stackOrder[pickDepth];
            const pickedBtn = iconButtons[pickedBtnIndex];

            const startX = -(pickDepth * STACK_OFFSET);
            const startY = -(pickDepth * STACK_OFFSET);

            // Arc destination: up and to one side
            const side = Math.random() > 0.5 ? 1 : -1;
            const arcX = startX + side * (24 + Math.random() * 16);
            const arcY = startY - (35 + Math.random() * 15);
            const arcRotate = side * (8 + Math.random() * 18);

            // Lift above everything
            pickedBtn.style.zIndex = total + 10;
            pickedBtn.style.opacity = '1';

            // Phase 1: lift and arc out
            pickedBtn.style.transition = 'left 0.18s ease-out, top 0.18s ease-out, transform 0.18s ease-out, opacity 0.1s ease';
            pickedBtn.style.left = arcX + 'px';
            pickedBtn.style.top = arcY + 'px';
            pickedBtn.style.transform = `rotate(${arcRotate}deg) scale(1.1)`;

            await sleep(180);

            // Phase 2: drop onto top of stack
            pickedBtn.style.transition = 'left 0.14s ease-in, top 0.14s ease-in, transform 0.14s ease-in';
            pickedBtn.style.left = '0px';
            pickedBtn.style.top = '0px';
            pickedBtn.style.transform = 'rotate(0deg) scale(1)';

            // Update stack order — picked card is now on top
            stackOrder.splice(pickDepth, 1);
            stackOrder.unshift(pickedBtnIndex);

            await sleep(150);

            // Snap remaining cards into new stack positions (no transition)
            stackOrder.forEach((btnIndex, depth) => {
                if (btnIndex === pickedBtnIndex) return;
                const btn = iconButtons[btnIndex];
                btn.style.transition = 'none';
                btn.getBoundingClientRect();
                btn.style.left = -(depth * STACK_OFFSET) + 'px';
                btn.style.top = -(depth * STACK_OFFSET) + 'px';
                btn.style.zIndex = total - depth;
                btn.style.opacity = depth === 0 ? '1'
                    : depth < 5 ? String(Math.max(0.1, 1 - depth * 0.18))
                        : '0';
                btn.getBoundingClientRect();
                btn.style.transition = '';
            });

            await sleep(80);
        }
    }

    // ─── Deal: fly each card from stack to its grid position ──────────────────

    async function deal() {
        const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

        for (let i = 0; i < stackOrder.length; i++) {
            const btnIndex = stackOrder[i];
            const btn = iconButtons[btnIndex];
            const pos = shuffledPositions[i];

            await sleep(DEAL_STAGGER);

            btn.style.zIndex = 10 + i;
            btn.style.opacity = '1';
            btn.style.left = pos.x + 'px';
            btn.style.top = pos.y + 'px';
            btn.style.transform = 'none';
        }

        // Store final positions keyed by button index for resize
        stackOrder.forEach((btnIndex, i) => {
            positions[btnIndex] = shuffledPositions[i];
        });
    }

    // ─── Resize handler (debounced) ───────────────────────────────────────────

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateContainerHeight();

            // Sort buttons by their current visual position (top → left)
            // so we reassign grid slots in the same reading order they're already in
            const sorted = [...iconButtons].sort((a, b) => {
                const aTop = parseFloat(a.style.top) || 0;
                const bTop = parseFloat(b.style.top) || 0;
                if (Math.abs(aTop - bTop) > ICON_SIZE / 2) return aTop - bTop;
                return (parseFloat(a.style.left) || 0) - (parseFloat(b.style.left) || 0);
            });

            const newSlots = calcGridPositions();

            sorted.forEach((btn, i) => {
                btn.style.left = newSlots[i].x + 'px';
                btn.style.top = newSlots[i].y + 'px';
            });

            // Rebuild positions array keyed by button index
            positions = [];
            sorted.forEach((btn, i) => {
                const btnIndex = iconButtons.indexOf(btn);
                positions[btnIndex] = newSlots[i];
            });
        }, 150);
    });

    // ─── Modal logic ──────────────────────────────────────────────────────────

    function setupEventListeners() {
        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent.querySelector('.modal-close')) {
                const closeButton = document.createElement('button');
                closeButton.className = 'modal-close';
                closeButton.innerHTML = '<span class="material-symbols-outlined">close</span>';
                modalContent.insertBefore(closeButton, modalContent.firstChild);
                closeButton.addEventListener('click', () => closeModal(modal));
            }
        });

        iconButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal');
                const modal = document.getElementById(`modal-${modalId}`);
                if (modal) openModal(modal);
            });
        });
    }

    function openModal(modal) {
        iconsContainer.classList.add('hidden');
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        iconsContainer.classList.remove('hidden');
    }

    // ─── Utility ──────────────────────────────────────────────────────────────

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ─── Boot sequence ────────────────────────────────────────────────────────

    async function init() {
        disableButtons();
        updateContainerHeight();
        positions = calcGridPositions();

        stackCards();

        await sleep(600);
        await shuffle(5);
        await sleep(300);
        await deal();

        enableButtons();
        setupEventListeners();
    }

    init();
});