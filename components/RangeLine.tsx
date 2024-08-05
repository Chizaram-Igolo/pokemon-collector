interface RangeProps {
    startLevel: number;
    endLevel: number;
}

const RangeLine: React.FC<RangeProps> = ({ startLevel, endLevel }) => {
    const totalWidth = 120; // Total width of the line in pixels
    const rangeWidth = totalWidth; // The width of the entire range (0 to 30)

    const startPos = (startLevel / 30) * totalWidth; // Position of the start level
    const endPos = (endLevel / 30) * totalWidth; // Position of the end level

    return (
        <div
            className="range-line-container"
            style={{
                position: "relative",
                width: `${totalWidth}px`,
                height: "18px",
            }}
        >
            <div
                className="range-line"
                style={{
                    position: "absolute",
                    bottom: "0px",
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#ddd",
                }}
            />
            <div
                className="highlight"
                style={{
                    position: "absolute",
                    bottom: "0px",
                    left: `${startPos}px`,
                    width: `${endPos - startPos}px`,
                    height: "4px",
                    backgroundColor: "#000",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "-30%",
                    }}
                >
                    {startLevel}
                </span>
                <span
                    style={{
                        position: "absolute",
                        top: "-20px",
                        left: "80%",
                    }}
                >
                    {endLevel}
                </span>
            </div>
        </div>
    );
};

export default RangeLine;
