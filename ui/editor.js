export function initBaseEditor({
  grid,
  gridNode,
  toggleButton,
  renderBase,
  setLog,
  onMove,
  onEditModeChange,
}) {
  if (!gridNode || !toggleButton) {
    return {
      clearSelection() {},
      refreshSelection() {},
      get isEditMode() {
        return false;
      },
    };
  }

  let isEditMode = false;
  let selectedCell = null;

  const sameCell = (cell, x, y) => cell?.x === x && cell?.y === y;

  function clearSelection() {
    selectedCell = null;
    refreshSelection();
  }

  function setEditMode(nextMode) {
    isEditMode = nextMode;
    toggleButton.textContent = `Edit Base: ${isEditMode ? "ON" : "OFF"}`;
    toggleButton.setAttribute("aria-pressed", String(isEditMode));
    if (!isEditMode) clearSelection();
    onEditModeChange?.(isEditMode);
  }

  function refreshSelection() {
    gridNode.querySelectorAll(".selected-building").forEach((cell) => {
      cell.classList.remove("selected-building");
    });
    if (!isEditMode || !selectedCell) return;
    const selectedNode = gridNode.querySelector(
      `[data-x="${selectedCell.x}"][data-y="${selectedCell.y}"]`,
    );
    selectedNode?.classList.add("selected-building");
  }

  function handleGridTap(event) {
    if (!isEditMode) return;
    const slot = event.target.closest(".grid-cell");
    if (!slot || !gridNode.contains(slot)) return;

    event.preventDefault();
    event.stopPropagation();

    const x = Number(slot.dataset.x);
    const y = Number(slot.dataset.y);
    const building = grid.matrix[y]?.[x];

    if (building) {
      selectedCell = sameCell(selectedCell, x, y) ? null : { x, y };
      setLog?.(
        selectedCell
          ? "Building selected. Tap an empty cell to move it."
          : "Selection cleared.",
      );
      refreshSelection();
      return;
    }

    if (!selectedCell) {
      setLog?.("Tap a building first, then tap an empty cell to move it.");
      return;
    }

    const result = grid.moveBuilding(selectedCell.x, selectedCell.y, x, y);
    setLog?.(result.message);
    if (result.ok) {
      selectedCell = null;
      onMove?.();
      renderBase?.();
    }
    refreshSelection();
  }

  toggleButton.addEventListener("click", () => setEditMode(!isEditMode));
  gridNode.addEventListener("click", handleGridTap, true);
  setEditMode(false);

  return {
    clearSelection,
    refreshSelection,
    get isEditMode() {
      return isEditMode;
    },
  };
}
