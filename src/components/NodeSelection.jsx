const NodeSelection = ({ nodeNames, onSelectNode, selectedNode }) => {
  return (
    <div>
      {nodeNames.map((name) => (
        <button
          key={name}
          onClick={() => onSelectNode(name)}
          style={{
            display: "block",
            margin: "5px",
            color: "black",
            fontSize: "30px",
          }}
        >
          {name}
        </button>
      ))}
      {selectedNode && (
        <div className="selected">
          <br></br>
          <br></br>
          <br></br>
          {selectedNode.name}
        </div>
      )}
    </div>
  );
};

export default NodeSelection;
