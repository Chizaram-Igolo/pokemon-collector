import { FlowViewEdge, FlowViewNode, SelectType } from "@ant-design/pro-flow";

interface FlowViewNodeExtended extends FlowViewNode {
    left?: (string | undefined)[];
    right?: (string | undefined)[];
}

interface FlowViewEdgeExtended extends FlowViewEdge {
    sourceNode?: FlowViewNode;
    targetNode?: FlowViewNode;
    select?: SelectType;
}

export const formatNodeMapping = (
    nodes: FlowViewNode[],
    edges: FlowViewEdge[]
) => {
    const obj: { [key: string]: FlowViewNodeExtended } = {};
    nodes.forEach((node) => {
        obj[node.id] = { ...node };
        obj[node.id].left = getLeftNode(nodes, edges, node.id);
        obj[node.id].right = getRightNode(nodes, edges, node.id);
    });
    return obj;
};

export const formatEdgeMapping = (
    nodes: FlowViewNode[],
    edges: FlowViewEdge[]
) => {
    const obj: { [key: string]: any } = {};
    edges.forEach((edge) => {
        obj[edge.id] = { ...edge };
        obj[edge.id].targetNode = nodes.find((node) => node.id === edge.target);
        obj[edge.id].sourceNode = nodes.find((node) => node.id === edge.source);
    });
    return obj;
};

export const setNodeBorder = (nodeMapping: {
    [key: string]: FlowViewNodeExtended;
}) => {
    Object.keys(nodeMapping).forEach((key) => {
        const node = nodeMapping[key];

        if (node.data.isItem) {
            const highNodes = getAllHighLightNode(nodeMapping, node.id);

            highNodes.forEach((item) => {
                if (
                    [SelectType.SELECT, SelectType.SUB_SELECT].includes(
                        nodeMapping[item.id].select as SelectType
                    )
                )
                    return;

                nodeMapping[item.id].select =
                    SelectType.SUB_WARNING as SelectType;
            });
        }

        if (node.data.isCharacter) {
            const highNodes = getAllHighLightNode(nodeMapping, node.id);

            highNodes.forEach((item) => {
                if (
                    [SelectType.SELECT, SelectType.SUB_SELECT].includes(
                        nodeMapping[item.id].select as SelectType
                    )
                )
                    return;
                nodeMapping[item.id].select = SelectType.SUB_SELECT;
            });
        }
    });

    return nodeMapping;
};

export const setEdgeDanger = (edgeMapping: {
    [key: string]: FlowViewEdgeExtended;
}) => {
    Object.keys(edgeMapping).forEach((key) => {
        const edge = edgeMapping[key];

        if (
            edge?.targetNode?.data.isDanger ||
            edge?.sourceNode?.data.isDanger
        ) {
            if (
                edge.select &&
                [SelectType.SELECT, SelectType.SUB_SELECT].includes(edge.select)
            )
                return;
            edge.select = SelectType.SUB_DANGER;
        }
    });

    return edgeMapping;
};

export const getLeftNode = (
    nodes: FlowViewNode[],
    edges: FlowViewEdge[],
    currentId: string | number
) => {
    return edges
        .filter((edge) => {
            return edge.target === currentId;
        })
        .map((edge) => {
            const node = nodes.find((node) => node.id === edge.source);
            return node?.id;
        });
};

export const getRightNode = (
    nodes: FlowViewNode[],
    edges: FlowViewEdge[],
    currentId: string | number
) => {
    return edges
        .filter((edge) => {
            return edge.source === currentId;
        })
        .map((edge) => {
            const node = nodes.find((node) => node.id === edge.target);
            return node?.id;
        });
};

export const getAllHighLightNode = (
    nodeMapping: { [key: string]: FlowViewNodeExtended },
    currentId: string | number
) => {
    const leftNodes: FlowViewNodeExtended[] = [];
    const rightNodes: FlowViewNodeExtended[] = [];

    function getLeft(nodeId: string | number | undefined) {
        if (nodeId === undefined) return;
        if (nodeMapping[nodeId] === undefined) return;

        const lefts = nodeMapping[nodeId].left;
        if (!lefts || lefts?.length === 0) return;

        leftNodes.push(
            ...lefts
                .filter((item) => item !== undefined)
                .map((item) => nodeMapping[item])
        );
        lefts?.forEach((node) => {
            getLeft(node);
        });
    }

    function getRight(nodeId: string | number | undefined) {
        if (nodeId === undefined) return;
        if (nodeMapping[nodeId] === undefined) return;

        const rights = nodeMapping[nodeId].right;
        if (!rights || rights?.length === 0) return;

        rightNodes.push(
            ...rights
                .filter((item) => item !== undefined)
                .map((item: string) => nodeMapping[item])
        );
        rights?.forEach((node) => {
            getRight(node);
        });
    }
    getLeft(currentId);
    getRight(currentId);

    return [...leftNodes, ...rightNodes, nodeMapping[currentId]];
};
