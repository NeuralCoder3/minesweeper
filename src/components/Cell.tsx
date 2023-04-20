
export interface cell_info {
  isRevealed: boolean;
  type: "mine" | number;
  isFlagged: boolean;
}

interface ICellProp extends cell_info {
  reveal: () => void;
  flag: () => void;
}

export function Cell(props: ICellProp) {
  const { isRevealed, type, isFlagged } = props;
  const cellStyle =
    typeof type === "number" ? "c" + type : type;
  return <div
    className={`cell ${isRevealed ? cellStyle : (isFlagged ? "flagged" : "hidden")}`}
    onClick={props.reveal}
    onContextMenu={
      (e) => {
        e.preventDefault();
        props.flag();
      }
    }
  ></div>;
}
