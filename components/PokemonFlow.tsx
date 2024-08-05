import {
    FlowView,
    FlowViewEdge,
    FlowViewNode,
    Language,
    MiniMap,
    SelectType,
    useEdgesState,
    useNodesState,
} from "@ant-design/pro-flow";
import { useCallback, useMemo } from "react";
import { ApiScore, edges, messages, nodes } from "../data/nodesAndEdges";
import {
    formatEdgeMapping,
    formatNodeMapping,
    getAllHighLightNode,
    getLeftNode,
    setEdgeDanger,
    setNodeBorder,
} from "../utils/helpers";
import useStyles from "../styles/PokemonFlow.styles";

function getLastPokemonNode(
    nodes: FlowViewNode[],
    edges: FlowViewEdge[],
    nodeId: string | number
) {
    let lastNode = getLeftNode(nodes, edges, nodeId)[0];

    if (lastNode && !lastNode.includes("pokemon")) {
        return getLastPokemonNode(nodes, edges, lastNode);
    }

    return lastNode;
}

const PokemonFlow = () => {
    const { styles } = useStyles();
    const [_nodes, setNodes, onNodesChange] = useNodesState([...nodes]);
    const [_edges, setEdges, onEdgesChange] = useEdgesState([...edges]);
    const edgeMapping = useMemo(() => {
        const mapping = formatEdgeMapping(_nodes, _edges);
        return setEdgeDanger(mapping);
    }, [_nodes, _edges]);
    const nodeMapping = useMemo(() => {
        const mapping = formatNodeMapping(_nodes, _edges);
        return setNodeBorder(mapping);
    }, [_nodes, _edges]);

    const renderData: { nodes: FlowViewNode[]; edges: FlowViewEdge[] } =
        useMemo(() => {
            return {
                nodes: Object.values(nodeMapping),
                edges: Object.values(edgeMapping),
            };
        }, [nodeMapping, edgeMapping]);

    const handleHighlight = useCallback(
        (node: FlowViewNode) => {
            handleUnHighlight();
            const highNodes = getAllHighLightNode(nodeMapping, node.id);

            let doneCount = nodes.filter(
                (n) => n.id.includes("pokemon") && n.data.done
            ).length;

            const item2 = nodes.find((n) => n.id === "item2");
            const feedbackNode = _nodes.find((n) => n.id === "feedback1");
            const grunt1 = nodes.find((n) => n.id === "grunt1");

            const lastPokemon =
                node.id === "pokemon1"
                    ? null
                    : _nodes.find(
                          (n) =>
                              n.id.includes("pokemon") &&
                              n.id ===
                                  getLastPokemonNode(_nodes, _edges, node.id)
                      );

            _nodes.forEach((_node) => {
                if (highNodes.find((item) => item.id === _node.id)) {
                    _node.select = SelectType.SUB_SELECT;
                }
                if (_node.id === node.id) {
                    _node.select = SelectType.SELECT;
                }
                if (
                    _node.id !== "item1" &&
                    _node.id === node.id &&
                    !_node.data.done
                ) {
                    if (_node.id.includes("pokemon")) {
                        if (_node.id === "pokemon2" && !item2?.data.done) {
                            if (feedbackNode) {
                                feedbackNode.data.description =
                                    messages.acquireFishingRod;
                            }
                            return;
                        } else if (lastPokemon && !lastPokemon.data.done) {
                            return;
                        } else if (
                            _node.id === "pokemon5" &&
                            !grunt1?.data.done
                        ) {
                            if (feedbackNode) {
                                feedbackNode.data.description =
                                    messages.defeatGrunt;
                            }
                            return;
                        } else {
                            _node.data.title = (
                                <mark className="bg-lime-300">
                                    <del>{_node.data.title}</del>
                                </mark>
                            );
                            _node.data.done = true;
                            if (_node.id === "pokemon5" && feedbackNode) {
                                feedbackNode.data.description =
                                    messages.lastPokemonCollected;
                            } else if (feedbackNode) {
                                feedbackNode.data.description =
                                    messages.keepGoing;
                            }
                            doneCount += 1;
                        }
                    } else if (_node.id.includes("item")) {
                        if (lastPokemon && !lastPokemon.data.done) return;

                        _node.data.title = (
                            <mark className="bg-amber-400">
                                <del>{_node.data.title}</del>
                            </mark>
                        );
                        _node.data.done = true;
                        if (feedbackNode) {
                            feedbackNode.data.description = messages.keepGoing;
                        }
                        return;
                    } else if (_node.id === "grunt1") {
                        if (lastPokemon && !lastPokemon.data.done) {
                            return;
                        } else {
                            _node.data.title = (
                                <mark className="bg-red-300">
                                    <del>{_node.data.title}</del>
                                </mark>
                            );
                            if (feedbackNode) {
                                feedbackNode.data.description =
                                    messages.defeatedGrunt;
                            }
                            _node.data.done = true;
                            return;
                        }
                    }
                }

                if (_node.id === "item1") {
                    _node.data.titleSlot.value = <ApiScore score={doneCount} />;
                }

                if (_node.id === "feedback1") {
                    if (lastPokemon && !lastPokemon.data.done && feedbackNode) {
                        _node.data.description = messages.collectLastPokemon;
                    }
                }
            });

            setNodes(_nodes);

            setEdges(
                edges.map((edge) => {
                    if (edge.source === node.id) {
                        edge.select = SelectType.SUB_SELECT;
                        edge.animated = false;
                    }

                    return { ...edge };
                })
            );
        },
        [nodeMapping]
    );

    const handleUnHighlight = () => {
        setNodes(
            _nodes.map((_node) => {
                _node.select = SelectType.DEFAULT;
                return _node;
            })
        );
        setEdges(
            edges.map((edge) => {
                return edge;
            })
        );
    };

    return (
        <div className={styles.container}>
            <FlowView
                onNodeDragStart={(e, node: any) => handleHighlight(node)}
                onPaneClick={handleUnHighlight}
                nodes={renderData.nodes}
                edges={renderData.edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                stepLessZooming={true}
                miniMap={false}
            >
                <MiniMap
                    language={Language.en_US}
                    position={{ x: 1250, y: -150 }}
                />
            </FlowView>
        </div>
    );
};

export default PokemonFlow;
